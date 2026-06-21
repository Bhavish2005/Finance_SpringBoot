package com.pockettrack.backend.common;

import com.pockettrack.backend.dashboard.AnomalyAlertEntity;
import com.pockettrack.backend.dashboard.AnomalyAlertRepository;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import com.pockettrack.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionSentinelEngine {

    private final TransactionRepository transactionRepository;
    private final AnomalyAlertRepository anomalyAlertRepository;
    private final UserRepository userRepository;

    // Runs every Sunday at 3:00 AM
    @Scheduled(cron = "0 0 3 * * SUN")
    @Transactional
    public void preCalculateAnomalies() {
        log.info("Starting weekly Subscription Sentinel pre-calculation...");
        
        List<User> users = userRepository.findAll();
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        int totalAnomaliesFound = 0;

        for (User user : users) {
            // 1. Clear old unresolved alerts so we don't get duplicates
            anomalyAlertRepository.deleteByUserId(user.getId());

            // 2. Fetch all recurring expenses from the last 6 months
            List<Transaction> recurringTxs = transactionRepository.findByUserIdAndDateBetween(
                    user.getId(), sixMonthsAgo, LocalDate.now(), org.springframework.data.domain.Pageable.unpaged()
            ).getContent().stream()
            .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE && t.isRecurring())
            .collect(Collectors.toList());

            // 3. Group by Merchant
            Map<String, List<Transaction>> groupedByMerchant = recurringTxs.stream()
                    .filter(t -> t.getDescription() != null && !t.getDescription().isEmpty())
                    .collect(Collectors.groupingBy(Transaction::getDescription));

            // 4. Analyze each subscription
            for (Map.Entry<String, List<Transaction>> entry : groupedByMerchant.entrySet()) {
                List<Transaction> history = entry.getValue();
                
                if (history.size() < 2) continue;
                
                history.sort((a, b) -> b.getDate().compareTo(a.getDate()));
                Transaction latestPayment = history.get(0);
                Transaction previousPayment = history.get(1);
                
                BigDecimal newPrice = latestPayment.getAmount();
                BigDecimal oldPrice = previousPayment.getAmount();

                // Detect Hike
                if (newPrice.compareTo(oldPrice) > 0) {
                    BigDecimal diff = newPrice.subtract(oldPrice);
                    BigDecimal pct = diff.divide(oldPrice, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
                    
                    if (pct.compareTo(BigDecimal.valueOf(2.0)) > 0) {
                        saveAnomaly(user, entry.getKey(), oldPrice, newPrice, pct.doubleValue(), latestPayment.getDate(), "HIKE");
                        totalAnomaliesFound++;
                    }
                } 
                // Detect Drop
                else if (newPrice.compareTo(oldPrice) < 0) {
                    BigDecimal diff = oldPrice.subtract(newPrice);
                    BigDecimal pct = diff.divide(oldPrice, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
                    
                    if (pct.compareTo(BigDecimal.valueOf(2.0)) > 0) {
                        saveAnomaly(user, entry.getKey(), oldPrice, newPrice, pct.doubleValue(), latestPayment.getDate(), "DROP");
                        totalAnomaliesFound++;
                    }
                }
            }
        }
        log.info("Sentinel pre-calculation complete. Saved {} anomalies to database.", totalAnomaliesFound);
    }

    private void saveAnomaly(User user, String merchant, BigDecimal oldPrice, BigDecimal newPrice, double pct, LocalDate date, String type) {
        AnomalyAlertEntity alert = AnomalyAlertEntity.builder()
                .user(user)
                .merchant(merchant)
                .oldPrice(oldPrice)
                .newPrice(newPrice)
                .percentageChange(pct)
                .dateDetected(date)
                .type(type)
                .build();
        anomalyAlertRepository.save(alert);
    }
}
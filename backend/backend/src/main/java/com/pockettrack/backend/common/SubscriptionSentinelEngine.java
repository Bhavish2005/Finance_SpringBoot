package com.pockettrack.backend.common;

import com.pockettrack.backend.dashboard.SubscriptionAnomaly;
import com.pockettrack.backend.dashboard.SubscriptionAnomalyRepository;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionSentinelEngine {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final SubscriptionAnomalyRepository anomalyRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(cron ="0 3 * * 0 ") 
    @Transactional
    public void scanForAnomalies() {
        // 1. LOUD LOGGING: Prove the engine is awake!
        log.info("⏰ [SENTINEL WAKING UP] Scanning database for anomalies...");

        List<User> users = userRepository.findAll();
        LocalDate startOfMonth = YearMonth.now().atDay(1);
        LocalDate twoMonthsAgo = LocalDate.now().minusMonths(2);

        for (User user : users) {
            
            // 2. SAFER FETCH: Using your built-in Recurring query instead of Export
            List<Transaction> recurringTxs = transactionRepository.findRecurringByUserId(user.getId());
            
            // Filter dates and types manually to avoid INNER JOIN drops
            List<Transaction> recentRecurring = recurringTxs.stream()
                    .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                    .filter(t -> !t.getDate().isBefore(twoMonthsAgo)) // Must be in the last 2 months
                    .toList();

            Map<String, List<Transaction>> byMerchant = recentRecurring.stream()
                    .collect(Collectors.groupingBy(Transaction::getDescription));

            for (Map.Entry<String, List<Transaction>> entry : byMerchant.entrySet()) {
                List<Transaction> txs = entry.getValue();
                
                if (txs.size() >= 2) {
                    txs.sort((a, b) -> b.getDate().compareTo(a.getDate())); // Newest first
                    Transaction newest = txs.get(0);
                    Transaction older = txs.get(1);

                    BigDecimal newPrice = newest.getAmount();
                    BigDecimal oldPrice = older.getAmount();

                    log.info("🔍 Analyzing '{}': Old Price = ₹{}, New Price = ₹{}", newest.getDescription(), oldPrice, newPrice);

                    if (oldPrice.compareTo(BigDecimal.ZERO) > 0 && newPrice.compareTo(oldPrice) != 0) {
                        BigDecimal change = newPrice.subtract(oldPrice).abs()
                                .divide(oldPrice, 2, RoundingMode.HALF_UP);
                        
                        if (change.compareTo(new BigDecimal("0.05")) >= 0) {
                            String type = newPrice.compareTo(oldPrice) > 0 ? "HIKE" : "DROP";

                            boolean alreadyAlerted = anomalyRepository.existsByUserIdAndMerchantAndDetectedDateGreaterThanEqual(
                                    user.getId(), newest.getDescription(), startOfMonth
                            );

                            if (!alreadyAlerted) {
                                SubscriptionAnomaly anomaly = SubscriptionAnomaly.builder()
                                        .user(user).merchant(newest.getDescription())
                                        .oldPrice(oldPrice).newPrice(newPrice)
                                        .type(type).detectedDate(LocalDate.now()).isRead(false)
                                        .build();
                                anomalyRepository.save(anomaly);
                                messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), "NEW_ALERT");
                                log.info("🚨 SAVED ANOMALY! {} detected for {}", type, newest.getDescription());
                            } else {
                                log.info("💤 Skipped {}: Already alerted this month.", newest.getDescription());
                            }
                        }
                    }
                }
            }
        }
        log.info("✅ [SENTINEL GOING TO SLEEP]");
    }
}
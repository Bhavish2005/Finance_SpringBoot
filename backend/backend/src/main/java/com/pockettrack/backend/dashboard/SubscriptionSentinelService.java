package com.pockettrack.backend.dashboard;

import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionSentinelService {

    private final TransactionRepository transactionRepository;

    public List<AnomalyAlert> detectStealthIncreases(User user) {
        // 1. Fetch all recurring expenses from the last 6 months
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        List<Transaction> recurringTxs = transactionRepository.findByUserIdAndDateBetween(
                user.getId(), sixMonthsAgo, LocalDate.now(), org.springframework.data.domain.Pageable.unpaged()
        ).getContent().stream()
        .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE && t.isRecurring())
        .collect(Collectors.toList());

        // 2. Group by Merchant (Description or Category)
        Map<String, List<Transaction>> groupedByMerchant = recurringTxs.stream()
                .filter(t -> t.getDescription() != null && !t.getDescription().isEmpty())
                .collect(Collectors.groupingBy(Transaction::getDescription));

        List<AnomalyAlert> alerts = new ArrayList<>();

        // 3. Analyze each subscription for price hikes
        for (Map.Entry<String, List<Transaction>> entry : groupedByMerchant.entrySet()) {
            List<Transaction> history = entry.getValue();
            
            // We need at least 2 payments to compare
            if (history.size() < 2) continue;

            // Sort by date descending (Newest first)
            history.sort((a, b) -> b.getDate().compareTo(a.getDate()));

            Transaction latestPayment = history.get(0);
            Transaction previousPayment = history.get(1);

            BigDecimal newPrice = latestPayment.getAmount();
            BigDecimal oldPrice = previousPayment.getAmount();

            // 4. Check if the new price is strictly greater than the old price
            if (newPrice.compareTo(oldPrice) > 0) {
                // Calculate percentage increase
                BigDecimal difference = newPrice.subtract(oldPrice);
                BigDecimal percentage = difference.divide(oldPrice, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));

                // If it increased by more than 2%, flag it!
                if (percentage.compareTo(BigDecimal.valueOf(2.0)) > 0) {
                    alerts.add(new AnomalyAlert(
                            entry.getKey(),
                            oldPrice,
                            newPrice,
                            percentage.doubleValue(),
                            latestPayment.getDate().toString()
                    ));
                }
            }
        }

        return alerts;
    }
}
package com.pockettrack.backend.dashboard;

import com.pockettrack.backend.account.AccountRepository;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PredictiveEngineService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public Map<String, Object> calculateSafeToSpend(User user) {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        int daysLeftInMonth = currentMonth.lengthOfMonth() - today.getDayOfMonth();

        // 1. Get Total Current Balance
        BigDecimal totalBalance = accountRepository.findByUserId(user.getId()).stream()
                .map(a -> a.getBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Calculate Upcoming Recurring Bills (for the rest of the month)
        // We find all recurring expenses, and if they haven't been paid this month, we reserve them.
        List<Transaction> recurringTxs = transactionRepository.findRecurringByUserId(user.getId());
        BigDecimal upcomingBills = BigDecimal.ZERO;

        for (Transaction tx : recurringTxs) {
            if (tx.getType() == Transaction.TransactionType.EXPENSE && tx.getDate().getDayOfMonth() > today.getDayOfMonth()) {
                upcomingBills = upcomingBills.add(tx.getAmount());
            }
        }

        // 3. Calculate Daily Needs (Groceries, Transport, Food)
        // Look at the last 30 days to find the average daily spend on necessities
        LocalDate thirtyDaysAgo = today.minusDays(30);
        List<Transaction> recentNecessities = transactionRepository.findByUserIdAndDateBetween(
                        user.getId(), thirtyDaysAgo, today, org.springframework.data.domain.Pageable.unpaged()
                ).getContent().stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .filter(t -> List.of("Groceries", "Food & Dining", "Transport", "Utilities").contains(t.getCategory()))
                .toList();

        BigDecimal totalRecentNecessities = recentNecessities.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Average per day over the last 30 days
        BigDecimal dailyAverageNecessity = totalRecentNecessities.divide(BigDecimal.valueOf(30), 2, RoundingMode.HALF_UP);
        BigDecimal reservedForNecessities = dailyAverageNecessity.multiply(BigDecimal.valueOf(daysLeftInMonth));

        // 4. Calculate Final Safe-to-Spend
        BigDecimal safeToSpend = totalBalance.subtract(upcomingBills).subtract(reservedForNecessities);

        // Don't show negative safe-to-spend
        if (safeToSpend.compareTo(BigDecimal.ZERO) < 0) {
            safeToSpend = BigDecimal.ZERO;
        }

        // 5. Daily Guilt-Free Allowance
        BigDecimal dailyGuiltFree = daysLeftInMonth > 0
                ? safeToSpend.divide(BigDecimal.valueOf(daysLeftInMonth), 2, RoundingMode.HALF_UP)
                : safeToSpend;

        return Map.of(
                "totalBalance", totalBalance,
                "upcomingBills", upcomingBills,
                "reservedForNecessities", reservedForNecessities,
                "safeToSpend", safeToSpend,
                "dailyGuiltFree", dailyGuiltFree,
                "daysLeft", daysLeftInMonth
        );
    }
}
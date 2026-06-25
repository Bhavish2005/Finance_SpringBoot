package com.pockettrack.backend.common;

import com.pockettrack.backend.account.AccountRepository;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardSummaryService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Cacheable(value = "dashboardSummary", key = "#user.id.toString()")
    public Map<String, Object> getSummary(User user) {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate today = LocalDate.now();

        List<Transaction> transactions = transactionRepository
                .findByUserIdAndDateBetween(
                        user.getId(), startOfMonth, today,
                        PageRequest.of(0, 1000)
                ).getContent();

        BigDecimal income = BigDecimal.ZERO;
        BigDecimal expenses = BigDecimal.ZERO;

        for (Transaction tx : transactions) {
            if (tx.getType() == Transaction.TransactionType.INCOME) {
                income = income.add(tx.getAmount());
            } else if (tx.getType() == Transaction.TransactionType.EXPENSE) {
                expenses = expenses.add(tx.getAmount());
            }
        }

        BigDecimal netWorth = accountRepository.findByUserId(user.getId()).stream()
                .map(account -> account.getBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("monthlyIncome", income);
        summary.put("monthlyExpenses", expenses);
        summary.put("monthlySavings", income.subtract(expenses));
        summary.put("netWorth", netWorth);
        return summary;
    }
}
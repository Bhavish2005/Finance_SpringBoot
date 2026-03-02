package com.pockettrack.backend.common;

import com.pockettrack.backend.common.MonthlyReportService;
import com.pockettrack.backend.account.AccountRepository;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final MonthlyReportService monthlyReportService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(
            @AuthenticationPrincipal User user) {

        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate today        = LocalDate.now();

        // All transactions this month
        var transactions = transactionRepository
                .findByUserIdAndDateBetween(
                        user.getId(), startOfMonth, today,
                        PageRequest.of(0, 1000)
                ).getContent();

        BigDecimal income   = BigDecimal.ZERO;
        BigDecimal expenses = BigDecimal.ZERO;

        for (Transaction tx : transactions) {
            if (tx.getType() == Transaction.TransactionType.INCOME) {
                income = income.add(tx.getAmount());
            } else if (tx.getType() == Transaction.TransactionType.EXPENSE) {
                expenses = expenses.add(tx.getAmount());
            }
        }

        // Net worth = sum of all account balances
        var accounts  = accountRepository.findByUserId(user.getId());
        BigDecimal netWorth = accounts.stream()
                .map(a -> a.getBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("monthlyIncome",   income);
        summary.put("monthlyExpenses", expenses);
        summary.put("monthlySavings",  income.subtract(expenses));
        summary.put("netWorth",        netWorth);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<List<Map<String, Object>>> getCategoryBreakdown(
            @AuthenticationPrincipal User user) {

        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate today        = LocalDate.now();

        var transactions = transactionRepository
                .findByUserIdAndTypeAndDateBetween(
                        user.getId(),
                        Transaction.TransactionType.EXPENSE,
                        startOfMonth, today,
                        PageRequest.of(0, 1000)
                ).getContent();

        // Group expenses by category
        Map<String, BigDecimal> grouped = new LinkedHashMap<>();
        for (Transaction tx : transactions) {
            grouped.merge(tx.getCategory(), tx.getAmount(), BigDecimal::add);
        }

        // Convert to list sorted by amount descending
        List<Map<String, Object>> result = new ArrayList<>();
        grouped.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .forEach(entry -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("category", entry.getKey());
                    item.put("amount",   entry.getValue());
                    result.add(item);
                });

        return ResponseEntity.ok(result);
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyTrend(
            @AuthenticationPrincipal User user) {

        List<Map<String, Object>> trend = new ArrayList<>();

        // Last 6 months
        for (int i = 5; i >= 0; i--) {
            LocalDate date  = LocalDate.now().minusMonths(i);
            LocalDate start = date.withDayOfMonth(1);
            LocalDate end   = date.withDayOfMonth(date.lengthOfMonth());

            var transactions = transactionRepository
                    .findByUserIdAndDateBetween(
                            user.getId(), start, end,
                            PageRequest.of(0, 1000)
                    ).getContent();

            BigDecimal income   = BigDecimal.ZERO;
            BigDecimal expenses = BigDecimal.ZERO;

            for (Transaction tx : transactions) {
                if (tx.getType() == Transaction.TransactionType.INCOME) {
                    income = income.add(tx.getAmount());
                } else if (tx.getType() == Transaction.TransactionType.EXPENSE) {
                    expenses = expenses.add(tx.getAmount());
                }
            }

            Map<String, Object> month = new LinkedHashMap<>();
            month.put("month",    date.getMonth().toString().substring(0, 3));
            month.put("income",   income);
            month.put("expenses", expenses);
            trend.add(month);
        }

        return ResponseEntity.ok(trend);
    }
    // Add to imports


    // Add to constructor injection


    // Add endpoint
    @PostMapping("/send-report")
    public ResponseEntity<Map<String, String>> sendReport(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int month,
            @RequestParam(defaultValue = "0") int year) {
        monthlyReportService.sendReportForUser(user, month, year);
        return ResponseEntity.ok(Map.of(
                "message", "Monthly report sent to " + user.getEmail()
        ));
    }
}
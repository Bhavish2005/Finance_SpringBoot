package com.pockettrack.backend.common;

import com.pockettrack.backend.account.AccountRepository;
import com.pockettrack.backend.budget.BudgetRepository;
import com.pockettrack.backend.goal.GoalRepository;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/health-score")
@RequiredArgsConstructor
public class HealthScoreController {

    private final TransactionRepository transactionRepository;
    private final AccountRepository     accountRepository;
    private final BudgetRepository      budgetRepository;
    private final GoalRepository        goalRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealthScore(
            @AuthenticationPrincipal User user) {

        LocalDate now   = LocalDate.now();
        LocalDate start = now.withDayOfMonth(1);
        int month       = now.getMonthValue();
        int year        = now.getYear();

        // Fetch this month's transactions
        List<Transaction> txs = transactionRepository
                .findByUserIdAndDateBetween(
                        user.getId(), start, now,
                        PageRequest.of(0, 10000)
                ).getContent();

        BigDecimal income = txs.stream()
                .filter(t -> t.getType() ==
                        Transaction.TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expenses = txs.stream()
                .filter(t -> t.getType() ==
                        Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // ---- Component 1: Savings Rate (30 points) ----
        // Good = saving 20%+ of income
        double savingsScore = 0;
        String savingsMsg;
        if (income.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal savings     = income.subtract(expenses);
            double     savingsRate = savings
                    .divide(income, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();

            if (savingsRate >= 30)      { savingsScore = 30; savingsMsg = "Excellent! Saving " + String.format("%.0f", savingsRate) + "% of income"; }
            else if (savingsRate >= 20) { savingsScore = 24; savingsMsg = "Good! Saving " + String.format("%.0f", savingsRate) + "% of income"; }
            else if (savingsRate >= 10) { savingsScore = 15; savingsMsg = "Fair. Try to save at least 20% of income"; }
            else if (savingsRate >= 0)  { savingsScore = 8;  savingsMsg = "Low savings rate — reduce expenses"; }
            else                        { savingsScore = 0;  savingsMsg = "Spending more than you earn this month"; }
        } else {
            savingsMsg = "No income recorded this month";
        }

        // ---- Component 2: Budget Adherence (25 points) ----
        var budgets = budgetRepository
                .findByUserIdAndMonthAndYear(user.getId(), month, year);

        double budgetScore = 25; // Start full, deduct for overruns
        String budgetMsg;
        int overBudget = 0;

        if (budgets.isEmpty()) {
            budgetScore = 10;
            budgetMsg   = "Set budgets to track spending limits";
        } else {
            for (var budget : budgets) {
                BigDecimal spent = txs.stream()
                        .filter(t -> t.getType() ==
                                Transaction.TransactionType.EXPENSE
                                && t.getCategory().equals(
                                budget.getCategory()))
                        .map(Transaction::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                double pct = budget.getAmount()
                        .compareTo(BigDecimal.ZERO) > 0
                        ? spent.divide(budget.getAmount(),
                                4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue()
                        : 0;

                if (pct > 100) overBudget++;
            }

            double deduction = (double) overBudget / budgets.size() * 25;
            budgetScore = Math.max(0, 25 - deduction);

            if (overBudget == 0) {
                budgetMsg = "All budgets on track this month";
            } else {
                budgetMsg = overBudget + " of " + budgets.size() +
                        " budgets exceeded";
            }
        }

        // ---- Component 3: Goal Progress (25 points) ----
        var goals = goalRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId());

        double goalScore;
        String goalMsg;

        if (goals.isEmpty()) {
            goalScore = 10;
            goalMsg   = "Set savings goals to improve your score";
        } else {
            long activeGoals    = goals.stream()
                    .filter(g -> g.getStatus().toString().equals("ACTIVE"))
                    .count();
            long completedGoals = goals.stream()
                    .filter(g -> g.getStatus().toString().equals("COMPLETED"))
                    .count();

            double avgProgress = goals.stream()
                    .mapToDouble(g -> {
                        if (g.getTargetAmount()
                                .compareTo(BigDecimal.ZERO) == 0) return 0;
                        return g.getCurrentAmount()
                                .divide(g.getTargetAmount(),
                                        4, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100))
                                .doubleValue();
                    })
                    .average()
                    .orElse(0);

            goalScore = Math.min(25, (avgProgress / 100) * 20 +
                    completedGoals * 5);

            goalMsg = completedGoals + " goal(s) completed, " +
                    activeGoals + " active — avg " +
                    String.format("%.0f", avgProgress) + "% progress";
        }

        // ---- Component 4: Net Worth (20 points) ----
        BigDecimal netWorth = accountRepository
                .findByUserId(user.getId()).stream()
                .map(a -> a.getBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double netWorthScore;
        String netWorthMsg;

        if (netWorth.compareTo(BigDecimal.valueOf(100000)) >= 0) {
            netWorthScore = 20;
            netWorthMsg   = "Strong net worth — keep it growing";
        } else if (netWorth.compareTo(BigDecimal.valueOf(50000)) >= 0) {
            netWorthScore = 16;
            netWorthMsg   = "Good net worth — keep building";
        } else if (netWorth.compareTo(BigDecimal.valueOf(10000)) >= 0) {
            netWorthScore = 10;
            netWorthMsg   = "Building net worth — stay consistent";
        } else if (netWorth.compareTo(BigDecimal.ZERO) >= 0) {
            netWorthScore = 5;
            netWorthMsg   = "Low net worth — focus on saving";
        } else {
            netWorthScore = 0;
            netWorthMsg   = "Negative net worth — reduce debts";
        }

        // ---- Total Score ----
        double totalScore = savingsScore + budgetScore +
                goalScore + netWorthScore;
        int    score      = (int) Math.round(totalScore);

        String grade;
        String gradeColor;
        String gradeMsg;

        if (score >= 85)      { grade = "A"; gradeColor = "#10B981"; gradeMsg = "Excellent Financial Health! "; }
        else if (score >= 70) { grade = "B"; gradeColor = "#3B82F6"; gradeMsg = "Good Financial Health! "; }
        else if (score >= 55) { grade = "C"; gradeColor = "#F59E0B"; gradeMsg = "Fair — Room for Improvement "; }
        else if (score >= 40) { grade = "D"; gradeColor = "#EF4444"; gradeMsg = "Needs Attention "; }
        else                  { grade = "F"; gradeColor = "#DC2626"; gradeMsg = "Critical — Take Action Now "; }

        // Build response
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("score",      score);
        result.put("grade",      grade);
        result.put("gradeColor", gradeColor);
        result.put("gradeMsg",   gradeMsg);

        result.put("components", List.of(
                Map.of("label", "Savings Rate",     "score", (int) savingsScore,  "max", 30, "message", savingsMsg),
                Map.of("label", "Budget Adherence", "score", (int) budgetScore,   "max", 25, "message", budgetMsg),
                Map.of("label", "Goal Progress",    "score", (int) goalScore,     "max", 25, "message", goalMsg),
                Map.of("label", "Net Worth",        "score", (int) netWorthScore, "max", 20, "message", netWorthMsg)
        ));

        return ResponseEntity.ok(result);
    }
}
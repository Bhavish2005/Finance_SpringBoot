package com.pockettrack.backend.budget;

import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public List<Map<String, Object>> getBudgets(User user, int month, int year) {
        List<Budget> budgets = budgetRepository
                .findByUserIdAndMonthAndYear(user.getId(), month, year);

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end   = start.withDayOfMonth(start.lengthOfMonth());

        List<Map<String, Object>> result = new ArrayList<>();

        for (Budget budget : budgets) {
            // Calculate how much was spent in this category this month
           var transactions = transactionRepository
        .findByUserIdAndCategoryAndTypeAndDateBetween(
                user.getId(),
                budget.getCategory(),
                Transaction.TransactionType.EXPENSE,
                start, end,
                PageRequest.of(0, 1000)
        ).getContent();

            BigDecimal spent = transactions.stream()
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            double percentage = budget.getAmount().compareTo(BigDecimal.ZERO) > 0
                    ? spent.divide(budget.getAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue()
                    : 0;

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id",         budget.getId());
            item.put("category",   budget.getCategory());
            item.put("amount",     budget.getAmount());
            item.put("spent",      spent);
            item.put("remaining",  budget.getAmount().subtract(spent));
            item.put("percentage", Math.min(percentage, 100));
            item.put("month",      budget.getMonth());
            item.put("year",       budget.getYear());
            result.add(item);
        }

        return result;
    }

    public Budget createBudget(User user, BudgetRequest req) {
        // Check if budget for this category+month+year already exists
        budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
                user.getId(), req.category(), req.month(), req.year()
        ).ifPresent(b -> {
            throw new IllegalArgumentException(
                    "Budget for " + req.category() + " already exists for this month"
            );
        });

        Budget budget = Budget.builder()
                .user(user)
                .category(req.category())
                .amount(req.amount())
                .month(req.month())
                .year(req.year())
                .build();

        return budgetRepository.save(budget);
    }

    public Budget updateBudget(User user, UUID budgetId, BudgetRequest req) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        budget.setAmount(req.amount());

        budget.setAlert80Sent(false);
        budget.setAlert100Sent(false);
        return budgetRepository.save(budget);
    }

    public void deleteBudget(User user, UUID budgetId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        budgetRepository.delete(budget);
    }
}
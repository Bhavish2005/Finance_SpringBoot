package com.pockettrack.backend.common;

import com.pockettrack.backend.budget.Budget;
import com.pockettrack.backend.budget.BudgetBadge;
import com.pockettrack.backend.budget.BudgetBadgeRepository;
import com.pockettrack.backend.budget.BudgetRepository;
import com.pockettrack.backend.transaction.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BudgetRolloverEngine {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetBadgeRepository budgetBadgeRepository;

    // Runs at Midnight on the 1st of every month
    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void processBudgetRollovers() {
        log.info("Starting monthly budget rollover process...");

        YearMonth lastMonth = YearMonth.now().minusMonths(1);
        YearMonth thisMonth = YearMonth.now();

        // Fetch every budget that existed last month across all users
        List<Budget> lastMonthBudgets = budgetRepository.findByMonthAndYear(lastMonth.getMonthValue(), lastMonth.getYear());
        int rolloverCount = 0;

        for (Budget oldBudget : lastMonthBudgets) {
            // SAFETY: If we already rolled this one over, skip it!
            if (oldBudget.isRolledOver()) continue;

            // Calculate exactly how much they spent in this category last month
            BigDecimal spentLastMonth = transactionRepository.sumCategoryExpensesForUserAndMonth(
                    oldBudget.getUser().getId(), oldBudget.getCategory(), lastMonth.getMonthValue(), lastMonth.getYear()
            );

            // Calculate leftover money
            BigDecimal leftover = oldBudget.getAmount().subtract(spentLastMonth);

            if (leftover.compareTo(BigDecimal.ZERO) > 0) {
                // Check if they already manually created a budget for the new month
                String rewardMonthString = lastMonth.getMonth().name() + " " + lastMonth.getYear();

BudgetBadge badge = BudgetBadge.builder()
        .user(oldBudget.getUser())
        .category(oldBudget.getCategory())
        .amountSaved(leftover)
        .earnedDate(LocalDate.now())
        .rewardMonth(rewardMonthString) // <-- Added this!
        .badgeType(leftover.compareTo(new BigDecimal("5000")) > 0 ? "BUDGET_MASTER" : "SAVINGS_HERO")
        .build();
budgetBadgeRepository.save(badge);
                Optional<Budget> existingThisMonth = budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
                        oldBudget.getUser().getId(), oldBudget.getCategory(), thisMonth.getMonthValue(), thisMonth.getYear()
                );

                if (existingThisMonth.isPresent()) {
                    // Add the leftover savings to their existing new budget
                    Budget currentBudget = existingThisMonth.get();
                    currentBudget.setAmount(currentBudget.getAmount().add(leftover));
                    budgetRepository.save(currentBudget);
                } else {
                    // Auto-create a new budget for them using their standard base amount + leftover
                    Budget newBudget = new Budget();
                    newBudget.setUser(oldBudget.getUser());
                    newBudget.setCategory(oldBudget.getCategory());
                    newBudget.setMonth(thisMonth.getMonthValue());
                    newBudget.setYear(thisMonth.getYear());
                    newBudget.setAmount(oldBudget.getAmount().add(leftover));
                    budgetRepository.save(newBudget);
                }
                rolloverCount++;
                log.info("Rolled over ₹{} for category {} for user {}", leftover, oldBudget.getCategory(), oldBudget.getUser().getEmail());
            }

            // Mark the old budget as processed so it never runs again
            oldBudget.setRolledOver(true);
            budgetRepository.save(oldBudget);
        }
        
        log.info("Monthly rollover complete. Processed {} budgets.", rolloverCount);
    }
}
package com.pockettrack.backend.budget;

import com.pockettrack.backend.common.EmailService;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BudgetAlertService {

    private final BudgetRepository      budgetRepository;
    private final TransactionRepository transactionRepository;
    private final EmailService          emailService;

    public void checkAndSendAlerts(User user, String category) {
        int month = LocalDate.now().getMonthValue();
        int year  = LocalDate.now().getYear();

        budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
                user.getId(), category, month, year
        ).ifPresent(budget -> {

            // Reset alert flags if it's a new month
            if (budget.getAlertMonth() == null ||
                    budget.getAlertMonth() != month) {
                budget.setAlert80Sent(false);
                budget.setAlert100Sent(false);
                budget.setAlertMonth(month);
            }

            LocalDate start = LocalDate.of(year, month, 1);
            LocalDate end   = LocalDate.now();

            List<Transaction> txs = transactionRepository
                    .findByUserIdAndCategoryAndTypeAndDateBetween(
                            user.getId(),
                            category,
                            Transaction.TransactionType.EXPENSE,
                            start, end,
                            PageRequest.of(0, 1000)
                    ).getContent();

            BigDecimal spent = txs.stream()
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            double percentage = budget.getAmount()
                    .compareTo(BigDecimal.ZERO) > 0
                    ? spent.divide(budget.getAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue()
                    : 0;

            String monthName = Month.of(month).toString();

            // Send 80% warning — only once per month
            if (percentage >= 80 && percentage < 100
                    && !budget.isAlert80Sent()) {
                emailService.sendEmail(
                        user.getEmail(),
                        "⚠️ Budget Warning — " + category,
                        buildWarningEmail(
                                user.getName(), category,
                                spent, budget.getAmount(),
                                percentage, monthName
                        )
                );
                budget.setAlert80Sent(true);
                budgetRepository.save(budget);
                log.info("Sent 80% alert to {} for {}", user.getEmail(), category);
            }

            // Send 100% exceeded alert — only once per month
            if (percentage >= 100 && !budget.isAlert100Sent()) {
                emailService.sendEmail(
                        user.getEmail(),
                        "🚨 Budget Exceeded — " + category,
                        buildExceededEmail(
                                user.getName(), category,
                                spent, budget.getAmount(),
                                monthName
                        )
                );
                budget.setAlert100Sent(true);
                budgetRepository.save(budget);
                log.info("Sent 100% alert to {} for {}", user.getEmail(), category);
            }
        });
    }

    private String buildWarningEmail(String name, String category,
                                     BigDecimal spent, BigDecimal budget,
                                     double percentage, String month) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #F59E0B; padding: 20px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0;">⚠️ Budget Warning</h1>
              </div>
              <div style="background: #FFFBEB; padding: 24px; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px;">Hi <strong>%s</strong>,</p>
                <p>You've used <strong style="color: #D97706;">%.0f%%</strong> of your
                   <strong>%s</strong> budget for <strong>%s</strong>.</p>
                <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 4px 0;">💸 Spent: <strong>₹%s</strong></p>
                  <p style="margin: 4px 0;">🎯 Budget: <strong>₹%s</strong></p>
                  <p style="margin: 4px 0;">⚠️ Usage: <strong>%.0f%%</strong></p>
                </div>
                <p style="color: #92400E;">You're running low — consider reducing spending
                   in this category.</p>
                <a href="http://localhost:5173/budget"
                   style="background: #F59E0B; color: white; padding: 12px 24px;
                          border-radius: 8px; text-decoration: none; display: inline-block;">
                  View Budget →
                </a>
              </div>
            </div>
            """.formatted(name, percentage, category, month,
                spent.toPlainString(), budget.toPlainString(), percentage);
    }

    private String buildExceededEmail(String name, String category,
                                      BigDecimal spent, BigDecimal budget,
                                      String month) {
        BigDecimal overspent = spent.subtract(budget);
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #EF4444; padding: 20px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0;">🚨 Budget Exceeded</h1>
              </div>
              <div style="background: #FEF2F2; padding: 24px; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px;">Hi <strong>%s</strong>,</p>
                <p>You've <strong style="color: #DC2626;">exceeded</strong> your
                   <strong>%s</strong> budget for <strong>%s</strong>!</p>
                <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 4px 0;">💸 Spent: <strong style="color: #DC2626;">₹%s</strong></p>
                  <p style="margin: 4px 0;">🎯 Budget: <strong>₹%s</strong></p>
                  <p style="margin: 4px 0;">🔴 Overspent by: <strong style="color: #DC2626;">₹%s</strong></p>
                </div>
                <p style="color: #991B1B;">Time to review your spending and adjust
                   your budget or habits.</p>
                <a href="http://localhost:5173/budget"
                   style="background: #EF4444; color: white; padding: 12px 24px;
                          border-radius: 8px; text-decoration: none; display: inline-block;">
                  View Budget →
                </a>
              </div>
            </div>
            """.formatted(name, category, month,
                spent.toPlainString(), budget.toPlainString(),
                overspent.toPlainString());
    }
}
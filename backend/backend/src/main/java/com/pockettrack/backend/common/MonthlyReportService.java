package com.pockettrack.backend.common;

import com.pockettrack.backend.account.AccountRepository;
import com.pockettrack.backend.budget.BudgetRepository;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import com.pockettrack.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MonthlyReportService {

    private final UserRepository        userRepository;
    private final TransactionRepository transactionRepository;
    private final AccountRepository     accountRepository;
    private final BudgetRepository      budgetRepository;
    private final EmailService          emailService;

    // Runs at 9:00 AM on the 1st of every month
    @Scheduled(cron = "0 0 9 1 * *")
    public void sendMonthlyReports() {
        log.info("Starting monthly report job...");
        List<User> users = userRepository.findAll();
        for (User user : users) {
            try {
                LocalDate last = LocalDate.now().minusMonths(1);
                sendReportForUser(user, last.getMonthValue(), last.getYear());
            } catch (Exception e) {
                log.error("Failed to send report for {}: {}",
                        user.getEmail(), e.getMessage());
            }
        }
        log.info("Monthly report job complete — sent to {} users", users.size());
    }

    // Can also be triggered manually via API
    public void sendReportForUser(User user , int month, int year) {
        // Get last month's date range
        if (month == 0) month = LocalDate.now().getMonthValue();
        if (year  == 0) year  = LocalDate.now().getYear();

        LocalDate targetDate = LocalDate.of(year, month, 1);
        LocalDate start      = targetDate.withDayOfMonth(1);
        LocalDate end        = targetDate.withDayOfMonth(
                targetDate.lengthOfMonth());

        // Cap end to today if we're in the current month
        if (end.isAfter(LocalDate.now())) end = LocalDate.now();

        String monthName = targetDate.getMonth().toString();
//        int    month     = lastMonth.getMonthValue();
//        int    year      = lastMonth.getYear();
        // Fetch all transactions last month
        List<Transaction> allTx = transactionRepository
                .findByUserIdAndDateBetween(
                        user.getId(), start, end,
                        PageRequest.of(0, 10000)
                ).getContent();

        // Income and expenses
        BigDecimal income = allTx.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expenses = allTx.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal savings = income.subtract(expenses);

        // Net worth
        BigDecimal netWorth = accountRepository
                .findByUserId(user.getId()).stream()
                .map(a -> a.getBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Top 3 spending categories
        Map<String, BigDecimal> byCategory = allTx.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO,
                                Transaction::getAmount, BigDecimal::add)
                ));

        List<Map.Entry<String, BigDecimal>> topCategories = byCategory
                .entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue()
                        .reversed())
                .limit(3)
                .collect(Collectors.toList());

        // Budget performance
        List<String> budgetLines = new ArrayList<>();
        budgetRepository.findByUserIdAndMonthAndYear(
                user.getId(), month, year
        ).forEach(budget -> {
            BigDecimal spent = allTx.stream()
                    .filter(t -> t.getType() ==
                            Transaction.TransactionType.EXPENSE
                            && t.getCategory().equals(budget.getCategory()))
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            double pct = budget.getAmount().compareTo(BigDecimal.ZERO) > 0
                    ? spent.divide(budget.getAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0;

            String status = pct >= 100 ? "🔴 Over budget" :
                    pct >= 80  ? "🟡 Near limit"  : "🟢 On track";

            budgetLines.add(String.format(
                    "<tr><td style='padding:8px'>%s</td>" +
                            "<td style='padding:8px'>₹%s</td>" +
                            "<td style='padding:8px'>₹%s</td>" +
                            "<td style='padding:8px'>%s</td></tr>",
                    budget.getCategory(),
                    spent.toPlainString(),
                    budget.getAmount().toPlainString(),
                    status
            ));
        });

        // Build and send email
        String html = buildReportEmail(
                user.getName(), monthName, year,
                income, expenses, savings, netWorth,
                topCategories, budgetLines,
                allTx.size()
        );

        emailService.sendEmail(
                user.getEmail(),
                "📊 Your PocketTrack Report — " + monthName + " " + year,
                html
        );

        log.info("Monthly report sent to {}", user.getEmail());
    }

    private String buildReportEmail(
            String name, String month, int year,
            BigDecimal income, BigDecimal expenses,
            BigDecimal savings, BigDecimal netWorth,
            List<Map.Entry<String, BigDecimal>> topCategories,
            List<String> budgetLines, int txCount) {

        StringBuilder catRows = new StringBuilder();
        for (int i = 0; i < topCategories.size(); i++) {
            var entry = topCategories.get(i);
            catRows.append("<tr><td style='padding:8px'>")
                    .append(i + 1).append(". ").append(entry.getKey())
                    .append("</td><td style='padding:8px;color:#EF4444'>₹")
                    .append(entry.getValue().toPlainString())
                    .append("</td></tr>");
        }

        String budgetTable = budgetLines.isEmpty()
                ? "<p style='color:#6B7280'>No budgets set for this month</p>"
                : "<table style='width:100%;border-collapse:collapse'>" +
                "<tr style='background:#F3F4F6'>" +
                "<th style='padding:8px;text-align:left'>Category</th>" +
                "<th style='padding:8px;text-align:left'>Spent</th>" +
                "<th style='padding:8px;text-align:left'>Budget</th>" +
                "<th style='padding:8px;text-align:left'>Status</th></tr>" +
                String.join("", budgetLines) + "</table>";

        String savingsColor = savings.compareTo(BigDecimal.ZERO) >= 0
                ? "#10B981" : "#EF4444";

        StringBuilder html = new StringBuilder();
        html.append("<div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto'>")

                // Header
                .append("<div style='background:linear-gradient(135deg,#3B82F6,#6366F1);")
                .append("padding:30px;border-radius:12px 12px 0 0;text-align:center'>")
                .append("<h1 style='color:white;margin:0;font-size:24px'>")
                .append("💰 PocketTrack Monthly Report</h1>")
                .append("<p style='color:rgba(255,255,255,0.8);margin:8px 0 0'>")
                .append(month).append(" ").append(year).append("</p></div>")

                // Body
                .append("<div style='background:#F9FAFB;padding:24px'>")
                .append("<p style='font-size:16px'>Hi <strong>").append(name)
                .append("</strong>,</p>")
                .append("<p>Here's your financial summary for <strong>")
                .append(month).append(" ").append(year)
                .append("</strong>. You had <strong>").append(txCount)
                .append(" transactions</strong> this month.</p>")

                // Stats cards
                .append("<div style='margin:20px 0'>")

                .append("<div style='display:flex;gap:12px;margin-bottom:12px'>")
                .append("<div style='background:white;border-radius:8px;padding:16px;flex:1'>")
                .append("<p style='color:#6B7280;margin:0;font-size:12px'>INCOME</p>")
                .append("<p style='color:#10B981;font-size:22px;font-weight:bold;margin:4px 0'>₹")
                .append(income.toPlainString()).append("</p></div>")
                .append("<div style='background:white;border-radius:8px;padding:16px;flex:1'>")
                .append("<p style='color:#6B7280;margin:0;font-size:12px'>EXPENSES</p>")
                .append("<p style='color:#EF4444;font-size:22px;font-weight:bold;margin:4px 0'>₹")
                .append(expenses.toPlainString()).append("</p></div></div>")

                .append("<div style='display:flex;gap:12px'>")
                .append("<div style='background:white;border-radius:8px;padding:16px;flex:1'>")
                .append("<p style='color:#6B7280;margin:0;font-size:12px'>SAVINGS</p>")
                .append("<p style='color:").append(savingsColor)
                .append(";font-size:22px;font-weight:bold;margin:4px 0'>₹")
                .append(savings.toPlainString()).append("</p></div>")
                .append("<div style='background:white;border-radius:8px;padding:16px;flex:1'>")
                .append("<p style='color:#6B7280;margin:0;font-size:12px'>NET WORTH</p>")
                .append("<p style='color:#3B82F6;font-size:22px;font-weight:bold;margin:4px 0'>₹")
                .append(netWorth.toPlainString()).append("</p></div></div></div>")

                // Top categories
                .append("<div style='background:white;border-radius:8px;padding:16px;margin:12px 0'>")
                .append("<h3 style='margin:0 0 12px'>🔥 Top Spending Categories</h3>")
                .append("<table style='width:100%'>")
                .append(catRows)
                .append("</table></div>")

                // Budget performance
                .append("<div style='background:white;border-radius:8px;padding:16px;margin:12px 0'>")
                .append("<h3 style='margin:0 0 12px'>🎯 Budget Performance</h3>")
                .append(budgetTable)
                .append("</div>")

                // CTA
                .append("<div style='text-align:center;margin-top:24px'>")
                .append("<a href='http://localhost:5173/dashboard' ")
                .append("style='background:#3B82F6;color:white;padding:14px 32px;")
                .append("border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block'>")
                .append("View Full Dashboard →</a></div>")

                .append("<p style='color:#9CA3AF;font-size:12px;text-align:center;margin-top:24px'>")
                .append("PocketTrack — Your AI Financial Manager</p>")
                .append("</div></div>");

        return html.toString();
    }
}
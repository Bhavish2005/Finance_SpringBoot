package com.pockettrack.backend.account;

import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountAnalyticsService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public Map<String, Object> getAccountAnalytics(User user, UUID accountId) {
        // 1. Securely fetch the account
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to account");
        }

        // 2. Fetch all transactions for THIS account
        List<Transaction> transactions = transactionRepository.findByUserIdAndAccountIdOrderByDateDesc(user.getId(), accountId);

        // 3. Calculate Current Month's Income & Expense for the Donut Chart
        YearMonth currentMonth = YearMonth.now();
        
        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                .filter(t -> YearMonth.from(t.getDate()).equals(currentMonth))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .filter(t -> YearMonth.from(t.getDate()).equals(currentMonth))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Build the payload
        Map<String, Object> response = new HashMap<>();
        response.put("accountId", account.getId());
        response.put("accountName", account.getName());
        response.put("accountType", account.getType().name());
        response.put("balance", account.getBalance());
        response.put("monthlyIncome", totalIncome);
        response.put("monthlyExpense", totalExpense);
        response.put("transactions", transactions); // Send the list for the UI table

        return response;
    }
}
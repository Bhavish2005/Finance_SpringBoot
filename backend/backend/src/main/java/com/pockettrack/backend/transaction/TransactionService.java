//package com.pockettrack.backend.transaction;
//
//import com.pockettrack.backend.account.Account;
//import com.pockettrack.backend.account.AccountRepository;
//import com.pockettrack.backend.user.User;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.*;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class TransactionService {
//
//    private final TransactionRepository transactionRepository;
//    private final AccountRepository accountRepository;
//
////    public Page<Transaction> getTransactions(User user,
////                                             UUID accountId,
////                                             LocalDate from,
////                                             LocalDate to,
////                                             String category,
////                                             String type,
////                                             int page,
////                                             int size) {
////        Pageable pageable = PageRequest.of(page, size);
////        Transaction.TransactionType txType = null;
////        if (type != null && !type.isBlank()) {
////            txType = Transaction.TransactionType.valueOf(type.toUpperCase());
////        }
////        return transactionRepository.findWithFilters(
////                user.getId(), accountId, from, to, category, txType, pageable
////        );
////    }
//
//    public Page<Transaction> getTransactions(User user,
//                                             UUID accountId,
//                                             LocalDate from,
//                                             LocalDate to,
//                                             String category,
//                                             String type,
//                                             int page,
//                                             int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return transactionRepository.findWithFilters(
//                user.getId(), accountId, from, to, category, type, pageable
//        );
//    }
//
//    @Transactional
//    public Transaction createTransaction(User user, TransactionRequest req) {
//        Account account = accountRepository
//                .findByIdAndUserId(req.accountId(), user.getId())
//                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
//
//        // Build and save transaction
//        Transaction tx = Transaction.builder()
//                .user(user)
//                .account(account)
//                .type(req.type())
//                .amount(req.amount())
//                .category(req.category())
//                .description(req.description())
//                .date(req.date())
//                .isRecurring(req.isRecurring())
//                .build();
//
//        // Update account balance based on transaction type
//        applyBalance(account, req.type(), req.amount());
//        accountRepository.save(account);
//
//        return transactionRepository.save(tx);
//    }
//
//    @Transactional
//    public Transaction updateTransaction(User user, UUID txId, TransactionRequest req) {
//        Transaction tx = transactionRepository
//                .findByIdAndUserId(txId, user.getId())
//                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
//
//        Account account = tx.getAccount();
//
//        // Step 1 — reverse the OLD transaction's effect on balance
//        reverseBalance(account, tx.getType(), tx.getAmount());
//
//        // Step 2 — apply the NEW transaction's effect on balance
//        applyBalance(account, req.type(), req.amount());
//        accountRepository.save(account);
//
//        // Step 3 — update transaction fields
//        tx.setType(req.type());
//        tx.setAmount(req.amount());
//        tx.setCategory(req.category());
//        tx.setDescription(req.description());
//        tx.setDate(req.date());
//        tx.setRecurring(req.isRecurring());
//
//        return transactionRepository.save(tx);
//    }
//
//    @Transactional
//    public void deleteTransaction(User user, UUID txId) {
//        Transaction tx = transactionRepository
//                .findByIdAndUserId(txId, user.getId())
//                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
//
//        // Reverse the balance effect before deleting
//        Account account = tx.getAccount();
//        reverseBalance(account, tx.getType(), tx.getAmount());
//        accountRepository.save(account);
//
//        transactionRepository.delete(tx);
//    }
//
//    // --- Balance helpers ---
//
//    private void applyBalance(Account account,
//                              Transaction.TransactionType type,
//                              BigDecimal amount) {
//        switch (type) {
//            case INCOME   -> account.setBalance(account.getBalance().add(amount));
//            case EXPENSE  -> account.setBalance(account.getBalance().subtract(amount));
//            case TRANSFER -> account.setBalance(account.getBalance().subtract(amount));
//        }
//    }
//
//    private void reverseBalance(Account account,
//                                Transaction.TransactionType type,
//                                BigDecimal amount) {
//        switch (type) {
//            case INCOME   -> account.setBalance(account.getBalance().subtract(amount));
//            case EXPENSE  -> account.setBalance(account.getBalance().add(amount));
//            case TRANSFER -> account.setBalance(account.getBalance().add(amount));
//        }
//    }
//}


package com.pockettrack.backend.transaction;
import org.springframework.data.domain.Sort;
import com.pockettrack.backend.account.Account;
import com.pockettrack.backend.account.AccountRepository;
import com.pockettrack.backend.budget.BudgetAlertService;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final BudgetAlertService budgetAlertService;

    public Page<Transaction> getTransactions(User user, UUID accountId,
                                             Transaction.TransactionType type, String category,
                                             LocalDate from, LocalDate to, int page, int size) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "date", "createdAt"));

        LocalDate dateFrom = from != null ? from : LocalDate.of(2000, 1, 1);
        LocalDate dateTo   = to   != null ? to   : LocalDate.now().plusYears(1);

        // Account-specific queries
        if (accountId != null) {
            if (type != null && category != null)
                return transactionRepository
                        .findByAccountIdAndTypeAndCategoryAndDateBetween(
                                accountId, type, category, dateFrom, dateTo, pageable);
            if (type != null)
                return transactionRepository
                        .findByAccountIdAndTypeAndDateBetween(
                                accountId, type, dateFrom, dateTo, pageable);
            if (category != null)
                return transactionRepository
                        .findByAccountIdAndCategoryAndDateBetween(
                                accountId, category, dateFrom, dateTo, pageable);
            return transactionRepository
                    .findByAccountIdAndDateBetween(
                            accountId, dateFrom, dateTo, pageable);
        }

        // User-wide queries (existing logic)
        if (type != null && category != null)
            return transactionRepository
                    .findByUserIdAndCategoryAndTypeAndDateBetween(
                            user.getId(), category, type, dateFrom, dateTo, pageable);
        if (category != null)
            return transactionRepository
                    .findByUserIdAndCategoryAndDateBetween(
                            user.getId(), category, dateFrom, dateTo, pageable);
        if (type != null)
            return transactionRepository
                    .findByUserIdAndTypeAndDateBetween(
                            user.getId(), type, dateFrom, dateTo, pageable);

        return transactionRepository
                .findByUserIdAndDateBetween(
                        user.getId(), dateFrom, dateTo, pageable);
    }

    @Transactional
    public Transaction createTransaction(User user, TransactionRequest req) {
        Account account = accountRepository
                .findByIdAndUserId(req.accountId(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        LocalDate lastMonthStart = req.date().minusMonths(1).withDayOfMonth(1);
        LocalDate lastMonthEnd   = req.date().minusMonths(1)
                .withDayOfMonth(
                        req.date().minusMonths(1).lengthOfMonth()
                );

        List<Transaction> similar = transactionRepository.findSimilarTransactions(
                user.getId(),
                req.category(),
                req.amount(),
                lastMonthStart,
                lastMonthEnd
        );

        // If same transaction existed last month — auto flag as recurring
        boolean autoRecurring = !similar.isEmpty();
        Transaction tx = Transaction.builder()
                .user(user)
                .account(account)
                .type(req.type())
                .amount(req.amount())
                .category(req.category())
                .description(req.description())
                .date(req.date())
                .isRecurring(req.isRecurring() || autoRecurring)
                .build();

        applyBalance(account, req.type(), req.amount());
        accountRepository.save(account);
        Transaction saved = transactionRepository.save(tx);

        // ✅ THEN check alerts — now includes the new transaction
        if (saved.getType() == Transaction.TransactionType.EXPENSE) {
            budgetAlertService.checkAndSendAlerts(user, saved.getCategory());
        }

        return saved;
    }

    @Transactional
    public Transaction updateTransaction(User user, UUID txId, TransactionRequest req) {
        Transaction tx = transactionRepository
                .findByIdAndUserId(txId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        Account account = tx.getAccount();
        reverseBalance(account, tx.getType(), tx.getAmount());
        applyBalance(account, req.type(), req.amount());
        accountRepository.save(account);

        tx.setType(req.type());
        tx.setAmount(req.amount());
        tx.setCategory(req.category());
        tx.setDescription(req.description());
        tx.setDate(req.date());
        tx.setRecurring(req.isRecurring());

        return transactionRepository.save(tx);
    }

    @Transactional
    public void deleteTransaction(User user, UUID txId) {
        Transaction tx = transactionRepository
                .findByIdAndUserId(txId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        Account account = tx.getAccount();
        reverseBalance(account, tx.getType(), tx.getAmount());
        accountRepository.save(account);

        transactionRepository.delete(tx);
    }

    private void applyBalance(Account account,
                              Transaction.TransactionType type,
                              BigDecimal amount) {
        switch (type) {
            case INCOME   -> account.setBalance(account.getBalance().add(amount));
            case EXPENSE  -> account.setBalance(account.getBalance().subtract(amount));
            case TRANSFER -> account.setBalance(account.getBalance().subtract(amount));
        }
    }

    private void reverseBalance(Account account,
                                Transaction.TransactionType type,
                                BigDecimal amount) {
        switch (type) {
            case INCOME   -> account.setBalance(account.getBalance().subtract(amount));
            case EXPENSE  -> account.setBalance(account.getBalance().add(amount));
            case TRANSFER -> account.setBalance(account.getBalance().add(amount));
        }
    }
    public Page<Transaction> searchTransactions(User user, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository.searchByKeyword(user.getId(), keyword, pageable);
    }
    public List<Transaction> getRecurringTransactions(User user) {
        return transactionRepository.findRecurringByUserId(user.getId());
    }
}
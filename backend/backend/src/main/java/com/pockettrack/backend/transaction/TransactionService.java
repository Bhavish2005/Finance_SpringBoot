package com.pockettrack.backend.transaction;

import com.pockettrack.backend.account.Account;
import com.pockettrack.backend.account.AccountRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public Page<Transaction> getTransactions(User user,
                                             UUID accountId,
                                             LocalDate from,
                                             LocalDate to,
                                             String category,
                                             String type,
                                             int page,
                                             int size) {
        Pageable pageable = PageRequest.of(page, size);
        Transaction.TransactionType txType = null;
        if (type != null && !type.isBlank()) {
            txType = Transaction.TransactionType.valueOf(type.toUpperCase());
        }
        return transactionRepository.findWithFilters(
                user.getId(), accountId, from, to, category, txType, pageable
        );
    }

    @Transactional
    public Transaction createTransaction(User user, TransactionRequest req) {
        Account account = accountRepository
                .findByIdAndUserId(req.accountId(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Build and save transaction
        Transaction tx = Transaction.builder()
                .user(user)
                .account(account)
                .type(req.type())
                .amount(req.amount())
                .category(req.category())
                .description(req.description())
                .date(req.date())
                .isRecurring(req.isRecurring())
                .build();

        // Update account balance based on transaction type
        applyBalance(account, req.type(), req.amount());
        accountRepository.save(account);

        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction updateTransaction(User user, UUID txId, TransactionRequest req) {
        Transaction tx = transactionRepository
                .findByIdAndUserId(txId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        Account account = tx.getAccount();

        // Step 1 — reverse the OLD transaction's effect on balance
        reverseBalance(account, tx.getType(), tx.getAmount());

        // Step 2 — apply the NEW transaction's effect on balance
        applyBalance(account, req.type(), req.amount());
        accountRepository.save(account);

        // Step 3 — update transaction fields
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

        // Reverse the balance effect before deleting
        Account account = tx.getAccount();
        reverseBalance(account, tx.getType(), tx.getAmount());
        accountRepository.save(account);

        transactionRepository.delete(tx);
    }

    // --- Balance helpers ---

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
}
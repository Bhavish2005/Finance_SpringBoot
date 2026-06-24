package com.pockettrack.backend.event;

import com.pockettrack.backend.event.dto.ExpenseRequest;
import com.pockettrack.backend.user.User;
import com.pockettrack.backend.user.UserRepository;
// Ensure these map correctly to your transaction core module imports
import com.pockettrack.backend.transaction.TransactionService;
import com.pockettrack.backend.transaction.TransactionRequest;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.account.Account;
import com.pockettrack.backend.account.AccountRepository; 

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EventExpenseService {

    private final EventRepository eventRepository;
    private final SharedExpenseRepository sharedExpenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final SettlementRepository settlementRepository;
    private final UserRepository userRepository;
    private final TransactionService transactionService;
    private final AccountRepository accountRepository;
    private final SimpMessagingTemplate messagingTemplate;
    // @Transactional
    // public SharedExpense addExpense(UUID eventId, ExpenseRequest request) {
    //     Event event = eventRepository.findById(eventId)
    //             .orElseThrow(() -> new IllegalArgumentException("Event not found"));
    //     User paidBy = userRepository.findById(request.getPaidByUserId())
    //             .orElseThrow(() -> new IllegalArgumentException("User not found"));

    //     SharedExpense expense = SharedExpense.builder()
    //             .event(event)
    //             .paidBy(paidBy)
    //             .description(request.getDescription())
    //             .totalAmount(request.getTotalAmount())
    //             .date(LocalDate.now())
    //             .build();

    //     SharedExpense savedExpense = sharedExpenseRepository.save(expense);
    //     Set<User> participants = event.getParticipants();

    //     if (request.getCustomSplits() == null || request.getCustomSplits().isEmpty()) {
    //         // Split equally automatically across all event members
    //         BigDecimal participantCount = BigDecimal.valueOf(participants.size());
    //         BigDecimal splitAmount = request.getTotalAmount().divide(participantCount, 2, RoundingMode.HALF_UP);

    //         for (User p : participants) {
    //             ExpenseSplit split = ExpenseSplit.builder()
    //                     .sharedExpense(savedExpense)
    //                     .owedBy(p)
    //                     .amountOwed(splitAmount)
    //                     .build();
    //             expenseSplitRepository.save(split);
    //         }
    //     } else {
    //         // Handle precision-guided manual custom allocation splits
    //         for (Map.Entry<UUID, BigDecimal> customSplit : request.getCustomSplits().entrySet()) {
    //             User debtor = userRepository.findById(customSplit.getKey())
    //                     .orElseThrow(() -> new IllegalArgumentException("Debtor not found"));
                
    //             ExpenseSplit split = ExpenseSplit.builder()
    //                     .sharedExpense(savedExpense)
    //                     .owedBy(debtor)
    //                     .amountOwed(customSplit.getValue())
    //                     .build();
    //             expenseSplitRepository.save(split);
    //         }
    //     }
    //     return savedExpense;
    // }

    @Transactional
    public SharedExpense addExpense(UUID eventId, ExpenseRequest request) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        User paidBy = userRepository.findById(request.getPaidByUserId()).orElseThrow();

        SharedExpense expense = SharedExpense.builder()
                .event(event)
                .paidBy(paidBy)
                .description(request.getDescription())
                .totalAmount(request.getTotalAmount())
                .date(LocalDate.now())
                .build();

        expense = sharedExpenseRepository.save(expense);

        // Split equally among all participants
        int participantCount = event.getParticipants().size();
        BigDecimal splitAmount = request.getTotalAmount()
                .divide(BigDecimal.valueOf(participantCount), 2, RoundingMode.HALF_UP);

        for (User participant : event.getParticipants()) {
            
            // ---> FIXED: Using the correct field names for your ExpenseSplit entity <---
            ExpenseSplit split = ExpenseSplit.builder()
                    .sharedExpense(expense) 
                    .owedBy(participant)
                    .amountOwed(splitAmount)
                    .build();
            
            expenseSplitRepository.save(split);

            // Broadcast to everyone except the payer
            if (!participant.getId().equals(paidBy.getId())) {
                String destinationTopic = "/topic/notifications/" + participant.getId();
                messagingTemplate.convertAndSend(destinationTopic, 
                    paidBy.getName() + " added a new bill for '" + request.getDescription() + "' (₹" + request.getTotalAmount() + "). Debts updated!");
            }
        }

        return expense;
    }

@Transactional
    public Settlement initiateSettlement(UUID eventId, UUID payerId, UUID payeeId, BigDecimal amount, UUID payerAccountId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        User payer = userRepository.findById(payerId).orElseThrow();
        User payee = userRepository.findById(payeeId).orElseThrow();

        // 1. STRICT SECURITY: Verify Account Ownership and Balance
        Account payerAccount = accountRepository.findById(payerAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Selected bank account not found."));
        
        if (!payerAccount.getUser().getId().equals(payerId)) {
            throw new SecurityException("Unauthorized: You do not own this bank account.");
        }

        if (payerAccount.getBalance().compareTo(amount) < 0) {
            throw new IllegalStateException("Insufficient funds! Your account has ₹" + payerAccount.getBalance() + " but you need ₹" + amount);
        }

        // 2. Lock the account ID into the pending settlement
        Settlement settlement = Settlement.builder()
                .event(event)
                .payer(payer)
                .payee(payee)
                .amount(amount)
                .status(Settlement.SettlementStatus.PENDING)
                .payerAccountId(payerAccountId) // Saved for final confirmation!
                .build();

        // Fire WebSocket Notification
        String destinationTopic = "/topic/notifications/" + payee.getId();
        messagingTemplate.convertAndSend(destinationTopic, 
                payer.getName() + " initiated a payment of ₹" + amount + " to you! Please confirm.");

        return settlementRepository.save(settlement);
    }

    @Transactional
    public Settlement confirmSettlement(UUID settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new IllegalArgumentException("Settlement entry missing"));

        if (settlement.getStatus() == Settlement.SettlementStatus.CONFIRMED) {
            throw new IllegalStateException("Settlement already reconciled");
        }

        // 1. Safely grab the Payee's receiving account
        List<Account> payeeAccounts = accountRepository.findByUserId(settlement.getPayee().getId());
        if (payeeAccounts.isEmpty()) {
            throw new IllegalStateException("Transaction failed: " + settlement.getPayee().getName() + " has no Bank Accounts set up to receive money.");
        }
        Account payeeAccount = payeeAccounts.stream().filter(Account::isDefault).findFirst().orElse(payeeAccounts.get(0));

        // 2. Retrieve the EXACT account the payer selected during initiation
        Account payerAccount = accountRepository.findById(settlement.getPayerAccountId())
                .orElseThrow(() -> new IllegalStateException("The payer's funding account no longer exists!"));

        // 3. Final safety check (in case they spent their money while the request was pending)
        if (payerAccount.getBalance().compareTo(settlement.getAmount()) < 0) {
            throw new IllegalStateException("Transaction failed: The payer no longer has sufficient funds in their linked account.");
        }

        settlement.setStatus(Settlement.SettlementStatus.CONFIRMED);
        settlement.setPaymentDate(LocalDate.now());

        // 4. Hit the Double-Entry Ledger (Updates Balances Automatically)
        TransactionRequest payerReq = new TransactionRequest(
                payerAccount.getId(), Transaction.TransactionType.EXPENSE, settlement.getAmount(),
                "Shared Event", "Event Settled: " + settlement.getEvent().getName(), LocalDate.now(), false
        );
        Transaction payerTx = transactionService.createTransaction(settlement.getPayer(), payerReq);
        settlement.setPayerTransactionId(payerTx.getId());

        TransactionRequest payeeReq = new TransactionRequest(
                payeeAccount.getId(), Transaction.TransactionType.INCOME, settlement.getAmount(),
                "Shared Event", "Reimbursement: " + settlement.getEvent().getName(), LocalDate.now(), false
        );
        Transaction payeeTx = transactionService.createTransaction(settlement.getPayee(), payeeReq);
        settlement.setPayeeTransactionId(payeeTx.getId());

        // Fire Confirmed Notification
        String destinationTopic = "/topic/notifications/" + settlement.getPayer().getId();
        messagingTemplate.convertAndSend(destinationTopic, 
            "✅ Payment of ₹" + settlement.getAmount() + " for '" + settlement.getEvent().getName() + "' was confirmed!");

        return settlementRepository.save(settlement);
    }
}
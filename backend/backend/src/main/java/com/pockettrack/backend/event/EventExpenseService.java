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
    @Transactional
    public SharedExpense addExpense(UUID eventId, ExpenseRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        User paidBy = userRepository.findById(request.getPaidByUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SharedExpense expense = SharedExpense.builder()
                .event(event)
                .paidBy(paidBy)
                .description(request.getDescription())
                .totalAmount(request.getTotalAmount())
                .date(LocalDate.now())
                .build();

        SharedExpense savedExpense = sharedExpenseRepository.save(expense);
        Set<User> participants = event.getParticipants();

        if (request.getCustomSplits() == null || request.getCustomSplits().isEmpty()) {
            // Split equally automatically across all event members
            BigDecimal participantCount = BigDecimal.valueOf(participants.size());
            BigDecimal splitAmount = request.getTotalAmount().divide(participantCount, 2, RoundingMode.HALF_UP);

            for (User p : participants) {
                ExpenseSplit split = ExpenseSplit.builder()
                        .sharedExpense(savedExpense)
                        .owedBy(p)
                        .amountOwed(splitAmount)
                        .build();
                expenseSplitRepository.save(split);
            }
        } else {
            // Handle precision-guided manual custom allocation splits
            for (Map.Entry<UUID, BigDecimal> customSplit : request.getCustomSplits().entrySet()) {
                User debtor = userRepository.findById(customSplit.getKey())
                        .orElseThrow(() -> new IllegalArgumentException("Debtor not found"));
                
                ExpenseSplit split = ExpenseSplit.builder()
                        .sharedExpense(savedExpense)
                        .owedBy(debtor)
                        .amountOwed(customSplit.getValue())
                        .build();
                expenseSplitRepository.save(split);
            }
        }
        return savedExpense;
    }

    @Transactional
    public Settlement initiateSettlement(UUID eventId, UUID payerId, UUID payeeId, BigDecimal amount) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        User payer = userRepository.findById(payerId).orElseThrow();
        User payee = userRepository.findById(payeeId).orElseThrow();

        Settlement settlement = Settlement.builder()
                .event(event)
                .payer(payer)
                .payee(payee)
                .amount(amount)
                .status(Settlement.SettlementStatus.PENDING)
                .build();

        return settlementRepository.save(settlement);
    }

   @Transactional
    public Settlement confirmSettlement(UUID settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new IllegalArgumentException("Settlement entry missing"));

        if (settlement.getStatus() == Settlement.SettlementStatus.CONFIRMED) {
            throw new IllegalStateException("Settlement already reconciled");
        }

        settlement.setStatus(Settlement.SettlementStatus.CONFIRMED);
        settlement.setPaymentDate(LocalDate.now());

        // ====================================================================
        // DOUBLE-ENTRY RECONCILIATION INTEGRATION
        // ====================================================================
        
        // Helper: Find Default Account (or just the first one if no default is set)
        Account payerAccount = accountRepository.findByUserId(settlement.getPayer().getId())
                .stream().filter(Account::isDefault).findFirst()
                .orElseGet(() -> accountRepository.findByUserId(settlement.getPayer().getId()).get(0));

        Account payeeAccount = accountRepository.findByUserId(settlement.getPayee().getId())
                .stream().filter(Account::isDefault).findFirst()
                .orElseGet(() -> accountRepository.findByUserId(settlement.getPayee().getId()).get(0));

        // 1. Create personal EXPENSE entry for the debtor who paid up
        TransactionRequest payerReq = new TransactionRequest(
                payerAccount.getId(),
                Transaction.TransactionType.EXPENSE,
                settlement.getAmount(),
                "Shared Event", // Category
                "Event Settled: " + settlement.getEvent().getName(), // Description
                LocalDate.now(),
                false // isRecurring
        );
        Transaction payerTx = transactionService.createTransaction(settlement.getPayer(), payerReq);
        settlement.setPayerTransactionId(payerTx.getId());

        // 2. Create personal INCOME entry for the receiver getting their reimbursement
        TransactionRequest payeeReq = new TransactionRequest(
                payeeAccount.getId(),
                Transaction.TransactionType.INCOME,
                settlement.getAmount(),
                "Shared Event", // Category
                "Reimbursement: " + settlement.getEvent().getName(), // Description
                LocalDate.now(),
                false // isRecurring
        );
        Transaction payeeTx = transactionService.createTransaction(settlement.getPayee(), payeeReq);
        settlement.setPayeeTransactionId(payeeTx.getId());
        // ====================================================================
        // REAL-TIME WEBSOCKET NOTIFICATION
        // ====================================================================
        // Send a live alert back to the Payer telling them their debt is cleared
        String destinationTopic = "/topic/notifications/" + settlement.getPayer().getId();
        String notificationMessage = " Payment of ₹" + settlement.getAmount() + 
                                     " for '" + settlement.getEvent().getName() + 
                                     "' was confirmed by " + settlement.getPayee().getName() + "!";
        
        messagingTemplate.convertAndSend(destinationTopic, notificationMessage);
        return settlementRepository.save(settlement);
    }
}
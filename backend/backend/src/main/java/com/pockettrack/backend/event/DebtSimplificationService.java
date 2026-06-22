package com.pockettrack.backend.event;

import com.pockettrack.backend.event.dto.DebtSummary;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DebtSimplificationService {

    private final SharedExpenseRepository sharedExpenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;

    public List<DebtSummary> calculateSimplifiedDebts(UUID eventId, Set<User> participants) {
        // Map to keep track of net balances: Positive means someone is owed money, Negative means they owe money.
        Map<UUID, BigDecimal> netBalances = new HashMap<>();
        Map<UUID, User> userMap = new HashMap<>();
        
        for (User p : participants) {
            netBalances.put(p.getId(), BigDecimal.ZERO);
            userMap.put(p.getId(), p);
        }

        // 1. Add credit for what people paid
        List<SharedExpense> expenses = sharedExpenseRepository.findByEventId(eventId);
        for (SharedExpense expense : expenses) {
            UUID payerId = expense.getPaidBy().getId();
            netBalances.put(payerId, netBalances.get(payerId).add(expense.getTotalAmount()));
        }

        // 2. Subtract debit for what people owe
        List<ExpenseSplit> splits = expenseSplitRepository.findByEventId(eventId);
        for (ExpenseSplit split : splits) {
            UUID debtorId = split.getOwedBy().getId();
            netBalances.put(debtorId, netBalances.get(debtorId).subtract(split.getAmountOwed()));
        }

        // 3. Separate into Debtors and Creditors heaps to match greedily
        PriorityQueue<Map.Entry<UUID, BigDecimal>> debtors = new PriorityQueue<>(Map.Entry.comparingByValue());
        PriorityQueue<Map.Entry<UUID, BigDecimal>> creditors = new PriorityQueue<>((a, b) -> b.getValue().compareTo(a.getValue()));

        for (Map.Entry<UUID, BigDecimal> entry : netBalances.entrySet()) {
            if (entry.getValue().compareTo(BigDecimal.ZERO) < 0) {
                debtors.add(entry);
            } else if (entry.getValue().compareTo(BigDecimal.ZERO) > 0) {
                creditors.add(entry);
            }
        }

        List<DebtSummary> simplifiedDebts = new ArrayList<>();

        // 4. Match extreme ends together to optimize path count
        while (!debtors.isEmpty() && !creditors.isEmpty()) {
            Map.Entry<UUID, BigDecimal> debtor = debtors.poll();
            Map.Entry<UUID, BigDecimal> creditor = creditors.poll();

            BigDecimal amountOwed = debtor.getValue().abs();
            BigDecimal amountCredited = creditor.getValue();

            BigDecimal settlementAmount = amountOwed.min(amountCredited);

            User debtorUser = userMap.get(debtor.getKey());
            User creditorUser = userMap.get(creditor.getKey());

            simplifiedDebts.add(new DebtSummary(
                debtorUser.getId(), debtorUser.getName(),
                creditorUser.getId(), creditorUser.getName(),
                settlementAmount
            ));

            // Track remainders and push back into heaps if not perfectly cleared
            BigDecimal debtorRemainder = debtor.getValue().add(settlementAmount);
            BigDecimal creditorRemainder = creditor.getValue().subtract(settlementAmount);

            if (debtorRemainder.compareTo(BigDecimal.ZERO) < 0) {
                debtor.setValue(debtorRemainder);
                debtors.add(debtor);
            }
            if (creditorRemainder.compareTo(BigDecimal.ZERO) > 0) {
                creditor.setValue(creditorRemainder);
                creditors.add(creditor);
            }
        }

        return simplifiedDebts;
    }
}
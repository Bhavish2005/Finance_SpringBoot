package com.pockettrack.backend.common;

import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecurringTransactionEngine {

    private final TransactionRepository transactionRepository;

    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void processRecurringTransactions() {
        log.info("Starting daily recurring transaction scan...");
        
        LocalDate today = LocalDate.now();
        int currentDay = today.getDayOfMonth();
        YearMonth currentMonth = YearMonth.from(today);
        
        List<Transaction> recurringTxs = transactionRepository.findByIsRecurringTrue();
        int addedCount = 0;

        for (Transaction tx : recurringTxs) {
            // FIX: Handle 31st of the month falling into February (28th) or April (30th)
            int originalDay = tx.getDate().getDayOfMonth();
            int maxDaysThisMonth = currentMonth.lengthOfMonth();
            int targetDay = Math.min(originalDay, maxDaysThisMonth);

            if (targetDay == currentDay && tx.getDate().isBefore(today)) {
                
                boolean alreadyAdded = transactionRepository.existsByUserIdAndDescriptionAndDateBetween(
                        tx.getUser().getId(), tx.getDescription(), currentMonth.atDay(1), currentMonth.atEndOfMonth()
                );

                if (!alreadyAdded) {
                    Transaction autoTx = new Transaction();
                    autoTx.setUser(tx.getUser());
                    autoTx.setAccount(tx.getAccount());
                    autoTx.setAmount(tx.getAmount());
                    autoTx.setCategory(tx.getCategory());
                    autoTx.setDescription(tx.getDescription());
                    autoTx.setType(tx.getType());
                    autoTx.setDate(today);
                    autoTx.setRecurring(true);

                    transactionRepository.save(autoTx);
                    addedCount++;
                }
            }
        }
        log.info("Daily scan complete. Auto-posted {} recurring transactions.", addedCount);
    }
}
package com.pockettrack.backend.transaction;

import com.pockettrack.backend.user.User;
import com.pockettrack.backend.ai.GeminiService;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.opencsv.CSVWriter;
import jakarta.servlet.http.HttpServletResponse;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.util.List;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final GeminiService geminiService;
    @GetMapping
    public ResponseEntity<Page<Transaction>> getTransactions(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) UUID accountId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                transactionService.getTransactions(
                        user, accountId, from, to, category, type, page, size)
        );
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(transactionService.createTransaction(user, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(transactionService.updateTransaction(user, id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        transactionService.deleteTransaction(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/scan-receipt")
    public ResponseEntity<?> scanReceipt(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> result = geminiService.parseReceipt(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to parse receipt: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Transaction>> search(
            @AuthenticationPrincipal User user,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                transactionService.searchTransactions(user, keyword, page, size)
        );
    }
    @GetMapping("/export/csv")
    public void exportCsv(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            HttpServletResponse response) throws Exception {

        // Set response headers for file download
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition",
                "attachment; filename=transactions_" +
                        LocalDate.now() + ".csv");

        // Fetch all matching transactions (no pagination)
        LocalDate dateFrom = from != null ? from : LocalDate.of(2000, 1, 1);
        LocalDate dateTo   = to   != null ? to   : LocalDate.now().plusDays(1);

        List<Transaction> transactions = transactionRepository
                .findForExport(user.getId(), dateFrom, dateTo);
        // Write CSV
        CSVWriter writer = new CSVWriter(
                new OutputStreamWriter(response.getOutputStream())
        );

        // Header row
        writer.writeNext(new String[]{
                "Date", "Type", "Category",
                "Description", "Amount", "Currency"
        });

        // Data rows
        for (Transaction tx : transactions) {
            writer.writeNext(new String[]{
                    tx.getDate().toString(),
                    tx.getType().toString(),
                    tx.getCategory(),
                    tx.getDescription() != null ? tx.getDescription() : "",
                    tx.getAmount().toString(),
                    tx.getAccount().getCurrency()
            });
        }

        writer.flush();
        writer.close();
    }
    @GetMapping("/recurring")
    public ResponseEntity<List<Transaction>> getRecurring(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                transactionService.getRecurringTransactions(user)
        );
    }
}
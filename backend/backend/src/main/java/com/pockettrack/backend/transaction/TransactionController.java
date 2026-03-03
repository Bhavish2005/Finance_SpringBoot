package com.pockettrack.backend.transaction;

import java.util.HashMap;
import org.springframework.web.multipart.MultipartFile;
import com.opencsv.CSVReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
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
            @RequestParam(required = false) Transaction.TransactionType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                transactionService.getTransactions(
                        user, accountId, type, category, from, to, page, size)
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
    @PostMapping("/import/csv")
    public ResponseEntity<?> importCsv(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file,
            @RequestParam UUID accountId) {

        String filename = file.getOriginalFilename() != null
                ? file.getOriginalFilename().toLowerCase() : "";

        try {
            List<Map<String, Object>> results;
            if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                results = processExcel(user, file, accountId);
            } else if (filename.endsWith(".csv")) {
                results = processCsv(user, file, accountId);
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Unsupported file type. Use .csv or .xlsx"));
            }

            int success = (int) results.stream()
                    .filter(r -> "success".equals(r.get("status"))).count();
            int failed  = results.size() - success;

            return ResponseEntity.ok(Map.of(
                    "success", success,
                    "failed",  failed,
                    "total",   results.size(),
                    "results", results
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to process file: " +
                            e.getMessage()));
        }
    }

    // ---- Process CSV ----
    private List<Map<String, Object>> processCsv(
            User user, MultipartFile file, UUID accountId)
            throws Exception {

        List<Map<String, Object>> results = new ArrayList<>();

        try (CSVReader reader = new CSVReader(
                new InputStreamReader(file.getInputStream()))) {

            List<String[]> allRows = reader.readAll();
            if (allRows.isEmpty()) throw new Exception("Empty CSV file");

            // Find the header row — first row that contains "date"
            int headerRowIndex = findHeaderRow(allRows);
            if (headerRowIndex == -1)
                throw new Exception("Could not find header row with Date column");

            String[] headers = allRows.get(headerRowIndex);
            Map<String, Integer> colIndex = findColumnIndexes(headers);

            for (int i = headerRowIndex + 1; i < allRows.size(); i++) {
                String[] row = allRows.get(i);
                if (isEmptyRow(row)) continue;
                results.add(importRow(user, accountId, row, colIndex, i + 1));
            }
        }
        return results;
    }

    // ---- Process Excel ----
    private List<Map<String, Object>> processExcel(
            User user, MultipartFile file, UUID accountId)
            throws Exception {

        List<Map<String, Object>> results = new ArrayList<>();

        try (org.apache.poi.ss.usermodel.Workbook workbook =
                     org.apache.poi.ss.usermodel.WorkbookFactory
                             .create(file.getInputStream())) {

            org.apache.poi.ss.usermodel.Sheet sheet =
                    workbook.getSheetAt(0);

            // Collect all rows as String arrays
            List<String[]> allRows = new ArrayList<>();
            for (int i = 0; i <= sheet.getLastRowNum(); i++) {
                org.apache.poi.ss.usermodel.Row row = sheet.getRow(i);
                if (row == null) { allRows.add(new String[0]); continue; }

                String[] rowData = new String[row.getLastCellNum()];
                for (int j = 0; j < row.getLastCellNum(); j++) {
                    org.apache.poi.ss.usermodel.Cell cell = row.getCell(j);
                    rowData[j] = cell != null ? getCellValue(cell) : "";
                }
                allRows.add(rowData);
            }

            // Find header row
            int headerRowIndex = findHeaderRow(allRows);
            if (headerRowIndex == -1)
                throw new Exception("Could not find header row with Date column");

            String[] headers = allRows.get(headerRowIndex);
            Map<String, Integer> colIndex = findColumnIndexes(headers);

            for (int i = headerRowIndex + 1; i < allRows.size(); i++) {
                String[] row = allRows.get(i);
                if (isEmptyRow(row)) continue;
                results.add(importRow(user, accountId, row, colIndex, i + 1));
            }
        }
        return results;
    }

    // ---- Find which row is the actual header ----
    private int findHeaderRow(List<String[]> rows) {
        for (int i = 0; i < Math.min(rows.size(), 10); i++) {
            String[] row = rows.get(i);
            for (String cell : row) {
                if (cell != null &&
                        cell.trim().toLowerCase().matches("date|transaction date|value date|txdate")) {
                    return i;
                }
            }
        }
        return -1;
    }

    // ---- Find column indexes — handles debit/credit split columns ----
    private Map<String, Integer> findColumnIndexes(String[] headers) {
        Map<String, Integer> index = new HashMap<>();

        for (int i = 0; i < headers.length; i++) {
            if (headers[i] == null) continue;
            String h = headers[i].trim().toLowerCase()
                    .replaceAll("[^a-z0-9]", "");
            switch (h) {
                case "date", "transactiondate",
                     "valuedate", "txdate",
                     "postingdate"                  -> index.put("date",        i);

                case "type", "transactiontype",
                     "txtype", "creditdebit",
                     "drcrflag", "drcr"             -> index.put("type",        i);

                case "category", "cat",
                     "transactioncategory"          -> index.put("category",    i);

                case "description", "desc",
                     "narration", "particulars",
                     "remarks", "details",
                     "transactiondescription",
                     "memo", "reference"            -> index.put("description", i);

                // Single amount column
                case "amount", "amt", "value",
                     "transactionamount"            -> index.put("amount",      i);

                // Split debit/credit columns
                case "debit", "debitamount",
                     "dr", "withdrawal",
                     "withdrawalamount"             -> index.put("debit",       i);

                case "credit", "creditamount",
                     "cr", "deposit",
                     "depositamount"                -> index.put("credit",      i);

                case "subtype", "subcategory"       -> index.put("subtype",     i);
            }
        }
        return index;
    }

    // ---- Import a single row ----
    private Map<String, Object> importRow(
            User user, UUID accountId,
            String[] row, Map<String, Integer> colIndex,
            int rowNum) {

        try {
            if (!colIndex.containsKey("date")) {
                return Map.of("row", rowNum, "status", "failed",
                        "reason", "Missing Date column");
            }

            // Date
            String dateStr = getCol(row, colIndex, "date");
            if (dateStr.isEmpty()) return Map.of(
                    "row", rowNum, "status", "failed",
                    "reason", "Empty date on this row");

            LocalDate date = parseDate(dateStr);

            // Amount — handle single amount OR separate debit/credit columns
            BigDecimal amount;
            Transaction.TransactionType type;

            boolean hasAmount = colIndex.containsKey("amount");
            boolean hasDebit  = colIndex.containsKey("debit");
            boolean hasCredit = colIndex.containsKey("credit");

            if (hasDebit || hasCredit) {
                // Bank statement format — separate debit/credit columns
                String debitStr  = cleanAmount(getCol(row, colIndex, "debit"));
                String creditStr = cleanAmount(getCol(row, colIndex, "credit"));

                boolean isCredit = !creditStr.isEmpty() &&
                        !creditStr.equals("0");
                boolean isDebit  = !debitStr.isEmpty() &&
                        !debitStr.equals("0");

                if (isCredit) {
                    amount = new BigDecimal(creditStr);
                    type   = Transaction.TransactionType.INCOME;
                } else if (isDebit) {
                    amount = new BigDecimal(debitStr);
                    type   = Transaction.TransactionType.EXPENSE;
                } else {
                    return Map.of("row", rowNum, "status", "failed",
                            "reason", "Both debit and credit are empty");
                }

                // Override type if explicit type column exists
                String typeStr = getCol(row, colIndex, "type").toUpperCase();
                if (!typeStr.isEmpty()) {
                    type = parseType(typeStr, type);
                }

                // Also check subtype column for DEPOSIT/WITHDRAWAL hints
                String subtype = getCol(row, colIndex, "subtype").toUpperCase();
                if (!subtype.isEmpty()) {
                    if (subtype.contains("INTEREST") ||
                            subtype.contains("DEPOSIT")) {
                        type = Transaction.TransactionType.INCOME;
                    } else if (subtype.contains("WITHDRAWAL") ||
                            subtype.contains("FEE")) {
                        type = Transaction.TransactionType.EXPENSE;
                    }
                }

            } else if (hasAmount) {
                // Standard single amount column
                String amtStr = cleanAmount(getCol(row, colIndex, "amount"));
                if (amtStr.isEmpty()) return Map.of(
                        "row", rowNum, "status", "failed",
                        "reason", "Empty amount");

                // Negative amount = expense
                boolean negative = amtStr.startsWith("-");
                amtStr = amtStr.replace("-", "");
                amount = new BigDecimal(amtStr);

                String typeStr = getCol(row, colIndex, "type").toUpperCase();
                if (!typeStr.isEmpty()) {
                    type = parseType(typeStr,
                            Transaction.TransactionType.EXPENSE);
                } else {
                    type = negative
                            ? Transaction.TransactionType.EXPENSE
                            : Transaction.TransactionType.INCOME;
                }
            } else {
                return Map.of("row", rowNum, "status", "failed",
                        "reason", "No amount column found (Amount, Debit or Credit)");
            }

            // Category
            String category = getCol(row, colIndex, "category");
            if (category.isEmpty()) {
                // Try to guess from description or type column
                String desc = getCol(row, colIndex, "description").toLowerCase();
                category = guessCategory(desc,
                        getCol(row, colIndex, "type"));
            }

            // Description
            String description = getCol(row, colIndex, "description");

            TransactionRequest req = new TransactionRequest(
                    accountId, type, amount,
                    category, description, date, false
            );

            transactionService.createTransaction(user, req);

            return Map.of(
                    "row",    rowNum,
                    "status", "success",
                    "desc",   description.isEmpty() ? category : description,
                    "amount", amount,
                    "type",   type.toString()
            );

        } catch (Exception e) {
            return Map.of(
                    "row",    rowNum,
                    "status", "failed",
                    "reason", e.getMessage() != null
                            ? e.getMessage() : "Invalid data"
            );
        }
    }

    // ---- Parse transaction type ----
    private Transaction.TransactionType parseType(
            String typeStr,
            Transaction.TransactionType defaultType) {
        return switch (typeStr.trim()) {
            case "INCOME", "CREDIT", "CR",
                 "DEPOSIT", "IN"              ->
                    Transaction.TransactionType.INCOME;
            case "TRANSFER", "TRF",
                 "TRANSFER OUT"              ->
                    Transaction.TransactionType.TRANSFER;
            case "EXPENSE", "DEBIT", "DR",
                 "WITHDRAWAL", "WITHDRAW",
                 "OUT"                       ->
                    Transaction.TransactionType.EXPENSE;
            default -> defaultType;
        };
    }

    // ---- Guess category from description ----
    private String guessCategory(String desc, String type) {
        if (desc.contains("salary") || desc.contains("payroll"))
            return "Salary";
        if (desc.contains("uber") || desc.contains("ola") ||
                desc.contains("petrol") || desc.contains("fuel"))
            return "Transport";
        if (desc.contains("swiggy") || desc.contains("zomato") ||
                desc.contains("restaurant") || desc.contains("food"))
            return "Food & Dining";
        if (desc.contains("amazon") || desc.contains("flipkart") ||
                desc.contains("shopping"))
            return "Shopping";
        if (desc.contains("netflix") || desc.contains("spotify") ||
                desc.contains("prime"))
            return "Entertainment";
        if (desc.contains("hospital") || desc.contains("pharmacy") ||
                desc.contains("medical"))
            return "Healthcare";
        if (desc.contains("electricity") || desc.contains("water") ||
                desc.contains("gas") || desc.contains("internet"))
            return "Utilities";
        if (desc.contains("rent") || desc.contains("maintenance"))
            return "Housing";
        if (desc.contains("interest") || desc.contains("dividend"))
            return "Investment Returns";
        return "Other";
    }

    // ---- Clean amount string ----
    private String cleanAmount(String raw) {
        if (raw == null || raw.trim().isEmpty()) return "";
        // Remove currency symbols, spaces, commas — keep digits, dot, minus
        String cleaned = raw.trim()
                .replaceAll("[₹$€£,\\s]", "")
                .replaceAll("[^0-9.\\-]", "");
        // Remove trailing CR/DR text that some banks add
        cleaned = cleaned.replaceAll("(?i)(cr|dr)$", "").trim();
        return cleaned.isEmpty() ? "" : cleaned;
    }

    // ---- Helpers ----
    private String getCol(String[] row,
                          Map<String, Integer> colIndex,
                          String key) {
        Integer idx = colIndex.get(key);
        if (idx == null || idx >= row.length) return "";
        return row[idx] != null ? row[idx].trim() : "";
    }

    private boolean isEmptyRow(String[] row) {
        for (String cell : row) {
            if (cell != null && !cell.trim().isEmpty()) return false;
        }
        return true;
    }

    private String getCellValue(
            org.apache.poi.ss.usermodel.Cell cell) {
        return switch (cell.getCellType()) {
            case NUMERIC -> {
                if (org.apache.poi.ss.usermodel.DateUtil
                        .isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue()
                            .toLocalDate().toString();
                }
                double val = cell.getNumericCellValue();
                if (val == Math.floor(val) && !Double.isInfinite(val)) {
                    yield String.valueOf((long) val);
                }
                yield String.valueOf(val);
            }
            case BOOLEAN ->
                    String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> {
                try {
                    yield String.valueOf(cell.getNumericCellValue());
                } catch (Exception e) {
                    yield cell.getStringCellValue();
                }
            }
            default -> cell.getStringCellValue().trim();
        };
    }

    private LocalDate parseDate(String dateStr) {
        String[] formats = {
                "yyyy-MM-dd",  "dd/MM/yyyy",   "MM/dd/yyyy",
                "dd-MM-yyyy",  "dd MMM yyyy",  "yyyy/MM/dd",
                "d/M/yyyy",    "d-M-yyyy",     "dd.MM.yyyy",
                "MMM dd yyyy", "dd MMM yy",    "M/d/yy",
                "d-MMM-yy",    "d MMM yy",     "dd-MMM-yyyy",
                "d/M/yy",      "MM-dd-yyyy"
        };

        dateStr = dateStr.trim();
        for (String format : formats) {
            try {
                return LocalDate.parse(dateStr,
                        DateTimeFormatter.ofPattern(format));
            } catch (DateTimeParseException ignored) {}
        }
        throw new IllegalArgumentException(
                "Cannot parse date: " + dateStr +
                        ". Supported formats: yyyy-MM-dd, dd/MM/yyyy, dd-MMM-yy");
    }
}
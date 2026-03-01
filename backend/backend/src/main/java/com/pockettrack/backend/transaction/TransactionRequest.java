package com.pockettrack.backend.transaction;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TransactionRequest(
        @NotNull(message = "Account is required") UUID accountId,
        @NotNull(message = "Type is required") Transaction.TransactionType type,
        @NotNull @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        BigDecimal amount,
        @NotBlank(message = "Category is required") String category,
        String description,
        @NotNull(message = "Date is required") LocalDate date,
        boolean isRecurring
) {}
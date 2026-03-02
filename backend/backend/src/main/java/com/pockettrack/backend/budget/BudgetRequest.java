package com.pockettrack.backend.budget;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record BudgetRequest(
        @NotBlank(message = "Category is required") String category,
        @NotNull @DecimalMin(value = "1.00") BigDecimal amount,
        @NotNull Integer month,
        @NotNull Integer year
) {}
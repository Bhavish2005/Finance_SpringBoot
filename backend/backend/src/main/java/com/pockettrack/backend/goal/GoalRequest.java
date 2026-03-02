package com.pockettrack.backend.goal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalRequest(
        @NotBlank(message = "Goal name is required") String name,
        @NotNull @DecimalMin(value = "1.00") BigDecimal targetAmount,
        LocalDate targetDate
) {}
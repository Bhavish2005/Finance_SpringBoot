package com.pockettrack.backend.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AccountRequest(
        @NotBlank(message = "Account name is required") String name,
        @NotNull(message = "Account type is required") Account.AccountType type,
        String currency,
        boolean isDefault
) {}
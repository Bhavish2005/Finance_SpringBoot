package com.pockettrack.backend.event.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
public class DebtSummary {
    private UUID debtorId;
    private String debtorName;
    private UUID creditorId;
    private String creditorName;
    private BigDecimal amount;
}
package com.pockettrack.backend.event.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Data
public class ExpenseRequest {
    private String description;
    private BigDecimal totalAmount;
    private UUID paidByUserId;
    // Map of User UUID -> How much they owe. If empty, split equally automatically.
    private Map<UUID, BigDecimal> customSplits; 
}
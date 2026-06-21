package com.pockettrack.backend.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class AnomalyAlert {
    private String merchant;       // e.g., "Netflix"
    private BigDecimal oldPrice;
    private BigDecimal newPrice;
    private double percentageChange;
    private String dateDetected;
    private String type;
}
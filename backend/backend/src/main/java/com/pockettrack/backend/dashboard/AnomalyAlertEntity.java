package com.pockettrack.backend.dashboard;

import com.pockettrack.backend.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "anomaly_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnomalyAlertEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String merchant;
    private BigDecimal oldPrice;
    private BigDecimal newPrice;
    private double percentageChange;
    private LocalDate dateDetected;
    private String type; // "HIKE" or "DROP"
    
    @Column(name = "is_resolved")
    @Builder.Default
    private boolean isResolved = false; // Useful if you want users to "Dismiss" alerts later
    // Add this field inside AnomalyAlertEntity.java
    @Column(name = "is_read")
    @Builder.Default
    private boolean isRead = false;
}
package com.pockettrack.backend.dashboard;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pockettrack.backend.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "subscription_anomalies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionAnomaly {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @JsonIgnore // Prevents Jackson JSON Infinite Loops!
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String merchant;

    @Column(name = "old_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal oldPrice;

    @Column(name = "new_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal newPrice;

    @Column(nullable = false)
    private String type; // "HIKE" or "DROP"

    @Column(name = "detected_date", nullable = false)
    private LocalDate detectedDate;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;
}
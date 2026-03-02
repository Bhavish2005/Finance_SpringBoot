package com.pockettrack.backend.budget;

import com.pockettrack.backend.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "budgets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "alert_80_sent")
    @Builder.Default
    private boolean alert80Sent = false;

    @Column(name = "alert_100_sent")
    @Builder.Default
    private boolean alert100Sent = false;

    @Column(name = "alert_month")
    private Integer alertMonth;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
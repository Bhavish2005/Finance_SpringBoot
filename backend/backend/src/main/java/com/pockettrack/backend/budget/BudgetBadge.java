package com.pockettrack.backend.budget;

import com.pockettrack.backend.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "budget_badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetBadge {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String category;
    private BigDecimal amountSaved;
    private LocalDate earnedDate;
    private String badgeType; // "SAVINGS_HERO", "BUDGET_MASTER"
    
    // ADDED THIS: To explicitly store "June 2026" etc.
    private String rewardMonth; 
}
// package com.pockettrack.backend.event;
// import com.fasterxml.jackson.annotation.JsonIgnore;
// import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
// import com.pockettrack.backend.user.User;
// import jakarta.persistence.*;
// import lombok.*;
// import java.math.BigDecimal;
// import java.time.LocalDate;
// import java.util.UUID;

// @Entity
// @Table(name = "settlements")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class Settlement {
//     @Id
//     @GeneratedValue(strategy = GenerationType.AUTO)
//     private UUID id;

//     @JsonIgnore
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "event_id", nullable = false)
//     private Event event;

//     @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "payer_user_id", nullable = false)
//     private User payer; // The person who scans the QR and pays

//     @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "payee_user_id", nullable = false)
//     private User payee; // The person who receives the money

//     @Column(nullable = false, precision = 12, scale = 2)
//     private BigDecimal amount;

//     @Column(name = "payment_date")
//     private LocalDate paymentDate;

//     @Enumerated(EnumType.STRING)
//     @Column(nullable = false)
//     private SettlementStatus status; // PENDING, CONFIRMED

//     // Double-Entry Synchronization Links
//     @Column(name = "payer_transaction_id")
//     private UUID payerTransactionId; // Auto-created EXPENSE on confirmation

//     @Column(name = "payee_transaction_id")
//     private UUID payeeTransactionId; // Auto-created INCOME/REIMBURSEMENT on confirmation

//     public enum SettlementStatus {
//         PENDING, CONFIRMED
//     }
// }

package com.pockettrack.backend.event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pockettrack.backend.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "settlements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settlement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payer_user_id", nullable = false)
    private User payer; 

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payee_user_id", nullable = false)
    private User payee; 

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SettlementStatus status; // PENDING, CONFIRMED

    @Column(name = "payer_transaction_id")
    private UUID payerTransactionId; 

    @Column(name = "payee_transaction_id")
    private UUID payeeTransactionId; 

    // ---> NEW: Lock in the exact funding account! <---
    @Column(name = "payer_account_id", nullable = false)
    private UUID payerAccountId;

    public enum SettlementStatus {
        PENDING, CONFIRMED
    }
}
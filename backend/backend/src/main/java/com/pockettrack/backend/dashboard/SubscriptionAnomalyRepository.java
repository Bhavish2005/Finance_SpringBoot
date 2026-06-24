package com.pockettrack.backend.dashboard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface SubscriptionAnomalyRepository extends JpaRepository<SubscriptionAnomaly, UUID> {
    List<SubscriptionAnomaly> findByUserIdOrderByDetectedDateDesc(UUID userId);
    
    // The "Memory Check" to prevent duplicate spam!
    boolean existsByUserIdAndMerchantAndDetectedDateGreaterThanEqual(UUID userId, String merchant, LocalDate date);
    // ---> NEW: Clear the notification bell! <---
    @Modifying
    @Query("UPDATE SubscriptionAnomaly a SET a.isRead = true WHERE a.user.id = :userId AND a.isRead = false")
    void markAllAsRead(@Param("userId") UUID userId);
    
    // ---> NEW: Count unread anomalies for the badge <---
    long countByUserIdAndIsReadFalse(UUID userId);
}

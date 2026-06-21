package com.pockettrack.backend.dashboard;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AnomalyAlertRepository extends JpaRepository<AnomalyAlertEntity, UUID> {
    // Fetch only active alerts for the dashboard
    List<AnomalyAlertEntity> findByUserIdAndIsResolvedFalseOrderByDateDetectedDesc(UUID userId);
    
    // Used by the Cron Job to wipe old data before recalculating
    void deleteByUserId(UUID userId);
}
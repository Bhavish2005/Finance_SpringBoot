package com.pockettrack.backend.budget;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BudgetBadgeRepository extends JpaRepository<BudgetBadge, UUID> {
    List<BudgetBadge> findByUserIdOrderByEarnedDateDesc(UUID userId);
}
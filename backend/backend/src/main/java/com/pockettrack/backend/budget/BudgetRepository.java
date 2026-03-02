package com.pockettrack.backend.budget;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    List<Budget> findByUserIdAndMonthAndYear(UUID userId, int month, int year);
    Optional<Budget> findByIdAndUserId(UUID id, UUID userId);
    Optional<Budget> findByUserIdAndCategoryAndMonthAndYear(
            UUID userId, String category, int month, int year
    );
}
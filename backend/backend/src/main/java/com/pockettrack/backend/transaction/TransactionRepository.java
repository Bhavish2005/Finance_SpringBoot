package com.pockettrack.backend.transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Optional<Transaction> findByIdAndUserId(UUID id, UUID userId);

    @Query("""
        SELECT t FROM Transaction t
        WHERE t.user.id = :userId
        AND (:accountId IS NULL OR t.account.id = :accountId)
        AND (:from IS NULL OR t.date >= :from)
        AND (:to IS NULL OR t.date <= :to)
        AND (:category IS NULL OR t.category = :category)
        AND (:type IS NULL OR t.type = :type)
        ORDER BY t.date DESC, t.createdAt DESC
    """)
    Page<Transaction> findWithFilters(
            @Param("userId") UUID userId,
            @Param("accountId") UUID accountId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("category") String category,
            @Param("type") Transaction.TransactionType type,
            Pageable pageable
    );
}
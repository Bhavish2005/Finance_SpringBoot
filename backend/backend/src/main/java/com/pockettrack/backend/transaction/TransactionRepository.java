package com.pockettrack.backend.transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Optional<Transaction> findByIdAndUserId(UUID id, UUID userId);

    // Used when filtering by category AND type
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND t.category = :category AND t.type = :type " +
            "AND t.date >= :from AND t.date <= :to " +
            "ORDER BY t.date DESC")
    Page<Transaction> findByUserIdAndCategoryAndTypeAndDateBetween(
            @Param("userId") UUID userId,
            @Param("category") String category,
            @Param("type") Transaction.TransactionType type,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            Pageable pageable);

    // Used when filtering by category only
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND t.category = :category " +
            "AND t.date >= :from AND t.date <= :to " +
            "ORDER BY t.date DESC")
    Page<Transaction> findByUserIdAndCategoryAndDateBetween(
            @Param("userId") UUID userId,
            @Param("category") String category,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            Pageable pageable);

    // Used when filtering by type only
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND t.type = :type " +
            "AND t.date >= :from AND t.date <= :to " +
            "ORDER BY t.date DESC")
    Page<Transaction> findByUserIdAndTypeAndDateBetween(
            @Param("userId") UUID userId,
            @Param("type") Transaction.TransactionType type,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            Pageable pageable);

    // Used when no category or type filter
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND t.date >= :from AND t.date <= :to " +
            "ORDER BY t.date DESC")
    Page<Transaction> findByUserIdAndDateBetween(
            @Param("userId") UUID userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            Pageable pageable);

    // No date filter versions
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "ORDER BY t.date DESC, t.createdAt DESC")
    Page<Transaction> findByUserId(
            @Param("userId") UUID userId,
            Pageable pageable);

    @Query("SELECT t FROM Transaction t " +
            "WHERE t.user.id = :userId " +
            "AND (LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.category) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY t.date DESC, t.createdAt DESC")
    Page<Transaction> searchByKeyword(
            @Param("userId") UUID userId,
            @Param("keyword") String keyword,
            Pageable pageable
    );
    @Query("SELECT t FROM Transaction t " +
            "JOIN FETCH t.account " +
            "WHERE t.user.id = :userId " +
            "AND t.date >= :from AND t.date <= :to " +
            "ORDER BY t.date DESC")
    List<Transaction> findForExport(
            @Param("userId") UUID userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
    @Query("SELECT t FROM Transaction t " +
            "WHERE t.user.id = :userId " +
            "AND t.isRecurring = true " +
            "ORDER BY t.date DESC")
    List<Transaction> findRecurringByUserId(@Param("userId") UUID userId);

    @Query("SELECT t FROM Transaction t " +
            "WHERE t.user.id = :userId " +
            "AND t.category = :category " +
            "AND t.amount = :amount " +
            "AND t.date >= :from AND t.date <= :to " +
            "ORDER BY t.date DESC")
    List<Transaction> findSimilarTransactions(
            @Param("userId") UUID userId,
            @Param("category") String category,
            @Param("amount") java.math.BigDecimal amount,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
}
package com.pockettrack.backend.event;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, UUID> {
    List<ExpenseSplit> findBySharedExpenseId(UUID sharedExpenseId);
    
    @Query("SELECT es FROM ExpenseSplit es WHERE es.sharedExpense.event.id = :eventId")
    List<ExpenseSplit> findByEventId(@Param("eventId") UUID eventId);
}
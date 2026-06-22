package com.pockettrack.backend.event;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SharedExpenseRepository extends JpaRepository<SharedExpense, UUID> {
    List<SharedExpense> findByEventId(UUID eventId);
}
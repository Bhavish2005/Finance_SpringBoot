package com.pockettrack.backend.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    @Query("SELECT e FROM Event e JOIN e.participants p WHERE p.id = :userId")
    List<Event> findByParticipantId(@Param("userId") UUID userId);
}
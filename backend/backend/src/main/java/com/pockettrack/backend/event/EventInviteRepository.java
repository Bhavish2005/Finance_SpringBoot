package com.pockettrack.backend.event;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EventInviteRepository extends JpaRepository<EventInvite, UUID> {
    List<EventInvite> findByInviteeIdAndStatus(UUID inviteeId, EventInvite.InviteStatus status);
    boolean existsByEventIdAndInviteeIdAndStatus(UUID eventId, UUID inviteeId, EventInvite.InviteStatus status);
}

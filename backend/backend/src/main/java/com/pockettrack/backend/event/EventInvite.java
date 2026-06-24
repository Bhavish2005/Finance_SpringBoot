package com.pockettrack.backend.event;

import com.pockettrack.backend.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "event_invites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventInvite {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inviter_id", nullable = false)
    private User inviter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitee_id", nullable = false)
    private User invitee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InviteStatus status; // PENDING, ACCEPTED, REJECTED

    public enum InviteStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
package com.pockettrack.backend.event;

import com.pockettrack.backend.event.dto.DebtSummary;
import com.pockettrack.backend.event.dto.ExpenseRequest;
import com.pockettrack.backend.user.User;
import com.pockettrack.backend.user.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional; // <-- ADDED
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Transactional // <-- IMPORTANT: Keeps DB connection open for Lazy Loading
public class EventController {

    private final EventRepository eventRepository;
    private final DebtSimplificationService debtSimplificationService;
    private final EventExpenseService eventExpenseService;
    private final SettlementRepository settlementRepository;
    private final UserRepository userRepository;
    private final EventInviteRepository eventInviteRepository; // Add this!
    private final SharedExpenseRepository sharedExpenseRepository; // <-- ADD THIS

    @GetMapping
    public ResponseEntity<List<Event>> getUserEvents(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eventRepository.findByParticipantId(user.getId()));
    }

    @GetMapping("/{eventId}/debts")
    public ResponseEntity<List<DebtSummary>> getOptimizedDebts(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal User user) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        return ResponseEntity.ok(debtSimplificationService.calculateSimplifiedDebts(eventId, event.getParticipants()));
    }

    @GetMapping("/{eventId}/settlements/pending")
    public ResponseEntity<List<SettlementDto>> getPendingSettlements(@PathVariable UUID eventId) {
        List<SettlementDto> pending = settlementRepository.findByEventId(eventId).stream()
                .filter(s -> s.getStatus() == Settlement.SettlementStatus.PENDING)
                .map(this::convertToDto) // Safely convert to DTO!
                .toList();
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/{eventId}/settle")
    public ResponseEntity<SettlementDto> initiateSettlement(
            @PathVariable UUID eventId,
            @RequestParam UUID payeeId,
            @RequestParam BigDecimal amount,
            @RequestParam UUID payerAccountId,
            @AuthenticationPrincipal User user) {
        Settlement s = eventExpenseService.initiateSettlement(eventId, user.getId(), payeeId, amount, payerAccountId);
        return ResponseEntity.ok(convertToDto(s));
    }

    @PutMapping("/settlements/{settlementId}/confirm")
    public ResponseEntity<SettlementDto> confirmSettlement(@PathVariable UUID settlementId) {
        Settlement s = eventExpenseService.confirmSettlement(settlementId);
        return ResponseEntity.ok(convertToDto(s));
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event, @AuthenticationPrincipal User user) {
        event.setCreatedBy(user);
        if (event.getParticipants() == null) {
            event.setParticipants(new HashSet<>());
        }
        event.getParticipants().add(user);
        event.setStatus(Event.EventStatus.ACTIVE);
        return ResponseEntity.ok(eventRepository.save(event));
    }

    // @PostMapping("/{eventId}/expenses")
    // public ResponseEntity<SharedExpense> addExpense(
    //         @PathVariable UUID eventId,
    //         @RequestBody ExpenseRequest request) {
    //     return ResponseEntity.ok(eventExpenseService.addExpense(eventId, request));
    // }
    // Add a new bill to the Trip/Event (SAFE JSON VERSION)
    @PostMapping("/{eventId}/expenses")
    public ResponseEntity<?> addExpense(
            @PathVariable UUID eventId,
            @RequestBody ExpenseRequest request) {
        
        // Save the expense and split it in the database
        eventExpenseService.addExpense(eventId, request);
        
        // Return a simple success message to COMPLETELY avoid JSON infinite loops!
        return ResponseEntity.ok().body(java.util.Map.of("message", "Expense added and split successfully!"));
    }

   // 6. Send an Invite (Does NOT add them to the trip yet)
    @PostMapping("/{eventId}/invite")
    public ResponseEntity<?> inviteFriend(
            @PathVariable UUID eventId,
            @RequestParam String email,
            @AuthenticationPrincipal User inviter) {
        
        Event event = eventRepository.findById(eventId).orElseThrow();
        User friend = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));

        if (event.getParticipants().contains(friend)) {
            return ResponseEntity.badRequest().body("User is already in this trip!");
        }
        if (eventInviteRepository.existsByEventIdAndInviteeIdAndStatus(eventId, friend.getId(), EventInvite.InviteStatus.PENDING)) {
            return ResponseEntity.badRequest().body("An invite is already pending for this user.");
        }

        EventInvite invite = EventInvite.builder()
                .event(event).inviter(inviter).invitee(friend).status(EventInvite.InviteStatus.PENDING).build();
        eventInviteRepository.save(invite);

        return ResponseEntity.ok("Invite sent to " + friend.getName() + "!");
    }
    // ==========================================
    // DTOs & MAPPERS (Stops JSON Infinite Loops)
    // ==========================================
    
 
    // 7. Get pending invites for the logged-in user
    @GetMapping("/invites")
    public ResponseEntity<List<InviteDto>> getMyInvites(@AuthenticationPrincipal User user) {
        List<InviteDto> invites = eventInviteRepository.findByInviteeIdAndStatus(user.getId(), EventInvite.InviteStatus.PENDING)
                .stream().map(i -> new InviteDto(i.getId(), i.getEvent().getName(), i.getInviter().getName())).toList();
        return ResponseEntity.ok(invites);
    }

    // 8. Accept or Reject Invite
    @PostMapping("/invites/{inviteId}/respond")
    public ResponseEntity<?> respondToInvite(@PathVariable UUID inviteId, @RequestParam boolean accept, @AuthenticationPrincipal User user) {
        EventInvite invite = eventInviteRepository.findById(inviteId).orElseThrow();
        
        if (accept) {
            invite.setStatus(EventInvite.InviteStatus.ACCEPTED);
            Event event = invite.getEvent();
            event.getParticipants().add(user);
            eventRepository.save(event);
        } else {
            invite.setStatus(EventInvite.InviteStatus.REJECTED);
        }
        eventInviteRepository.save(invite);
        return ResponseEntity.ok(accept ? "Joined trip!" : "Invite rejected.");
    }
       private SettlementDto convertToDto(Settlement s) {
        return new SettlementDto(
                s.getId(),
                s.getAmount(),
                s.getStatus().name(),
                new UserDto(s.getPayer().getId(), s.getPayer().getName()),
                new UserDto(s.getPayee().getId(), s.getPayee().getName())
        );
    }
    // --- TRIP ANALYTICS: Get all expenses for the ledger history ---
    @GetMapping("/{eventId}/expenses")
    public ResponseEntity<List<SharedExpenseDto>> getEventExpenses(@PathVariable UUID eventId) {
        List<SharedExpense> expenses = sharedExpenseRepository.findByEventId(eventId);
        
        // Map to DTO to prevent Jackson JSON Infinite Loops!
        List<SharedExpenseDto> dtos = expenses.stream().map(e -> new SharedExpenseDto(
                e.getId(), 
                e.getDescription(), 
                e.getTotalAmount(), 
                e.getDate(),
                new UserDto(e.getPaidBy().getId(), e.getPaidBy().getName())
        )).toList();
        
        return ResponseEntity.ok(dtos);
    }

    // DTO for the new endpoint
    @Data @AllArgsConstructor
    public static class SharedExpenseDto {
        private UUID id;
        private String description;
        private BigDecimal totalAmount;
        private LocalDate date;
        private UserDto paidBy;
    }

    @Data
    @AllArgsConstructor
    public static class SettlementDto {
        private UUID id;
        private BigDecimal amount;
        private String status;
        private UserDto payer;
        private UserDto payee;
    }

    @Data
    @AllArgsConstructor
    public static class UserDto {
        private UUID id;
        private String name;
    }
    @Data @AllArgsConstructor
    public static class InviteDto {
        private UUID inviteId;
        private String eventName;
        private String inviterName;
    }
}
package com.pockettrack.backend.event;

import com.pockettrack.backend.event.dto.DebtSummary;
import com.pockettrack.backend.event.dto.ExpenseRequest;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;
    private final DebtSimplificationService debtSimplificationService;
    private final EventExpenseService eventExpenseService;
    private final SettlementRepository settlementRepository;

    // 1. Get all events for the logged-in user
    @GetMapping
    public ResponseEntity<List<Event>> getUserEvents(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eventRepository.findByParticipantId(user.getId()));
    }

    // 2. Get the optimized "Who owes Who" list for an event
    @GetMapping("/{eventId}/debts")
    public ResponseEntity<List<DebtSummary>> getOptimizedDebts(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal User user) {
        
        Event event = eventRepository.findById(eventId).orElseThrow();
        return ResponseEntity.ok(debtSimplificationService.calculateSimplifiedDebts(eventId, event.getParticipants()));
    }

    // 3. Get pending settlements waiting for confirmation
    @GetMapping("/{eventId}/settlements/pending")
    public ResponseEntity<List<Settlement>> getPendingSettlements(@PathVariable UUID eventId) {
        List<Settlement> pending = settlementRepository.findByEventId(eventId).stream()
                .filter(s -> s.getStatus() == Settlement.SettlementStatus.PENDING)
                .toList();
        return ResponseEntity.ok(pending);
    }

    // 4. User A initiates a payment to User B
    @PostMapping("/{eventId}/settle")
    public ResponseEntity<Settlement> initiateSettlement(
            @PathVariable UUID eventId,
            @RequestParam UUID payeeId,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal User user) {
        
        // The logged-in user is the payer
        return ResponseEntity.ok(eventExpenseService.initiateSettlement(eventId, user.getId(), payeeId, amount));
    }

    // 5. User B confirms they received the money (Triggers WebSockets & Double-Entry!)
    @PutMapping("/settlements/{settlementId}/confirm")
    public ResponseEntity<Settlement> confirmSettlement(@PathVariable UUID settlementId) {
        return ResponseEntity.ok(eventExpenseService.confirmSettlement(settlementId));
    }
    // Create a new Trip/Event
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event, @AuthenticationPrincipal User user) {
        event.setCreatedBy(user);
        event.getParticipants().add(user); // Automatically add the creator to the group
        event.setStatus(Event.EventStatus.ACTIVE);
        return ResponseEntity.ok(eventRepository.save(event));
    }

    // Add a new bill to the Trip/Event
    @PostMapping("/{eventId}/expenses")
    public ResponseEntity<SharedExpense> addExpense(
            @PathVariable UUID eventId,
            @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(eventExpenseService.addExpense(eventId, request));
    }
}
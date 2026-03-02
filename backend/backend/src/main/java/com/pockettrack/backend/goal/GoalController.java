package com.pockettrack.backend.goal;

import com.pockettrack.backend.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getGoals(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(goalService.getGoals(user));
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GoalRequest req) {
        return ResponseEntity.ok(goalService.createGoal(user, req));
    }

    @PutMapping("/{id}/contribute")
    public ResponseEntity<Goal> contribute(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @RequestBody Map<String, Double> body) {
        BigDecimal amount = BigDecimal.valueOf(body.get("amount"));
        return ResponseEntity.ok(goalService.contribute(user, id, amount));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody GoalRequest req) {
        return ResponseEntity.ok(goalService.updateGoal(user, id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        goalService.deleteGoal(user, id);
        return ResponseEntity.noContent().build();
    }
}
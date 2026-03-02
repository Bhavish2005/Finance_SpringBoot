package com.pockettrack.backend.budget;

import com.pockettrack.backend.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getBudgets(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int month,
            @RequestParam(defaultValue = "0") int year) {

        // Default to current month/year
        if (month == 0) month = LocalDate.now().getMonthValue();
        if (year  == 0) year  = LocalDate.now().getYear();

        return ResponseEntity.ok(budgetService.getBudgets(user, month, year));
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BudgetRequest req) {
        return ResponseEntity.ok(budgetService.createBudget(user, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody BudgetRequest req) {
        return ResponseEntity.ok(budgetService.updateBudget(user, id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        budgetService.deleteBudget(user, id);
        return ResponseEntity.noContent().build();
    }
}
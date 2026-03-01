package com.pockettrack.backend.account;

import com.pockettrack.backend.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<List<Account>> getAccounts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.getAccounts(user));
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@AuthenticationPrincipal User user,
                                                 @Valid @RequestBody AccountRequest req) {
        return ResponseEntity.ok(accountService.createAccount(user, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@AuthenticationPrincipal User user,
                                                 @PathVariable UUID id,
                                                 @Valid @RequestBody AccountRequest req) {
        return ResponseEntity.ok(accountService.updateAccount(user, id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal User user,
                                              @PathVariable UUID id) {
        accountService.deleteAccount(user, id);
        return ResponseEntity.noContent().build();
    }
}
package com.pockettrack.backend.account;

import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public List<Account> getAccounts(User user) {
        return accountRepository.findByUserId(user.getId());
    }

    public Account createAccount(User user, AccountRequest req) {
        Account account = Account.builder()
                .user(user)
                .name(req.name())
                .type(req.type())
                .currency(req.currency() != null ? req.currency() : "INR")
                .isDefault(req.isDefault())
                .build();
        return accountRepository.save(account);
    }

    public Account updateAccount(User user, UUID accountId, AccountRequest req) {
        Account account = accountRepository.findByIdAndUserId(accountId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        account.setName(req.name());
        account.setType(req.type());
        return accountRepository.save(account);
    }

    public void deleteAccount(User user, UUID accountId) {
        Account account = accountRepository.findByIdAndUserId(accountId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        accountRepository.delete(account);
    }
}
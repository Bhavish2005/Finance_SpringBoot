package com.pockettrack.backend.goal;

import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    public List<Map<String, Object>> getGoals(User user) {
        List<Goal> goals = goalRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId());

        List<Map<String, Object>> result = new ArrayList<>();

        for (Goal goal : goals) {
            double percentage = goal.getTargetAmount()
                    .compareTo(BigDecimal.ZERO) > 0
                    ? goal.getCurrentAmount()
                    .divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue()
                    : 0;

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id",            goal.getId());
            item.put("name",          goal.getName());
            item.put("targetAmount",  goal.getTargetAmount());
            item.put("currentAmount", goal.getCurrentAmount());
            item.put("remaining",     goal.getTargetAmount()
                    .subtract(goal.getCurrentAmount()));
            item.put("percentage",    Math.min(percentage, 100));
            item.put("targetDate",    goal.getTargetDate());
            item.put("status",        goal.getStatus());
            item.put("createdAt",     goal.getCreatedAt());
            result.add(item);
        }

        return result;
    }

    public Goal createGoal(User user, GoalRequest req) {
        Goal goal = Goal.builder()
                .user(user)
                .name(req.name())
                .targetAmount(req.targetAmount())
                .targetDate(req.targetDate())
                .build();
        return goalRepository.save(goal);
    }

    public Goal contribute(User user, UUID goalId, BigDecimal amount) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));

        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));

        // Auto-complete if reached target
        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(Goal.GoalStatus.COMPLETED);
        }

        return goalRepository.save(goal);
    }

    public Goal updateGoal(User user, UUID goalId, GoalRequest req) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));
        goal.setName(req.name());
        goal.setTargetAmount(req.targetAmount());
        goal.setTargetDate(req.targetDate());
        return goalRepository.save(goal);
    }

    public void deleteGoal(User user, UUID goalId) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));
        goalRepository.delete(goal);
    }
}
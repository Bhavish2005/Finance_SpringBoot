package com.pockettrack.backend.ai;

import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final AiChatService aiChatService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> request) {
        
        try {
            // Safely cast the history from the request
            Object historyObj = request.get("history");
            List<Map<String, String>> history = new ArrayList<>();
            
            if (historyObj instanceof List) {
                history = (List<Map<String, String>>) historyObj;
            }

            // Ensure there is at least one message to process
            if (history.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("answer", "No question provided."));
            }

            String answer = aiChatService.askQuestion(user, history);
            return ResponseEntity.ok(Map.of("answer", answer));
            
        } catch (Exception e) {
            log.error("Error generating AI chat response for user {}: {}", user.getId(), e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "answer", "Sorry, I am having trouble analyzing your financial data right now. Please try again later."
            ));
        }
    }
    // --- ADD THIS INSIDE ChatController.java ---
    @PostMapping("/dispute-email")
    public ResponseEntity<Map<String, String>> generateDisputeEmail(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> requestData) {
        try {
            String emailDraft = aiChatService.generateDisputeEmail(user, requestData);
            return ResponseEntity.ok(Map.of("email", emailDraft));
        } catch (Exception e) {
            log.error("Error generating dispute email: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("email", "Error generating email."));
        }
    }
    

}






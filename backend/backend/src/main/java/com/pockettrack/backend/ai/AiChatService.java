// package com.pockettrack.backend.ai;

// // JSON parsing imports
// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;

// // Your internal models and repositories
// import com.pockettrack.backend.transaction.Transaction;
// import com.pockettrack.backend.transaction.TransactionRepository;
// import com.pockettrack.backend.user.User;

// // Spring Boot & Lombok imports
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.stereotype.Service;

// // OkHttp import (for the Gemini API call)
// import okhttp3.*;

// // Standard Java utilities
// import java.io.IOException;
// import java.time.LocalDate;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class AiChatService {

//     private final TransactionRepository transactionRepository;

//     @Value("${app.gemini.api-key}")
//     private String apiKey;

//     @Value("${app.gemini.model}")
//     private String model;

//     @Value("${app.gemini.api-url}")
//     private String apiUrl;

//     private final OkHttpClient httpClient = new OkHttpClient();
//     private final ObjectMapper objectMapper = new ObjectMapper();

//     public String askQuestion(User user, String userQuestion) throws IOException {
//         // 1. Fetch Context (Last 60 days of transactions)
//         LocalDate sixtyDaysAgo = LocalDate.now().minusDays(60);
//         List<Transaction> recentTransactions = transactionRepository.findByUserIdAndDateBetween(
//                 user.getId(), sixtyDaysAgo, LocalDate.now(), PageRequest.of(0, 200)
//         ).getContent();

//         // // 2. Format Context strictly to save tokens
//         // List<Map<String, Object>> txData = recentTransactions.stream().map(tx -> Map.of(
//         //         "date", tx.getDate().toString(),
//         //         "type", tx.getType().toString(),
//         //         "amount", tx.getAmount(),
//         //         "category", tx.getCategory(),
//         //         "desc", tx.getDescription() != null ? tx.getDescription() : ""
//         // )).collect(Collectors.toList());
//                 // 2. Format Context strictly to save tokens
//         List<Map<String, Object>> txData = recentTransactions.stream().map(tx -> Map.<String, Object>of(
//                 "date", tx.getDate().toString(),
//                 "type", tx.getType().toString(),
//                 "amount", tx.getAmount(),
//                 "category", tx.getCategory(),
//                 "desc", tx.getDescription() != null ? tx.getDescription() : ""
//         )).collect(Collectors.toList());

//         String contextJson = objectMapper.writeValueAsString(txData);

        
//         String prompt = """
//             You are FinanceVUE AI, an expert personal financial advisor. 
//             Answer the user's question concisely, using ONLY the following transaction data representing their last 60 days of activity.
//             Do not format with markdown code blocks. Keep it conversational, helpful, and brief (under 3 sentences unless they ask for a breakdown).
            
//             USER DATA:
//             %s
            
//             USER QUESTION:
//             %s
//             """.formatted(contextJson, userQuestion);

//         // 4. Call Gemini
//         String requestBody = objectMapper.writeValueAsString(Map.of(
//                 "contents", new Object[]{
//                         Map.of("parts", new Object[]{
//                                 Map.of("text", prompt)
//                         })
//                 },
//                 "generationConfig", Map.of("temperature", 0.3) // Low temperature for factual answers
//         ));

//         Request request = new Request.Builder()
//                 .url(apiUrl + "/" + model + ":generateContent?key=" + apiKey)
//                 .post(RequestBody.create(requestBody, MediaType.parse("application/json")))
//                 .build();

//         try (Response response = httpClient.newCall(request).execute()) {
//             if (!response.isSuccessful()) throw new IOException("Gemini API error: " + response.code());
            
//             JsonNode root = objectMapper.readTree(response.body().string());
//             return root.at("/candidates/0/content/parts/0/text").asText().trim();
//         }
//     }
// }


package com.pockettrack.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pockettrack.backend.account.Account;
import com.pockettrack.backend.account.AccountRepository;
import com.pockettrack.backend.budget.Budget;
import com.pockettrack.backend.budget.BudgetRepository;
import com.pockettrack.backend.dashboard.PredictiveEngineService;
import com.pockettrack.backend.goal.Goal;
import com.pockettrack.backend.goal.GoalRepository;
import com.pockettrack.backend.transaction.Transaction;
import com.pockettrack.backend.transaction.TransactionRepository;
import com.pockettrack.backend.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiChatService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final AccountRepository accountRepository;
    private final PredictiveEngineService predictiveEngineService;

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model:gemini-2.5-flash}")
    private String model;

    @Value("${app.gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String apiUrl;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();
            
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String askQuestion(User user, List<Map<String, String>> chatHistory) throws IOException {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        int daysLeft = currentMonth.lengthOfMonth() - today.getDayOfMonth();

        // 1. Fetch & Compress Transactions
        List<Transaction> recentTransactions = transactionRepository.findByUserIdAndDateBetween(
                user.getId(), today.minusDays(60), today, PageRequest.of(0, 200)
        ).getContent();

        // FIX 1: Removed the redundant 4th argument from toMap
        Map<String, BigDecimal> spendingByCategory = recentTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .collect(Collectors.toMap(
                        Transaction::getCategory,
                        Transaction::getAmount,
                        BigDecimal::add 
                ));

        // FIX 2: Added explicit <String, Object> casting to Map.of()
        List<Map<String, Object>> topRecent = recentTransactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .sorted((a, b) -> b.getAmount().compareTo(a.getAmount()))
                .limit(5)
                .map(tx -> Map.<String, Object>of("date", tx.getDate().toString(), "desc", tx.getDescription() != null ? tx.getDescription() : tx.getCategory(), "amount", tx.getAmount()))
                .collect(Collectors.toList());

        // 2. Liquidity (Account Balances)
        List<Map<String, Object>> accounts = accountRepository.findByUserId(user.getId()).stream()
                .map(a -> Map.<String, Object>of("name", a.getName(), "type", a.getType().name(), "balance", a.getBalance()))
                .collect(Collectors.toList());

        // 3. Budgets, Goals, & Predictive Engine
        Map<String, Object> safeToSpendData = predictiveEngineService.calculateSafeToSpend(user);
        
        List<Map<String, Object>> budgets = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), today.getMonthValue(), today.getYear())
                .stream().map(b -> Map.<String, Object>of("category", b.getCategory(), "limit", b.getAmount())).collect(Collectors.toList());
                
        List<Map<String, Object>> goals = goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().filter(g -> g.getStatus().name().equals("ACTIVE"))
                .map(g -> Map.<String, Object>of("name", g.getName(), "target", g.getTargetAmount(), "saved", g.getCurrentAmount())).collect(Collectors.toList());

        // 4. Build Master JSON Context
        Map<String, Object> fullContext = Map.of(
                "time_context", Map.of("current_date", today.toString(), "days_left_in_month", daysLeft),
                "liquidity_accounts", accounts,
                "safe_to_spend_analysis", safeToSpendData,
                "monthly_budgets", budgets,
                "active_goals", goals,
                "last_60_days_spending_summary", spendingByCategory,
                "top_5_largest_expenses", topRecent
        );

        String contextJson = objectMapper.writeValueAsString(fullContext);

        // 5. The Production System Prompt (The "Brain")
        String systemInstruction = """
            You are FinanceVUE AI, a strict, highly intelligent wealth manager and personal financial advisor.
            
            DECISION-MAKING FRAMEWORK:
            If the user asks if they can afford an item, you MUST evaluate it in this exact order:
            1. LIQUIDITY: Do they have enough money in their 'CHECKING' or 'CASH' accounts? (NEVER advise spending from 'SAVINGS' or 'INVESTMENT' accounts for daily expenses).
            2. SAFE-TO-SPEND: Does the item cost more than their 'safeToSpend' value? (Do NOT let them touch 'upcomingBills' money).
            3. TIME OF MONTH: Look at 'days_left_in_month'. If many days are left and the purchase drains their 'dailyGuiltFree' allowance, warn them to wait.
            4. BUDGETS: Will this purchase blow a specific category limit in 'monthly_budgets'?
            
            CRITICAL RULES:
            - Use ONLY the provided JSON context. If asked about something not in the data, say "I don't have that data."
            - Format ALL money in Indian Rupees (₹) (e.g., ₹5,000).
            - Be empathetic but financially disciplined. Keep answers concise.
            
            USER FINANCIAL CONTEXT:
            %s
            """.formatted(contextJson);

        // 6. Assemble the Request with History Truncation
        ObjectNode requestBodyNode = objectMapper.createObjectNode();
        
        ObjectNode systemNode = objectMapper.createObjectNode();
        systemNode.putArray("parts").addObject().put("text", systemInstruction);
        requestBodyNode.set("systemInstruction", systemNode);

        int historySize = chatHistory.size();
        int startIndex = Math.max(0, historySize - 10); 
        
        ArrayNode contentsArray = objectMapper.createArrayNode();
        for (int i = startIndex; i < historySize; i++) {
            Map<String, String> msg = chatHistory.get(i);
            ObjectNode contentNode = objectMapper.createObjectNode();
            contentNode.put("role", msg.get("sender").equals("user") ? "user" : "model");
            contentNode.putArray("parts").addObject().put("text", msg.get("text"));
            contentsArray.add(contentNode);
        }
        requestBodyNode.set("contents", contentsArray);

        requestBodyNode.putObject("generationConfig").put("temperature", 0.2);

        String requestBody = objectMapper.writeValueAsString(requestBodyNode);

        Request request = new Request.Builder()
                .url(apiUrl + "/" + model + ":generateContent?key=" + apiKey)
                .post(RequestBody.create(requestBody, MediaType.parse("application/json")))
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.error("Gemini API Error: {}", response.body().string());
                throw new IOException("Gemini API returned an error.");
            }
            JsonNode root = objectMapper.readTree(response.body().string());
            return root.at("/candidates/0/content/parts/0/text").asText().trim();
        }
    }

    // --- ADD THIS TO THE BOTTOM OF AiChatService.java ---
    public String generateDisputeEmail(User user, Map<String, Object> requestData) throws IOException {
        String merchant = requestData.get("merchant").toString();
        String oldPrice = requestData.get("oldPrice").toString();
        String newPrice = requestData.get("newPrice").toString();

        String prompt = """
            You are an expert consumer rights advocate and master negotiator. 
            Write a polite, professional, but firm email to %s customer support on behalf of %s.
            
            THE SITUATION: 
            The recurring subscription price was quietly increased from ₹%s to ₹%s without clear prior consent or added value.
            
            THE GOAL: 
            Ask them to honor the original price, refund the difference, or provide a retention discount. Mention that the user is considering canceling the service due to this stealth hike.
            
            RULES:
            - Keep it under 150 words.
            - Provide a clear Subject Line at the top.
            - Leave placeholder brackets like [Your Account Email/Number] where the user needs to fill in their details.
            - Do not use markdown code blocks.
            """.formatted(merchant, user.getName(), oldPrice, newPrice);

        ObjectNode requestBodyNode = objectMapper.createObjectNode();
        requestBodyNode.putArray("contents").addObject().put("role", "user")
                .putArray("parts").addObject().put("text", prompt);
        
        // Slightly higher temperature for creative writing
        requestBodyNode.putObject("generationConfig").put("temperature", 0.6);

        Request request = new Request.Builder()
                .url(apiUrl + "/" + model + ":generateContent?key=" + apiKey)
                .post(RequestBody.create(objectMapper.writeValueAsString(requestBodyNode), MediaType.parse("application/json")))
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Gemini API error");
            JsonNode root = objectMapper.readTree(response.body().string());
            return root.at("/candidates/0/content/parts/0/text").asText().trim();
        }
    }
}






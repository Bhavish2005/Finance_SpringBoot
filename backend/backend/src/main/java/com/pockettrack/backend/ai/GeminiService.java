package com.pockettrack.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model}")
    private String model;

    @Value("${app.gemini.api-url}")
    private String apiUrl;

    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String PROMPT = """
            You are a receipt parser. Analyze this receipt image and extract data.
            Return ONLY valid JSON, no markdown, no explanation, no code fences.

            Required JSON format:
            {
              "merchant": "Store Name",
              "amount": 42.50,
              "date": "2026-03-01",
              "category": "Groceries",
              "description": "Short description of purchase"
            }

            Valid categories: Food & Dining, Groceries, Transport, Shopping,
            Entertainment, Healthcare, Utilities, Housing, Education, Travel, Other

            If you cannot read a field clearly, use null.
            Date format must be YYYY-MM-DD.
            Amount must be a number, not a string.
            """;

    public Map<String, Object> parseReceipt(MultipartFile imageFile) throws IOException {
            log.info("=== GEMINI DEBUG ===");
            log.info("API Key loaded: {}", apiKey != null ? apiKey.substring(0, 8) + "..." : "NULL");
            log.info("Model: {}", model);
            log.info("URL: {}", apiUrl);
            // ... rest of method
        byte[] imageBytes = imageFile.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        String mimeType = imageFile.getContentType() != null
                ? imageFile.getContentType() : "image/jpeg";

        // Build request body for Gemini API
        String requestBody = objectMapper.writeValueAsString(Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("inline_data", Map.of(
                                        "mime_type", mimeType,
                                        "data", base64Image
                                )),
                                Map.of("text", PROMPT)
                        })
                },
                "generationConfig", Map.of(
                        "temperature", 0.1,
                        "maxOutputTokens", 512
                )
        ));

        Request request = new Request.Builder()
                .url(apiUrl + "/" + model + ":generateContent?key=" + apiKey)
                .post(RequestBody.create(
                        requestBody,
                        MediaType.parse("application/json")
                ))
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Gemini API error: " + response.code());
            }

            String responseBody = response.body().string();
            JsonNode root = objectMapper.readTree(responseBody);
            String text = root
                    .at("/candidates/0/content/parts/0/text")
                    .asText();

            // Strip any markdown fences if Gemini adds them
            text = text.replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            return objectMapper.readValue(text, Map.class);
        }
    }
}
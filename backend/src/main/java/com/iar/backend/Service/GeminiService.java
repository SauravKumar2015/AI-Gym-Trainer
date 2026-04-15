package com.iar.backend.Service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKeysRaw;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private List<String> apiKeys;
    private final AtomicInteger currentKeyIndex = new AtomicInteger(0);
    private final WebClient webClient;

    public GeminiService() {
        this.webClient = WebClient.builder().build();
    }

    @PostConstruct
    public void init() {
        // ✅ Parse comma-separated keys into a list
        apiKeys = Arrays.stream(apiKeysRaw.split(","))
                .map(String::trim)
                .filter(k -> !k.isBlank())
                .toList();

        if (apiKeys.isEmpty()) {
            throw new IllegalStateException("No Gemini API keys configured!");
        }
        System.out.println("✅ GeminiService initialized with " + apiKeys.size() + " API key(s)");
    }

    public String generate(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prompt cannot be empty");
        }

        Map<String, Object> request = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", prompt)
                        })
                },
                // ✅ Idea 1: Limit tokens to save quota
                "generationConfig", Map.of(
                        "maxOutputTokens", 500,
                        "temperature", 0.7));

        // ✅ Idea 2: Try each key, rotate on 429
        int totalKeys = apiKeys.size();
        int attempts = 0;

        while (attempts < totalKeys) {
            int index = currentKeyIndex.get() % totalKeys;
            String currentKey = apiKeys.get(index);

            try {
                return callGemini(request, currentKey);
            } catch (ResponseStatusException e) {
                if (e.getStatusCode().value() == 429) {
                    // ✅ This key is exhausted — rotate to next
                    System.err.println("⚠️ Key #" + (index + 1) + " quota exhausted, rotating to next key...");
                    currentKeyIndex.incrementAndGet();
                    attempts++;
                } else {
                    // Non-quota error — don't retry
                    throw e;
                }
            }
        }

        // All keys exhausted
        throw new ResponseStatusException(
                HttpStatus.TOO_MANY_REQUESTS,
                "All " + totalKeys + " Gemini API keys have exhausted their quota. Try again tomorrow.");
    }

    private String callGemini(Map<String, Object> request, String apiKey) {
        var response = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.value() == 429,
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .map(body -> new ResponseStatusException(
                                        HttpStatus.TOO_MANY_REQUESTS, "Quota exceeded")))
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .map(errorBody -> new ResponseStatusException(
                                        HttpStatus.BAD_GATEWAY, "Gemini API error: " + errorBody)))
                .bodyToMono(Map.class)
                .block();

        if (response == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Null response from Gemini");
        }

        var candidates = (java.util.List<?>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "No candidates in Gemini response");
        }

        var content = (Map<?, ?>) ((Map<?, ?>) candidates.get(0)).get("content");
        var parts = (java.util.List<?>) content.get("parts");

        if (parts == null || parts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "No parts in Gemini response");
        }

        return (String) ((Map<?, ?>) parts.get(0)).get("text");
    }
}
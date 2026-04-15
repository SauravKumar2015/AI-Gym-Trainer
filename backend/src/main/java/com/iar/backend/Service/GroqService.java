package com.iar.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    private final WebClient webClient;

    public GroqService() {
        this.webClient = WebClient.builder().build();
    }

    public String generate(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prompt cannot be empty");
        }

        // ✅ Groq uses OpenAI-compatible format
        Map<String, Object> request = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", new Object[] {
                        Map.of(
                                "role", "user",
                                "content", prompt)
                },
                "max_tokens", 500,
                "temperature", 0.7);

        try {
            var response = webClient.post()
                    .uri(apiUrl)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(
                            status -> status.value() == 429,
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(body -> new ResponseStatusException(
                                            HttpStatus.TOO_MANY_REQUESTS, "Groq quota exceeded")))
                    .onStatus(
                            status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(errorBody -> new ResponseStatusException(
                                            HttpStatus.BAD_GATEWAY, "Groq API error: " + errorBody)))
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Null response from Groq");
            }

            // ✅ Groq response format: choices[0].message.content
            var choices = (List<?>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "No choices in Groq response");
            }

            var message = (Map<?, ?>) ((Map<?, ?>) choices.get(0)).get("message");
            return (String) message.get("content");

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Groq call failed: " + e.getMessage());
        }
    }
}
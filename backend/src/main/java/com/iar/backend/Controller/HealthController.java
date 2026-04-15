package com.iar.backend.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
public class HealthController {

    private final MongoTemplate mongoTemplate;

    @GetMapping("/status")
    public ResponseEntity<?> getHealthStatus() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Try to ping MongoDB
            mongoTemplate.executeCommand("{ ping: 1 }");

            response.put("status", "UP");
            response.put("database", "CONNECTED");
            response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("message", "Application and database are running successfully");

            log.debug("Health check passed - Database is connected");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("database", "DISCONNECTED");
            response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("message", "Database connection failed: " + e.getMessage());

            log.error("Health check failed - Database connection error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }

    @GetMapping("/database")
    public ResponseEntity<?> getDatabaseStatus() {
        Map<String, Object> response = new HashMap<>();

        try {
            mongoTemplate.executeCommand("{ ping: 1 }");

            response.put("database_status", "✓ CONNECTED");
            response.put("connection_type", "MongoDB");
            response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("health", "HEALTHY");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("database_status", "✗ DISCONNECTED");
            response.put("connection_type", "MongoDB");
            response.put("error", e.getMessage());
            response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            response.put("health", "UNHEALTHY");

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }

    @GetMapping("/whoami")
    public ResponseEntity<?> whoAmI() {
        try {
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("anonymous");
            }
            return ResponseEntity.ok(auth.getName());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
        }
    }
}

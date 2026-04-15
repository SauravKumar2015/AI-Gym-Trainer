package com.iar.backend.Health;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class DatabaseHealthCheck {

    private final MongoTemplate mongoTemplate;

    @EventListener(ApplicationStartedEvent.class)
    public void checkDatabaseConnection() {
        try {
            // Attempt to perform a simple ping operation
            mongoTemplate.executeCommand("{ ping: 1 }");

            log.info("");
            log.info("========================================");
            log.info("✔️  DATABASE CONNECTION SUCCESSFUL");
            log.info("✔️  MongoDB is connected and ready");
            log.info("========================================");

        } catch (Exception e) {
            log.error("");
            log.error("========================================");
            log.error("❌  DATABASE CONNECTION FAILED");
            log.error("❌  MongoDB connection error: {}", e.getMessage());
            log.error("========================================");

        }
    }
}

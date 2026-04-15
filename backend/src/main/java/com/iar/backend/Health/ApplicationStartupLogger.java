package com.iar.backend.Health;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
public class ApplicationStartupLogger {

    private final Environment environment;

    public ApplicationStartupLogger(Environment environment) {
        this.environment = environment;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logApplicationStartup() {
        String appName = environment.getProperty("spring.application.name", "AiGymTrainer Backend");
        String port = environment.getProperty("server.port", "8080");
        String profile = String.join(",", environment.getActiveProfiles().length > 0
                ? environment.getActiveProfiles()
                : new String[] { "default" });

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String hostname = getHostname();

        log.info("");
        log.info("============================================================");
        log.info("+------ APPLICATION STARTED SUCCESSFULLY ------+");
        log.info("| Application Name: " + appName);
        log.info("| Server Port: " + port);
        log.info("| Active Profile: " + profile);
        log.info("| Hostname: " + hostname);
        log.info("| Startup Time: " + timestamp);
        log.info("|");
        log.info("| Ready to accept requests!");
        log.info("+----------------------------------------------+");
        log.info("============================================================");
    }

    private String getHostname() {
        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e) {
            return "Unknown";
        }
    }
}

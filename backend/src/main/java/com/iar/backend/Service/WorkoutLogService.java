package com.iar.backend.Service;

import com.iar.backend.Entity.UserWorkoutLogEntity;
import com.iar.backend.Repository.UserWorkoutLogRepository;
import com.iar.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutLogService {

    @Autowired
    private final UserWorkoutLogRepository logRepository;

    @Autowired
    private final UserRepository userRepository;

    public List<UserWorkoutLogEntity> getLogsByUserId(String userId) {

        List<UserWorkoutLogEntity> logs = logRepository.findByUserId(userId);

        if (logs.isEmpty()) {
            throw new RuntimeException("No workout logs found");
        }

        return logs;
    }

    public UserWorkoutLogEntity addWorkoutLog(UserWorkoutLogEntity log) {
        if (log.getUserId() == null) {
            throw new IllegalArgumentException("User ID required");
        }

        log.setWorkoutDate(LocalDate.now());

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            userRepository.findByEmail(auth.getName()).ifPresent(user -> {
                log.setCreatedBy(user.getId()); // set before save
                log.setUserId(user.getId()); // auto-set, remove from request body
                UserWorkoutLogEntity saved = logRepository.save(log); // ID generated here
                user.getWorkoutLogs().add(saved); // use saved, not log
                userRepository.save(user);
            });

            String id = log.getId();
            if (id != null) {
                return logRepository.findById(id).orElseThrow();
            }
        }

        return logRepository.save(log);
    }
}
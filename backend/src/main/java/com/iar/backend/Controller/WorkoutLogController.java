package com.iar.backend.Controller;

import com.iar.backend.Service.WorkoutLogService;
import com.iar.backend.Service.UserService;
import com.iar.backend.Entity.UserWorkoutLogEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workout-log")
@RequiredArgsConstructor
public class WorkoutLogController {

    @Autowired
    private final WorkoutLogService workoutLogService;

    @Autowired
    private final UserService userService;

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody UserWorkoutLogEntity log) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(workoutLogService.addWorkoutLog(log));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Workout log failed");
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserLogs(@PathVariable String id) {
        try {
            // Validate that user can only see their own logs
            var currentUser = userService.getLoggedInUser();
            if (!currentUser.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only view your own workout logs");
            }
            return ResponseEntity.ok(workoutLogService.getLogsByUserId(id));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("unauthorized") || e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Logs not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Logs not found");
        }
    }
}

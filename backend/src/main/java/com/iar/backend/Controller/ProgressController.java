package com.iar.backend.Controller;

import com.iar.backend.Entity.ProgressTrackingEntity;
import com.iar.backend.Service.ProgressService;
import com.iar.backend.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    @Autowired
    private final ProgressService progressService;

    @Autowired
    private final UserService userService;

    @PostMapping("/log")
    public ResponseEntity<?> log(@RequestBody ProgressTrackingEntity progress) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(progressService.logProgress(progress));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Progress logging failed");
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(@RequestParam String userId) {
        try {
            // Validate that user can only see their own progress
            var currentUser = userService.getLoggedInUser();
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only view your own progress history");
            }
            return ResponseEntity.ok(progressService.getUserProgressHistory(userId));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("unauthorized") || e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching progress history");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching progress history");
        }
    }
}

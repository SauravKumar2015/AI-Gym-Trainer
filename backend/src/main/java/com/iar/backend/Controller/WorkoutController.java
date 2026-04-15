package com.iar.backend.Controller;

import com.iar.backend.Service.WorkoutService;
import com.iar.backend.Entity.WorkoutPlanEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    @Autowired
    private final WorkoutService workoutService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(workoutService.getAllWorkouts());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to fetch workouts");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(workoutService.getWorkoutById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Workout not found");
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody WorkoutPlanEntity workout) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(workoutService.createWorkout(workout));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Workout creation failed");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            workoutService.deleteWorkout(id);
            return ResponseEntity.ok("Workout deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete workout");
        }
    }
}

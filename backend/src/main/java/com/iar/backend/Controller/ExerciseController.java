package com.iar.backend.Controller;

import com.iar.backend.Entity.ExerciseEntity;
import com.iar.backend.Service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    @Autowired
    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(exerciseService.getAllExercises());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching exercises");
        }
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody ExerciseEntity exercise) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(exerciseService.addExercise(exercise));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Exercise creation failed");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            exerciseService.deleteExercise(id);
            return ResponseEntity.ok("Exercise deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete exercise");
        }
    }
}

package com.iar.backend.Controller;

import com.iar.backend.Service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    // ─────────────────────────────────────────────
    // GENERATE WORKOUT
    // ─────────────────────────────────────────────
    @PostMapping("/generate-workout")
    public ResponseEntity<?> generateWorkout() {
        try {
            return ResponseEntity.ok(aiService.generateWorkout());
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of(
                            "error", e.getReason() != null ? e.getReason() : "Workout generation failed",
                            "status", e.getStatusCode().value()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Workout generation failed: " + e.getMessage(),
                            "status", 500));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE DIET
    // ─────────────────────────────────────────────
    @PostMapping("/generate-diet")
    public ResponseEntity<?> generateDiet() {
        try {
            return ResponseEntity.ok(aiService.generateDiet());
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of(
                            "error", e.getReason() != null ? e.getReason() : "Diet generation failed",
                            "status", e.getStatusCode().value()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Diet generation failed: " + e.getMessage(),
                            "status", 500));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE EXERCISE
    // ─────────────────────────────────────────────
    @PostMapping("/generate-exercise")
    public ResponseEntity<?> generateExercise() {
        try {
            return ResponseEntity.ok(aiService.generateExercise());
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of(
                            "error", e.getReason() != null ? e.getReason() : "Exercise generation failed",
                            "status", e.getStatusCode().value()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Exercise generation failed: " + e.getMessage(),
                            "status", 500));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE MEAL
    // ─────────────────────────────────────────────
    @PostMapping("/generate-meal")
    public ResponseEntity<?> generateMeal() {
        try {
            return ResponseEntity.ok(aiService.generateMeal());
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of(
                            "error", e.getReason() != null ? e.getReason() : "Meal generation failed",
                            "status", e.getStatusCode().value()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Meal generation failed: " + e.getMessage(),
                            "status", 500));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE PROGRESS PLAN
    // ─────────────────────────────────────────────
    @PostMapping("/generate-progress")
    public ResponseEntity<?> generateProgress() {
        try {
            return ResponseEntity.ok(aiService.generateProgressPlan());
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of(
                            "error", e.getReason() != null ? e.getReason() : "Progress generation failed",
                            "status", e.getStatusCode().value()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Progress generation failed: " + e.getMessage(),
                            "status", 500));
        }
    }

    // ─────────────────────────────────────────────
    // GET RECOMMENDATIONS
    // ─────────────────────────────────────────────
    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations() {
        try {
            return ResponseEntity.ok(aiService.getUserRecommendations());
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of(
                            "error", e.getReason() != null ? e.getReason() : "Failed to fetch recommendations",
                            "status", e.getStatusCode().value()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Failed to fetch recommendations: " + e.getMessage(),
                            "status", 500));
        }
    }

    // ─────────────────────────────────────────────
    // HEALTH METRICS (BMI / BMR / TDEE)
    // ─────────────────────────────────────────────
    @GetMapping("/health-metrics")
    public ResponseEntity<?> getHealthMetrics() {
        try {
            return ResponseEntity.ok(aiService.getHealthMetrics());
        } catch (ResponseStatusException e) {
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(Map.of(
                            "error", e.getReason() != null ? e.getReason() : "Failed to calculate health metrics",
                            "status", e.getStatusCode().value()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Failed to calculate health metrics: " + e.getMessage(),
                            "status", 500));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE TIPS - WORKOUT
    // ─────────────────────────────────────────────
    @PostMapping("/tips/workout")
    public ResponseEntity<?> generateWorkoutTips(@RequestParam String title) {
        try {
            var tips = aiService.generateWorkoutTips(title);
            System.out.println("✅ Workout tips generated: " + tips);
            return ResponseEntity.ok(tips);
        } catch (Exception e) {
            System.err.println("❌ Error generating workout tips: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate tips: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE TIPS - DIET
    // ─────────────────────────────────────────────
    @PostMapping("/tips/diet")
    public ResponseEntity<?> generateDietTips(@RequestParam String title) {
        try {
            var tips = aiService.generateDietTips(title);
            System.out.println("✅ Diet tips generated: " + tips);
            return ResponseEntity.ok(tips);
        } catch (Exception e) {
            System.err.println("❌ Error generating diet tips: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate tips: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE TIPS - MEAL
    // ─────────────────────────────────────────────
    @PostMapping("/tips/meal")
    public ResponseEntity<?> generateMealTips(@RequestParam String name,
            @RequestParam double protein,
            @RequestParam double carbs,
            @RequestParam double fats) {
        try {
            var tips = aiService.generateMealTips(name, protein, carbs, fats);
            System.out.println("✅ Meal tips generated: " + tips);
            return ResponseEntity.ok(tips);
        } catch (Exception e) {
            System.err.println("❌ Error generating meal tips: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate tips: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE TIPS - EXERCISE
    // ─────────────────────────────────────────────
    @PostMapping("/tips/exercise")
    public ResponseEntity<?> generateExerciseTips(@RequestParam String name,
            @RequestParam String muscleGroup) {
        try {
            var tips = aiService.generateExerciseTips(name, muscleGroup);
            System.out.println("✅ Exercise tips generated: " + tips);
            return ResponseEntity.ok(tips);
        } catch (Exception e) {
            System.err.println("❌ Error generating exercise tips: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate tips: " + e.getMessage()));
        }
    }
}
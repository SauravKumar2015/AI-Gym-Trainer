package com.iar.backend.Controller;

import com.iar.backend.Entity.MealEntity;
import com.iar.backend.Service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    @Autowired
    private final MealService mealService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(mealService.getAllMeals());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching meals");
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody MealEntity meal) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mealService.addMeal(meal));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Meal creation failed");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            mealService.deleteMeal(id);
            return ResponseEntity.ok("Meal deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete meal");
        }
    }
}

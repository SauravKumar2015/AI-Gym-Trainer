package com.iar.backend.Controller;

import com.iar.backend.Service.DietService;
import com.iar.backend.Service.UserService;
import com.iar.backend.Entity.DietPlanEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diets")
@RequiredArgsConstructor
public class DietController {

    @Autowired
    private final DietService dietService;

    @Autowired
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(dietService.getAllDietPlans());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching diets");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(dietService.getDietById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Diet plan not found");
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody DietPlanEntity plan) {
        try {
            // If there is an authenticated user, attribute the plan to them
            try {
                var user = userService.getLoggedInUser();
                if (user != null) {
                    // use user id as creator reference
                    plan.setCreatedBy(user.getId());
                }
            } catch (Exception ignored) {
                // no authenticated user - leave createdBy as provided
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(dietService.createDiet(plan));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Diet creation failed");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            dietService.deleteDiet(id);
            return ResponseEntity.ok("Diet deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete diet");
        }
    }
}

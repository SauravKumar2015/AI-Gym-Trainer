package com.iar.backend.Service;

import com.iar.backend.Entity.MealEntity;
import com.iar.backend.Repository.MealRepository;
import com.iar.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MealService {

    @Autowired
    private final MealRepository mealRepository;

    @Autowired
    private final UserRepository userRepository;

    public List<MealEntity> getAllMeals() {
        // Get logged-in user's meals only
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String email = auth.getName();
            var user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                return mealRepository.findByCreatedBy(user.get().getId());
            }
        }

        // Fallback: empty list if not authenticated
        return List.of();
    }

    public List<MealEntity> getByMealType(String mealType) {
        // Get logged-in user's meals only, filtered by meal type
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String email = auth.getName();
            var user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                String userId = user.get().getId();
                // Filter by both createdBy and mealType
                return mealRepository.findByMealType(mealType).stream()
                        .filter(meal -> meal.getCreatedBy() != null && meal.getCreatedBy().equals(userId))
                        .toList();
            }
        }

        // Fallback: empty list if not authenticated
        return List.of();
    }

    public MealEntity getMealById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Meal id is required");
        }

        var meal = mealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            var user = userRepository.findByEmail(auth.getName());
            if (user.isPresent() && meal.getCreatedBy() != null && meal.getCreatedBy().equals(user.get().getId())) {
                return meal;
            }
        }

        throw new RuntimeException("Meal not found or access denied");
    }

    public void deleteMeal(String id) {
        var meal = getMealById(id);
        mealRepository.delete(meal);
    }

    public MealEntity addMeal(MealEntity meal) {
        if (meal.getName() == null || meal.getName().isBlank()) {
            throw new IllegalArgumentException("Meal name required");
        }

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            userRepository.findByEmail(auth.getName()).ifPresent(user -> {
                meal.setCreatedBy(user.getId()); // set before save
                MealEntity saved = mealRepository.save(meal); // ID generated here
                user.getMeals().add(saved); // use saved, not meal
                userRepository.save(user);
            });

            String id = meal.getId();
            if (id != null) {
                return mealRepository.findById(id).orElseThrow();
            }
        }

        return mealRepository.save(meal);
    }
}
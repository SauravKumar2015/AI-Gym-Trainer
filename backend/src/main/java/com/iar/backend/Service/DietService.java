package com.iar.backend.Service;

import com.iar.backend.Entity.DietPlanEntity;
import com.iar.backend.Repository.DietPlanRepository;
import com.iar.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DietService {

    @Autowired
    private final DietPlanRepository dietRepository;

    @Autowired
    private final UserRepository userRepository;

    public List<DietPlanEntity> getAllDietPlans() {
        // Get logged-in user's diet plans only
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String email = auth.getName();
            var user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                return dietRepository.findByCreatedBy(user.get().getId());
            }
        }

        // Fallback: empty list if not authenticated
        return List.of();
    }

    public DietPlanEntity getDietById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Diet id is required");
        }

        var diet = dietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diet plan not found"));

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            var user = userRepository.findByEmail(auth.getName());
            if (user.isPresent() && diet.getCreatedBy() != null && diet.getCreatedBy().equals(user.get().getId())) {
                return diet;
            }
        }

        throw new RuntimeException("Diet plan not found or access denied");
    }

    public void deleteDiet(String id) {
        var diet = getDietById(id);
        dietRepository.delete(diet);
    }

    public List<DietPlanEntity> getByGoal(String goal) {
        // Get logged-in user's diet plans only, filtered by goal
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String email = auth.getName();
            var user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                String userId = user.get().getId();
                // Filter by both createdBy and goal
                return dietRepository.findByGoal(goal).stream()
                        .filter(diet -> diet.getCreatedBy() != null && diet.getCreatedBy().equals(userId))
                        .toList();
            }
        }

        // Fallback: empty list if not authenticated
        return List.of();
    }

    public DietPlanEntity createDiet(DietPlanEntity plan) {

        if (plan.getTitle() == null || plan.getTitle().isBlank()) {
            throw new IllegalArgumentException("Diet title required");
        }

        // Save first to get the ID
        DietPlanEntity saved = dietRepository.save(plan);

        // Auto-link to logged-in user from JWT
        try {
            var auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()
                    && !auth.getName().equals("anonymousUser")) {
                userRepository.findByEmail(auth.getName()).ifPresent(user -> {
                    user.getDietPlans().add(saved);
                    userRepository.save(user);
                });
            }
        } catch (Exception ignored) {
        }

        return saved;
    }
}
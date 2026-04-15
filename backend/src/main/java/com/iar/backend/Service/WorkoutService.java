package com.iar.backend.Service;

import com.iar.backend.Entity.WorkoutPlanEntity;
import com.iar.backend.Repository.WorkoutPlanRepository;
import com.iar.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    @Autowired
    private final WorkoutPlanRepository workoutRepository;

    @Autowired
    private final UserRepository userRepository;

    public List<WorkoutPlanEntity> getAllWorkouts() {
        // Get logged-in user's workout plans only
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String email = auth.getName();
            var user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                return workoutRepository.findByCreatedBy(user.get().getId());
            }
        }

        // Fallback: empty list if not authenticated
        return List.of();
    }

    public WorkoutPlanEntity getWorkoutById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Workout id required");
        }

        var workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            var user = userRepository.findByEmail(auth.getName());
            if (user.isPresent() && workout.getCreatedBy() != null
                    && workout.getCreatedBy().equals(user.get().getId())) {
                return workout;
            }
        }

        throw new RuntimeException("Workout not found or access denied");
    }

    public void deleteWorkout(String id) {
        var workout = getWorkoutById(id);
        workoutRepository.delete(workout);
    }

    public List<WorkoutPlanEntity> getByGoal(String goal) {
        // Get logged-in user's workout plans only, filtered by goal
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String email = auth.getName();
            var user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                String userId = user.get().getId();
                // Filter by both createdBy and goal
                return workoutRepository.findByGoal(goal).stream()
                        .filter(workout -> workout.getCreatedBy() != null && workout.getCreatedBy().equals(userId))
                        .toList();
            }
        }

        // Fallback: empty list if not authenticated
        return List.of();
    }

    public WorkoutPlanEntity createWorkout(WorkoutPlanEntity workout) {
        if (workout.getTitle() == null || workout.getTitle().isBlank()) {
            throw new IllegalArgumentException("Workout title required");
        }

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            userRepository.findByEmail(auth.getName()).ifPresent(user -> {
                workout.setCreatedBy(user.getId()); // set before save
                WorkoutPlanEntity saved = workoutRepository.save(workout); // ID generated here
                user.getWorkoutPlans().add(saved); // use saved, not workout
                userRepository.save(user);
            });

            String id = workout.getId();
            if (id != null) {
                return workoutRepository.findById(id).orElseThrow();
            }
        }

        return workoutRepository.save(workout);
    }
}
package com.iar.backend.Service;

import com.iar.backend.Entity.ExerciseEntity;
import com.iar.backend.Repository.ExerciseRepository;
import com.iar.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    @Autowired
    private final ExerciseRepository exerciseRepository;

    @Autowired
    private final UserRepository userRepository;

    public List<ExerciseEntity> getAllExercises() {
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String email = auth.getName();
            var user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                return exerciseRepository.findByCreatedBy(user.get().getId());
            }
        }

        return List.of();
    }

    public List<ExerciseEntity> getByMuscleGroup(String muscleGroup) {
        return exerciseRepository.findByMuscleGroup(muscleGroup);
    }

    public ExerciseEntity addExercise(ExerciseEntity exercise) {
        if (exercise.getName() == null || exercise.getName().isBlank()) {
            throw new IllegalArgumentException("Exercise name required");
        }

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            userRepository.findByEmail(auth.getName()).ifPresent(user -> {
                exercise.setCreatedBy(user.getId());
                ExerciseEntity saved = exerciseRepository.save(exercise);
                user.getExercisePlans().add(saved);
                userRepository.save(user);
            });

            String id = exercise.getId();
            if (id != null) {
                return exerciseRepository.findById(id).orElseThrow();
            }
        }

        return exerciseRepository.save(exercise);
    }

    public ExerciseEntity getExerciseById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Exercise id is required");
        }

        var exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            var user = userRepository.findByEmail(auth.getName());
            if (user.isPresent() && exercise.getCreatedBy() != null
                    && exercise.getCreatedBy().equals(user.get().getId())) {
                return exercise;
            }
        }

        throw new RuntimeException("Exercise not found or access denied");
    }

    public void deleteExercise(String id) {
        var exercise = getExerciseById(id);
        exerciseRepository.delete(exercise);
    }
}

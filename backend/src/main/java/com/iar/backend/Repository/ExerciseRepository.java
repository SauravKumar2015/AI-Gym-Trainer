package com.iar.backend.Repository;

import com.iar.backend.Entity.ExerciseEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExerciseRepository extends MongoRepository<ExerciseEntity, String> {

    List<ExerciseEntity> findByMuscleGroup(String muscleGroup);

    List<ExerciseEntity> findByEquipment(String equipment);

    List<ExerciseEntity> findByDifficulty(String difficulty);

    List<ExerciseEntity> findByCreatedBy(String createdBy);
}

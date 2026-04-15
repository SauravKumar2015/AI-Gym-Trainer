package com.iar.backend.Repository;

import com.iar.backend.Entity.WorkoutPlanEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WorkoutPlanRepository extends MongoRepository<WorkoutPlanEntity, String> {

    List<WorkoutPlanEntity> findByGoal(String goal);

    List<WorkoutPlanEntity> findByDifficulty(String difficulty);

    List<WorkoutPlanEntity> findByCreatedBy(String createdBy);
}

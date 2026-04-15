package com.iar.backend.Repository;

import com.iar.backend.Entity.DietPlanEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DietPlanRepository extends MongoRepository<DietPlanEntity, String> {

    List<DietPlanEntity> findByGoal(String goal);

    List<DietPlanEntity> findByCreatedBy(String createdBy);

    List<DietPlanEntity> findByDailyCaloriesBetween(int min, int max);
}

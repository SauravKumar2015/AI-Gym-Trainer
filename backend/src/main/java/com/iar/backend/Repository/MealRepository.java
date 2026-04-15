package com.iar.backend.Repository;

import com.iar.backend.Entity.MealEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MealRepository extends MongoRepository<MealEntity, String> {

    List<MealEntity> findByMealType(String mealType); // breakfast, lunch, dinner

    List<MealEntity> findByCaloriesLessThanEqual(int calories);

    List<MealEntity> findByProteinGreaterThanEqual(double protein);

    List<MealEntity> findByCreatedBy(String createdBy);
}

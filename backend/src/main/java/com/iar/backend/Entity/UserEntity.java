package com.iar.backend.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Document(collection = "users")
@Data
public class UserEntity {

    @Id
    private String id;

    private String Name;
    private String email;
    private String password;
    private String phone;

    private int age;
    private String gender;
    private double height;
    private double weight;

    private String fitnessGoal;
    private String experienceLevel;
    private String role;

    private LocalDateTime createdAt;
    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    // Diet plans created by the user. Stored as DBRef to DietPlan documents.
    @DBRef
    private List<DietPlanEntity> dietPlans = new ArrayList<>();

    @DBRef
    private List<ExerciseEntity> exercisePlans = new ArrayList<>();

    @DBRef
    private List<MealEntity> meals = new ArrayList<>();

    @DBRef
    private List<WorkoutPlanEntity> workoutPlans = new ArrayList<>();

    @DBRef
    private List<ProgressTrackingEntity> progressTracking = new ArrayList<>();

    @DBRef
    private List<UserWorkoutLogEntity> workoutLogs = new ArrayList<>();

    @DBRef
    private List<AIRecommendationEntity> aiRecommendations = new ArrayList<>();
}

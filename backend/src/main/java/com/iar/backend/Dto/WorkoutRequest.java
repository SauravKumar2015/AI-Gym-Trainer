package com.iar.backend.Dto;

import lombok.Data;

@Data
public class WorkoutRequest {
    private String goal; // e.g. "muscle gain", "weight loss"
    private String fitnessLevel; // e.g. "beginner", "intermediate", "advanced"
    private Integer age;
    private Integer daysPerWeek;
    private String equipment; // e.g. "dumbbells, barbell", "bodyweight only"
    private String injuries; // optional — e.g. "bad knees"
}

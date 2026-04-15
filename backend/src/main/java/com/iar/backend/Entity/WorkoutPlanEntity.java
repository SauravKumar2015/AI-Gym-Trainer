package com.iar.backend.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "workout_plans")
@Data
public class WorkoutPlanEntity {

    @Id
    private String id;

    private String title;
    private String goal; // weight_loss, muscle_gain
    private String difficulty; // beginner, intermediate, advanced
    private int durationWeeks;

    private String description;
    private String createdBy; // AI or Trainer

}

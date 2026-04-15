package com.iar.backend.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "user_workout_logs")
@Data
public class UserWorkoutLogEntity {

    @Id
    private String id;

    private String userId;
    private String exerciseId;

    private int sets;
    private int reps;
    private double weightUsed;

    private LocalDate workoutDate;

    private String createdBy;
}

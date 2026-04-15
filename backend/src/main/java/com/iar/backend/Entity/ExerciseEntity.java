package com.iar.backend.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "exercises")
@Data
public class ExerciseEntity {

    @Id
    private String id;

    private String name;
    private String muscleGroup;
    private String equipment;
    private String difficulty;
    private String videoUrl;

    private String instructions;
    private String createdBy;
}

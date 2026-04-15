package com.iar.backend.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "meals")
@Data
public class MealEntity {

    @Id
    private String id;

    private String name;
    private String mealType; // breakfast, lunch

    private int calories;
    private double protein;
    private double carbs;
    private double fats;

    private String createdBy;

}

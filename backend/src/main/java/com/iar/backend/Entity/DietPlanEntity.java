package com.iar.backend.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "diet_plans")
@Data
public class DietPlanEntity {

    @Id
    private String id;

    private String title;
    private String goal; // fat_loss, muscle_gain

    private int dailyCalories;
    private String dietType; // veg, non-veg

    private String description;

    private String createdBy; // AI or Nutritionist
}

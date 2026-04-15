package com.iar.backend.Dto;

import lombok.Data;

@Data
public class DietRequest {
    private String goal; // e.g. "weight loss", "muscle gain", "maintenance"
    private Integer age;
    private String gender;
    private Double weight; // in kg
    private Double height; // in cm
    private String dietType; // e.g. "vegan", "keto", "balanced"
    private String allergies; // optional — e.g. "nuts, dairy"
    private Integer dailyCalorieTarget; // optional
}

package com.iar.backend.Dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private int age;
    private String gender;
    private double height;
    private double weight;
    private String fitnessGoal;
    private String experienceLevel;
}

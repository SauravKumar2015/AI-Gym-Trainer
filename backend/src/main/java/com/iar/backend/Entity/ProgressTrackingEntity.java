package com.iar.backend.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "progress_tracking")
@Data
public class ProgressTrackingEntity {

    @Id
    private String id;

    private String userId;

    private double weight;
    private double bodyFatPercentage;

    private LocalDate recordDate;

    private String createdBy;

}
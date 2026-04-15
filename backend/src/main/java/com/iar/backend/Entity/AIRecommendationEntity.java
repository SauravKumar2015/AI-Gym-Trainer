package com.iar.backend.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ai_recommendations")
@Data
public class AIRecommendationEntity {

    @Id
    private String id;

    private String userId;

    private String workoutSuggestion;

    private String dietSuggestion;

    private LocalDateTime generatedAt;

    private String recommendationType;

    private String referenceId;

    private LocalDateTime createdDate;

    private String content;

}

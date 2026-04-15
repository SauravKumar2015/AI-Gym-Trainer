package com.iar.backend.Repository;

import com.iar.backend.Entity.AIRecommendationEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AIRecommendationRepository extends MongoRepository<AIRecommendationEntity, String> {

    List<AIRecommendationEntity> findByUserId(String userId);

    List<AIRecommendationEntity> findByRecommendationType(String recommendationType);

    List<AIRecommendationEntity> findByCreatedDateAfter(java.time.LocalDateTime dateTime);
}

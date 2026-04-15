package com.iar.backend.Repository;

import com.iar.backend.Entity.ProgressTrackingEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ProgressTrackingRepository extends MongoRepository<ProgressTrackingEntity, String> {

    List<ProgressTrackingEntity> findByUserId(String userId);

    List<ProgressTrackingEntity> findByUserIdOrderByRecordDateDesc(String userId);

    List<ProgressTrackingEntity> findByRecordDateBetween(LocalDate start, LocalDate end);
}

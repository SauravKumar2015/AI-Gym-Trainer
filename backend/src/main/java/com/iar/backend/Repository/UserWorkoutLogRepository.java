package com.iar.backend.Repository;

import com.iar.backend.Entity.UserWorkoutLogEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface UserWorkoutLogRepository extends MongoRepository<UserWorkoutLogEntity, String> {

    List<UserWorkoutLogEntity> findByUserId(String userId);

    List<UserWorkoutLogEntity> findByUserIdAndWorkoutDate(String userId, LocalDate workoutDate);

    List<UserWorkoutLogEntity> findByWorkoutDateBetween(LocalDate start, LocalDate end);
}

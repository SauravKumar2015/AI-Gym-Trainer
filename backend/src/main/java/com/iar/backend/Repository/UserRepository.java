package com.iar.backend.Repository;

import com.iar.backend.Entity.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<UserEntity, String> {

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    List<UserEntity> findByRole(String role);

}

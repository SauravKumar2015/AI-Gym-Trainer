package com.iar.backend.Service;

import com.iar.backend.Entity.ProgressTrackingEntity;
import com.iar.backend.Repository.ProgressTrackingRepository;
import com.iar.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {

    @Autowired
    private final ProgressTrackingRepository progressRepository;

    @Autowired
    private final UserRepository userRepository;

    public List<ProgressTrackingEntity> getUserProgressHistory(String userId) {

        List<ProgressTrackingEntity> history = progressRepository.findByUserIdOrderByRecordDateDesc(userId);

        return history;
    }

    public ProgressTrackingEntity logProgress(ProgressTrackingEntity progress) {
        if (progress.getUserId() == null) {
            throw new IllegalArgumentException("User ID required");
        }

        progress.setRecordDate(LocalDate.now());

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            userRepository.findByEmail(auth.getName()).ifPresent(user -> {
                progress.setCreatedBy(user.getId()); // set before save
                ProgressTrackingEntity saved = progressRepository.save(progress); // ID generated here
                user.getProgressTracking().add(saved); // use saved, not progress
                userRepository.save(user);
            });

            String id = progress.getId();
            if (id != null) {
                return progressRepository.findById(id).orElseThrow();
            }
        }

        return progressRepository.save(progress);
    }
}
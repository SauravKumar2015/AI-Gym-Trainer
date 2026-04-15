package com.iar.backend.Service;

import com.iar.backend.Entity.UserEntity;
import com.iar.backend.Repository.UserRepository;
import com.iar.backend.Repository.DietPlanRepository;
import com.iar.backend.Repository.WorkoutPlanRepository;
import com.iar.backend.Repository.UserWorkoutLogRepository;
import com.iar.backend.Repository.ProgressTrackingRepository;
import com.iar.backend.Repository.AIRecommendationRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final DietPlanRepository dietPlanRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final UserWorkoutLogRepository userWorkoutLogRepository;
    private final ProgressTrackingRepository progressTrackingRepository;
    private final AIRecommendationRepository aiRecommendationRepository;

    public UserEntity getUserById(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new RuntimeException("User ID cannot be null or empty");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserEntity updateProfile(UserEntity updatedUser) {

        // Get currently logged-in user instead of requiring ID in body
        UserEntity existing = getLoggedInUser();

        // Update all provided fields EXCEPT password
        if (updatedUser.getName() != null && !updatedUser.getName().isEmpty()) {
            existing.setName(updatedUser.getName());
        }
        if (updatedUser.getPhone() != null && !updatedUser.getPhone().isEmpty()) {
            existing.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getAge() > 0)
            existing.setAge(updatedUser.getAge());
        if (updatedUser.getGender() != null && !updatedUser.getGender().isEmpty()) {
            existing.setGender(updatedUser.getGender());
        }
        if (updatedUser.getHeight() > 0)
            existing.setHeight(updatedUser.getHeight());
        if (updatedUser.getWeight() > 0)
            existing.setWeight(updatedUser.getWeight());
        if (updatedUser.getFitnessGoal() != null && !updatedUser.getFitnessGoal().isEmpty()) {
            existing.setFitnessGoal(updatedUser.getFitnessGoal());
        }
        if (updatedUser.getExperienceLevel() != null && !updatedUser.getExperienceLevel().isEmpty()) {
            existing.setExperienceLevel(updatedUser.getExperienceLevel());
        }

        // Update password if provided (encode it)
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        // Update email if provided and not used by others
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isBlank()
                && !updatedUser.getEmail().equals(existing.getEmail())) {
            if (userRepository.existsByEmail(updatedUser.getEmail())) {
                throw new RuntimeException("Email already in use");
            }
            existing.setEmail(updatedUser.getEmail());
        }

        return userRepository.save(existing);
    }

    /**
     * Generate a 6-digit OTP and send it via email
     */
    public String forgotPassword(String email) {
        logger.info("Processing forgot password request for email: {}", email);
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        logger.info("Generated OTP for user {}: {}", email, otp);

        user.setResetToken(otp);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(1));
        userRepository.save(user);
        logger.info("OTP saved to database with 1 minute expiry for user: {}", email);

        // Send OTP via email
        try {
            logger.info("Sending OTP email to: {}", email);
            emailService.sendOtpEmail(email, otp, user.getName());
            logger.info("OTP email sent successfully to: {}", email);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", email, e.getMessage(), e);
            // Still return OTP for testing in case email fails
        }

        // Return OTP for frontend (for testing/demo purposes)
        // In production, remove this return and only send via email
        return otp;
    }

    /**
     * Reset password using OTP and send confirmation email
     */
    public void resetPassword(String token, String newPassword) {
        UserEntity user = userRepository.findAll().stream()
                .filter(u -> token.equals(u.getResetToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        // Send confirmation email
        try {
            emailService.sendPasswordResetConfirmation(user.getEmail(), user.getName());
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
            // Don't fail the password reset if email fails
        }
    }

    public void deleteUser(String userId) {
        UserEntity user = getUserById(userId);

        String uid = user.getId();
        String email = user.getEmail();
        String name = user.getName();

        // Delete diet plans created by this user (match on id, email or name)
        try {
            var dietPlans = dietPlanRepository.findByCreatedBy(uid);
            if (dietPlans != null) {
                dietPlanRepository.deleteAll(dietPlans);
            }
            dietPlans = dietPlanRepository.findByCreatedBy(email);
            if (dietPlans != null) {
                dietPlanRepository.deleteAll(dietPlans);
            }
            dietPlans = dietPlanRepository.findByCreatedBy(name);
            if (dietPlans != null) {
                dietPlanRepository.deleteAll(dietPlans);
            }
        } catch (Exception ignored) {
        }

        // Delete workout plans created by this user
        try {
            var workoutPlans = workoutPlanRepository.findByCreatedBy(uid);
            if (workoutPlans != null) {
                workoutPlanRepository.deleteAll(workoutPlans);
            }
            workoutPlans = workoutPlanRepository.findByCreatedBy(email);
            if (workoutPlans != null) {
                workoutPlanRepository.deleteAll(workoutPlans);
            }
            workoutPlans = workoutPlanRepository.findByCreatedBy(name);
            if (workoutPlans != null) {
                workoutPlanRepository.deleteAll(workoutPlans);
            }
        } catch (Exception ignored) {
        }

        // Delete user workout logs and progress tracking
        try {
            var workoutLogs = userWorkoutLogRepository.findByUserId(uid);
            if (workoutLogs != null) {
                userWorkoutLogRepository.deleteAll(workoutLogs);
            }
        } catch (Exception ignored) {
        }
        try {
            var progressTracking = progressTrackingRepository.findByUserId(uid);
            if (progressTracking != null) {
                progressTrackingRepository.deleteAll(progressTracking);
            }
        } catch (Exception ignored) {
        }

        // Delete AI recommendations for user
        try {
            var aiRecs = aiRecommendationRepository.findByUserId(uid);
            if (aiRecs != null) {
                aiRecommendationRepository.deleteAll(aiRecs);
            }
        } catch (Exception ignored) {
        }

        // Finally delete the user
        userRepository.delete(user);
    }

    /**
     * Get currently logged-in user from SecurityContext
     * Uses JWT token's email (set by JwtAuthenticationFilter)
     * 
     * @return UserEntity of authenticated user
     * @throws RuntimeException if user not found or not authenticated
     */

    public UserEntity getLoggedInUser() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public void deleteCurrentUser() {
        UserEntity current = getLoggedInUser();
        deleteUser(current.getId());
    }

    /**
     * Change password for logged-in user
     * 
     * @param oldPassword - current password (must match)
     * @param newPassword - new password to set
     * @return updated user
     * @throws RuntimeException if old password doesn't match
     */
    public UserEntity changePassword(String oldPassword, String newPassword) {
        UserEntity user = getLoggedInUser();

        // Verify old password matches
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Encode and set new password
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

}

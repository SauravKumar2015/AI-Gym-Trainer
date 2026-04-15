package com.iar.backend.Service;

import com.iar.backend.Entity.UserEntity;
import com.iar.backend.Dto.RegisterRequest;
import com.iar.backend.Dto.AuthRequest;
import com.iar.backend.Dto.AuthResponse;
import com.iar.backend.Jwt.JwtService;
import com.iar.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final JwtService jwtService;

    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        UserEntity user = new UserEntity();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // 🔐 BCrypt
        user.setPhone(request.getPhone() != null ? request.getPhone() : "");
        user.setGender(request.getGender() != null ? request.getGender() : "");
        user.setAge(request.getAge());
        user.setHeight(request.getHeight());
        user.setWeight(request.getWeight());
        user.setFitnessGoal(request.getFitnessGoal() != null ? request.getFitnessGoal() : "");
        user.setExperienceLevel(request.getExperienceLevel() != null ? request.getExperienceLevel() : "beginner");
        user.setRole("user");
        user.setCreatedAt(java.time.LocalDateTime.now());

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token);
    }

    public AuthResponse login(AuthRequest request) {

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token);
    }

    public Map<String, Object> loginWithGoogle(String googleToken) {
        try {
            logger.info("Processing Google login with token");

            // For now, trust the token from frontend (frontend validates it)
            // In production, verify with Google's servers
            Map<String, Object> tokenData = parseGoogleToken(googleToken);

            String email = (String) tokenData.get("email");
            String name = (String) tokenData.get("name");

            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Invalid Google token: no email");
            }

            logger.info("Google login for email: {}", email);

            // Find or create user
            UserEntity user = userRepository.findByEmail(email)
                    .orElseGet(() -> createGoogleUser(email, name));

            String token = jwtService.generateToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            return response;

        } catch (Exception e) {
            logger.error("Google login failed: {}", e.getMessage(), e);
            throw new RuntimeException("Google login failed: " + e.getMessage());
        }
    }

    public Map<String, Object> registerWithGoogle(String googleToken) {
        try {
            logger.info("Processing Google registration with token");

            // Parse token
            Map<String, Object> tokenData = parseGoogleToken(googleToken);

            String email = (String) tokenData.get("email");
            String name = (String) tokenData.get("name");

            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Invalid Google token: no email");
            }

            logger.info("Google registration for email: {}", email);

            // If user already exists, just login (seamless experience)
            if (userRepository.existsByEmail(email)) {
                logger.info("User already exists, proceeding with login for: {}", email);
                return loginWithGoogle(googleToken);
            }

            UserEntity user = createGoogleUser(email, name);

            String token = jwtService.generateToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            return response;

        } catch (Exception e) {
            logger.error("Google registration failed: {}", e.getMessage(), e);
            throw new RuntimeException("Google registration failed: " + e.getMessage());
        }
    }

    private UserEntity createGoogleUser(String email, String name) {
        logger.info("Creating new Google user: {}", email);
        UserEntity user = new UserEntity();
        user.setName(name != null && !name.isEmpty() ? name : email.split("@")[0]);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random password
        user.setRole("user");
        user.setExperienceLevel("beginner");
        user.setCreatedAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    private Map<String, Object> parseGoogleToken(String tokenString) {
        try {
            // Decode JWT token (simplified - frontend has already validated it)
            String[] parts = tokenString.split("\\.");
            if (parts.length != 3) {
                throw new RuntimeException("Invalid token format");
            }

            // Decode payload
            String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));

            // Simple JSON parsing (in production, use JSON library)
            Map<String, Object> data = new HashMap<>();

            // Extract email
            int emailStart = payload.indexOf("\"email\":\"") + 9;
            int emailEnd = payload.indexOf("\"", emailStart);
            if (emailStart > 8 && emailEnd > emailStart) {
                data.put("email", payload.substring(emailStart, emailEnd));
            }

            // Extract name
            int nameStart = payload.indexOf("\"name\":\"") + 8;
            int nameEnd = payload.indexOf("\"", nameStart);
            if (nameStart > 7 && nameEnd > nameStart) {
                data.put("name", payload.substring(nameStart, nameEnd));
            }

            logger.info("Parsed Google token - email: {}", data.get("email"));
            return data;

        } catch (Exception e) {
            logger.error("Failed to parse Google token: {}", e.getMessage());
            throw new RuntimeException("Failed to parse Google token: " + e.getMessage());
        }
    }
}

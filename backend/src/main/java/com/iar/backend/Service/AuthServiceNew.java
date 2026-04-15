package com.iar.backend.Service;

import com.iar.backend.Entity.UserEntity;
import com.iar.backend.Dto.RegisterRequest;
import com.iar.backend.Dto.AuthRequest;
import com.iar.backend.Dto.AuthResponse;
import com.iar.backend.Jwt.JwtService;
import com.iar.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.Base64;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class AuthServiceNew {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        UserEntity user = new UserEntity();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
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
            GoogleUserInfo userInfo = extractGoogleUserInfo(googleToken);

            if (userInfo == null || userInfo.getEmail() == null) {
                throw new RuntimeException("Invalid Google token");
            }

            UserEntity user = userRepository.findByEmail(userInfo.getEmail())
                    .orElseGet(() -> createGoogleUser(userInfo.getEmail(), userInfo.getName()));

            String token = jwtService.generateToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            return response;

        } catch (Exception e) {
            throw new RuntimeException("Google login failed: " + e.getMessage());
        }
    }

    public Map<String, Object> registerWithGoogle(String googleToken) {
        try {
            GoogleUserInfo userInfo = extractGoogleUserInfo(googleToken);

            if (userInfo == null || userInfo.getEmail() == null) {
                throw new RuntimeException("Invalid Google token");
            }

            if (userRepository.existsByEmail(userInfo.getEmail())) {
                throw new IllegalArgumentException("Email already registered. Please login instead.");
            }

            UserEntity user = createGoogleUser(userInfo.getEmail(), userInfo.getName());

            String token = jwtService.generateToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            return response;

        } catch (Exception e) {
            throw new RuntimeException("Google registration failed: " + e.getMessage());
        }
    }

    private UserEntity createGoogleUser(String email, String name) {
        UserEntity user = new UserEntity();
        user.setName(name != null ? name : email.split("@")[0]);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRole("user");
        user.setExperienceLevel("beginner");
        user.setCreatedAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    private GoogleUserInfo extractGoogleUserInfo(String tokenString) {
        try {
            String[] parts = tokenString.split("\\.");
            if (parts.length != 3) {
                return null;
            }

            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));

            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(payload);

            String email = node.get("email").asText(null);
            String name = node.get("name").asText(null);

            return new GoogleUserInfo(email, name);

        } catch (Exception e) {
            System.err.println("Token extraction error: " + e.getMessage());
            return null;
        }
    }

    public static class GoogleUserInfo {
        private String email;
        private String name;

        public GoogleUserInfo(String email, String name) {
            this.email = email;
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public String getName() {
            return name;
        }
    }
}

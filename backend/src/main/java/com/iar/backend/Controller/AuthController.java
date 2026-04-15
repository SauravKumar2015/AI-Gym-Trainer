package com.iar.backend.Controller;

import com.iar.backend.Service.AuthService;
import com.iar.backend.Dto.RegisterRequest;
import com.iar.backend.Dto.AuthRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(authService.register(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed");
        }
    }

    @PostMapping("/google/login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        try {
            String googleToken = request.get("token");
            if (googleToken == null || googleToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Google token is required");
            }
            return ResponseEntity.ok(authService.loginWithGoogle(googleToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Google login failed: " + e.getMessage());
        }
    }

    @PostMapping("/google/register")
    public ResponseEntity<?> googleRegister(@RequestBody Map<String, String> request) {
        try {
            String googleToken = request.get("token");
            if (googleToken == null || googleToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Google token is required");
            }
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(authService.registerWithGoogle(googleToken));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Google registration failed: " + e.getMessage());
        }
    }
}

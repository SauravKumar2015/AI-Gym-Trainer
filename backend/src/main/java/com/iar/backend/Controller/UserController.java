package com.iar.backend.Controller;

import com.iar.backend.Entity.UserEntity;
import com.iar.backend.Dto.ChangePasswordRequest;
import com.iar.backend.Service.UserService;
import com.iar.backend.Jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;

    @Autowired
    private final JwtService jwtService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            return ResponseEntity.ok(userService.getLoggedInUser());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching profile");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody UserEntity user) {
        try {
            // capture current email to detect change
            UserEntity current = userService.getLoggedInUser();
            UserEntity saved = userService.updateProfile(user);

            if (saved != null && !saved.getEmail().equalsIgnoreCase(current.getEmail())) {
                // Email changed - issue a new token for the client
                String token = jwtService.generateToken(saved.getEmail());
                java.util.Map<String, Object> resp = new java.util.HashMap<>();
                resp.put("user", saved);
                resp.put("token", token);
                resp.put("message", "Email updated. Use the returned token for subsequent requests.");
                return ResponseEntity.ok(resp);
            }

            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Update failed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody com.iar.backend.Dto.ForgotPasswordRequest request) {
        try {
            if (request == null || request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Email is required");
            }
            String token = userService.forgotPassword(request.getEmail());
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "OTP sent to your email");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody com.iar.backend.Dto.ResetPasswordRequest request) {
        try {
            userService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser() {
        try {
            userService.deleteCurrentUser();
            return ResponseEntity.ok("User deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Deletion failed");
        }
    }
}

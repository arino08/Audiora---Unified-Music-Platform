package com.audiora.controller;

import com.audiora.model.User;
import com.audiora.service.UserService;
import com.audiora.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserService userService;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    public UserProfileController(UserService userService, JwtService jwtService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.objectMapper = objectMapper;
    }

    /**
     * Get current user's profile
     */
    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authorization header required"));
            }

            String token = authHeader.substring(7);
            String userIdString = jwtService.getUserIdFromToken(token);
            UUID userId = UUID.fromString(userIdString);

            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            // Create profile response
            Map<String, Object> profile = Map.of(
                "id", user.getId().toString(),
                "email", user.getEmail(),
                "name", user.getName(),
                "username", user.getUsername() != null ? user.getUsername() : "",
                "displayName", user.getDisplayName() != null ? user.getDisplayName() : user.getName(),
                "bio", user.getBio() != null ? user.getBio() : "",
                "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
                "emailVerified", user.isEmailVerified(),
                "createdAt", user.getCreatedAt(),
                "lastLoginAt", user.getLastLoginAt()
            );

            return ResponseEntity.ok(profile);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token: " + e.getMessage()));
        }
    }

    /**
     * Update user profile
     */
    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody ProfileUpdateRequest request) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authorization header required"));
            }

            String token = authHeader.substring(7);
            String userIdString = jwtService.getUserIdFromToken(token);
            UUID userId = UUID.fromString(userIdString);

            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            // Update fields if provided
            if (request.getDisplayName() != null) {
                user.setDisplayName(request.getDisplayName());
            }
            if (request.getUsername() != null) {
                // Check if username is already taken
                Optional<User> existingUser = userService.getUserByUsername(request.getUsername());
                if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Username already taken"));
                }
                user.setUsername(request.getUsername());
            }
            if (request.getBio() != null) {
                user.setBio(request.getBio());
            }
            if (request.getAvatarUrl() != null) {
                user.setAvatarUrl(request.getAvatarUrl());
            }

            // Save updated user
            User updatedUser = userService.updateUser(user);

            Map<String, Object> profile = Map.of(
                "id", updatedUser.getId().toString(),
                "email", updatedUser.getEmail(),
                "name", updatedUser.getName(),
                "username", updatedUser.getUsername() != null ? updatedUser.getUsername() : "",
                "displayName", updatedUser.getDisplayName() != null ? updatedUser.getDisplayName() : updatedUser.getName(),
                "bio", updatedUser.getBio() != null ? updatedUser.getBio() : "",
                "avatarUrl", updatedUser.getAvatarUrl() != null ? updatedUser.getAvatarUrl() : "",
                "emailVerified", updatedUser.isEmailVerified()
            );

            return ResponseEntity.ok(profile);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }

    /**
     * Get user preferences
     */
    @GetMapping("/preferences")
    public ResponseEntity<?> getPreferences(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authorization header required"));
            }

            String token = authHeader.substring(7);
            String userIdString = jwtService.getUserIdFromToken(token);
            UUID userId = UUID.fromString(userIdString);

            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            String preferencesJson = user.getPreferences();

            if (preferencesJson == null || preferencesJson.isEmpty()) {
                return ResponseEntity.ok(Map.of());
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> preferences = objectMapper.readValue(preferencesJson, Map.class);
            return ResponseEntity.ok(preferences);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get preferences: " + e.getMessage()));
        }
    }

    /**
     * Update user preferences
     */
    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreferences(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> preferences) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authorization header required"));
            }

            String token = authHeader.substring(7);
            String userIdString = jwtService.getUserIdFromToken(token);
            UUID userId = UUID.fromString(userIdString);

            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            String preferencesJson = objectMapper.writeValueAsString(preferences);
            user.setPreferences(preferencesJson);

            userService.updateUser(user);

            return ResponseEntity.ok(Map.of("message", "Preferences updated successfully"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update preferences: " + e.getMessage()));
        }
    }

    // DTO for profile updates
    public static class ProfileUpdateRequest {
        private String displayName;
        private String username;
        private String bio;
        private String avatarUrl;

        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }
}

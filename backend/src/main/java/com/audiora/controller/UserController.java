package com.audiora.controller;

import com.audiora.model.LikedTrack;
import com.audiora.model.Provider;
import com.audiora.model.User;
import com.audiora.service.LikedTracksService;
import com.audiora.service.UserService;
import com.audiora.service.GoogleAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final LikedTracksService likedTracksService;
    private final GoogleAuthService googleAuthService;

    public UserController(UserService userService, LikedTracksService likedTracksService, GoogleAuthService googleAuthService) {
        this.userService = userService;
        this.likedTracksService = likedTracksService;
        this.googleAuthService = googleAuthService;
    }

    /**
     * Get user profile by ID
     */
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable String userId) {
        UUID userUUID = UUID.fromString(userId);
        Optional<User> user = userService.getUserById(userUUID);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Validate user token and get user info
     */
    @PostMapping("/validate")
    public ResponseEntity<User> validateUserToken(@RequestBody Map<String, String> request) {
        String accessToken = request.get("accessToken");
        if (accessToken == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            GoogleAuthService.GoogleUserInfo userInfo = googleAuthService.getUserInfo(accessToken).block();
            if (userInfo != null) {
                User user = userService.createOrUpdateUser(
                    userInfo.getId(),
                    userInfo.getEmail(),
                    userInfo.getName(),
                    userInfo.getPicture(),
                    userInfo.getGiven_name(),
                    userInfo.getFamily_name(),
                    userInfo.isVerified_email()
                );
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Get user's liked tracks
     */
    @GetMapping("/{userId}/liked-tracks")
    public ResponseEntity<List<LikedTrack>> getUserLikedTracks(@PathVariable String userId) {
        UUID userUUID = UUID.fromString(userId);
        if (!userService.userExists(userUUID)) {
            return ResponseEntity.notFound().build();
        }
        List<LikedTrack> likedTracks = likedTracksService.getUserLikedTracks(userUUID);
        return ResponseEntity.ok(likedTracks);
    }

    /**
     * Get user's liked tracks by provider
     */
    @GetMapping("/{userId}/liked-tracks/{provider}")
    public ResponseEntity<List<LikedTrack>> getUserLikedTracksByProvider(
            @PathVariable String userId,
            @PathVariable Provider provider) {
        UUID userUUID = UUID.fromString(userId);
        if (!userService.userExists(userUUID)) {
            return ResponseEntity.notFound().build();
        }
        List<LikedTrack> likedTracks = likedTracksService.getUserLikedTracksByProvider(userUUID, provider);
        return ResponseEntity.ok(likedTracks);
    }

    /**
     * Like a track
     */
    @PostMapping("/{userId}/liked-tracks")
    public ResponseEntity<LikedTrack> likeTrack(@PathVariable String userId, @RequestBody LikeTrackRequest request) {
        UUID userUUID = UUID.fromString(userId);
        if (!userService.userExists(userUUID)) {
            return ResponseEntity.notFound().build();
        }

        LikedTrack likedTrack = likedTracksService.likeTrack(
            userUUID,
            request.getProvider(),
            request.getTrackId(),
            request.getTitle(),
            request.getArtist(),
            request.getAlbum(),
            request.getImageUrl(),
            request.getExternalUrl()
        );
        return ResponseEntity.ok(likedTrack);
    }

    /**
     * Unlike a track
     */
    @DeleteMapping("/{userId}/liked-tracks/{provider}/{trackId}")
    public ResponseEntity<Void> unlikeTrack(
            @PathVariable String userId,
            @PathVariable Provider provider,
            @PathVariable String trackId) {
        UUID userUUID = UUID.fromString(userId);
        if (!userService.userExists(userUUID)) {
            return ResponseEntity.notFound().build();
        }

        boolean removed = likedTracksService.unlikeTrack(userUUID, provider, trackId);
        return removed ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    /**
     * Check if a track is liked
     */
    @GetMapping("/{userId}/liked-tracks/{provider}/{trackId}/status")
    public ResponseEntity<Map<String, Boolean>> checkTrackLiked(
            @PathVariable String userId,
            @PathVariable Provider provider,
            @PathVariable String trackId) {
        UUID userUUID = UUID.fromString(userId);
        if (!userService.userExists(userUUID)) {
            return ResponseEntity.notFound().build();
        }

        boolean isLiked = likedTracksService.isTrackLiked(userUUID, provider, trackId);
        return ResponseEntity.ok(Map.of("isLiked", isLiked));
    }

    /**
     * Import liked tracks (for syncing from client-side storage)
     */
    @PostMapping("/{userId}/liked-tracks/import")
    public ResponseEntity<Map<String, String>> importLikedTracks(
            @PathVariable String userId,
            @RequestBody List<LikedTrack> tracks) {
        UUID userUUID = UUID.fromString(userId);
        if (!userService.userExists(userUUID)) {
            return ResponseEntity.notFound().build();
        }

        likedTracksService.importLikedTracks(userUUID, tracks);
        return ResponseEntity.ok(Map.of("message", "Liked tracks imported successfully"));
    }

    /**
     * Export liked tracks
     */
    @GetMapping("/{userId}/liked-tracks/export")
    public ResponseEntity<List<LikedTrack>> exportLikedTracks(@PathVariable String userId) {
        UUID userUUID = UUID.fromString(userId);
        if (!userService.userExists(userUUID)) {
            return ResponseEntity.notFound().build();
        }

        List<LikedTrack> tracks = likedTracksService.exportUserLikedTracks(userUUID);
        return ResponseEntity.ok(tracks);
    }

    /**
     * Get liked tracks count
     */
    @GetMapping("/{userId}/liked-tracks/count")
    public ResponseEntity<Map<String, Long>> getLikedTracksCount(@PathVariable String userId) {
        UUID userUUID = UUID.fromString(userId);
        if (!userService.userExists(userUUID)) {
            return ResponseEntity.notFound().build();
        }

        long count = likedTracksService.getUserLikedTracksCount(userUUID);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // DTO classes for requests
    public static class LikeTrackRequest {
        private Provider provider;
        private String trackId;
        private String title;
        private String artist;
        private String album;
        private String imageUrl;
        private String externalUrl;

        // Getters and setters
        public Provider getProvider() { return provider; }
        public void setProvider(Provider provider) { this.provider = provider; }

        public String getTrackId() { return trackId; }
        public void setTrackId(String trackId) { this.trackId = trackId; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getArtist() { return artist; }
        public void setArtist(String artist) { this.artist = artist; }

        public String getAlbum() { return album; }
        public void setAlbum(String album) { this.album = album; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getExternalUrl() { return externalUrl; }
        public void setExternalUrl(String externalUrl) { this.externalUrl = externalUrl; }
    }
}

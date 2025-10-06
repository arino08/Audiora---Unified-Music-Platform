package com.audiora.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_spotify_user_id", columnList = "spotifyUserId"),
    @Index(name = "idx_youtube_user_id", columnList = "youtubeUserId")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(length = 100)
    private String name;

    @Column(length = 500)
    private String picture;

    @Column(length = 100)
    private String givenName;

    @Column(length = 100)
    private String familyName;

    @Column(nullable = false)
    private boolean emailVerified;

    @Column(length = 255)
    private String passwordHash;

    @Column(length = 100)
    private String verificationCode;

    private Instant verificationCodeExpiry;

    // New customizable profile fields
    @Column(length = 50)
    private String username;

    @Column(length = 100)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 500)
    private String avatarUrl;

    @Column(length = 100)
    private String spotifyUserId;

    @Column(length = 100)
    private String youtubeUserId;

    /**
     * User preferences stored as JSON
     * Example: {"theme": "dark", "autoQueue": true, "defaultProvider": "spotify"}
     */
    @Column(columnDefinition = "TEXT")
    private String preferences;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    private Instant lastLoginAt;

    public User() {}

    public User(String email, String name) {
        this.email = email;
        this.name = name;
        this.lastLoginAt = Instant.now();
    }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }

    public String getGivenName() { return givenName; }
    public void setGivenName(String givenName) { this.givenName = givenName; }

    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }

    public Instant getVerificationCodeExpiry() { return verificationCodeExpiry; }
    public void setVerificationCodeExpiry(Instant verificationCodeExpiry) { this.verificationCodeExpiry = verificationCodeExpiry; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getSpotifyUserId() { return spotifyUserId; }
    public void setSpotifyUserId(String spotifyUserId) { this.spotifyUserId = spotifyUserId; }

    public String getYoutubeUserId() { return youtubeUserId; }
    public void setYoutubeUserId(String youtubeUserId) { this.youtubeUserId = youtubeUserId; }

    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", emailVerified=" + emailVerified +
                '}';
    }
}

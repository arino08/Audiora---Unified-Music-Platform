package com.audiora.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "liked_tracks", indexes = {
    @Index(name = "idx_user_id", columnList = "userId"),
    @Index(name = "idx_provider_track", columnList = "provider,trackId"),
    @Index(name = "idx_liked_at", columnList = "likedAt")
}, uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "provider", "trackId"})
})
public class LikedTrack {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Provider provider;

    @Column(nullable = false, length = 100)
    private String trackId;

    @Column(length = 255)
    private String title;

    @Column(length = 255)
    private String artist;

    @Column(length = 255)
    private String album;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String externalUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant likedAt;

    public LikedTrack() {}

    public LikedTrack(UUID userId, Provider provider, String trackId, String title, String artist) {
        this.userId = userId;
        this.provider = provider;
        this.trackId = trackId;
        this.title = title;
        this.artist = artist;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

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

    public Instant getLikedAt() { return likedAt; }
    public void setLikedAt(Instant likedAt) { this.likedAt = likedAt; }

    @Override
    public String toString() {
        return "LikedTrack{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", provider=" + provider +
                ", trackId='" + trackId + '\'' +
                ", title='" + title + '\'' +
                ", artist='" + artist + '\'' +
                '}';
    }
}

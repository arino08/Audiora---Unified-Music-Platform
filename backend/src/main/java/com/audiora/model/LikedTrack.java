package com.audiora.model;

import java.time.Instant;

public class LikedTrack {
    private String id; // Unique ID for this liked track entry
    private String userId; // The user who liked the track
    private Provider provider; // SPOTIFY or YOUTUBE
    private String trackId; // Track ID from the provider
    private String title;
    private String artist;
    private String album;
    private String imageUrl;
    private String externalUrl; // Link to the track on the provider
    private Instant likedAt;

    public LikedTrack() {}

    public LikedTrack(String userId, Provider provider, String trackId, String title, String artist) {
        this.userId = userId;
        this.provider = provider;
        this.trackId = trackId;
        this.title = title;
        this.artist = artist;
        this.likedAt = Instant.now();
        this.id = generateId();
    }

    private String generateId() {
        return userId + "_" + provider + "_" + trackId;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

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

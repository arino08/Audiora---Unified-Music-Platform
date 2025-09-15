package com.audiora.service;

import com.audiora.model.LikedTrack;
import com.audiora.model.Provider;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LikedTracksService {
    private final ConcurrentHashMap<String, LikedTrack> likedTracks = new ConcurrentHashMap<>();

    /**
     * Like a track for a user
     */
    public LikedTrack likeTrack(String userId, Provider provider, String trackId, String title, String artist, String album, String imageUrl, String externalUrl) {
        String id = generateId(userId, provider, trackId);

        LikedTrack likedTrack = new LikedTrack(userId, provider, trackId, title, artist);
        likedTrack.setId(id);
        likedTrack.setAlbum(album);
        likedTrack.setImageUrl(imageUrl);
        likedTrack.setExternalUrl(externalUrl);

        likedTracks.put(id, likedTrack);
        return likedTrack;
    }

    /**
     * Unlike a track for a user
     */
    public boolean unlikeTrack(String userId, Provider provider, String trackId) {
        String id = generateId(userId, provider, trackId);
        return likedTracks.remove(id) != null;
    }

    /**
     * Check if a track is liked by a user
     */
    public boolean isTrackLiked(String userId, Provider provider, String trackId) {
        String id = generateId(userId, provider, trackId);
        return likedTracks.containsKey(id);
    }

    /**
     * Get all liked tracks for a user
     */
    public List<LikedTrack> getUserLikedTracks(String userId) {
        return likedTracks.values().stream()
                .filter(track -> userId.equals(track.getUserId()))
                .sorted((a, b) -> b.getLikedAt().compareTo(a.getLikedAt())) // Most recent first
                .collect(Collectors.toList());
    }

    /**
     * Get liked tracks for a user from a specific provider
     */
    public List<LikedTrack> getUserLikedTracksByProvider(String userId, Provider provider) {
        return likedTracks.values().stream()
                .filter(track -> userId.equals(track.getUserId()) && provider.equals(track.getProvider()))
                .sorted((a, b) -> b.getLikedAt().compareTo(a.getLikedAt()))
                .collect(Collectors.toList());
    }

    /**
     * Get a specific liked track
     */
    public Optional<LikedTrack> getLikedTrack(String userId, Provider provider, String trackId) {
        String id = generateId(userId, provider, trackId);
        return Optional.ofNullable(likedTracks.get(id));
    }

    /**
     * Import liked tracks for a user (for syncing from client-side storage)
     */
    public void importLikedTracks(String userId, List<LikedTrack> tracks) {
        for (LikedTrack track : tracks) {
            track.setUserId(userId);
            track.setId(generateId(userId, track.getProvider(), track.getTrackId()));
            likedTracks.put(track.getId(), track);
        }
    }

    /**
     * Export liked tracks for a user (for backup or migration)
     */
    public List<LikedTrack> exportUserLikedTracks(String userId) {
        return getUserLikedTracks(userId);
    }

    /**
     * Get count of liked tracks for a user
     */
    public long getUserLikedTracksCount(String userId) {
        return likedTracks.values().stream()
                .filter(track -> userId.equals(track.getUserId()))
                .count();
    }

    /**
     * Clear all liked tracks for a user
     */
    public void clearUserLikedTracks(String userId) {
        likedTracks.entrySet().removeIf(entry -> userId.equals(entry.getValue().getUserId()));
    }

    private String generateId(String userId, Provider provider, String trackId) {
        return userId + "_" + provider + "_" + trackId;
    }
}

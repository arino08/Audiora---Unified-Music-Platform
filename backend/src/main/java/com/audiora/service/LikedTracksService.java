package com.audiora.service;

import com.audiora.model.LikedTrack;
import com.audiora.model.Provider;
import com.audiora.repository.LikedTrackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LikedTracksService {
    private final LikedTrackRepository likedTrackRepository;

    public LikedTracksService(LikedTrackRepository likedTrackRepository) {
        this.likedTrackRepository = likedTrackRepository;
    }

    /**
     * Like a track for a user
     */
    @Transactional
    public LikedTrack likeTrack(UUID userId, Provider provider, String trackId, String title, String artist, String album, String imageUrl, String externalUrl) {
        // Check if already liked
        if (likedTrackRepository.existsByUserIdAndProviderAndTrackId(userId, provider, trackId)) {
            return likedTrackRepository.findByUserIdAndProviderAndTrackId(userId, provider, trackId).orElse(null);
        }

        LikedTrack likedTrack = new LikedTrack(userId, provider, trackId, title, artist);
        likedTrack.setAlbum(album);
        likedTrack.setImageUrl(imageUrl);
        likedTrack.setExternalUrl(externalUrl);

        return likedTrackRepository.save(likedTrack);
    }

    /**
     * Unlike a track for a user
     */
    @Transactional
    public boolean unlikeTrack(UUID userId, Provider provider, String trackId) {
        likedTrackRepository.deleteByUserIdAndProviderAndTrackId(userId, provider, trackId);
        return true;
    }

    /**
     * Check if a track is liked by a user
     */
    public boolean isTrackLiked(UUID userId, Provider provider, String trackId) {
        return likedTrackRepository.existsByUserIdAndProviderAndTrackId(userId, provider, trackId);
    }

    /**
     * Get all liked tracks for a user
     */
    public List<LikedTrack> getUserLikedTracks(UUID userId) {
        return likedTrackRepository.findByUserIdOrderByLikedAtDesc(userId);
    }

    /**
     * Get liked tracks for a user from a specific provider
     */
    public List<LikedTrack> getUserLikedTracksByProvider(UUID userId, Provider provider) {
        return likedTrackRepository.findByUserIdAndProviderOrderByLikedAtDesc(userId, provider);
    }

    /**
     * Get a specific liked track
     */
    public Optional<LikedTrack> getLikedTrack(UUID userId, Provider provider, String trackId) {
        return likedTrackRepository.findByUserIdAndProviderAndTrackId(userId, provider, trackId);
    }

    /**
     * Import liked tracks for a user (for syncing from client-side storage)
     */
    @Transactional
    public void importLikedTracks(UUID userId, List<LikedTrack> tracks) {
        for (LikedTrack track : tracks) {
            track.setUserId(userId);
            if (!likedTrackRepository.existsByUserIdAndProviderAndTrackId(userId, track.getProvider(), track.getTrackId())) {
                likedTrackRepository.save(track);
            }
        }
    }

    /**
     * Export liked tracks for a user (for backup or migration)
     */
    public List<LikedTrack> exportUserLikedTracks(UUID userId) {
        return getUserLikedTracks(userId);
    }

    /**
     * Get count of liked tracks for a user
     */
    public long getUserLikedTracksCount(UUID userId) {
        return likedTrackRepository.countByUserId(userId);
    }

    /**
     * Clear all liked tracks for a user
     */
    @Transactional
    public void clearUserLikedTracks(UUID userId) {
        likedTrackRepository.deleteByUserId(userId);
    }
}

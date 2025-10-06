package com.audiora.repository;

import com.audiora.model.LikedTrack;
import com.audiora.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LikedTrackRepository extends JpaRepository<LikedTrack, UUID> {

    List<LikedTrack> findByUserIdOrderByLikedAtDesc(UUID userId);

    List<LikedTrack> findByUserIdAndProviderOrderByLikedAtDesc(UUID userId, Provider provider);

    Optional<LikedTrack> findByUserIdAndProviderAndTrackId(UUID userId, Provider provider, String trackId);

    boolean existsByUserIdAndProviderAndTrackId(UUID userId, Provider provider, String trackId);

    long countByUserId(UUID userId);

    void deleteByUserIdAndProviderAndTrackId(UUID userId, Provider provider, String trackId);

    void deleteByUserId(UUID userId);
}

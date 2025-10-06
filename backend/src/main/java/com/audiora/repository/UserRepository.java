package com.audiora.repository;

import com.audiora.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findBySpotifyUserId(String spotifyUserId);

    Optional<User> findByYoutubeUserId(String youtubeUserId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}

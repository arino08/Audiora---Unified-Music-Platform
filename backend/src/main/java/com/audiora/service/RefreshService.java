package com.audiora.service;

import com.audiora.model.OAuthTokenResponse;
import com.audiora.model.Provider;
import com.audiora.model.TokenInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Service
public class RefreshService {

    private final WebClient spotifyAccounts = WebClient.create("https://accounts.spotify.com");
    private final WebClient googleOauth = WebClient.create("https://oauth2.googleapis.com");

    @Value("${spotify.clientId:}") private String spotifyClientId;
    @Value("${spotify.clientSecret:}") private String spotifyClientSecret;
    @Value("${youtube.clientId:}") private String youtubeClientId;
    @Value("${youtube.clientSecret:}") private String youtubeClientSecret;

    public Mono<TokenInfo> refresh(Provider provider, TokenInfo existing) {
        if (existing == null || existing.getRefreshToken() == null) return Mono.empty();
        if (provider == Provider.SPOTIFY) {
            return refreshSpotify(existing.getRefreshToken());
        } else if (provider == Provider.YOUTUBE) {
            return refreshYouTube(existing.getRefreshToken());
        }
        return Mono.empty();
    }

    private Mono<TokenInfo> refreshSpotify(String refreshToken) {
        return spotifyAccounts.post().uri("/api/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "refresh_token")
                        .with("refresh_token", refreshToken)
                        .with("client_id", spotifyClientId)
                        .with("client_secret", spotifyClientSecret))
                .retrieve()
                .bodyToMono(OAuthTokenResponse.class)
                .map(r -> new TokenInfo(r.getAccessToken(), refreshToken, Instant.now().plusSeconds(r.getExpiresIn()), r.getScope(), r.getTokenType()));
    }

    private Mono<TokenInfo> refreshYouTube(String refreshToken) {
        return googleOauth.post().uri("/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "refresh_token")
                        .with("refresh_token", refreshToken)
                        .with("client_id", youtubeClientId)
                        .with("client_secret", youtubeClientSecret))
                .retrieve()
                .bodyToMono(OAuthTokenResponse.class)
                .map(r -> new TokenInfo(r.getAccessToken(), refreshToken, Instant.now().plusSeconds(r.getExpiresIn()), r.getScope(), r.getTokenType()));
    }
}

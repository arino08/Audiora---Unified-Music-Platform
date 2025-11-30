package com.audiora.service;

import com.audiora.model.OAuthTokenResponse;
import com.audiora.model.TokenInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class SpotifyAuthService {

    private final WebClient authClient = WebClient.create(
        "https://accounts.spotify.com"
    );
    private final WebClient apiClient = WebClient.create(
        "https://api.spotify.com"
    );

    @Value("${spotify.client.id:}")
    private String clientId;

    @Value("${spotify.client.secret:}")
    private String clientSecret;

    public Mono<OAuthTokenResponse> exchangeCodeForToken(
        String clientId,
        String clientSecret,
        String redirectUri,
        String code
    ) {
        return authClient
            .post()
            .uri("/api/token")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(
                BodyInserters.fromFormData("grant_type", "authorization_code")
                    .with("code", code)
                    .with("redirect_uri", redirectUri)
                    .with("client_id", clientId)
                    .with("client_secret", clientSecret)
            )
            .retrieve()
            .bodyToMono(OAuthTokenResponse.class);
    }

    public Mono<SpotifyUserInfo> getUserInfo(String accessToken) {
        return apiClient
            .get()
            .uri("/v1/me")
            .header("Authorization", "Bearer " + accessToken)
            .retrieve()
            .bodyToMono(SpotifyUserInfo.class);
    }

    /**
     * Refresh an access token using a refresh token
     * Returns a new TokenInfo with the refreshed access token
     */
    public Mono<TokenInfo> refreshAccessToken(String refreshToken) {
        return authClient
            .post()
            .uri("/api/token")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(
                BodyInserters.fromFormData("grant_type", "refresh_token")
                    .with("refresh_token", refreshToken)
                    .with("client_id", clientId)
                    .with("client_secret", clientSecret)
            )
            .retrieve()
            .bodyToMono(OAuthTokenResponse.class)
            .map(response -> {
                // Spotify may or may not return a new refresh token
                String newRefreshToken = response.getRefreshToken() != null
                    ? response.getRefreshToken()
                    : refreshToken;

                // Calculate expiration time (expiresIn is primitive long, so check for > 0)
                Instant expiresAt = response.getExpiresIn() > 0
                    ? Instant.now().plusSeconds(response.getExpiresIn())
                    : Instant.now().plusSeconds(3600); // Default to 1 hour

                return new TokenInfo(
                    response.getAccessToken(),
                    newRefreshToken,
                    expiresAt,
                    response.getScope(),
                    response.getTokenType()
                );
            });
    }

    public static class SpotifyUserInfo {

        private String id;
        private String email;

        @JsonProperty("display_name")
        private String displayName;

        private String country;
        private ExternalUrls external_urls;
        private Followers followers;
        private Image[] images;

        // Getters and setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public ExternalUrls getExternal_urls() {
            return external_urls;
        }

        public void setExternal_urls(ExternalUrls external_urls) {
            this.external_urls = external_urls;
        }

        public Followers getFollowers() {
            return followers;
        }

        public void setFollowers(Followers followers) {
            this.followers = followers;
        }

        public Image[] getImages() {
            return images;
        }

        public void setImages(Image[] images) {
            this.images = images;
        }

        public String getName() {
            return displayName != null && !displayName.trim().isEmpty()
                ? displayName
                : id;
        }

        public String getPicture() {
            return images != null && images.length > 0 ? images[0].url : null;
        }

        public static class ExternalUrls {

            public String spotify;
        }

        public static class Followers {

            public String href;
            public int total;
        }

        public static class Image {

            public String url;
            public Integer height;
            public Integer width;
        }
    }
}

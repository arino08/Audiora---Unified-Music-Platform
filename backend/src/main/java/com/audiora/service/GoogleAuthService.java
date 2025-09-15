package com.audiora.service;

import com.audiora.model.OAuthTokenResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class GoogleAuthService {
    private final WebClient webClient;

    public GoogleAuthService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://oauth2.googleapis.com")
                .build();
    }

    /**
     * Exchange authorization code for access token from Google
     */
    public Mono<OAuthTokenResponse> exchangeCodeForToken(String clientId, String clientSecret, String redirectUri, String code) {
        return webClient.post()
                .uri("/token")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .bodyValue("grant_type=authorization_code" +
                        "&code=" + code +
                        "&redirect_uri=" + redirectUri +
                        "&client_id=" + clientId +
                        "&client_secret=" + clientSecret)
                .retrieve()
                .bodyToMono(OAuthTokenResponse.class);
    }

    /**
     * Get user info from Google using access token
     */
    public Mono<GoogleUserInfo> getUserInfo(String accessToken) {
        return WebClient.create("https://www.googleapis.com")
                .get()
                .uri("/oauth2/v2/userinfo")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(GoogleUserInfo.class);
    }

    /**
     * Refresh access token using refresh token
     */
    public Mono<OAuthTokenResponse> refreshToken(String clientId, String clientSecret, String refreshToken) {
        return webClient.post()
                .uri("/token")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .bodyValue("grant_type=refresh_token" +
                        "&refresh_token=" + refreshToken +
                        "&client_id=" + clientId +
                        "&client_secret=" + clientSecret)
                .retrieve()
                .bodyToMono(OAuthTokenResponse.class);
    }

    /**
     * Verify access token validity
     */
    public Mono<TokenInfo> verifyToken(String accessToken) {
        return WebClient.create("https://oauth2.googleapis.com")
                .get()
                .uri("/tokeninfo?access_token=" + accessToken)
                .retrieve()
                .bodyToMono(TokenInfo.class);
    }

    public static class GoogleUserInfo {
        private String id;
        private String email;
        private String name;
        private String picture;
        private String given_name;
        private String family_name;
        private boolean verified_email;

        // Getters and setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getPicture() { return picture; }
        public void setPicture(String picture) { this.picture = picture; }

        public String getGiven_name() { return given_name; }
        public void setGiven_name(String given_name) { this.given_name = given_name; }

        public String getFamily_name() { return family_name; }
        public void setFamily_name(String family_name) { this.family_name = family_name; }

        public boolean isVerified_email() { return verified_email; }
        public void setVerified_email(boolean verified_email) { this.verified_email = verified_email; }
    }

    public static class TokenInfo {
        private String scope;
        private String audience;
        private String expires_in;
        private String issued_to;

        // Getters and setters
        public String getScope() { return scope; }
        public void setScope(String scope) { this.scope = scope; }

        public String getAudience() { return audience; }
        public void setAudience(String audience) { this.audience = audience; }

        public String getExpires_in() { return expires_in; }
        public void setExpires_in(String expires_in) { this.expires_in = expires_in; }

        public String getIssued_to() { return issued_to; }
        public void setIssued_to(String issued_to) { this.issued_to = issued_to; }
    }
}

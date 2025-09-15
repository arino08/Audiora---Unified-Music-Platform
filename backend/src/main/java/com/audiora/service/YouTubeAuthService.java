package com.audiora.service;

import com.audiora.model.OAuthTokenResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class YouTubeAuthService {
    private final WebClient authClient = WebClient.create("https://oauth2.googleapis.com");
    private final WebClient apiClient = WebClient.create("https://www.googleapis.com");

    public Mono<OAuthTokenResponse> exchangeCodeForToken(String clientId, String clientSecret, String redirectUri, String code) {
        return authClient.post()
                .uri("/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "authorization_code")
                        .with("code", code)
                        .with("redirect_uri", redirectUri)
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret))
                .retrieve()
                .bodyToMono(OAuthTokenResponse.class);
    }

    // YouTube uses Google's user info API since it's a Google service
    public Mono<GoogleAuthService.GoogleUserInfo> getUserInfo(String accessToken) {
        return apiClient.get()
                .uri("/oauth2/v2/userinfo")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(GoogleAuthService.GoogleUserInfo.class);
    }
}

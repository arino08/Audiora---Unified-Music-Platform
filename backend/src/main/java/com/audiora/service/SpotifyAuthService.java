package com.audiora.service;

import com.audiora.model.OAuthTokenResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class SpotifyAuthService {
    private final WebClient webClient = WebClient.create("https://accounts.spotify.com");

    public Mono<OAuthTokenResponse> exchangeCodeForToken(String clientId, String clientSecret, String redirectUri, String code) {
        return webClient.post()
                .uri("/api/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "authorization_code")
                        .with("code", code)
                        .with("redirect_uri", redirectUri)
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret))
                .retrieve()
                .bodyToMono(OAuthTokenResponse.class);
    }
}

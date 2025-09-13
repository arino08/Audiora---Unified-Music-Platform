package com.audiora.service;

import com.audiora.model.TokenInfo;
import com.audiora.model.Provider;
import com.audiora.store.InMemoryTokenStore;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class SpotifyApiService {
    private final WebClient api = WebClient.create("https://api.spotify.com/v1");
    private final RefreshService refreshService;
    private final InMemoryTokenStore tokenStore;

    public SpotifyApiService(RefreshService refreshService, InMemoryTokenStore tokenStore) {
        this.refreshService = refreshService;
        this.tokenStore = tokenStore;
    }

    private Mono<TokenInfo> ensureValid(TokenInfo token, String sessionId) {
        if (token == null) return Mono.empty();
        if (!token.isExpired()) return Mono.just(token);
        return refreshService.refresh(Provider.SPOTIFY, token)
                .doOnNext(t -> tokenStore.update(sessionId, Provider.SPOTIFY, t));
    }

    public Mono<String> getCurrentUserPlaylistsRaw(TokenInfo token, String sessionId) {
        return ensureValid(token, sessionId).switchIfEmpty(Mono.just(token)).flatMap(t -> api.get()
                .uri(uriBuilder -> uriBuilder.path("/me/playlists").queryParam("limit", 50).build())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
                .retrieve()
                .bodyToMono(String.class));
    }

    public Mono<String> getPlaybackStateRaw(TokenInfo token, String sessionId) {
        return ensureValid(token, sessionId).switchIfEmpty(Mono.just(token)).flatMap(t -> api.get()
                .uri("/me/player")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
                .retrieve()
                .bodyToMono(String.class));
    }

    public Mono<Integer> resumeOrStartPlayback(TokenInfo token, String sessionId, String jsonBody) {
        return ensureValid(token, sessionId).switchIfEmpty(Mono.just(token)).flatMap(t -> {
            WebClient.RequestBodySpec spec = api.put().uri("/me/player/play").header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken());
            if (jsonBody != null) spec = (WebClient.RequestBodySpec) spec.bodyValue(jsonBody);
            return spec.exchangeToMono(resp -> resp.toBodilessEntity().map(e -> resp.statusCode().value()))
                    .onErrorResume(ex -> Mono.just(-1));
        });
    }

    public Mono<Integer> pausePlayback(TokenInfo token, String sessionId) {
    return ensureValid(token, sessionId).switchIfEmpty(Mono.just(token)).flatMap(t -> api.put()
        .uri("/me/player/pause")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
        .exchangeToMono(resp -> resp.toBodilessEntity().map(e -> resp.statusCode().value()))
        .onErrorResume(ex -> Mono.just(-1)));
    }

    public Mono<Integer> nextTrack(TokenInfo token, String sessionId) {
    return ensureValid(token, sessionId).switchIfEmpty(Mono.just(token)).flatMap(t -> api.post()
        .uri("/me/player/next")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
        .exchangeToMono(resp -> resp.toBodilessEntity().map(e -> resp.statusCode().value()))
        .onErrorResume(ex -> Mono.just(-1)));
    }

    public Mono<Integer> previousTrack(TokenInfo token, String sessionId) {
    return ensureValid(token, sessionId).switchIfEmpty(Mono.just(token)).flatMap(t -> api.post()
        .uri("/me/player/previous")
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
        .exchangeToMono(resp -> resp.toBodilessEntity().map(e -> resp.statusCode().value()))
        .onErrorResume(ex -> Mono.just(-1)));
    }

    public Mono<String> searchTracksRaw(TokenInfo token, String sessionId, String query, int limit) {
    return ensureValid(token, sessionId).switchIfEmpty(Mono.just(token)).flatMap(t -> api.get()
        .uri(uriBuilder -> uriBuilder.path("/search")
            .queryParam("type", "track")
            .queryParam("q", query)
            .queryParam("limit", limit)
            .build())
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
        .retrieve()
        .bodyToMono(String.class));
    }

    public Mono<Integer> transferPlayback(TokenInfo token, String sessionId, String deviceId, boolean play) {
        String body = "{\"device_ids\":[\"" + deviceId + "\"],\"play\":" + play + "}";
        return ensureValid(token, sessionId).switchIfEmpty(Mono.just(token)).flatMap(t -> api.put()
            .uri("/me/player")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
            .header(HttpHeaders.CONTENT_TYPE, "application/json")
            .bodyValue(body)
            .exchangeToMono(resp -> resp.toBodilessEntity().map(e -> resp.statusCode().value()))
            .onErrorResume(ex -> Mono.just(-1)));
    }
}

package com.audiora.service;

import com.audiora.model.TokenInfo;
import com.audiora.model.Provider;
import com.audiora.store.InMemoryTokenStore;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class YouTubeApiService {
    private final WebClient api = WebClient.create("https://www.googleapis.com/youtube/v3");
    private final RefreshService refreshService;
    private final InMemoryTokenStore tokenStore;

    public YouTubeApiService(RefreshService refreshService, InMemoryTokenStore tokenStore) {
        this.refreshService = refreshService;
        this.tokenStore = tokenStore;
    }

    private reactor.core.publisher.Mono<TokenInfo> ensureValid(TokenInfo token, String sessionId) {
        if (token == null) return reactor.core.publisher.Mono.empty();
        if (!token.isExpired()) return reactor.core.publisher.Mono.just(token);
        return refreshService.refresh(Provider.YOUTUBE, token)
                .doOnNext(t -> tokenStore.update(sessionId, Provider.YOUTUBE, t));
    }

    public Mono<String> getPlaylistsRaw(TokenInfo token) {
    return ensureValid(token, null).defaultIfEmpty(token).flatMap(t -> api.get()
                .uri(uriBuilder -> uriBuilder.path("/playlists")
                        .queryParam("part", "snippet,contentDetails")
                        .queryParam("mine", true)
                        .queryParam("maxResults", 50)
                        .build())
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
        .retrieve()
        .bodyToMono(String.class));
    }

    public Mono<String> getPlaylistItemsRaw(TokenInfo token, String playlistId) {
    return ensureValid(token, null).defaultIfEmpty(token).flatMap(t -> api.get()
        .uri(uriBuilder -> uriBuilder.path("/playlistItems")
            .queryParam("part", "snippet,contentDetails")
            .queryParam("playlistId", playlistId)
            .queryParam("maxResults", 50)
            .build())
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
        .retrieve()
        .bodyToMono(String.class));
    }

    public Mono<String> searchVideosRaw(TokenInfo token, String query, int limit) {
        int effectiveLimit = Math.min(limit, 25);
    return ensureValid(token, null).defaultIfEmpty(token).flatMap(t -> api.get()
        .uri(uriBuilder -> uriBuilder.path("/search")
            .queryParam("part", "snippet")
            .queryParam("type", "video")
            .queryParam("q", query)
                        .queryParam("maxResults", effectiveLimit)
            .build())
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + t.getAccessToken())
        .retrieve()
        .bodyToMono(String.class));
    }
}

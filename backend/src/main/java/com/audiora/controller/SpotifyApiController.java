package com.audiora.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.audiora.store.InMemoryTokenStore;
import com.audiora.model.Provider;
import com.audiora.model.TokenInfo;
import com.audiora.service.SpotifyApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spotify")
public class SpotifyApiController {
    private final InMemoryTokenStore tokenStore;
    private final SpotifyApiService spotifyApiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SpotifyApiController(InMemoryTokenStore tokenStore, SpotifyApiService spotifyApiService) {
        this.tokenStore = tokenStore;
        this.spotifyApiService = spotifyApiService;
    }

    @GetMapping("/playlists")
    public ResponseEntity<?> playlists(@RequestHeader(name = "X-Session-Id", required = false) String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "missing_session", "message", "X-Session-Id header required"));
        }
        TokenInfo token = tokenStore.get(sessionId, Provider.SPOTIFY);
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
        }
        if (token.getExpiresAt() != null && token.getExpiresAt().isBefore(Instant.now())) {
            return ResponseEntity.status(401).body(Map.of("error", "token_expired"));
        }
    String raw = spotifyApiService.getCurrentUserPlaylistsRaw(token, sessionId).block();
        if (raw == null) {
            return ResponseEntity.internalServerError().body(Map.of("error", "spotify_unreachable"));
        }
        try {
            JsonNode root = objectMapper.readTree(raw);
            List<Map<String, Object>> items = new ArrayList<>();
            if (root.has("items")) {
                for (JsonNode n : root.get("items")) {
                    String id = n.path("id").asText();
                    String name = n.path("name").asText();
                    int trackCount = n.path("tracks").path("total").asInt();
                    String image = null;
                    JsonNode images = n.path("images");
                    if (images.isArray() && images.size() > 0) {
                        image = images.get(0).path("url").asText(null);
                    }
                    items.add(Map.of(
                            "id", id,
                            "name", name,
                            "tracks", trackCount,
                            "image", image
                    ));
                }
            }
            return ResponseEntity.ok(Map.of("items", items));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "parse_failed", "details", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestHeader(name = "X-Session-Id", required = false) String sessionId,
                                    @RequestParam(name = "query") String query,
                                    @RequestParam(name = "limit", required = false, defaultValue = "10") int limit) {
        if (sessionId == null || sessionId.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "missing_session"));
        }
        TokenInfo token = tokenStore.get(sessionId, Provider.SPOTIFY);
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
        }
        if (limit > 50) limit = 50;
    String raw = spotifyApiService.searchTracksRaw(token, sessionId, query, limit).block();
        if (raw == null) return ResponseEntity.internalServerError().body(Map.of("error", "spotify_unreachable"));
        try {
            JsonNode root = objectMapper.readTree(raw);
            JsonNode tracks = root.path("tracks").path("items");
            List<Map<String, Object>> items = new ArrayList<>();
            if (tracks.isArray()) {
                for (JsonNode t : tracks) {
                    String id = t.path("id").asText();
                    String name = t.path("name").asText();
                    List<String> artists = new ArrayList<>();
                    for (JsonNode a : t.path("artists")) artists.add(a.path("name").asText());
                    String album = t.path("album").path("name").asText();
                    long durationMs = t.path("duration_ms").asLong();
                    String uri = t.path("uri").asText();
                    String image = null;
                    JsonNode images = t.path("album").path("images");
                    if (images.isArray() && images.size() > 0) image = images.get(images.size()-1).path("url").asText();
                    items.add(Map.of(
                            "id", id,
                            "name", name,
                            "artists", artists,
                            "album", album,
                            "durationMs", durationMs,
                            "uri", uri,
                "image", image,
                "provider", "spotify"
                    ));
                }
            }
            return ResponseEntity.ok(Map.of("items", items));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "parse_failed", "details", e.getMessage()));
        }
    }
}

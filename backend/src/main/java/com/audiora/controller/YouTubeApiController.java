package com.audiora.controller;

import com.audiora.model.Provider;
import com.audiora.model.TokenInfo;
import com.audiora.service.YouTubeApiService;
import com.audiora.store.InMemoryTokenStore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/youtube")
public class YouTubeApiController {
    private final InMemoryTokenStore tokenStore;
    private final YouTubeApiService youTubeApiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public YouTubeApiController(InMemoryTokenStore tokenStore, YouTubeApiService youTubeApiService) {
        this.tokenStore = tokenStore;
        this.youTubeApiService = youTubeApiService;
    }

    @GetMapping("/playlists")
    public ResponseEntity<?> playlists(@RequestHeader(name = "X-Session-Id", required = false) String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "missing_session"));
        }
        TokenInfo token = tokenStore.get(sessionId, Provider.YOUTUBE);
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
        }
        if (token.getExpiresAt() != null && token.getExpiresAt().isBefore(Instant.now())) {
            return ResponseEntity.status(401).body(Map.of("error", "token_expired"));
        }
        String raw = youTubeApiService.getPlaylistsRaw(token).block();
        if (raw == null) {
            return ResponseEntity.internalServerError().body(Map.of("error", "youtube_unreachable"));
        }
        try {
            JsonNode root = objectMapper.readTree(raw);
            List<Map<String, Object>> items = new ArrayList<>();
            if (root.has("items")) {
                for (JsonNode n : root.get("items")) {
                    String id = n.path("id").asText();
                    JsonNode snippet = n.path("snippet");
                    String title = snippet.path("title").asText();
                    int count = n.path("contentDetails").path("itemCount").asInt();
                    String thumb = null;
                    JsonNode thumbs = snippet.path("thumbnails");
                    if (thumbs.has("default")) {
                        thumb = thumbs.path("default").path("url").asText(null);
                    } else if (thumbs.has("medium")) {
                        thumb = thumbs.path("medium").path("url").asText(null);
                    }
                    items.add(Map.of(
                            "id", id,
                            "name", title,
                            "tracks", count,
                            "image", thumb
                    ));
                }
            }
            return ResponseEntity.ok(Map.of("items", items));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "parse_failed", "details", e.getMessage()));
        }
    }

    @GetMapping("/playlists/{playlistId}/items")
    public ResponseEntity<?> playlistItems(@RequestHeader(name = "X-Session-Id", required = false) String sessionId,
                                           @PathVariable String playlistId) {
        if (sessionId == null || sessionId.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "missing_session"));
        }
        TokenInfo token = tokenStore.get(sessionId, Provider.YOUTUBE);
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
        }
        if (token.getExpiresAt() != null && token.getExpiresAt().isBefore(Instant.now())) {
            return ResponseEntity.status(401).body(Map.of("error", "token_expired"));
        }
        String raw = youTubeApiService.getPlaylistItemsRaw(token, playlistId).block();
        if (raw == null) {
            return ResponseEntity.internalServerError().body(Map.of("error", "youtube_unreachable"));
        }
        try {
            JsonNode root = objectMapper.readTree(raw);
            List<Map<String, Object>> items = new ArrayList<>();
            if (root.has("items")) {
                for (JsonNode n : root.get("items")) {
                    JsonNode snippet = n.path("snippet");
                    String videoId = snippet.path("resourceId").path("videoId").asText();
                    int position = snippet.path("position").asInt();
                    String title = snippet.path("title").asText();
                    String channelTitle = snippet.path("channelTitle").asText();
                    String publishedAt = snippet.path("publishedAt").asText();
                    String thumb = null;
                    JsonNode thumbs = snippet.path("thumbnails");
                    if (thumbs.has("default")) {
                        thumb = thumbs.path("default").path("url").asText(null);
                    } else if (thumbs.has("medium")) {
                        thumb = thumbs.path("medium").path("url").asText(null);
                    }
                    items.add(Map.of(
                            "videoId", videoId,
                            "position", position,
                            "title", title,
                            "channelTitle", channelTitle,
                            "publishedAt", publishedAt,
                            "thumbnail", thumb
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
        TokenInfo token = tokenStore.get(sessionId, Provider.YOUTUBE);
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
        String raw = youTubeApiService.searchVideosRaw(token, query, limit).block();
        if (raw == null) return ResponseEntity.internalServerError().body(Map.of("error", "youtube_unreachable"));
        try {
            JsonNode root = objectMapper.readTree(raw);
            List<Map<String,Object>> items = new ArrayList<>();
            if (root.has("items")) {
                for (JsonNode n : root.get("items")) {
                    JsonNode snippet = n.path("snippet");
                    String videoId = n.path("id").path("videoId").asText();
                    String title = snippet.path("title").asText();
                    String channel = snippet.path("channelTitle").asText();
                    String thumb = null;
                    JsonNode thumbs = snippet.path("thumbnails");
                    if (thumbs.has("default")) thumb = thumbs.path("default").path("url").asText(null);
                    else if (thumbs.has("medium")) thumb = thumbs.path("medium").path("url").asText(null);
                    items.add(Map.of(
                "videoId", videoId,
                "title", title,
                "channel", channel,
                "thumbnail", thumb,
                "provider", "youtube"
                    ));
                }
            }
            return ResponseEntity.ok(Map.of("items", items));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "parse_failed", "details", e.getMessage()));
        }
    }
}

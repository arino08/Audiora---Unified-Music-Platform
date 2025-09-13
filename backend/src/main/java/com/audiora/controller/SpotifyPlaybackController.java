package com.audiora.controller;

import com.audiora.model.Provider;
import com.audiora.model.TokenInfo;
import com.audiora.service.SpotifyApiService;
import com.audiora.store.InMemoryTokenStore;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/spotify/player")
public class SpotifyPlaybackController {
    private final InMemoryTokenStore tokenStore;
    private final SpotifyApiService spotifyApiService;

    public SpotifyPlaybackController(InMemoryTokenStore tokenStore, SpotifyApiService spotifyApiService) {
        this.tokenStore = tokenStore;
        this.spotifyApiService = spotifyApiService;
    }

    private TokenInfo requireToken(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) return null;
        TokenInfo t = tokenStore.get(sessionId, Provider.SPOTIFY);
        return t; // allow expired; downstream service will refresh
    }

    @GetMapping("/state")
    public ResponseEntity<?> state(@RequestHeader(name = "X-Session-Id", required = false) String sessionId) {
        TokenInfo token = requireToken(sessionId);
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
    String raw = spotifyApiService.getPlaybackStateRaw(token, sessionId).block();
        if (raw == null) return ResponseEntity.internalServerError().body(Map.of("error", "spotify_unreachable"));
        return ResponseEntity.ok(raw);
    }

    @PostMapping(value = "/play", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> playWithBody(@RequestHeader(name = "X-Session-Id", required = false) String sessionId,
                                          @RequestBody(required = false) String body) {
        return play(sessionId, body, null);
    }

    @PostMapping("/play")
    public ResponseEntity<?> play(@RequestHeader(name = "X-Session-Id", required = false) String sessionId,
                                  @RequestBody(required = false) String body,
                                  @RequestParam(name = "deviceId", required = false) String deviceId) {
        TokenInfo token = requireToken(sessionId);
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
        // If a deviceId explicitly provided and body has no context, inject an empty body so Spotify targets device
        if (deviceId != null && (body == null || body.isBlank())) {
            body = "{}"; // minimal body allowed
        }
        Integer code = spotifyApiService.resumeOrStartPlayback(token, sessionId, body).block();
        return ResponseEntity.status(code == null ? 500 : code).body(Map.of("status", code));
    }

    @PostMapping("/pause")
    public ResponseEntity<?> pause(@RequestHeader(name = "X-Session-Id", required = false) String sessionId) {
        TokenInfo token = requireToken(sessionId);
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
    Integer code = spotifyApiService.pausePlayback(token, sessionId).block();
        return ResponseEntity.status(code == null ? 500 : code).body(Map.of("status", code));
    }

    @PostMapping("/next")
    public ResponseEntity<?> next(@RequestHeader(name = "X-Session-Id", required = false) String sessionId) {
        TokenInfo token = requireToken(sessionId);
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
    Integer code = spotifyApiService.nextTrack(token, sessionId).block();
        return ResponseEntity.status(code == null ? 500 : code).body(Map.of("status", code));
    }

    @PostMapping("/previous")
    public ResponseEntity<?> previous(@RequestHeader(name = "X-Session-Id", required = false) String sessionId) {
        TokenInfo token = requireToken(sessionId);
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
    Integer code = spotifyApiService.previousTrack(token, sessionId).block();
        return ResponseEntity.status(code == null ? 500 : code).body(Map.of("status", code));
    }

    private static final Pattern SPOTIFY_TRACK_ID = Pattern.compile("^[0-9A-Za-z]{22}$");

    @PostMapping(path = "/play/track", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> playTrack(@RequestHeader(name = "X-Session-Id", required = false) String sessionId,
                                       @RequestBody Map<String, Object> body,
                                       @RequestParam(name = "deviceId", required = false) String deviceId) {
        TokenInfo token = requireToken(sessionId);
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
        if (body == null) return ResponseEntity.badRequest().body(Map.of("error", "missing_body"));
        Object raw = body.get("uri");
        if (raw == null) raw = body.get("id");
        if (raw == null) return ResponseEntity.badRequest().body(Map.of("error", "missing_uri_or_id"));
        String value = raw.toString();
        String uri = value.startsWith("spotify:track:") ? value : (SPOTIFY_TRACK_ID.matcher(value).matches() ? "spotify:track:" + value : null);
        if (uri == null) return ResponseEntity.badRequest().body(Map.of("error", "invalid_track_reference"));
        Long positionMs = null;
        if (body.containsKey("positionMs")) {
            try { positionMs = Long.parseLong(body.get("positionMs").toString()); } catch (NumberFormatException ignored) {}
        }
        String json = positionMs == null ? "{\"uris\":[\"" + uri + "\"]}" : "{\"uris\":[\"" + uri + "\"],\"position_ms\":" + positionMs + "}";
        if (deviceId != null) {
            // Pre-transfer playback if needed
            spotifyApiService.transferPlayback(token, sessionId, deviceId, false).block();
        }
        Integer code = spotifyApiService.resumeOrStartPlayback(token, sessionId, json).block();
        return ResponseEntity.status(code == null ? 500 : code).body(Map.of(
                "status", code,
                "uri", uri
        ));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestHeader(name = "X-Session-Id", required = false) String sessionId,
                                      @RequestBody Map<String, Object> body) {
        TokenInfo token = requireToken(sessionId);
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
        Object did = body.get("deviceId");
        if (did == null) return ResponseEntity.badRequest().body(Map.of("error", "missing_device_id"));
        boolean play = Boolean.TRUE.equals(body.get("play"));
        Integer code = spotifyApiService.transferPlayback(token, sessionId, did.toString(), play).block();
        return ResponseEntity.status(code == null ? 500 : code).body(Map.of("status", code));
    }

    @GetMapping("/access-token")
    public ResponseEntity<?> accessToken(@RequestHeader(name = "X-Session-Id", required = false) String sessionId) {
        TokenInfo token = requireToken(sessionId);
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "invalid_session"));
        return ResponseEntity.ok(Map.of("accessToken", token.getAccessToken(), "expiresAt", token.getExpiresAt()));
    }
}

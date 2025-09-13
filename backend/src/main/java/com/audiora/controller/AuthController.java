package com.audiora.controller;

import com.audiora.service.AuthLinkBuilder;
import com.audiora.service.SpotifyAuthService;
import com.audiora.service.YouTubeAuthService;
import com.audiora.store.InMemoryTokenStore;
import com.audiora.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthLinkBuilder authLinkBuilder;
    private final SpotifyAuthService spotifyAuthService;
    private final YouTubeAuthService youTubeAuthService;
    private final InMemoryTokenStore tokenStore;

    @Value("${spotify.clientId:}") private String spotifyClientId;
    @Value("${spotify.clientSecret:}") private String spotifyClientSecret;
    @Value("${youtube.clientId:}") private String youtubeClientId;
    @Value("${youtube.clientSecret:}") private String youtubeClientSecret;
    @Value("${app.backendBaseUrl:http://localhost:8080}") private String backendBaseUrl;
    @Value("${app.frontendBaseUrl:http://localhost:4200}") private String frontendBaseUrl;

    public AuthController(AuthLinkBuilder authLinkBuilder, SpotifyAuthService spotifyAuthService, YouTubeAuthService youTubeAuthService, InMemoryTokenStore tokenStore) {
        this.authLinkBuilder = authLinkBuilder;
        this.spotifyAuthService = spotifyAuthService;
        this.youTubeAuthService = youTubeAuthService;
        this.tokenStore = tokenStore;
    }

    @GetMapping("/spotify/login")
    public Map<String, String> spotifyLogin(@RequestParam(name = "sessionId", required = false) String sessionId) {
        return Map.of("authUrl", authLinkBuilder.buildSpotifyAuthorizeUrl(sessionId));
    }

    @GetMapping("/spotify/callback")
    public ResponseEntity<?> spotifyCallback(@RequestParam(name = "code", required = false) String code,
                                             @RequestParam(name = "error", required = false) String error,
                                             @RequestParam(name = "state", required = false) String state) {
        if (error != null) {
            return redirectError("spotify", error);
        }
        String redirectUri = backendBaseUrl + "/auth/spotify/callback";
        return spotifyAuthService.exchangeCodeForToken(spotifyClientId, spotifyClientSecret, redirectUri, code)
            .map(resp -> {
                TokenInfo ti = new TokenInfo(resp.getAccessToken(), resp.getRefreshToken(),
                    java.time.Instant.now().plusSeconds(resp.getExpiresIn()), resp.getScope(), resp.getTokenType());
                // state will carry existing session id if present
                String existingSession = (state != null && state.startsWith("sess_")) ? state.substring(5) : null;
                String sessionId = tokenStore.createOrUpdate(existingSession, Provider.SPOTIFY, ti);
                return buildRedirect(frontendBaseUrl + "?sessionId=" + sessionId + "#provider=spotify");
            })
            .block();
    }

    @GetMapping("/youtube/login")
    public Map<String, String> youtubeLogin(@RequestParam(name = "sessionId", required = false) String sessionId) {
        return Map.of("authUrl", authLinkBuilder.buildYouTubeAuthorizeUrl(sessionId));
    }

    @GetMapping("/youtube/callback")
    public ResponseEntity<?> youtubeCallback(@RequestParam(name = "code", required = false) String code,
                                             @RequestParam(name = "error", required = false) String error,
                                             @RequestParam(name = "state", required = false) String state) {
        if (error != null) {
            return redirectError("youtube", error);
        }
        String redirectUri = backendBaseUrl + "/auth/youtube/callback";
        return youTubeAuthService.exchangeCodeForToken(youtubeClientId, youtubeClientSecret, redirectUri, code)
            .map(resp -> {
                TokenInfo ti = new TokenInfo(resp.getAccessToken(), resp.getRefreshToken(),
                    java.time.Instant.now().plusSeconds(resp.getExpiresIn()), resp.getScope(), resp.getTokenType());
                String existingSession = (state != null && state.startsWith("sess_")) ? state.substring(5) : null;
                String sessionId = tokenStore.createOrUpdate(existingSession, Provider.YOUTUBE, ti);
                return buildRedirect(frontendBaseUrl + "?sessionId=" + sessionId + "#provider=youtube");
            })
            .block();
    }

    private ResponseEntity<?> buildRedirect(String target) {
        HttpHeaders h = new HttpHeaders();
        h.set(HttpHeaders.LOCATION, target);
        return new ResponseEntity<>(h, HttpStatus.FOUND);
    }

    private ResponseEntity<?> redirectError(String provider, String error) {
        return buildRedirect(frontendBaseUrl + "?authError=" + error + "#provider=" + provider);
    }
}

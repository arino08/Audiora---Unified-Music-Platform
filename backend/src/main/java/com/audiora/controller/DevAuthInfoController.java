package com.audiora.controller;

import com.audiora.service.AuthLinkBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Development-only endpoint to help verify OAuth configuration without exposing secrets.
 * Do NOT enable in production without restricting access.
 */
@RestController
@RequestMapping("/auth/dev")
public class DevAuthInfoController {

    private final AuthLinkBuilder authLinkBuilder;

    @Value("${spotify.clientId:}")
    private String spotifyClientId;
    @Value("${youtube.clientId:}")
    private String youtubeClientId;
    @Value("${app.backendBaseUrl:http://127.0.0.1:8080}")
    private String backendBaseUrl;

    public DevAuthInfoController(AuthLinkBuilder authLinkBuilder) {
        this.authLinkBuilder = authLinkBuilder;
    }

    @GetMapping("/info")
    public Map<String, Object> info() {
        String spotifyRedirect = backendBaseUrl + "/auth/spotify/callback";
        String youtubeRedirect = backendBaseUrl + "/auth/youtube/callback";
        return Map.of(
            "backendBaseUrl", backendBaseUrl,
            "spotify", Map.of(
                "clientIdPresent", !isBlank(spotifyClientId),
                "redirectUri", spotifyRedirect,
                "authSample", authLinkBuilder.buildSpotifyAuthorizeUrl()
            ),
            "youtube", Map.of(
                "clientIdPresent", !isBlank(youtubeClientId),
                "redirectUri", youtubeRedirect,
                "authSample", authLinkBuilder.buildYouTubeAuthorizeUrl()
            )
        );
    }

    private boolean isBlank(String s) { return s == null || s.isBlank(); }
}

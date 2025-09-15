package com.audiora.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class AuthLinkBuilder {

    @Value("${spotify.clientId:SPOTIFY_CLIENT_ID}")
    private String spotifyClientId;

    @Value("${app.backendBaseUrl:http://127.0.0.1:8080}")
    private String backendBaseUrl;

    @Value("${youtube.clientId:YOUTUBE_CLIENT_ID}")
    private String youtubeClientId;

    @Value("${google.clientId:GOOGLE_CLIENT_ID}")
    private String googleClientId;

    public String buildSpotifyAuthorizeUrl() { return buildSpotifyAuthorizeUrl(null); }

    public String buildSpotifyAuthorizeUrl(String existingSessionId) {
        String redirectUri = backendBaseUrl + "/api/auth/spotify/callback";
        String scopes = String.join(" ",
                "user-read-email",
                "user-read-private",
                "playlist-read-private",
                "user-read-playback-state",
                "user-modify-playback-state",
                "user-read-currently-playing",
                "streaming"
        );
        String stateVal = existingSessionId != null && !existingSessionId.isBlank() ? ("sess_" + existingSessionId) : UUID.randomUUID().toString();
        return "https://accounts.spotify.com/authorize" +
            "?response_type=code" +
            "&client_id=" + url(spotifyClientId) +
            "&scope=" + url(scopes) +
            "&redirect_uri=" + url(redirectUri) +
            "&state=" + url(stateVal);
    }

    public String buildYouTubeAuthorizeUrl() { return buildYouTubeAuthorizeUrl(null); }

    public String buildYouTubeAuthorizeUrl(String existingSessionId) {
        // Using YouTube Data API scopes plus profile access for user info
        String redirectUri = backendBaseUrl + "/api/auth/youtube/callback";
        String scopes = String.join(" ",
            "https://www.googleapis.com/auth/youtube.readonly",
            "openid",
            "profile",
            "email"
        );
        String stateVal = existingSessionId != null && !existingSessionId.isBlank() ? ("sess_" + existingSessionId) : UUID.randomUUID().toString();
        return "https://accounts.google.com/o/oauth2/v2/auth" +
            "?response_type=code" +
            "&client_id=" + url(youtubeClientId) +
            "&scope=" + url(scopes) +
            "&redirect_uri=" + url(redirectUri) +
            "&access_type=offline" +
            "&prompt=consent" +
            "&state=" + url(stateVal);
    }

    public String buildGoogleAuthorizeUrl() { return buildGoogleAuthorizeUrl(null); }

    public String buildGoogleAuthorizeUrl(String existingSessionId) {
        String redirectUri = backendBaseUrl + "/api/auth/google/callback";
        String scopes = String.join(" ",
            "openid",
            "profile",
            "email",
            "https://www.googleapis.com/auth/youtube"
        );
        String stateVal = existingSessionId != null && !existingSessionId.isBlank() ? ("sess_" + existingSessionId) : UUID.randomUUID().toString();
        return "https://accounts.google.com/o/oauth2/v2/auth" +
            "?response_type=code" +
            "&client_id=" + url(googleClientId) +
            "&scope=" + url(scopes) +
            "&redirect_uri=" + url(redirectUri) +
            "&access_type=offline" +
            "&prompt=select_account" +
            "&state=" + url(stateVal);
    }

    private String url(String v) {
        return URLEncoder.encode(v, StandardCharsets.UTF_8);
    }
}

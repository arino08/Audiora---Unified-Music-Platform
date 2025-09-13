package com.audiora.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StartupConfigValidator {
    private static final Logger log = LoggerFactory.getLogger(StartupConfigValidator.class);

    @Value("${spotify.clientId:}")
    private String spotifyClientId;
    @Value("${spotify.clientSecret:}")
    private String spotifyClientSecret;
    @Value("${youtube.clientId:}")
    private String youtubeClientId;
    @Value("${youtube.clientSecret:}")
    private String youtubeClientSecret;
    @Value("${app.backendBaseUrl:http://127.0.0.1:8080}")
    private String backendBaseUrl;

    @PostConstruct
    void validate() {
        if (isBlank(spotifyClientId)) {
            log.warn("Spotify clientId is not set. Authorization URL will be invalid.");
        }
        if (isBlank(spotifyClientSecret)) {
            log.warn("Spotify clientSecret is not set; token exchange will fail.");
        }
        if (isBlank(youtubeClientId)) {
            log.warn("YouTube clientId is not set. Authorization URL will be invalid.");
        }
        if (isBlank(youtubeClientSecret)) {
            log.warn("YouTube clientSecret is not set; token exchange will fail.");
        }
        if (backendBaseUrl.contains("localhost")) {
            log.warn("backendBaseUrl uses 'localhost'. Spotify's new redirect URI rules disallow hostname 'localhost'; switch to 127.0.0.1 (e.g. BACKEND_BASE_URL=http://127.0.0.1:8080)");
        }
    }

    private boolean isBlank(String s) { return s == null || s.isBlank(); }
}

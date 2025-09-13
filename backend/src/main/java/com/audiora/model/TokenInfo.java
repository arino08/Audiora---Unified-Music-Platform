package com.audiora.model;

import java.time.Instant;

public class TokenInfo {
    private final String accessToken;
    private final String refreshToken;
    private final Instant expiresAt;
    private final String scope;
    private final String tokenType;

    public TokenInfo(String accessToken, String refreshToken, Instant expiresAt, String scope, String tokenType) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
        this.scope = scope;
        this.tokenType = tokenType;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public Instant getExpiresAt() { return expiresAt; }
    public String getScope() { return scope; }
    public String getTokenType() { return tokenType; }
    public boolean isExpired() { return Instant.now().isAfter(expiresAt.minusSeconds(30)); }
}

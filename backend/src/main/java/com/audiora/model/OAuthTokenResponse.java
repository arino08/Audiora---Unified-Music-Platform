package com.audiora.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OAuthTokenResponse {
        @JsonProperty("access_token") private String accessToken;
        @JsonProperty("token_type") private String tokenType;
        @JsonProperty("expires_in") private long expiresIn;
        @JsonProperty("refresh_token") private String refreshToken;
        private String scope;

        public OAuthTokenResponse() {}

        public String getAccessToken() { return accessToken; }
        public String getTokenType() { return tokenType; }
        public long getExpiresIn() { return expiresIn; }
        public String getRefreshToken() { return refreshToken; }
        public String getScope() { return scope; }
}

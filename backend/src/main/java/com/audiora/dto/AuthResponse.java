package com.audiora.dto;

public class AuthResponse {
    private String token;
    private UserProfile user;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, UserProfile user) {
        this.token = token;
        this.user = user;
    }

    public AuthResponse(String message) {
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserProfile getUser() { return user; }
    public void setUser(UserProfile user) { this.user = user; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public static class UserProfile {
        private String id;
        private String email;
        private String name;
        private boolean verified;

        public UserProfile() {}

        public UserProfile(String id, String email, String name, boolean verified) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.verified = verified;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public boolean isVerified() { return verified; }
        public void setVerified(boolean verified) { this.verified = verified; }
    }
}

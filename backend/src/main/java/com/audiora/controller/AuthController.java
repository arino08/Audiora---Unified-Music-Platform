package com.audiora.controller;

import com.audiora.service.AuthLinkBuilder;
import com.audiora.service.SpotifyAuthService;
import com.audiora.service.YouTubeAuthService;
import com.audiora.service.GoogleAuthService;
import com.audiora.service.UserService;
import com.audiora.service.JwtService;
import com.audiora.store.InMemoryTokenStore;
import com.audiora.model.*;
import com.audiora.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthLinkBuilder authLinkBuilder;
    private final SpotifyAuthService spotifyAuthService;
    private final YouTubeAuthService youTubeAuthService;
    private final GoogleAuthService googleAuthService;
    private final UserService userService;
    private final InMemoryTokenStore tokenStore;
    private final JwtService jwtService;

    @Value("${spotify.clientId:}") private String spotifyClientId;
    @Value("${spotify.clientSecret:}") private String spotifyClientSecret;
    @Value("${youtube.clientId:}") private String youtubeClientId;
    @Value("${youtube.clientSecret:}") private String youtubeClientSecret;
    @Value("${google.clientId:}") private String googleClientId;
    @Value("${google.clientSecret:}") private String googleClientSecret;
    @Value("${app.backendBaseUrl:http://127.0.0.1:8080}") private String backendBaseUrl;
    @Value("${app.frontendBaseUrl:http://localhost:4200}") private String frontendBaseUrl;

    public AuthController(AuthLinkBuilder authLinkBuilder, SpotifyAuthService spotifyAuthService,
                         YouTubeAuthService youTubeAuthService, GoogleAuthService googleAuthService,
                         UserService userService, InMemoryTokenStore tokenStore, JwtService jwtService) {
        this.authLinkBuilder = authLinkBuilder;
        this.spotifyAuthService = spotifyAuthService;
        this.youTubeAuthService = youTubeAuthService;
        this.googleAuthService = googleAuthService;
        this.userService = userService;
        this.tokenStore = tokenStore;
        this.jwtService = jwtService;
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
        String redirectUri = backendBaseUrl + "/api/auth/spotify/callback";
        return spotifyAuthService.exchangeCodeForToken(spotifyClientId, spotifyClientSecret, redirectUri, code)
            .flatMap(tokenResp -> {
                // Get user info from Spotify
                return spotifyAuthService.getUserInfo(tokenResp.getAccessToken())
                    .map(userInfo -> {
                        // Create or update user in our system
                        User user = userService.createOrUpdateUser(
                            userInfo.getId(),
                            userInfo.getEmail(),
                            userInfo.getName(),
                            userInfo.getPicture(),
                            userInfo.getName(), // Use display name as given name
                            null, // Spotify doesn't provide family name
                            userInfo.getEmail() != null // Assume verified if email provided
                        );

                        // Store Spotify tokens in token store
                        TokenInfo ti = new TokenInfo(tokenResp.getAccessToken(), tokenResp.getRefreshToken(),
                            java.time.Instant.now().plusSeconds(tokenResp.getExpiresIn()),
                            tokenResp.getScope(), tokenResp.getTokenType());

                        String existingSession = (state != null && state.startsWith("sess_")) ? state.substring(5) : null;
                        String sessionId = tokenStore.createOrUpdate(existingSession, Provider.SPOTIFY, ti);

                        // Redirect with both session ID and user ID for frontend integration
                        return buildRedirect(frontendBaseUrl + "?sessionId=" + sessionId + "&userId=" + user.getId() + "#provider=spotify");
                    });
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
        String redirectUri = backendBaseUrl + "/api/auth/youtube/callback";
        return youTubeAuthService.exchangeCodeForToken(youtubeClientId, youtubeClientSecret, redirectUri, code)
            .flatMap(tokenResp -> {
                // Get user info from Google (YouTube uses Google auth)
                return youTubeAuthService.getUserInfo(tokenResp.getAccessToken())
                    .map(userInfo -> {
                        // Create or update user in our system
                        User user = userService.createOrUpdateUser(
                            userInfo.getId(),
                            userInfo.getEmail(),
                            userInfo.getName(),
                            userInfo.getPicture(),
                            userInfo.getGiven_name(),
                            userInfo.getFamily_name(),
                            userInfo.isVerified_email()
                        );

                        // Store YouTube tokens in token store
                        TokenInfo ti = new TokenInfo(tokenResp.getAccessToken(), tokenResp.getRefreshToken(),
                            java.time.Instant.now().plusSeconds(tokenResp.getExpiresIn()),
                            tokenResp.getScope(), tokenResp.getTokenType());

                        String existingSession = (state != null && state.startsWith("sess_")) ? state.substring(5) : null;
                        String sessionId = tokenStore.createOrUpdate(existingSession, Provider.YOUTUBE, ti);

                        // Redirect with both session ID and user ID for frontend integration
                        return buildRedirect(frontendBaseUrl + "?sessionId=" + sessionId + "&userId=" + user.getId() + "#provider=youtube");
                    });
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

    @GetMapping("/google/login")
    public Map<String, String> googleLogin(@RequestParam(name = "sessionId", required = false) String sessionId) {
        return Map.of("authUrl", authLinkBuilder.buildGoogleAuthorizeUrl(sessionId));
    }

    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback(@RequestParam(name = "code", required = false) String code,
                                           @RequestParam(name = "error", required = false) String error,
                                           @RequestParam(name = "state", required = false) String state) {
        if (error != null) {
            return redirectError("google", error);
        }
        String redirectUri = backendBaseUrl + "/api/auth/google/callback";
        return googleAuthService.exchangeCodeForToken(googleClientId, googleClientSecret, redirectUri, code)
            .flatMap(tokenResp -> {
                // Get user info from Google to create/update user
                return googleAuthService.getUserInfo(tokenResp.getAccessToken())
                    .map(userInfo -> {
                        // Create or update user in our system
                        User user = userService.createOrUpdateUser(
                            userInfo.getId(),
                            userInfo.getEmail(),
                            userInfo.getName(),
                            userInfo.getPicture(),
                            userInfo.getGiven_name(),
                            userInfo.getFamily_name(),
                            userInfo.isVerified_email()
                        );

                        // Store Google tokens in token store
                        TokenInfo ti = new TokenInfo(tokenResp.getAccessToken(), tokenResp.getRefreshToken(),
                            java.time.Instant.now().plusSeconds(tokenResp.getExpiresIn()),
                            tokenResp.getScope(), tokenResp.getTokenType());

                        String existingSession = (state != null && state.startsWith("sess_")) ? state.substring(5) : null;
                        String sessionId = tokenStore.createOrUpdate(existingSession, Provider.GOOGLE, ti);

                        // Redirect with both session ID and user ID for frontend integration
                        return buildRedirect(frontendBaseUrl + "?sessionId=" + sessionId + "&userId=" + user.getId() + "#provider=google");
                    });
            })
            .block();
    }

    // ============ Email/Password Authentication Endpoints ============

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Validate input
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
            }
            if (request.getPassword() == null || request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
            }

            // Create user
            userService.createUser(request.getEmail(), request.getName(), request.getPassword());

            return ResponseEntity.ok(new AuthResponse("Registration successful. Please check your email to verify your account."));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Registration failed"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            // Validate input
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }

            // Authenticate user
            Optional<User> userOpt = userService.authenticateUser(request.getEmail(), request.getPassword());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid email or password"));
            }

            User user = userOpt.get();

            // Generate JWT token
            String token = jwtService.generateToken(user.getId(), user.getEmail());

            // Create user profile response
            AuthResponse.UserProfile userProfile = new AuthResponse.UserProfile(
                    user.getId(), user.getEmail(), user.getName(), user.isEmailVerified());

            return ResponseEntity.ok(new AuthResponse(token, userProfile));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");

            if (email == null || code == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and verification code are required"));
            }

            boolean verified = userService.verifyEmail(email, code);
            if (verified) {
                return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired verification code"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Email verification failed"));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationCode(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            // Generate new verification code and send email
            String newCode = userService.generateNewVerificationCode(email);

            return ResponseEntity.ok(Map.of("message", "New verification code sent to your email"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to resend verification code"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            // Generate new verification code (we'll use this as password reset code)
            String resetCode = userService.generateNewVerificationCode(email);

            // TODO: Send reset code via email
            System.out.println("Password reset code for " + email + ": " + resetCode);

            return ResponseEntity.ok(Map.of("message", "Password reset code sent to your email"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send reset code"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            String newPassword = request.get("password");

            if (email == null || code == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email, code, and new password are required"));
            }

            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
            }

            // Verify the reset code first
            if (!userService.verifyEmail(email, code)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset code"));
            }

            // TODO: Update user password

            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Password reset failed"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // For JWT-based auth, logout is typically handled client-side by removing the token
        // We could implement a token blacklist here if needed
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authorization header required"));
            }

            String token = authHeader.substring(7);
            String userId = jwtService.getUserIdFromToken(token);

            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            AuthResponse.UserProfile userProfile = new AuthResponse.UserProfile(
                    user.getId(), user.getEmail(), user.getName(), user.isEmailVerified());

            return ResponseEntity.ok(userProfile);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }
    }

    /**
     * Exchange OAuth session for JWT token
     * This endpoint allows the frontend to convert a sessionId from OAuth callback into a JWT token
     */
    @PostMapping("/oauth/exchange")
    public ResponseEntity<?> exchangeOAuthSession(@RequestBody Map<String, String> request) {
        try {
            String sessionId = request.get("sessionId");
            String userId = request.get("userId");

            if (sessionId == null || userId == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "SessionId and userId are required"));
            }

            // Verify the user exists
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            // Verify that at least one OAuth token exists for this session
            boolean hasSpotifyToken = tokenStore.get(sessionId, Provider.SPOTIFY) != null;
            boolean hasYouTubeToken = tokenStore.get(sessionId, Provider.YOUTUBE) != null;
            boolean hasGoogleToken = tokenStore.get(sessionId, Provider.GOOGLE) != null;

            if (!hasSpotifyToken && !hasYouTubeToken && !hasGoogleToken) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "No valid OAuth session found"));
            }

            // Generate JWT token for the user
            String jwtToken = jwtService.generateToken(user.getId(), user.getEmail());

            // Create user profile response
            AuthResponse.UserProfile userProfile = new AuthResponse.UserProfile(
                    user.getId(), user.getEmail(), user.getName(), user.isEmailVerified());

            return ResponseEntity.ok(new AuthResponse(jwtToken, userProfile));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "OAuth exchange failed"));
        }
    }
}

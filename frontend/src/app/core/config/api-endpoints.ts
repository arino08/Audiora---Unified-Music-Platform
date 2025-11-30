/**
 * Audiora API Endpoints Configuration
 *
 * This file provides a centralized mapping of all backend API endpoints
 * to ensure frontend services use correct paths.
 *
 * Backend Base URL is configured via environment.apiUrl
 */

import { Provider } from "../models";

// ============================================================================
// Authentication Endpoints
// ============================================================================

export const AUTH_ENDPOINTS = {
  // OAuth Flows
  SPOTIFY_LOGIN: "/auth/spotify/login",
  SPOTIFY_CALLBACK: "/auth/spotify/callback",
  YOUTUBE_LOGIN: "/auth/youtube/login",
  YOUTUBE_CALLBACK: "/auth/youtube/callback",
  GOOGLE_LOGIN: "/auth/google/login",
  GOOGLE_CALLBACK: "/auth/google/callback",
  OAUTH_EXCHANGE: "/auth/oauth/exchange",

  // Email/Password Auth
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify",
  RESEND_VERIFICATION: "/auth/resend-verification",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Profile (via auth)
  PROFILE: "/auth/profile",
} as const;

// ============================================================================
// Spotify API Endpoints
// ============================================================================

export const SPOTIFY_ENDPOINTS = {
  // Playlists
  PLAYLISTS: "/spotify/playlists",
  PLAYLIST_TRACKS: (playlistId: string) =>
    `/spotify/playlists/${playlistId}/tracks`,

  // Search & Discovery
  SEARCH: "/spotify/search",
  RECOMMENDATIONS: "/spotify/recommendations",

  // Playback Control
  PLAYER_STATE: "/spotify/player/state",
  PLAYER_PLAY: "/spotify/player/play",
  PLAYER_PAUSE: "/spotify/player/pause",
  PLAYER_NEXT: "/spotify/player/next",
  PLAYER_PREVIOUS: "/spotify/player/previous",
  PLAYER_PLAY_TRACK: "/spotify/player/play/track",
  PLAYER_TRANSFER: "/spotify/player/transfer",
  PLAYER_ACCESS_TOKEN: "/spotify/player/access-token",
} as const;

// ============================================================================
// YouTube API Endpoints
// ============================================================================

export const YOUTUBE_ENDPOINTS = {
  // Playlists
  PLAYLISTS: "/youtube/playlists",
  PLAYLIST_ITEMS: (playlistId: string) =>
    `/youtube/playlists/${playlistId}/items`,

  // Search & Discovery
  SEARCH: "/youtube/search",
  RELATED: "/youtube/related",
} as const;

// ============================================================================
// User Endpoints
// ============================================================================

export const USER_ENDPOINTS = {
  // Profile
  GET_USER: (userId: string) => `/users/${userId}`,
  VALIDATE_TOKEN: "/users/validate",

  // Liked Tracks
  LIKED_TRACKS: (userId: string) => `/users/${userId}/liked-tracks`,
  LIKED_TRACKS_BY_PROVIDER: (userId: string, provider: string) =>
    `/users/${userId}/liked-tracks/${provider}`,
  LIKE_TRACK: (userId: string) => `/users/${userId}/liked-tracks`,
  UNLIKE_TRACK: (userId: string, provider: string, trackId: string) =>
    `/users/${userId}/liked-tracks/${provider}/${trackId}`,
  CHECK_TRACK_LIKED: (userId: string, provider: string, trackId: string) =>
    `/users/${userId}/liked-tracks/${provider}/${trackId}/status`,
  IMPORT_LIKED_TRACKS: (userId: string) =>
    `/users/${userId}/liked-tracks/import`,
  EXPORT_LIKED_TRACKS: (userId: string) =>
    `/users/${userId}/liked-tracks/export`,
  LIKED_TRACKS_COUNT: (userId: string) => `/users/${userId}/liked-tracks/count`,
} as const;

// ============================================================================
// Profile Endpoints (separate from auth profile)
// ============================================================================

export const PROFILE_ENDPOINTS = {
  GET_PROFILE: "/profile",
  UPDATE_PROFILE: "/profile",
  GET_PREFERENCES: "/profile/preferences",
  UPDATE_PREFERENCES: "/profile/preferences",
} as const;

// ============================================================================
// Utility Endpoints
// ============================================================================

export const UTILITY_ENDPOINTS = {
  HEALTH: "/health",
  DEV_AUTH_INFO: "/auth/dev/info",
} as const;

// ============================================================================
// Combined API Configuration
// ============================================================================

export const API_ENDPOINTS = {
  auth: AUTH_ENDPOINTS,
  spotify: SPOTIFY_ENDPOINTS,
  youtube: YOUTUBE_ENDPOINTS,
  user: USER_ENDPOINTS,
  profile: PROFILE_ENDPOINTS,
  utility: UTILITY_ENDPOINTS,
} as const;

// ============================================================================
// Helper Types
// ============================================================================

export interface RequestHeaders {
  "X-Session-Id"?: string;
  Authorization?: string;
  "Content-Type"?: string;
}

/**
 * Build headers for provider API requests
 */
export function buildProviderHeaders(sessionId?: string): RequestHeaders {
  const headers: RequestHeaders = {};
  if (sessionId) {
    headers["X-Session-Id"] = sessionId;
  }
  return headers;
}

/**
 * Build Authorization header with Bearer token
 */
export function buildAuthHeader(token?: string): RequestHeaders {
  const headers: RequestHeaders = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Get the appropriate search endpoint for a provider
 */
export function getSearchEndpoint(provider: Provider): string {
  switch (provider) {
    case "spotify":
      return SPOTIFY_ENDPOINTS.SEARCH;
    case "youtube":
      return YOUTUBE_ENDPOINTS.SEARCH;
    default:
      throw new Error(`Search not supported for provider: ${provider}`);
  }
}

/**
 * Get the appropriate playlists endpoint for a provider
 */
export function getPlaylistsEndpoint(provider: Provider): string {
  switch (provider) {
    case "spotify":
      return SPOTIFY_ENDPOINTS.PLAYLISTS;
    case "youtube":
      return YOUTUBE_ENDPOINTS.PLAYLISTS;
    default:
      throw new Error(`Playlists not supported for provider: ${provider}`);
  }
}

/**
 * Get the appropriate playlist tracks/items endpoint for a provider
 */
export function getPlaylistTracksEndpoint(
  provider: Provider,
  playlistId: string,
): string {
  switch (provider) {
    case "spotify":
      return SPOTIFY_ENDPOINTS.PLAYLIST_TRACKS(playlistId);
    case "youtube":
      return YOUTUBE_ENDPOINTS.PLAYLIST_ITEMS(playlistId);
    default:
      throw new Error(
        `Playlist tracks not supported for provider: ${provider}`,
      );
  }
}

/**
 * Get recommendations/related endpoint for a provider
 */
export function getRecommendationsEndpoint(provider: Provider): string {
  switch (provider) {
    case "spotify":
      return SPOTIFY_ENDPOINTS.RECOMMENDATIONS;
    case "youtube":
      return YOUTUBE_ENDPOINTS.RELATED;
    default:
      throw new Error(
        `Recommendations not supported for provider: ${provider}`,
      );
  }
}

export default API_ENDPOINTS;

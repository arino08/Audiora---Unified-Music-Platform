// ============================================================================
// Audiora Core Module Exports
// ============================================================================

// Models
export * from "./models";

// Services - export selectively to avoid conflicts with models
export { ApiService, RequestOptions } from "./services/api.service";
export { AuthService } from "./services/auth.service";
export { ThemeService, ThemeMode } from "./services/theme.service";
export { DynamicThemeService } from "./services/dynamic-theme.service";
export { PlayerService } from "./services/player.service";
export {
  MusicService,
  SearchOptions,
  RecentSearch,
} from "./services/music.service";
export {
  PlaylistService,
  PlaylistSortOption,
  PlaylistFilter,
} from "./services/playlist.service";
export { ToastService } from "./services/toast.service";

// Config - export selectively to avoid Provider conflict
export {
  AUTH_ENDPOINTS,
  SPOTIFY_ENDPOINTS,
  YOUTUBE_ENDPOINTS,
  USER_ENDPOINTS,
  PROFILE_ENDPOINTS,
  UTILITY_ENDPOINTS,
  API_ENDPOINTS,
  RequestHeaders,
  buildProviderHeaders,
  buildAuthHeader,
  getSearchEndpoint,
  getPlaylistsEndpoint,
  getPlaylistTracksEndpoint,
  getRecommendationsEndpoint,
} from "./config/api-endpoints";

// Guards
export * from "./guards/auth.guard";

// Interceptors
export * from "./interceptors/auth.interceptor";

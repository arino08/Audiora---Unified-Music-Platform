// ============================================================================
// Audiora Core Models
// ============================================================================

// ============================================================================
// User Models
// ============================================================================

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: "dark" | "light" | "system";
  language: string;
  autoPlay: boolean;
  crossfade: number;
  normalizeVolume: boolean;
  showExplicitContent: boolean;
  defaultProvider: Provider;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  newReleases: boolean;
  playlistUpdates: boolean;
  socialActivity: boolean;
  emailDigest: boolean;
}

// ============================================================================
// Authentication Models
// ============================================================================

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface OAuthExchangeRequest {
  sessionId: string;
  userId: string;
  provider: Provider;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// ============================================================================
// Provider Models
// ============================================================================

export type Provider = "spotify" | "youtube" | "google" | "local";

export interface ProviderConnection {
  provider: Provider;
  connected: boolean;
  sessionId?: string;
  displayName?: string;
  avatarUrl?: string;
  expiresAt?: number;
}

export interface ProviderToken {
  provider: Provider;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

// ============================================================================
// Track Models
// ============================================================================

export interface Track {
  id: string;
  provider: Provider;
  providerId: string;
  title: string;
  artist: string;
  artists?: Artist[];
  album?: string;
  albumId?: string;
  albumArt?: string;
  duration: number; // in milliseconds
  explicit?: boolean;
  popularity?: number;
  previewUrl?: string;
  externalUrl?: string;
  isPlayable: boolean;
  addedAt?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  provider: Provider;
  providerId: string;
}

export interface Album {
  id: string;
  provider: Provider;
  providerId: string;
  name: string;
  artist: string;
  artists?: Artist[];
  imageUrl?: string;
  releaseDate?: string;
  totalTracks?: number;
  tracks?: Track[];
}

// ============================================================================
// Playlist Models
// ============================================================================

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  owner: PlaylistOwner;
  provider: Provider;
  providerId?: string;
  isPublic: boolean;
  isCollaborative: boolean;
  totalTracks: number;
  tracks?: PlaylistTrack[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistOwner {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface PlaylistTrack {
  track: Track;
  addedAt: string;
  addedBy?: PlaylistOwner;
  position: number;
}

export interface CreatePlaylistRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdatePlaylistRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

// ============================================================================
// Liked Tracks Models
// ============================================================================

export interface LikedTrack {
  id: string;
  userId: string;
  trackId: string;
  provider: Provider;
  trackData: Track;
  likedAt: string;
}

export interface LikeTrackRequest {
  trackId: string;
  provider: Provider;
  trackData: Track;
}

// ============================================================================
// Player Models
// ============================================================================

export interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  position: number; // in milliseconds
  duration: number; // in milliseconds
  volume: number; // 0-1
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  activeDevice: Device | null;
}

export type RepeatMode = "off" | "track" | "context";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  isActive: boolean;
  volumePercent: number;
}

export type DeviceType = "computer" | "smartphone" | "speaker" | "tv" | "web";

export interface PlayRequest {
  trackId?: string;
  trackIds?: string[];
  contextUri?: string;
  offset?: number;
  positionMs?: number;
}

// ============================================================================
// Search Models
// ============================================================================

export interface SearchRequest {
  query: string;
  types?: SearchType[];
  providers?: Provider[];
  limit?: number;
  offset?: number;
}

export type SearchType = "track" | "artist" | "album" | "playlist";

export interface SearchResults {
  query: string;
  tracks: SearchResultGroup<Track>;
  artists: SearchResultGroup<Artist>;
  albums: SearchResultGroup<Album>;
  playlists: SearchResultGroup<Playlist>;
}

export interface SearchResultGroup<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  provider?: Provider;
}

export interface UnifiedSearchResults {
  query: string;
  spotify?: SearchResults;
  youtube?: SearchResults;
}

// ============================================================================
// API Response Models
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================================================
// Theme Models
// ============================================================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  background: string;
  surface: string;
  text: string;
}

export interface DynamicTheme {
  isActive: boolean;
  colors: ThemeColors;
  sourceImage?: string;
}

// ============================================================================
// UI State Models
// ============================================================================

export interface UIState {
  sidebarCollapsed: boolean;
  queueVisible: boolean;
  nowPlayingExpanded: boolean;
  searchFocused: boolean;
  modalStack: string[];
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  callback: () => void;
}

// ============================================================================
// Utility Types
// ============================================================================

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

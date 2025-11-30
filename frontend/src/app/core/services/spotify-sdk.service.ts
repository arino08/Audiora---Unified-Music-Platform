import { Injectable, signal, computed, NgZone, inject } from "@angular/core";
import {
  Subject,
  firstValueFrom,
  catchError,
  of,
  timeout,
  TimeoutError,
} from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../../environments/environment";

declare global {
  interface Window {
    Spotify: typeof Spotify;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

declare namespace Spotify {
  class Player {
    constructor(options: PlayerOptions);
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, callback: (state: any) => void): boolean;
    removeListener(event: string, callback?: (state: any) => void): boolean;
    getCurrentState(): Promise<PlaybackState | null>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
    activateElement(): Promise<void>;
  }

  interface PlayerOptions {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }

  interface PlaybackState {
    context: {
      uri: string | null;
      metadata: Record<string, unknown>;
    };
    disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
    };
    duration: number;
    paused: boolean;
    position: number;
    repeat_mode: number;
    shuffle: boolean;
    track_window: {
      current_track: Track;
      previous_tracks: Track[];
      next_tracks: Track[];
    };
  }

  interface Track {
    uri: string;
    id: string;
    type: string;
    media_type: string;
    name: string;
    is_playable: boolean;
    album: {
      uri: string;
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
    };
    artists: Array<{ uri: string; name: string }>;
    duration_ms: number;
  }

  interface WebPlaybackError {
    message: string;
  }
}

export interface SpotifyPlayerState {
  isReady: boolean;
  isConnected: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  deviceId: string | null;
  currentTrack: SpotifyTrackInfo | null;
  position: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeatMode: number;
}

export interface SpotifyTrackInfo {
  id: string;
  uri: string;
  name: string;
  artist: string;
  artists: string[];
  album: string;
  albumArt: string;
  duration: number;
  isPlayable: boolean;
}

@Injectable({
  providedIn: "root",
})
export class SpotifySdkService {
  private readonly ngZone = inject(NgZone);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  private player: Spotify.Player | null = null;
  private sdkReady = false;
  private pendingConnection = false;
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private lastKnownPosition = 0;
  private lastUpdateTime = 0;

  // State signal
  private stateSignal = signal<SpotifyPlayerState>({
    isReady: false,
    isConnected: false,
    isPlaying: false,
    isPaused: true,
    deviceId: null,
    currentTrack: null,
    position: 0,
    duration: 0,
    volume: 0.5,
    shuffle: false,
    repeatMode: 0,
  });

  // Public computed signals
  readonly state = computed(() => this.stateSignal());
  readonly isReady = computed(() => this.stateSignal().isReady);
  readonly isConnected = computed(() => this.stateSignal().isConnected);
  readonly isPlaying = computed(() => this.stateSignal().isPlaying);
  readonly isPaused = computed(() => this.stateSignal().isPaused);
  readonly deviceId = computed(() => this.stateSignal().deviceId);
  readonly currentTrack = computed(() => this.stateSignal().currentTrack);
  readonly position = computed(() => this.stateSignal().position);
  readonly duration = computed(() => this.stateSignal().duration);
  readonly volume = computed(() => this.stateSignal().volume);

  // Events
  readonly trackEnded$ = new Subject<void>();
  readonly trackChanged$ = new Subject<SpotifyTrackInfo | null>();
  readonly playerError$ = new Subject<string>();
  readonly stateChanged$ = new Subject<SpotifyPlayerState>();
  readonly deviceReady$ = new Subject<string>();

  constructor() {
    this.loadSpotifySDK();
  }

  /**
   * Load the Spotify Web Playback SDK script
   */
  private loadSpotifySDK(): void {
    if (window.Spotify) {
      this.sdkReady = true;
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="spotify.com/player"]')) {
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      this.ngZone.run(() => {
        this.sdkReady = true;
        if (this.pendingConnection) {
          this.connect();
          this.pendingConnection = false;
        }
      });
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.head.appendChild(script);
  }

  /**
   * Initialize and connect the Spotify player
   */
  async connect(): Promise<boolean> {
    if (!this.sdkReady) {
      this.pendingConnection = true;
      return false;
    }

    if (this.player) {
      return true;
    }

    return new Promise((resolve) => {
      this.player = new window.Spotify.Player({
        name: "Audiora Web Player",
        getOAuthToken: async (cb) => {
          const token = await this.getAccessToken();
          if (token) {
            cb(token);
          }
        },
        volume: 0.5,
      });

      // Error handling
      this.player.addListener(
        "initialization_error",
        ({ message }: Spotify.WebPlaybackError) => {
          this.ngZone.run(() => {
            console.error("Spotify SDK initialization error:", message);
            this.playerError$.next(`Initialization error: ${message}`);
            resolve(false);
          });
        },
      );

      this.player.addListener(
        "authentication_error",
        ({ message }: Spotify.WebPlaybackError) => {
          this.ngZone.run(() => {
            console.error("Spotify SDK authentication error:", message);
            this.playerError$.next(`Authentication error: ${message}`);
            resolve(false);
          });
        },
      );

      this.player.addListener(
        "account_error",
        ({ message }: Spotify.WebPlaybackError) => {
          this.ngZone.run(() => {
            console.error("Spotify SDK account error:", message);
            this.playerError$.next(
              "Spotify Premium Required: The Web Playback SDK requires a Spotify Premium account. Free accounts cannot play music directly in the browser.",
            );
            resolve(false);
          });
        },
      );

      this.player.addListener(
        "playback_error",
        ({ message }: Spotify.WebPlaybackError) => {
          this.ngZone.run(() => {
            console.error("Spotify SDK playback error:", message);
            // Don't show error for "no list was loaded" - it's not a real error
            if (message?.includes("no list was loaded")) {
              console.log(
                "Ignoring 'no list was loaded' error - will load track via API",
              );
              return;
            }
            this.playerError$.next(`Spotify playback error: ${message}`);
          });
        },
      );

      // Ready event
      this.player.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          this.ngZone.run(() => {
            console.log("Spotify SDK ready with device ID:", device_id);
            this.stateSignal.update((state) => ({
              ...state,
              isReady: true,
              isConnected: true,
              deviceId: device_id,
            }));
            this.deviceReady$.next(device_id);
            resolve(true);
          });
        },
      );

      // Not ready event
      this.player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          this.ngZone.run(() => {
            console.log("Spotify SDK device has gone offline:", device_id);
            this.stateSignal.update((state) => ({
              ...state,
              isReady: false,
              isConnected: false,
            }));
          });
        },
      );

      // State change event
      this.player.addListener(
        "player_state_changed",
        (state: Spotify.PlaybackState | null) => {
          this.ngZone.run(() => {
            this.handleStateChange(state);
          });
        },
      );

      // Connect to the player
      this.player.connect();
    });
  }

  /**
   * Handle playback state changes
   */
  private handleStateChange(state: Spotify.PlaybackState | null): void {
    if (!state) {
      this.stopProgressTracking();
      this.stateSignal.update((s) => ({
        ...s,
        isPlaying: false,
        isPaused: true,
        currentTrack: null,
        position: 0,
        duration: 0,
      }));
      return;
    }

    const currentTrack = state.track_window.current_track;
    const trackInfo: SpotifyTrackInfo | null = currentTrack
      ? {
          id: currentTrack.id,
          uri: currentTrack.uri,
          name: currentTrack.name,
          artist: currentTrack.artists.map((a) => a.name).join(", "),
          artists: currentTrack.artists.map((a) => a.name),
          album: currentTrack.album.name,
          albumArt: currentTrack.album.images[0]?.url || "",
          duration: currentTrack.duration_ms,
          isPlayable: currentTrack.is_playable,
        }
      : null;

    const prevTrack = this.stateSignal().currentTrack;
    const isPlaying = !state.paused;

    // Track playback position
    this.lastKnownPosition = state.position;
    this.lastUpdateTime = Date.now();

    this.stateSignal.update((s) => ({
      ...s,
      isPlaying,
      isPaused: state.paused,
      currentTrack: trackInfo,
      position: state.position,
      duration: state.duration,
      shuffle: state.shuffle,
      repeatMode: state.repeat_mode,
    }));

    // Emit track changed if different track
    if (trackInfo?.id !== prevTrack?.id) {
      this.trackChanged$.next(trackInfo);
    }

    // Handle progress tracking
    if (isPlaying) {
      this.startProgressTracking();
    } else {
      this.stopProgressTracking();
    }

    // Check if track ended (position near end and paused)
    if (state.paused && state.position === 0 && prevTrack && !trackInfo) {
      this.trackEnded$.next();
    }

    this.stateChanged$.next(this.stateSignal());
  }

  /**
   * Start tracking playback progress
   */
  private startProgressTracking(): void {
    this.stopProgressTracking();

    this.progressInterval = setInterval(() => {
      if (this.stateSignal().isPlaying) {
        const elapsed = Date.now() - this.lastUpdateTime;
        const estimatedPosition = this.lastKnownPosition + elapsed;

        this.stateSignal.update((state) => ({
          ...state,
          position: Math.min(estimatedPosition, state.duration),
        }));
      }
    }, 500);
  }

  /**
   * Stop tracking playback progress
   */
  private stopProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * Get access token from the backend
   */
  private async getAccessToken(): Promise<string | null> {
    const sessionId = this.authService.getProviderSession("spotify");
    if (!sessionId) {
      console.warn("No Spotify session found - please connect Spotify first");
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.http
          .get<{ accessToken: string; error?: string; message?: string }>(
            `${this.apiUrl}/spotify/token`,
            {
              headers: { "X-Session-Id": sessionId },
            },
          )
          .pipe(
            catchError((err) => {
              console.error("[SpotifySDK] getAccessToken error:", err);
              throw err;
            }),
          ),
      );
      return response?.accessToken || null;
    } catch (error: any) {
      // Check if this is a token refresh issue that requires re-authentication
      const errorBody = error?.error;
      if (
        errorBody?.error === "token_expired_no_refresh" ||
        errorBody?.error === "token_expired" ||
        errorBody?.action === "reconnect" ||
        errorBody?.message?.includes("refresh token") ||
        errorBody?.message?.includes("reconnect")
      ) {
        console.error(
          "Spotify session expired - please disconnect and reconnect Spotify from Settings",
        );
        this.playerError$.next(
          "Spotify session expired. Please go to Settings, disconnect Spotify, and reconnect to continue playback.",
        );
      } else if (errorBody?.error === "invalid_session") {
        console.error("Invalid Spotify session - please connect Spotify");
        this.playerError$.next(
          "Spotify not connected. Please connect Spotify from Settings.",
        );
      } else {
        console.error("Failed to get Spotify access token:", error);
        this.playerError$.next(
          "Failed to connect to Spotify. Please try reconnecting from Settings.",
        );
      }
      return null;
    }
  }

  /**
   * Play a track by URI
   */
  async playTrack(trackUri: string): Promise<void> {
    console.log("[SpotifySDK] playTrack called with URI:", trackUri);

    const deviceId = this.stateSignal().deviceId;
    console.log("[SpotifySDK] Current device ID:", deviceId);
    console.log("[SpotifySDK] Current state:", this.stateSignal());

    if (!deviceId) {
      console.error("[SpotifySDK] No Spotify device available");
      this.playerError$.next(
        "Spotify player not ready. Please wait a moment and try again.",
      );
      return;
    }

    const sessionId = this.authService.getProviderSession("spotify");
    console.log("[SpotifySDK] Session ID:", sessionId ? "present" : "missing");

    if (!sessionId) {
      console.error("[SpotifySDK] Spotify not connected - no session");
      this.playerError$.next(
        "Spotify not connected. Please connect Spotify from Settings.",
      );
      return;
    }

    console.log("[SpotifySDK] Getting access token...");
    const accessToken = await this.getAccessToken();
    console.log(
      "[SpotifySDK] Access token:",
      accessToken ? "obtained" : "failed",
    );

    if (!accessToken) {
      console.error("[SpotifySDK] Failed to get access token");
      return;
    }

    try {
      // First, transfer playback to this device to ensure it's active
      console.log("[SpotifySDK] Transferring playback to device:", deviceId);
      console.log(
        "[SpotifySDK] Using access token:",
        accessToken.substring(0, 20) + "...",
      );

      // Using native fetch to bypass any Angular HttpClient issues
      try {
        console.log("[SpotifySDK] Making transfer request with fetch...");
        const transferResponse = await fetch(
          "https://api.spotify.com/v1/me/player",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              device_ids: [deviceId],
              play: false,
            }),
          },
        );
        console.log(
          "[SpotifySDK] Transfer response status:",
          transferResponse.status,
        );
        if (!transferResponse.ok && transferResponse.status !== 204) {
          const errorText = await transferResponse.text();
          console.error("[SpotifySDK] Transfer error response:", errorText);
        }
      } catch (transferErr) {
        console.warn(
          "[SpotifySDK] Transfer failed, continuing anyway:",
          transferErr,
        );
      }

      // Small delay to ensure device is active
      console.log("[SpotifySDK] Waiting 500ms for device activation...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Now play the track
      const playUrl = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
      console.log("[SpotifySDK] Sending play request for:", trackUri);
      console.log("[SpotifySDK] Play URL:", playUrl);

      console.log("[SpotifySDK] Making play request with fetch...");
      const playResponse = await fetch(playUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });

      console.log("[SpotifySDK] Play response status:", playResponse.status);

      if (!playResponse.ok && playResponse.status !== 204) {
        const errorText = await playResponse.text();
        console.error("[SpotifySDK] Play error response:", errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw { status: playResponse.status, error: errorJson };
        } catch {
          throw { status: playResponse.status, message: errorText };
        }
      }

      console.log(
        "[SpotifySDK] Spotify playback started successfully for:",
        trackUri,
      );
    } catch (error: any) {
      console.error("[SpotifySDK] Failed to play track:", error);
      console.error("[SpotifySDK] Error status:", error?.status);
      console.error("[SpotifySDK] Error body:", error?.error);
      console.error(
        "[SpotifySDK] Full error object:",
        JSON.stringify(error, null, 2),
      );

      // Check for specific error types
      if (error?.status === 404) {
        this.playerError$.next(
          "Spotify player not found. Please make sure Spotify is open.",
        );
      } else if (error?.status === 403) {
        this.playerError$.next(
          "Spotify Premium is required for playback. Please upgrade your account.",
        );
      } else if (error?.error?.error?.reason === "PREMIUM_REQUIRED") {
        this.playerError$.next(
          "Spotify Premium is required for Web Playback SDK.",
        );
      } else if (error?.status === 502 || error?.status === 503) {
        this.playerError$.next(
          "Spotify service temporarily unavailable. Please try again.",
        );
      } else if (error?.status === 401) {
        this.playerError$.next(
          "Spotify session expired. Please reconnect Spotify from Settings.",
        );
      } else {
        this.playerError$.next(
          `Failed to start Spotify playback: ${error?.error?.error?.message || error?.message || "Unknown error"}`,
        );
      }
    }
  }

  /**
   * Play multiple tracks
   */
  async playTracks(trackUris: string[], offset = 0): Promise<void> {
    const deviceId = this.stateSignal().deviceId;
    if (!deviceId) {
      console.error("No Spotify device available");
      this.playerError$.next(
        "Spotify player not ready. Please wait a moment and try again.",
      );
      return;
    }

    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      console.error("Failed to get access token");
      return;
    }

    try {
      // First, transfer playback to this device to ensure it's active
      await firstValueFrom(
        this.http
          .put(
            "https://api.spotify.com/v1/me/player",
            {
              device_ids: [deviceId],
              play: false,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              responseType: "text" as const,
            },
          )
          .pipe(
            catchError((err) => {
              console.error("[SpotifySDK] playTracks transfer error:", err);
              throw err;
            }),
          ),
      ).catch(() => null); // Continue even if transfer fails

      // Small delay to ensure device is active
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Now play the tracks
      await firstValueFrom(
        this.http
          .put(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
              uris: trackUris,
              offset: { position: offset },
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              responseType: "text" as const,
            },
          )
          .pipe(
            catchError((err) => {
              console.error("[SpotifySDK] playTracks play error:", err);
              throw err;
            }),
          ),
      );

      console.log(
        "Spotify playback started successfully with",
        trackUris.length,
        "tracks",
      );
    } catch (error: any) {
      console.error("Failed to play tracks:", error);

      if (
        error?.status === 403 ||
        error?.error?.error?.reason === "PREMIUM_REQUIRED"
      ) {
        this.playerError$.next(
          "Spotify Premium is required for Web Playback SDK.",
        );
      } else {
        this.playerError$.next(
          "Failed to start Spotify playback. Please try again.",
        );
      }
    }
  }

  /**
   * Resume playback
   */
  async resume(): Promise<void> {
    try {
      const state = await this.player?.getCurrentState();
      if (!state) {
        console.warn("No Spotify playback state - nothing to resume");
        return;
      }
      await this.player?.resume();
    } catch (error: any) {
      console.error("Spotify resume error:", error);
      if (error?.message?.includes("no list was loaded")) {
        this.playerError$.next(
          "No track loaded. Please select a track to play.",
        );
      }
    }
  }

  /**
   * Pause playback
   */
  async pause(): Promise<void> {
    try {
      const state = await this.player?.getCurrentState();
      if (!state) {
        console.warn("No Spotify playback state - nothing to pause");
        return;
      }
      await this.player?.pause();
    } catch (error: any) {
      console.error("Spotify pause error:", error);
      if (error?.message?.includes("no list was loaded")) {
        // Silently ignore - nothing is playing anyway
        return;
      }
    }
  }

  /**
   * Toggle play/pause
   */
  async togglePlay(): Promise<void> {
    try {
      const state = await this.player?.getCurrentState();
      if (!state) {
        console.warn("No Spotify playback state - nothing to toggle");
        this.playerError$.next(
          "No track loaded. Please select a track to play.",
        );
        return;
      }
      await this.player?.togglePlay();
    } catch (error: any) {
      console.error("Spotify togglePlay error:", error);
      if (error?.message?.includes("no list was loaded")) {
        this.playerError$.next(
          "No track loaded. Please select a track to play.",
        );
      }
    }
  }

  /**
   * Seek to position in milliseconds
   */
  async seek(positionMs: number): Promise<void> {
    await this.player?.seek(positionMs);
    this.lastKnownPosition = positionMs;
    this.lastUpdateTime = Date.now();
  }

  /**
   * Skip to next track
   */
  async nextTrack(): Promise<void> {
    await this.player?.nextTrack();
  }

  /**
   * Skip to previous track
   */
  async previousTrack(): Promise<void> {
    await this.player?.previousTrack();
  }

  /**
   * Set volume (0-1)
   */
  async setVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    await this.player?.setVolume(clampedVolume);

    this.stateSignal.update((state) => ({
      ...state,
      volume: clampedVolume,
    }));
  }

  /**
   * Get current volume
   */
  async getVolume(): Promise<number> {
    return (await this.player?.getVolume()) || 0;
  }

  /**
   * Transfer playback to this device
   */
  async transferPlayback(play = true): Promise<void> {
    const deviceId = this.stateSignal().deviceId;
    if (!deviceId) {
      return;
    }

    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        console.error("[SpotifySDK] transferPlayback: No access token");
        return;
      }

      await firstValueFrom(
        this.http
          .put(
            "https://api.spotify.com/v1/me/player",
            {
              device_ids: [deviceId],
              play,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              responseType: "text" as const,
            },
          )
          .pipe(
            catchError((err) => {
              console.error("[SpotifySDK] transferPlayback error:", err);
              throw err;
            }),
          ),
      );
    } catch (error) {
      console.error("Failed to transfer playback:", error);
    }
  }

  /**
   * Activate the player element (required for autoplay)
   */
  async activateElement(): Promise<void> {
    await this.player?.activateElement();
  }

  /**
   * Check if SDK is connected and ready
   */
  isPlayerReady(): boolean {
    return this.stateSignal().isReady && this.stateSignal().isConnected;
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    this.stopProgressTracking();
    this.player?.disconnect();
    this.player = null;

    this.stateSignal.update((state) => ({
      ...state,
      isReady: false,
      isConnected: false,
      deviceId: null,
      currentTrack: null,
      position: 0,
      duration: 0,
    }));
  }
}

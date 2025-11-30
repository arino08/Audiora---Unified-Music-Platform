import { Injectable, signal, computed, inject, effect } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, interval, takeUntil } from "rxjs";
import { Track, PlayerState, RepeatMode, Device, Provider } from "../models";
import { AuthService } from "./auth.service";
import { environment } from "../../../environments/environment";

const STORAGE_KEYS = {
  VOLUME: "audiora_player_volume",
  MUTED: "audiora_player_muted",
  SHUFFLE: "audiora_player_shuffle",
  REPEAT: "audiora_player_repeat",
  QUEUE: "audiora_player_queue",
  QUEUE_INDEX: "audiora_player_queue_index",
};

export interface PlaybackSource {
  type: "local" | "spotify-sdk" | "youtube-embed" | "spotify-api";
  isActive: boolean;
}

@Injectable({
  providedIn: "root",
})
export class PlayerService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  // Player state using signals
  private playerStateSignal = signal<PlayerState>({
    isPlaying: false,
    isPaused: false,
    currentTrack: null,
    queue: [],
    queueIndex: -1,
    position: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isShuffled: false,
    repeatMode: "off",
    activeDevice: null,
  });

  // Current playback source
  private playbackSource = signal<PlaybackSource>({
    type: "local",
    isActive: false,
  });

  // Progress tracking
  private progressTimer$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  // Audio element for local playback (preview URLs)
  private audioElement: HTMLAudioElement | null = null;

  // References to SDK services (lazy loaded to avoid circular deps)
  private youtubePlayerService: any = null;
  private spotifySdkService: any = null;

  // Public computed signals
  readonly playerState = computed(() => this.playerStateSignal());
  readonly currentTrack = computed(() => this.playerStateSignal().currentTrack);
  readonly isPlaying = computed(() => this.playerStateSignal().isPlaying);
  readonly isPaused = computed(() => this.playerStateSignal().isPaused);
  readonly position = computed(() => this.playerStateSignal().position);
  readonly duration = computed(() => this.playerStateSignal().duration);
  readonly volume = computed(() => this.playerStateSignal().volume);
  readonly isMuted = computed(() => this.playerStateSignal().isMuted);
  readonly isShuffled = computed(() => this.playerStateSignal().isShuffled);
  readonly repeatMode = computed(() => this.playerStateSignal().repeatMode);
  readonly queue = computed(() => this.playerStateSignal().queue);
  readonly queueIndex = computed(() => this.playerStateSignal().queueIndex);
  readonly currentPlaybackSource = computed(() => this.playbackSource());

  // Progress percentage (0-100)
  readonly progressPercent = computed(() => {
    const state = this.playerStateSignal();
    if (state.duration === 0) return 0;
    return (state.position / state.duration) * 100;
  });

  // Formatted time strings
  readonly currentTimeFormatted = computed(() =>
    this.formatTime(this.position()),
  );
  readonly durationFormatted = computed(() => this.formatTime(this.duration()));

  // Has previous/next tracks
  readonly hasPrevious = computed(() => {
    const state = this.playerStateSignal();
    return state.queueIndex > 0 || state.repeatMode !== "off";
  });

  readonly hasNext = computed(() => {
    const state = this.playerStateSignal();
    return (
      state.queueIndex < state.queue.length - 1 || state.repeatMode !== "off"
    );
  });

  // Events for components to subscribe to
  readonly trackChanged$ = new Subject<Track | null>();
  readonly playbackStarted$ = new Subject<Track>();
  readonly playbackPaused$ = new Subject<void>();
  readonly playbackEnded$ = new Subject<void>();
  readonly queueUpdated$ = new Subject<Track[]>();
  readonly youtubeVideoRequested$ = new Subject<string>();
  readonly spotifySdkRequested$ = new Subject<string>();

  constructor() {
    this.initializeFromStorage();
    this.setupAudioElement();

    // Save state changes to localStorage
    effect(() => {
      const state = this.playerStateSignal();
      this.saveToStorage(state);
    });
  }

  // ============================================================================
  // SDK Service Setters (called from components to avoid circular deps)
  // ============================================================================

  setYouTubePlayerService(service: any): void {
    this.youtubePlayerService = service;
    if (service) {
      service.videoEnded$.subscribe(() => {
        this.handleTrackEnded();
      });
      service.stateChanged$.subscribe((state: any) => {
        // Always sync state when YouTube is the active source
        if (this.playbackSource().type === "youtube-embed") {
          this.playerStateSignal.update((s) => ({
            ...s,
            position: state.currentTime,
            duration: state.duration > 0 ? state.duration : s.duration,
            isPlaying: state.isPlaying,
            isPaused: state.isPaused,
          }));

          // Stop local progress tracking when YouTube handles it
          if (state.isPlaying) {
            this.stopProgressTracking();
          }
        }
      });
    }
  }

  setSpotifySdkService(service: any): void {
    this.spotifySdkService = service;
    if (service) {
      service.trackEnded$.subscribe(() => {
        this.handleTrackEnded();
      });
      service.stateChanged$.subscribe((state: any) => {
        // Always sync state when Spotify SDK is the active source
        if (this.playbackSource().type === "spotify-sdk") {
          this.playerStateSignal.update((s) => ({
            ...s,
            position: state.position,
            duration: state.duration > 0 ? state.duration : s.duration,
            isPlaying: state.isPlaying,
            isPaused: state.isPaused,
          }));

          // Stop local progress tracking when SDK handles it
          if (state.isPlaying) {
            this.stopProgressTracking();
          }
        }
      });

      // Listen for device ready event
      service.deviceReady$.subscribe((deviceId: string) => {
        console.log("Spotify SDK device ready:", deviceId);
      });
    }
  }

  // ============================================================================
  // Playback Controls
  // ============================================================================

  /**
   * Play a single track
   */
  play(track: Track): void {
    this.setQueue([track], 0);
    this.startPlayback(track);
  }

  /**
   * Play multiple tracks starting from an index
   */
  playTracks(tracks: Track[], startIndex = 0): void {
    if (tracks.length === 0) return;

    const queue = this.isShuffled() ? this.shuffleArray([...tracks]) : tracks;
    this.setQueue(queue, startIndex);
    this.startPlayback(queue[startIndex]);
  }

  /**
   * Add track to end of queue
   */
  addToQueue(track: Track): void {
    this.playerStateSignal.update((state) => ({
      ...state,
      queue: [...state.queue, track],
    }));
    this.queueUpdated$.next(this.queue());
  }

  /**
   * Add track to play next
   */
  playNext(track: Track): void {
    this.playerStateSignal.update((state) => {
      const newQueue = [...state.queue];
      newQueue.splice(state.queueIndex + 1, 0, track);
      return { ...state, queue: newQueue };
    });
    this.queueUpdated$.next(this.queue());
  }

  /**
   * Remove track from queue
   */
  removeFromQueue(index: number): void {
    this.playerStateSignal.update((state) => {
      const newQueue = state.queue.filter((_, i) => i !== index);
      let newIndex = state.queueIndex;

      // Adjust index if we removed a track before current
      if (index < state.queueIndex) {
        newIndex--;
      } else if (index === state.queueIndex && newQueue.length > 0) {
        // If we removed current track, play next one
        newIndex = Math.min(newIndex, newQueue.length - 1);
      }

      return { ...state, queue: newQueue, queueIndex: newIndex };
    });
    this.queueUpdated$.next(this.queue());
  }

  /**
   * Reorder the queue (used by drag-and-drop)
   */
  reorderQueue(newQueue: Track[]): void {
    const currentTrack = this.currentTrack();
    let newIndex = this.queueIndex();

    // Find the current track's new position
    if (currentTrack) {
      const foundIndex = newQueue.findIndex(
        (t) => t.id === currentTrack.id && t.provider === currentTrack.provider,
      );
      if (foundIndex !== -1) {
        newIndex = foundIndex;
      }
    }

    this.playerStateSignal.update((state) => ({
      ...state,
      queue: newQueue,
      queueIndex: newIndex,
    }));
    this.queueUpdated$.next(newQueue);
  }

  /**
   * Clear the queue
   */
  clearQueue(): void {
    this.stop();
    this.playerStateSignal.update((state) => ({
      ...state,
      queue: [],
      queueIndex: -1,
    }));
    this.queueUpdated$.next([]);
  }

  /**
   * Resume playback
   */
  resume(): void {
    const track = this.currentTrack();
    if (!track) return;

    const source = this.playbackSource();

    switch (source.type) {
      case "local":
        this.audioElement?.play();
        break;
      case "youtube-embed":
        this.youtubePlayerService?.play();
        break;
      case "spotify-sdk":
        this.spotifySdkService?.resume();
        break;
      case "spotify-api":
        this.resumeProviderPlayback(track.provider);
        break;
    }

    this.playerStateSignal.update((state) => ({
      ...state,
      isPlaying: true,
      isPaused: false,
    }));
    this.startProgressTracking();
  }

  /**
   * Pause playback
   */
  pause(): void {
    const track = this.currentTrack();
    if (!track) return;

    const source = this.playbackSource();

    switch (source.type) {
      case "local":
        this.audioElement?.pause();
        break;
      case "youtube-embed":
        this.youtubePlayerService?.pause();
        break;
      case "spotify-sdk":
        this.spotifySdkService?.pause();
        break;
      case "spotify-api":
        this.pauseProviderPlayback(track.provider);
        break;
    }

    this.playerStateSignal.update((state) => ({
      ...state,
      isPlaying: false,
      isPaused: true,
    }));
    this.stopProgressTracking();
    this.playbackPaused$.next();
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Stop playback
   */
  stop(): void {
    const source = this.playbackSource();

    switch (source.type) {
      case "local":
        if (this.audioElement) {
          this.audioElement.pause();
          this.audioElement.currentTime = 0;
        }
        break;
      case "youtube-embed":
        this.youtubePlayerService?.stop();
        break;
      case "spotify-sdk":
        this.spotifySdkService?.pause();
        break;
    }

    this.stopProgressTracking();
    this.playerStateSignal.update((state) => ({
      ...state,
      isPlaying: false,
      isPaused: false,
      position: 0,
    }));
    this.playbackEnded$.next();
  }

  /**
   * Skip to next track
   */
  next(): void {
    const state = this.playerStateSignal();
    let nextIndex = state.queueIndex + 1;

    if (nextIndex >= state.queue.length) {
      if (state.repeatMode === "context") {
        nextIndex = 0; // Loop back to start
      } else {
        this.stop();
        return;
      }
    }

    this.playerStateSignal.update((s) => ({ ...s, queueIndex: nextIndex }));
    this.startPlayback(state.queue[nextIndex]);
  }

  /**
   * Skip to previous track
   */
  previous(): void {
    const state = this.playerStateSignal();

    // If more than 3 seconds in, restart current track
    if (state.position > 3000) {
      this.seek(0);
      return;
    }

    let prevIndex = state.queueIndex - 1;

    if (prevIndex < 0) {
      if (state.repeatMode === "context") {
        prevIndex = state.queue.length - 1;
      } else {
        this.seek(0);
        return;
      }
    }

    this.playerStateSignal.update((s) => ({ ...s, queueIndex: prevIndex }));
    this.startPlayback(state.queue[prevIndex]);
  }

  /**
   * Seek to position (in milliseconds)
   */
  seek(positionMs: number): void {
    const track = this.currentTrack();
    if (!track) return;

    const clampedPosition = Math.max(0, Math.min(positionMs, this.duration()));
    const source = this.playbackSource();

    switch (source.type) {
      case "local":
        if (this.audioElement) {
          this.audioElement.currentTime = clampedPosition / 1000;
        }
        break;
      case "youtube-embed":
        this.youtubePlayerService?.seek(clampedPosition);
        break;
      case "spotify-sdk":
        this.spotifySdkService?.seek(clampedPosition);
        break;
      case "spotify-api":
        this.seekProviderPlayback(track.provider, clampedPosition);
        break;
    }

    this.playerStateSignal.update((state) => ({
      ...state,
      position: clampedPosition,
    }));
  }

  /**
   * Seek by percentage (0-100)
   */
  seekPercent(percent: number): void {
    const position = (percent / 100) * this.duration();
    this.seek(position);
  }

  // ============================================================================
  // Volume Controls
  // ============================================================================

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));

    if (this.audioElement) {
      this.audioElement.volume = clampedVolume;
    }

    // Set volume on active player
    const source = this.playbackSource();
    if (source.type === "youtube-embed" && this.youtubePlayerService) {
      this.youtubePlayerService.setVolume(clampedVolume * 100);
    } else if (source.type === "spotify-sdk" && this.spotifySdkService) {
      this.spotifySdkService.setVolume(clampedVolume);
    }

    this.playerStateSignal.update((state) => ({
      ...state,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }));
  }

  /**
   * Toggle mute
   */
  toggleMute(): void {
    const state = this.playerStateSignal();
    const newMuted = !state.isMuted;

    if (this.audioElement) {
      this.audioElement.muted = newMuted;
    }

    if (
      this.playbackSource().type === "youtube-embed" &&
      this.youtubePlayerService
    ) {
      newMuted
        ? this.youtubePlayerService.mute()
        : this.youtubePlayerService.unmute();
    }

    this.playerStateSignal.update((s) => ({ ...s, isMuted: newMuted }));
  }

  /**
   * Increase volume by 10%
   */
  volumeUp(): void {
    this.setVolume(this.volume() + 0.1);
  }

  /**
   * Decrease volume by 10%
   */
  volumeDown(): void {
    this.setVolume(this.volume() - 0.1);
  }

  // ============================================================================
  // Shuffle & Repeat Controls
  // ============================================================================

  /**
   * Toggle shuffle mode
   */
  toggleShuffle(): void {
    const state = this.playerStateSignal();
    const newShuffled = !state.isShuffled;

    if (newShuffled && state.queue.length > 1) {
      // Shuffle queue but keep current track at current position
      const currentTrack = state.queue[state.queueIndex];
      const otherTracks = state.queue.filter((_, i) => i !== state.queueIndex);
      const shuffled = this.shuffleArray(otherTracks);
      const newQueue = [currentTrack, ...shuffled];

      this.playerStateSignal.update((s) => ({
        ...s,
        isShuffled: true,
        queue: newQueue,
        queueIndex: 0,
      }));
    } else {
      this.playerStateSignal.update((s) => ({ ...s, isShuffled: false }));
    }

    this.queueUpdated$.next(this.queue());
  }

  /**
   * Set repeat mode
   */
  setRepeatMode(mode: RepeatMode): void {
    this.playerStateSignal.update((state) => ({ ...state, repeatMode: mode }));
  }

  /**
   * Cycle through repeat modes: off -> context -> track -> off
   */
  cycleRepeatMode(): void {
    const modes: RepeatMode[] = ["off", "context", "track"];
    const currentIndex = modes.indexOf(this.repeatMode());
    const nextIndex = (currentIndex + 1) % modes.length;
    this.setRepeatMode(modes[nextIndex]);
  }

  // ============================================================================
  // Device Controls
  // ============================================================================

  /**
   * Get available devices
   */
  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/player/devices`);
  }

  /**
   * Transfer playback to device
   */
  transferPlayback(deviceId: string, startPlaying = true): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/player/device`, {
      deviceId,
      play: startPlaying,
    });
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private initializeFromStorage(): void {
    const volume = localStorage.getItem(STORAGE_KEYS.VOLUME);
    const muted = localStorage.getItem(STORAGE_KEYS.MUTED);
    const shuffle = localStorage.getItem(STORAGE_KEYS.SHUFFLE);
    const repeat = localStorage.getItem(STORAGE_KEYS.REPEAT);
    const queue = localStorage.getItem(STORAGE_KEYS.QUEUE);
    const queueIndex = localStorage.getItem(STORAGE_KEYS.QUEUE_INDEX);

    this.playerStateSignal.update((state) => ({
      ...state,
      volume: volume ? parseFloat(volume) : 1,
      isMuted: muted === "true",
      isShuffled: shuffle === "true",
      repeatMode: (repeat as RepeatMode) || "off",
      queue: queue ? JSON.parse(queue) : [],
      queueIndex: queueIndex ? parseInt(queueIndex, 10) : -1,
    }));
  }

  private saveToStorage(state: PlayerState): void {
    localStorage.setItem(STORAGE_KEYS.VOLUME, state.volume.toString());
    localStorage.setItem(STORAGE_KEYS.MUTED, state.isMuted.toString());
    localStorage.setItem(STORAGE_KEYS.SHUFFLE, state.isShuffled.toString());
    localStorage.setItem(STORAGE_KEYS.REPEAT, state.repeatMode);
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(state.queue));
    localStorage.setItem(STORAGE_KEYS.QUEUE_INDEX, state.queueIndex.toString());
  }

  private setupAudioElement(): void {
    this.audioElement = new Audio();
    this.audioElement.volume = this.volume();

    this.audioElement.addEventListener("ended", () => {
      this.handleTrackEnded();
    });

    this.audioElement.addEventListener("loadedmetadata", () => {
      if (this.audioElement) {
        this.playerStateSignal.update((state) => ({
          ...state,
          duration: this.audioElement!.duration * 1000,
        }));
      }
    });

    this.audioElement.addEventListener("error", (e) => {
      console.error("Audio playback error:", e);
      this.next(); // Try next track on error
    });
  }

  private setQueue(tracks: Track[], startIndex: number): void {
    this.playerStateSignal.update((state) => ({
      ...state,
      queue: tracks,
      queueIndex: startIndex,
    }));
    this.queueUpdated$.next(tracks);
  }

  private startPlayback(track: Track): void {
    // Stop current playback
    this.stop();

    // Update state with new track
    this.playerStateSignal.update((state) => ({
      ...state,
      currentTrack: track,
      isPlaying: true,
      isPaused: false,
      position: 0,
      duration: track.duration,
    }));

    // Start playback based on provider
    if (track.provider === "local" || track.previewUrl) {
      this.playLocal(track);
    } else if (track.provider === "spotify") {
      this.playSpotify(track);
    } else if (track.provider === "youtube") {
      this.playYouTube(track);
    }

    this.trackChanged$.next(track);
    this.playbackStarted$.next(track);
    this.startProgressTracking();
  }

  private playLocal(track: Track): void {
    const url = track.previewUrl || track.externalUrl;
    if (!url || !this.audioElement) return;

    this.playbackSource.set({ type: "local", isActive: true });
    this.audioElement.src = url;
    this.audioElement.play().catch((err) => {
      console.error("Failed to play local audio:", err);
    });
  }

  private playSpotify(track: Track): void {
    const sessionId = this.authService.getProviderSession("spotify");
    if (!sessionId) {
      console.error("Spotify not connected");
      return;
    }

    const trackId = track.providerId || track.id;
    const trackUri = `spotify:track:${trackId}`;

    // Try Spotify Web Playback SDK first if available and connected
    if (this.spotifySdkService?.isPlayerReady()) {
      console.log("Using Spotify SDK for playback");
      this.playbackSource.set({ type: "spotify-sdk", isActive: true });

      // Use async/await pattern for better error handling
      (async () => {
        try {
          await this.spotifySdkService.playTrack(trackUri);
          this.spotifySdkRequested$.next(trackId);
        } catch (err: any) {
          console.error(
            "Spotify SDK playback failed, falling back to API:",
            err,
          );
          // Check if it's a Premium-required error
          if (err?.message?.includes("Premium") || err?.status === 403) {
            console.log("Premium required - falling back to Spotify Web API");
          }
          this.playSpotifyViaApi(track, trackUri, sessionId);
        }
      })();
      return;
    }

    // SDK not ready - try to connect it first, but with a timeout
    if (this.spotifySdkService && !this.spotifySdkService.isPlayerReady()) {
      console.log("Attempting to connect Spotify SDK...");

      // Set a timeout to fall back to API if SDK takes too long
      const sdkTimeout = setTimeout(() => {
        console.log("Spotify SDK connection timeout, using API");
        this.playSpotifyViaApi(track, trackUri, sessionId);
      }, 5000);

      this.spotifySdkService
        .connect()
        .then((connected: boolean) => {
          clearTimeout(sdkTimeout);
          if (connected && this.spotifySdkService.isPlayerReady()) {
            console.log("Spotify SDK connected, using for playback");
            this.playbackSource.set({ type: "spotify-sdk", isActive: true });
            this.spotifySdkService.playTrack(trackUri).catch((err: any) => {
              console.error("Spotify SDK playback failed after connect:", err);
              this.playSpotifyViaApi(track, trackUri, sessionId);
            });
            this.spotifySdkRequested$.next(trackId);
          } else {
            console.log("Spotify SDK connection failed, using API");
            this.playSpotifyViaApi(track, trackUri, sessionId);
          }
        })
        .catch((err: any) => {
          clearTimeout(sdkTimeout);
          console.error("Spotify SDK connection error:", err);
          this.playSpotifyViaApi(track, trackUri, sessionId);
        });
      return;
    }

    // Fall back to Spotify Web API (requires Spotify app open on another device)
    console.log(
      "Using Spotify Web API for playback (requires Spotify app open)",
    );
    this.playSpotifyViaApi(track, trackUri, sessionId);
  }

  private playSpotifyViaApi(
    track: Track,
    trackUri: string,
    sessionId: string,
  ): void {
    this.playbackSource.set({ type: "spotify-api", isActive: true });
    const headers = { "X-Session-Id": sessionId };

    this.http
      .post(
        `${this.apiUrl}/spotify/player/play/track`,
        { uri: trackUri },
        { headers },
      )
      .subscribe({
        next: (response: any) => {
          console.log("Spotify playback started via API", response);
          // Update player state
          this.playerStateSignal.update((state) => ({
            ...state,
            isPlaying: true,
            isPaused: false,
            currentTrack: track,
            duration: track.duration || 0,
          }));
          this.playbackStarted$.next(track);
          // Note: Progress tracking for API playback is limited
          // The Spotify app controls playback, we just monitor state
        },
        error: (err) => {
          console.error("Spotify playback error:", err);
          const errorMessage =
            err?.error?.message || err?.error?.error || "Unknown error";

          if (err?.status === 404) {
            // No active device
            console.error("No active Spotify device found");
            // Emit an event so the UI can show a helpful message
            this.playerStateSignal.update((state) => ({
              ...state,
              isPlaying: false,
              isPaused: true,
            }));
          } else if (err?.status === 403 || errorMessage.includes("Premium")) {
            console.error("Spotify Premium required or forbidden");
          } else {
            console.error("Unable to play track:", errorMessage);
          }
        },
      });
  }

  private playYouTube(track: Track): void {
    const videoId = track.providerId || track.id;

    // Always use embedded YouTube player - emit event for app component to handle
    this.playbackSource.set({ type: "youtube-embed", isActive: true });
    this.youtubeVideoRequested$.next(videoId);

    // Don't start local progress tracking - YouTube service handles it
    // The state will be synced via stateChanged$ subscription
  }

  private resumeProviderPlayback(provider: Provider): void {
    const sessionId = this.authService.getProviderSession(provider);
    if (!sessionId) return;

    if (provider === "spotify") {
      const headers = { "X-Session-Id": sessionId };
      this.http
        .post(`${this.apiUrl}/spotify/player/play`, {}, { headers })
        .subscribe({
          error: (err) => console.error("Spotify resume error:", err),
        });
    }
  }

  private pauseProviderPlayback(provider: Provider): void {
    const sessionId = this.authService.getProviderSession(provider);
    if (!sessionId) return;

    if (provider === "spotify") {
      const headers = { "X-Session-Id": sessionId };
      this.http
        .put(`${this.apiUrl}/spotify/player/pause`, {}, { headers })
        .subscribe({
          error: (err) => console.error("Spotify pause error:", err),
        });
    }
  }

  private seekProviderPlayback(provider: Provider, positionMs: number): void {
    const sessionId = this.authService.getProviderSession(provider);
    if (!sessionId) return;

    if (provider === "spotify") {
      const headers = { "X-Session-Id": sessionId };
      this.http
        .put(
          `${this.apiUrl}/spotify/player/seek?position_ms=${positionMs}`,
          {},
          { headers },
        )
        .subscribe({
          error: (err) => console.error("Spotify seek error:", err),
        });
    }
  }

  private handleTrackEnded(): void {
    const state = this.playerStateSignal();

    if (state.repeatMode === "track") {
      // Repeat current track
      this.seek(0);
      this.resume();
    } else {
      this.next();
    }
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();

    // Only track progress for local playback
    // YouTube and Spotify SDK handle their own progress
    if (this.playbackSource().type !== "local") {
      return;
    }

    interval(1000)
      .pipe(takeUntil(this.progressTimer$))
      .subscribe(() => {
        if (this.audioElement && this.isPlaying()) {
          this.playerStateSignal.update((state) => ({
            ...state,
            position: this.audioElement!.currentTime * 1000,
          }));
        }
      });
  }

  private stopProgressTracking(): void {
    this.progressTimer$.next();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  private formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.progressTimer$.complete();

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = "";
      this.audioElement = null;
    }
  }
}

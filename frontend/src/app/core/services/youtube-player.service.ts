import { Injectable, signal, computed, NgZone, inject } from "@angular/core";
import { Subject } from "rxjs";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

declare namespace YT {
  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    setVolume(volume: number): void;
    getVolume(): number;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    getDuration(): number;
    getCurrentTime(): number;
    getPlayerState(): number;
    getVideoData(): { video_id: string; title: string; author: string };
    destroy(): void;
    loadVideoById(videoId: string, startSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number): void;
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: PlayerEvents;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    enablejsapi?: 0 | 1;
    fs?: 0 | 1;
    iv_load_policy?: 1 | 3;
    modestbranding?: 0 | 1;
    origin?: string;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    start?: number;
  }

  interface PlayerEvents {
    onReady?: (event: PlayerEvent) => void;
    onStateChange?: (event: OnStateChangeEvent) => void;
    onError?: (event: OnErrorEvent) => void;
    onPlaybackQualityChange?: (event: PlayerEvent) => void;
    onPlaybackRateChange?: (event: PlayerEvent) => void;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: number;
  }

  interface OnErrorEvent extends PlayerEvent {
    data: number;
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }
}

export interface YouTubePlayerState {
  isReady: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isBuffering: boolean;
  currentVideoId: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

@Injectable({
  providedIn: "root",
})
export class YouTubePlayerService {
  private readonly ngZone = inject(NgZone);

  private player: YT.Player | null = null;
  private apiReady = false;
  private pendingVideoId: string | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private playerContainerId = "youtube-player-container";

  // State signal
  private stateSignal = signal<YouTubePlayerState>({
    isReady: false,
    isPlaying: false,
    isPaused: false,
    isBuffering: false,
    currentVideoId: null,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isMuted: false,
  });

  // Public computed signals
  readonly state = computed(() => this.stateSignal());
  readonly isReady = computed(() => this.stateSignal().isReady);
  readonly isPlaying = computed(() => this.stateSignal().isPlaying);
  readonly isPaused = computed(() => this.stateSignal().isPaused);
  readonly currentTime = computed(() => this.stateSignal().currentTime);
  readonly duration = computed(() => this.stateSignal().duration);
  readonly volume = computed(() => this.stateSignal().volume);

  // Events
  readonly videoEnded$ = new Subject<void>();
  readonly videoError$ = new Subject<number>();
  readonly stateChanged$ = new Subject<YouTubePlayerState>();

  constructor() {
    this.loadYouTubeAPI();
  }

  /**
   * Load the YouTube IFrame API script
   */
  private loadYouTubeAPI(): void {
    if (window.YT && window.YT.Player) {
      this.apiReady = true;
      console.log("YouTube API already loaded");
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      console.log("YouTube API script already loading");
      return;
    }

    console.log("Loading YouTube IFrame API...");
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      this.ngZone.run(() => {
        console.log("YouTube IFrame API ready");
        this.apiReady = true;
        if (this.pendingVideoId) {
          console.log("Playing pending video:", this.pendingVideoId);
          this.playVideo(this.pendingVideoId);
          this.pendingVideoId = null;
        }
      });
    };
  }

  /**
   * Initialize the player in a container element
   */
  initializePlayer(containerId: string): void {
    console.log("initializePlayer called with:", containerId);
    this.playerContainerId = containerId;

    if (!this.apiReady) {
      console.log("API not ready yet, will create player when ready");
      return;
    }

    this.createPlayer();
  }

  /**
   * Create the YouTube player instance
   */
  private createPlayer(): void {
    if (this.player) {
      console.log("Player already exists");
      return;
    }

    const container = document.getElementById(this.playerContainerId);
    if (!container) {
      console.error(
        "YouTube player container not found:",
        this.playerContainerId,
      );
      // Retry after a short delay - container might not be in DOM yet
      setTimeout(() => {
        const retryContainer = document.getElementById(this.playerContainerId);
        if (retryContainer) {
          console.log("Container found on retry, creating player");
          this.createPlayerInternal();
        }
      }, 500);
      return;
    }

    this.createPlayerInternal();
  }

  private createPlayerInternal(): void {
    console.log(
      "Creating YouTube player in container:",
      this.playerContainerId,
    );
    this.player = new window.YT.Player(this.playerContainerId, {
      height: "100%",
      width: "100%",
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        origin: window.location.origin,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady: (event) => this.onPlayerReady(event),
        onStateChange: (event) => this.onPlayerStateChange(event),
        onError: (event) => this.onPlayerError(event),
      },
    });
  }

  /**
   * Handle player ready event
   */
  private onPlayerReady(event: YT.PlayerEvent): void {
    this.ngZone.run(() => {
      console.log("YouTube player ready event fired");
      this.stateSignal.update((state) => ({
        ...state,
        isReady: true,
        volume: event.target.getVolume(),
        isMuted: event.target.isMuted(),
      }));

      if (this.pendingVideoId) {
        console.log(
          "Playing pending video after player ready:",
          this.pendingVideoId,
        );
        const videoId = this.pendingVideoId;
        this.pendingVideoId = null;
        // Load the video now that player is ready
        this.stateSignal.update((state) => ({
          ...state,
          currentVideoId: videoId,
          currentTime: 0,
        }));
        this.player?.loadVideoById(videoId, 0);
      }
    });
  }

  /**
   * Handle player state change event
   */
  private onPlayerStateChange(event: YT.OnStateChangeEvent): void {
    this.ngZone.run(() => {
      const playerState = event.data;

      let isPlaying = false;
      let isPaused = false;
      let isBuffering = false;

      switch (playerState) {
        case YT.PlayerState.PLAYING:
          isPlaying = true;
          this.startProgressTracking();
          break;
        case YT.PlayerState.PAUSED:
          isPaused = true;
          this.stopProgressTracking();
          break;
        case YT.PlayerState.BUFFERING:
          isBuffering = true;
          break;
        case YT.PlayerState.ENDED:
          this.stopProgressTracking();
          this.videoEnded$.next();
          break;
        case YT.PlayerState.UNSTARTED:
        case YT.PlayerState.CUED:
          this.stopProgressTracking();
          break;
      }

      const duration = this.player?.getDuration() || 0;
      const currentTime = this.player?.getCurrentTime() || 0;

      this.stateSignal.update((state) => ({
        ...state,
        isPlaying,
        isPaused,
        isBuffering,
        duration: duration * 1000, // Convert to ms
        currentTime: currentTime * 1000,
      }));

      this.stateChanged$.next(this.stateSignal());
    });
  }

  /**
   * Handle player error event
   */
  private onPlayerError(event: YT.OnErrorEvent): void {
    this.ngZone.run(() => {
      console.error("YouTube Player Error:", event.data);
      this.videoError$.next(event.data);

      this.stateSignal.update((state) => ({
        ...state,
        isPlaying: false,
        isPaused: false,
        isBuffering: false,
      }));
    });
  }

  /**
   * Start tracking playback progress
   */
  private startProgressTracking(): void {
    this.stopProgressTracking();

    this.progressInterval = setInterval(() => {
      if (this.player && this.isPlaying()) {
        const currentTime = this.player.getCurrentTime() * 1000;
        const duration = this.player.getDuration() * 1000;

        this.ngZone.run(() => {
          this.stateSignal.update((state) => ({
            ...state,
            currentTime,
            duration,
          }));

          // Emit state change for live sync with native player
          this.stateChanged$.next(this.stateSignal());
        });
      }
    }, 250); // Update every 250ms for smoother progress tracking
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
   * Play a video by ID
   */
  playVideo(videoId: string, startSeconds = 0): void {
    console.log(
      "playVideo called with:",
      videoId,
      "API ready:",
      this.apiReady,
      "Player exists:",
      !!this.player,
    );

    if (!this.apiReady) {
      console.log("API not ready, storing pending video ID");
      this.pendingVideoId = videoId;
      return;
    }

    if (!this.player) {
      console.log("Player not created yet, creating now");
      this.pendingVideoId = videoId;
      this.createPlayer();
      return;
    }

    // Check if player is ready
    if (!this.stateSignal().isReady) {
      console.log("Player not ready yet, storing pending video ID");
      this.pendingVideoId = videoId;
      return;
    }

    console.log("Loading video:", videoId);
    this.stateSignal.update((state) => ({
      ...state,
      currentVideoId: videoId,
      currentTime: startSeconds * 1000,
    }));

    this.player.loadVideoById(videoId, startSeconds);
  }

  /**
   * Resume playback
   */
  play(): void {
    this.player?.playVideo();
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.player?.pauseVideo();
  }

  /**
   * Stop playback
   */
  stop(): void {
    this.player?.stopVideo();
    this.stopProgressTracking();

    this.stateSignal.update((state) => ({
      ...state,
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
    }));
  }

  /**
   * Seek to position in milliseconds
   */
  seek(positionMs: number): void {
    if (this.player) {
      this.player.seekTo(positionMs / 1000, true);
      this.stateSignal.update((state) => ({
        ...state,
        currentTime: positionMs,
      }));
    }
  }

  /**
   * Set volume (0-100)
   */
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    this.player?.setVolume(clampedVolume);

    this.stateSignal.update((state) => ({
      ...state,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }));
  }

  /**
   * Mute audio
   */
  mute(): void {
    this.player?.mute();
    this.stateSignal.update((state) => ({
      ...state,
      isMuted: true,
    }));
  }

  /**
   * Unmute audio
   */
  unmute(): void {
    this.player?.unMute();
    this.stateSignal.update((state) => ({
      ...state,
      isMuted: false,
    }));
  }

  /**
   * Toggle mute
   */
  toggleMute(): void {
    if (this.stateSignal().isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  /**
   * Get current video data
   */
  getVideoData(): { video_id: string; title: string; author: string } | null {
    return this.player?.getVideoData() || null;
  }

  /**
   * Check if player is initialized and ready
   */
  isPlayerReady(): boolean {
    return this.apiReady && !!this.player && this.stateSignal().isReady;
  }

  /**
   * Destroy the player instance
   */
  destroy(): void {
    this.stopProgressTracking();
    this.player?.destroy();
    this.player = null;

    this.stateSignal.update((state) => ({
      ...state,
      isReady: false,
      isPlaying: false,
      isPaused: false,
      currentVideoId: null,
      currentTime: 0,
      duration: 0,
    }));
  }
}

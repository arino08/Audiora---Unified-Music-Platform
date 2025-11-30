import { Injectable, inject, OnDestroy } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { PlayerService } from "./player.service";
import { Track } from "../models";

/**
 * MediaSessionService integrates with the browser's Media Session API
 * to provide OS-level media controls, lock screen integration, and
 * media key support (play/pause, next, previous on keyboards).
 */
@Injectable({
  providedIn: "root",
})
export class MediaSessionService implements OnDestroy {
  private readonly playerService = inject(PlayerService);
  private readonly destroy$ = new Subject<void>();

  private isSupported = false;

  constructor() {
    this.checkSupport();
    if (this.isSupported) {
      this.setupMediaSession();
      this.setupTrackChangeListener();
      this.setupPlaybackStateListener();
      this.setupPositionStateListener();
    }
  }

  /**
   * Check if Media Session API is supported
   */
  private checkSupport(): void {
    this.isSupported = "mediaSession" in navigator;
    if (!this.isSupported) {
      console.info("Media Session API is not supported in this browser");
    }
  }

  /**
   * Setup media session action handlers
   */
  private setupMediaSession(): void {
    const mediaSession = navigator.mediaSession;

    // Play action
    mediaSession.setActionHandler("play", () => {
      this.playerService.resume();
    });

    // Pause action
    mediaSession.setActionHandler("pause", () => {
      this.playerService.pause();
    });

    // Previous track
    mediaSession.setActionHandler("previoustrack", () => {
      this.playerService.previous();
    });

    // Next track
    mediaSession.setActionHandler("nexttrack", () => {
      this.playerService.next();
    });

    // Seek backward
    try {
      mediaSession.setActionHandler("seekbackward", (details) => {
        const skipTime = details.seekOffset || 10; // Default 10 seconds
        const currentPosition = this.playerService.position();
        const newPosition = Math.max(0, currentPosition - skipTime * 1000);
        this.playerService.seek(newPosition);
      });
    } catch {
      console.info("seekbackward action not supported");
    }

    // Seek forward
    try {
      mediaSession.setActionHandler("seekforward", (details) => {
        const skipTime = details.seekOffset || 10; // Default 10 seconds
        const currentPosition = this.playerService.position();
        const duration = this.playerService.duration();
        const newPosition = Math.min(
          duration,
          currentPosition + skipTime * 1000,
        );
        this.playerService.seek(newPosition);
      });
    } catch {
      console.info("seekforward action not supported");
    }

    // Seek to specific position
    try {
      mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime !== undefined) {
          this.playerService.seek(details.seekTime * 1000); // Convert to ms
        }
      });
    } catch {
      console.info("seekto action not supported");
    }

    // Stop action
    try {
      mediaSession.setActionHandler("stop", () => {
        this.playerService.stop();
      });
    } catch {
      console.info("stop action not supported");
    }
  }

  /**
   * Listen for track changes and update media session metadata
   */
  private setupTrackChangeListener(): void {
    this.playerService.trackChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((track) => {
        this.updateMetadata(track);
      });

    // Also set initial metadata if there's a current track
    const currentTrack = this.playerService.currentTrack();
    if (currentTrack) {
      this.updateMetadata(currentTrack);
    }
  }

  /**
   * Listen for playback state changes
   */
  private setupPlaybackStateListener(): void {
    // Subscribe to playback started
    this.playerService.playbackStarted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updatePlaybackState("playing");
      });

    // Subscribe to playback paused
    this.playerService.playbackPaused$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updatePlaybackState("paused");
      });
  }

  /**
   * Update position state periodically for seek bar on lock screen
   */
  private setupPositionStateListener(): void {
    // Update position state every 5 seconds when playing
    setInterval(() => {
      if (this.playerService.isPlaying() && this.isSupported) {
        this.updatePositionState();
      }
    }, 5000);
  }

  /**
   * Update media session metadata with track info
   */
  updateMetadata(track: Track | null): void {
    if (!this.isSupported || !track) {
      navigator.mediaSession.metadata = null;
      return;
    }

    const artistName = this.getArtistName(track);
    const albumName = this.getAlbumName(track);

    // Build artwork array
    const artwork: MediaImage[] = [];
    if (track.albumArt) {
      artwork.push(
        { src: track.albumArt, sizes: "96x96", type: "image/jpeg" },
        { src: track.albumArt, sizes: "128x128", type: "image/jpeg" },
        { src: track.albumArt, sizes: "192x192", type: "image/jpeg" },
        { src: track.albumArt, sizes: "256x256", type: "image/jpeg" },
        { src: track.albumArt, sizes: "384x384", type: "image/jpeg" },
        { src: track.albumArt, sizes: "512x512", type: "image/jpeg" },
      );
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: artistName,
      album: albumName,
      artwork,
    });

    // Update position state
    this.updatePositionState();
  }

  /**
   * Update playback state
   */
  updatePlaybackState(state: MediaSessionPlaybackState): void {
    if (!this.isSupported) return;
    navigator.mediaSession.playbackState = state;
  }

  /**
   * Update position state for seek bar display
   */
  updatePositionState(): void {
    if (!this.isSupported) return;

    const duration = this.playerService.duration();
    const position = this.playerService.position();

    if (duration <= 0) return;

    try {
      navigator.mediaSession.setPositionState({
        duration: duration / 1000, // Convert ms to seconds
        playbackRate: 1,
        position: Math.min(position / 1000, duration / 1000), // Convert ms to seconds
      });
    } catch (error) {
      // Position state might fail if duration/position are invalid
      console.debug("Failed to set position state:", error);
    }
  }

  /**
   * Extract artist name from track
   */
  private getArtistName(track: Track): string {
    // Track.artist is always a string in our model
    if (track.artist) {
      return track.artist;
    }
    // Fallback to artists array if available
    if (track.artists && track.artists.length > 0) {
      return track.artists.map((a) => a.name).join(", ");
    }
    return "Unknown Artist";
  }

  /**
   * Extract album name from track
   */
  private getAlbumName(track: Track): string {
    if (track.album) {
      return typeof track.album === "string" ? track.album : "";
    }
    return "";
  }

  /**
   * Check if Media Session API is supported
   */
  isMediaSessionSupported(): boolean {
    return this.isSupported;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clear media session
    if (this.isSupported) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = "none";
    }
  }
}

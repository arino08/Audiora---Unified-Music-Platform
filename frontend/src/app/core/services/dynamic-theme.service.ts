import { Injectable, inject, OnDestroy } from "@angular/core";
import {
  Subject,
  takeUntil,
  filter,
  debounceTime,
  distinctUntilChanged,
} from "rxjs";
import { ThemeService } from "./theme.service";
import { PlayerService } from "./player.service";
import { Track } from "../models";

/**
 * DynamicThemeService
 *
 * Bridges the PlayerService and ThemeService to enable dynamic album art
 * color extraction. When a track changes, this service:
 * 1. Extracts dominant colors from the album art
 * 2. Updates the theme with the extracted colors
 * 3. Provides smooth color transitions between tracks
 *
 * This implements the "Dynamic Adaptive" concept where the UI colors
 * dynamically shift based on the currently playing album artwork.
 */
@Injectable({
  providedIn: "root",
})
export class DynamicThemeService implements OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly playerService = inject(PlayerService);
  private readonly destroy$ = new Subject<void>();

  // Track the last processed album art to avoid redundant extractions
  private lastProcessedAlbumArt: string | null = null;

  // Configuration
  private readonly config = {
    // Debounce rapid track changes (e.g., during scrubbing)
    debounceMs: 300,
    // Enable/disable smooth color transitions
    smoothTransitions: true,
    // Transition duration in CSS - longer for soothing ambient effect
    transitionDuration: "1500ms",
    // Ambient background transition - even slower for smooth color bleeding
    ambientTransitionDuration: "2000ms",
  };

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the dynamic theme system
   */
  private initialize(): void {
    // Subscribe to track changes
    this.playerService.trackChanged$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.config.debounceMs),
        filter((track): track is Track | null => true),
        distinctUntilChanged((prev, curr) => prev?.albumArt === curr?.albumArt),
      )
      .subscribe((track) => {
        this.handleTrackChange(track);
      });

    // Apply transition styles if smooth transitions are enabled
    if (this.config.smoothTransitions) {
      this.applyTransitionStyles();
    }
  }

  /**
   * Handle track changes and update theme colors
   */
  private async handleTrackChange(track: Track | null): Promise<void> {
    // If no track or dynamic theming is disabled, reset to defaults
    if (!track || !this.themeService.dynamicTheme().isActive) {
      if (this.lastProcessedAlbumArt !== null) {
        this.themeService.resetToDefaultColors();
        this.lastProcessedAlbumArt = null;
      }
      return;
    }

    const albumArt = track.albumArt;

    // Skip if no album art or same as last processed
    if (!albumArt || albumArt === this.lastProcessedAlbumArt) {
      return;
    }

    try {
      await this.themeService.updateFromAlbumArt(albumArt);
      this.lastProcessedAlbumArt = albumArt;
      console.log("[DynamicTheme] Updated colors from album art:", track.title);
    } catch (error) {
      console.warn("[DynamicTheme] Failed to extract colors:", error);
      // Keep previous colors on failure
    }
  }

  /**
   * Apply CSS transition styles for smooth color changes
   */
  private applyTransitionStyles(): void {
    const style = document.createElement("style");
    style.id = "dynamic-theme-transitions";
    style.textContent = `
      :root {
        transition:
          --dynamic-primary ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          --dynamic-secondary ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          --dynamic-accent ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          --dynamic-muted ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          --dynamic-primary-rgb ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          --dynamic-secondary-rgb ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          --dynamic-accent-rgb ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          --dynamic-muted-rgb ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Smooth background transitions for aurora effect */
      .aurora-dynamic::before {
        transition: background ${this.config.ambientTransitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Ambient background orbs - extra slow for soothing effect */
      .ambient-orb {
        transition:
          background ${this.config.ambientTransitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          opacity ${this.config.ambientTransitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }

      .ambient-mesh {
        transition: background ${this.config.ambientTransitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }

      .home-ambient-bg {
        transition: background ${this.config.ambientTransitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Smooth transitions for elements using dynamic colors */
      .dynamic-color-transition {
        transition:
          color ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          background-color ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          border-color ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Progress bar and interactive elements */
      .player-progress-fill,
      .volume-fill,
      .btn-dynamic {
        transition: background ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Glow effects */
      .dynamic-glow {
        transition: box-shadow ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Section icons and UI elements */
      .section-icon,
      .playlist-glow,
      .quick-play-card,
      .playlist-card-inner {
        transition:
          background ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Greeting underline */
      .greeting-text::after {
        transition:
          background ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.4s ease,
          opacity 0.4s ease;
      }

      /* User highlight text */
      .user-highlight {
        transition: color ${this.config.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;

    // Remove existing style if present
    const existing = document.getElementById("dynamic-theme-transitions");
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(style);
  }

  /**
   * Manually trigger color extraction for current track
   * Useful for re-extracting after dynamic theme is enabled
   */
  async refreshCurrentTrackColors(): Promise<void> {
    const currentTrack = this.playerService.currentTrack();
    if (currentTrack?.albumArt) {
      this.lastProcessedAlbumArt = null; // Force re-extraction
      await this.handleTrackChange(currentTrack);
    }
  }

  /**
   * Enable or disable dynamic theming
   */
  setEnabled(enabled: boolean): void {
    this.themeService.setDynamicThemeEnabled(enabled);

    if (enabled) {
      // Immediately extract colors from current track
      this.refreshCurrentTrackColors();
    } else {
      // Reset to default colors
      this.themeService.resetToDefaultColors();
      this.lastProcessedAlbumArt = null;
    }
  }

  /**
   * Check if dynamic theming is currently active
   */
  isEnabled(): boolean {
    return this.themeService.dynamicTheme().isActive;
  }

  /**
   * Get the current dynamic colors
   */
  getCurrentColors() {
    return this.themeService.currentColors();
  }

  /**
   * Manually extract colors from any image URL
   * Useful for preview functionality or custom images
   */
  async extractColorsFromImage(imageUrl: string) {
    return this.themeService.extractColorsFromImage(imageUrl);
  }

  /**
   * Apply colors from a specific track without playing it
   * Useful for hover previews or playlist thumbnails
   */
  async previewTrackColors(track: Track): Promise<void> {
    if (!track.albumArt || !this.themeService.dynamicTheme().isActive) {
      return;
    }

    await this.themeService.updateFromAlbumArt(track.albumArt);
  }

  /**
   * Restore colors from the currently playing track
   * Used after previewing colors from another track
   */
  async restoreCurrentTrackColors(): Promise<void> {
    const currentTrack = this.playerService.currentTrack();
    if (currentTrack?.albumArt) {
      await this.themeService.updateFromAlbumArt(currentTrack.albumArt);
    } else {
      this.themeService.resetToDefaultColors();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up transition styles
    const style = document.getElementById("dynamic-theme-transitions");
    if (style) {
      style.remove();
    }
  }
}

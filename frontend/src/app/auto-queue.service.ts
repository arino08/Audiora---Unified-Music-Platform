import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerService, Playable, SpotifyPlayable, YouTubePlayable } from './player.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AutoQueueService {
  private http = inject(HttpClient);
  private player = inject(PlayerService);

  private readonly STORAGE_KEY = 'audiora_radio_mode';
  private readonly QUEUE_THRESHOLD = 2; // Start fetching when queue has <= 2 items
  private readonly RECOMMENDATIONS_COUNT = 3;

  // State
  radioMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  private backendBase = `http://${window.location.hostname}:8080`;
  private sessionId: string | null = null;
  private processingTrack: string | null = null; // Prevent duplicate requests
  private lastRecommendedTracks = new Set<string>(); // Prevent adding same tracks

  constructor() {
    this.loadSettings();

    // Watch for track changes when radio mode is enabled
    effect(() => {
      const current = this.player.current();
      const mode = this.radioMode();
      const queueLength = this.player.queue().length;

      console.log('AutoQueue effect triggered:', {
        mode,
        hasCurrent: !!current,
        queueLength,
        threshold: this.QUEUE_THRESHOLD,
        sessionId: !!this.sessionId
      });

      if (mode && current && queueLength <= this.QUEUE_THRESHOLD) {
        console.log('AutoQueue: Conditions met, fetching recommendations...');
        // Automatically fetch recommendations when queue is low
        this.queueRecommendations(current);
      }
    }, { allowSignalWrites: true });
  }

  /**
   * Set the session ID for API requests
   */
  setSessionId(sessionId: string | null) {
    this.sessionId = sessionId;
  }

  /**
   * Toggle radio mode on/off
   */
  toggleRadioMode(enabled?: boolean) {
    const newState = enabled !== undefined ? enabled : !this.radioMode();
    this.radioMode.set(newState);
    this.saveSettings();

    // If turning on and queue is low, immediately fetch recommendations
    if (newState && this.player.current() && this.player.queue().length <= this.QUEUE_THRESHOLD) {
      this.queueRecommendations(this.player.current()!);
    }
  }

  /**
   * Manually trigger recommendations for current track
   */
  async queueRecommendations(track: Playable) {
    console.log('AutoQueue: queueRecommendations called', {
      trackTitle: track.title,
      provider: track.provider,
      radioMode: this.radioMode(),
      sessionId: !!this.sessionId
    });

    if (!this.radioMode()) {
      console.log('AutoQueue: Radio mode is OFF, skipping');
      return;
    }
    if (!this.sessionId) {
      console.warn('AutoQueue: No session ID set - user may not be logged in');
      return;
    }

    // Prevent duplicate requests for the same track
    const trackId = this.getTrackIdentifier(track);
    if (this.processingTrack === trackId) {
      console.log('AutoQueue: Already processing this track, skipping');
      return;
    }

    this.processingTrack = trackId;
    this.isLoading.set(true);

    try {
      console.log(`AutoQueue: Fetching recommendations for ${track.provider} track: ${track.title}`);
      if (track.provider === 'spotify') {
        await this.queueSpotifyRecommendations(track as SpotifyPlayable);
      } else if (track.provider === 'youtube') {
        await this.queueYouTubeRecommendations(track as YouTubePlayable);
      }
    } catch (error) {
      console.error('AutoQueue: Failed to fetch recommendations', error);
    } finally {
      this.isLoading.set(false);
      this.processingTrack = null;
    }
  }

  /**
   * Fetch Spotify recommendations
   */
  private async queueSpotifyRecommendations(track: SpotifyPlayable) {
    const headers = new HttpHeaders({
      'X-Session-Id': this.sessionId!
    });

    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.backendBase}/api/spotify/recommendations`, {
          headers,
          params: {
            trackId: track.id,
            limit: this.RECOMMENDATIONS_COUNT.toString()
          }
        })
      );

      if (response && response.items && Array.isArray(response.items)) {
        const recommendations: SpotifyPlayable[] = response.items
          .filter((item: any) => {
            // Filter out tracks already in queue or recently added
            const id = item.id || item.uri?.split(':').pop();
            return id && !this.lastRecommendedTracks.has(id);
          })
          .map((item: any) => ({
            provider: 'spotify' as const,
            id: item.id,
            uri: item.uri,
            title: item.name,
            artists: item.artists || [],
            album: item.album,
            image: item.image,
            durationMs: item.durationMs
          }));

        // Add to queue
        recommendations.forEach(rec => {
          this.player.queue.update(q => [...q, rec]);
          this.lastRecommendedTracks.add(rec.id);
        });

        // Cleanup old tracks from set (keep last 50)
        if (this.lastRecommendedTracks.size > 50) {
          const arr = Array.from(this.lastRecommendedTracks);
          this.lastRecommendedTracks = new Set(arr.slice(-50));
        }

        console.log(`AutoQueue: Added ${recommendations.length} Spotify recommendations`);
      }
    } catch (error) {
      console.error('AutoQueue: Spotify recommendations failed', error);
      throw error;
    }
  }

  /**
   * Fetch YouTube related videos
   */
  private async queueYouTubeRecommendations(video: YouTubePlayable) {
    const headers = new HttpHeaders({
      'X-Session-Id': this.sessionId!
    });

    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.backendBase}/api/youtube/related`, {
          headers,
          params: {
            videoId: video.videoId,
            limit: this.RECOMMENDATIONS_COUNT.toString()
          }
        })
      );

      if (response && response.items && Array.isArray(response.items)) {
        const recommendations: YouTubePlayable[] = response.items
          .filter((item: any) => {
            // Filter out videos already in queue or recently added
            return item.videoId && !this.lastRecommendedTracks.has(item.videoId);
          })
          .map((item: any) => ({
            provider: 'youtube' as const,
            videoId: item.videoId,
            title: item.title,
            channel: item.channel,
            image: item.thumbnail
          }));

        // Add to queue
        recommendations.forEach(rec => {
          this.player.queue.update(q => [...q, rec]);
          this.lastRecommendedTracks.add(rec.videoId);
        });

        // Cleanup old tracks from set (keep last 50)
        if (this.lastRecommendedTracks.size > 50) {
          const arr = Array.from(this.lastRecommendedTracks);
          this.lastRecommendedTracks = new Set(arr.slice(-50));
        }

        console.log(`AutoQueue: Added ${recommendations.length} YouTube recommendations`);
      }
    } catch (error) {
      console.error('AutoQueue: YouTube recommendations failed', error);
      throw error;
    }
  }

  /**
   * Get unique identifier for a track
   */
  private getTrackIdentifier(track: Playable): string {
    if (track.provider === 'spotify') {
      return `spotify:${(track as SpotifyPlayable).id}`;
    } else {
      return `youtube:${(track as YouTubePlayable).videoId}`;
    }
  }

  /**
   * Clear the recommendation history
   */
  clearHistory() {
    this.lastRecommendedTracks.clear();
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings() {
    try {
      localStorage.setItem(this.STORAGE_KEY, this.radioMode().toString());
    } catch (error) {
      console.error('Failed to save radio mode settings', error);
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved !== null) {
        this.radioMode.set(saved === 'true');
      }
    } catch (error) {
      console.error('Failed to load radio mode settings', error);
    }
  }
}

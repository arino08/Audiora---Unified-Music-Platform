import { Injectable, signal } from '@angular/core';

export interface BasePlayable {
  provider: 'spotify' | 'youtube';
  title: string;
  image?: string | null;
}
export interface SpotifyPlayable extends BasePlayable {
  provider: 'spotify';
  uri: string; // spotify:track:...
  id: string; // track id
  artists: string[];
  album?: string;
  durationMs?: number;
}
export interface YouTubePlayable extends BasePlayable {
  provider: 'youtube';
  videoId: string;
  channel?: string;
}
export type Playable = SpotifyPlayable | YouTubePlayable;

@Injectable({ providedIn: 'root' })
export class PlayerService {
  current = signal<Playable | null>(null);
  isPlaying = signal<boolean>(false);
  // simple queue
  queue = signal<Playable[]>([]);
  // active provider convenience
  activeProvider = signal<'spotify' | 'youtube' | null>(null);
  private endTimer: any;

  // callbacks for integration (set by host component)
  onSpotifyPlay?: (track: SpotifyPlayable) => Promise<boolean>;
  onSpotifyPause?: () => Promise<boolean>;
  onYouTubePlay?: (video: YouTubePlayable) => Promise<boolean>;
  onYouTubeStop?: () => Promise<boolean>;

  setCallbacks(cb: Partial<PlayerService>) {
    if (cb.onSpotifyPlay) this.onSpotifyPlay = cb.onSpotifyPlay;
    if (cb.onSpotifyPause) this.onSpotifyPause = cb.onSpotifyPause;
    if (cb.onYouTubePlay) this.onYouTubePlay = cb.onYouTubePlay;
    if (cb.onYouTubeStop) this.onYouTubeStop = cb.onYouTubeStop;
  }

  async play(item: Playable, append = false) {
    if (append && this.current()) {
      this.queue.update(q => [...q, item]);
      return;
    }
    // switching provider? stop other
    if (this.activeProvider() && this.activeProvider() !== item.provider) {
      await this.pause(); // pause current first
    }
    // clear any previous end timer
    if (this.endTimer) { clearTimeout(this.endTimer); this.endTimer = null; }
    let ok = false;
    if (item.provider === 'spotify' && this.onSpotifyPlay) {
      ok = await this.onSpotifyPlay(item as SpotifyPlayable);
    } else if (item.provider === 'youtube' && this.onYouTubePlay) {
      ok = await this.onYouTubePlay(item as YouTubePlayable);
    }
    if (ok) {
      this.current.set(item);
      this.activeProvider.set(item.provider);
      this.isPlaying.set(true);
      // schedule auto-advance for known-duration items (e.g., Spotify)
      const duration = (item as any).durationMs as number | undefined;
      if (item.provider === 'spotify' && duration && duration > 0) {
        // add slight buffer (500ms) to ensure track truly ended
        this.endTimer = setTimeout(() => { this.next(); }, duration + 500);
      }
    }
  }

  async pause() {
    if (!this.current()) return;
    if (this.endTimer) { clearTimeout(this.endTimer); this.endTimer = null; }
    if (this.activeProvider() === 'spotify' && this.onSpotifyPause) {
      await this.onSpotifyPause();
    } else if (this.activeProvider() === 'youtube' && this.onYouTubeStop) {
      await this.onYouTubeStop();
    }
    this.isPlaying.set(false);
  }

  async next() {
    if (this.endTimer) { clearTimeout(this.endTimer); this.endTimer = null; }
    const q = this.queue();
    if (q.length === 0) {
      // nothing queued
      await this.pause();
      this.current.set(null);
      this.activeProvider.set(null);
      return;
    }
    const [head, ...rest] = q;
    this.queue.set(rest);
    await this.play(head, false);
  }

  clearQueue() {
    this.queue.set([]);
  }

  // External providers can notify explicit end (e.g., YouTube ended event)
  notifyEnded() {
    // If a timer is present (Spotify scheduling) clear it to avoid duplicate next
    if (this.endTimer) { clearTimeout(this.endTimer); this.endTimer = null; }
    this.next();
  }
}

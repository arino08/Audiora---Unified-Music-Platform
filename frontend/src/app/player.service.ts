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
  // recently played stack for previous navigation
  history = signal<Playable[]>([]);
  // future stack for forward navigation
  future = signal<Playable[]>([]);
  private readonly HISTORY_LIMIT = 50;
  // active provider convenience
  activeProvider = signal<'spotify' | 'youtube' | null>(null);
  private endTimer: any;

  private readonly LS_KEY = 'audiora_last_played';
  private readonly HISTORY_KEY = 'audiora_history_stack';
  private readonly FUTURE_KEY = 'audiora_future_stack';

  constructor() {
    // Restore last played (not auto-playing) if available
    try {
      const raw = localStorage.getItem(this.LS_KEY);
      if (raw) {
        const parsed: Playable = JSON.parse(raw);
        if (parsed && parsed.provider && parsed.title) {
          this.current.set(parsed);
          this.activeProvider.set(parsed.provider);
          this.isPlaying.set(false);
        }
      }
    } catch {}

    // Restore navigation stacks from session storage when available
    try {
      const histRaw = sessionStorage.getItem(this.HISTORY_KEY);
      if (histRaw) {
        const parsed = JSON.parse(histRaw) as Playable[];
        if (Array.isArray(parsed) && parsed.length) {
          this.history.set(parsed);
        }
      }
    } catch {}

    try {
      const futureRaw = sessionStorage.getItem(this.FUTURE_KEY);
      if (futureRaw) {
        const parsed = JSON.parse(futureRaw) as Playable[];
        if (Array.isArray(parsed) && parsed.length) {
          this.future.set(parsed);
        }
      }
    } catch {}
  }

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

  async play(item: Playable, append = false, options?: { suppressHistory?: boolean }) {
    if (append && this.current()) {
      this.queue.update(q => [...q, item]);
      return;
    }
    const previous = this.current();
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
      if (!append && !options?.suppressHistory) {
        if (previous && !this.samePlayable(previous, item)) {
          this.pushToHistory(previous);
        }
        this.future.set([]);
        this.persistStacks();
      }
      this.current.set(item);
      this.activeProvider.set(item.provider);
      this.isPlaying.set(true);
      // persist last played
      try { localStorage.setItem(this.LS_KEY, JSON.stringify(item)); } catch {}
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
    this.future.set([]);
    this.persistStacks();
    await this.play(head, false);
  }

  async previous() {
    if (this.endTimer) { clearTimeout(this.endTimer); this.endTimer = null; }
    const hist = this.history();
    const cur = this.current();
    if (hist.length === 0) {
      if (cur) {
        await this.play(cur, false, { suppressHistory: true });
      }
      return;
    }
    if (cur) {
      this.future.update(stack => [...stack, cur]);
    }
    const prev = hist[hist.length - 1];
    this.history.set(hist.slice(0, hist.length - 1));
    this.persistStacks();
    await this.play(prev, false, { suppressHistory: true });
  }

  async forward() {
    if (this.endTimer) { clearTimeout(this.endTimer); this.endTimer = null; }
    const future = this.future();
    if (future.length === 0) return;
    const cur = this.current();
    const nextUp = future[future.length - 1];
    this.future.set(future.slice(0, future.length - 1));
    if (cur && !this.samePlayable(cur, nextUp)) {
      this.pushToHistory(cur);
    }
    this.persistStacks();
    await this.play(nextUp, false, { suppressHistory: true });
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

  private pushToHistory(track: Playable) {
    this.history.update(hist => {
      let next = [...hist, track];
      if (next.length > this.HISTORY_LIMIT) {
        next = next.slice(next.length - this.HISTORY_LIMIT);
      }
      return next;
    });
    this.persistStacks();
  }

  private samePlayable(a: Playable, b: Playable): boolean {
    if (a.provider !== b.provider) return false;
    if (a.provider === 'spotify' && b.provider === 'spotify') {
      const sa = a as SpotifyPlayable; const sb = b as SpotifyPlayable;
      return (!!sa.uri && !!sb.uri && sa.uri === sb.uri) || (!!sa.id && !!sb.id && sa.id === sb.id);
    }
    if (a.provider === 'youtube' && b.provider === 'youtube') {
      return (a as YouTubePlayable).videoId === (b as YouTubePlayable).videoId;
    }
    return false;
  }

  private persistStacks() {
    try {
      sessionStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.history()));
      sessionStorage.setItem(this.FUTURE_KEY, JSON.stringify(this.future()));
    } catch {}
  }
}

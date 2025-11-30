import { Injectable, signal, computed } from "@angular/core";

export interface LikedTrackData {
  id: string;
  providerId: string;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  duration?: number;
  provider: "spotify" | "youtube";
  uri?: string;
  videoId?: string;
  likedAt: string;
}

const STORAGE_KEY = "audiora_liked_tracks";

@Injectable({
  providedIn: "root",
})
export class LikedTracksService {
  private tracksSignal = signal<Map<string, LikedTrackData>>(new Map());

  // Computed signals for easy access
  readonly tracks = computed(() =>
    Array.from(this.tracksSignal().values()).sort(
      (a, b) => new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime(),
    ),
  );

  readonly count = computed(() => this.tracksSignal().size);

  readonly spotifyTracks = computed(() =>
    this.tracks().filter((t) => t.provider === "spotify"),
  );

  readonly youtubeTracks = computed(() =>
    this.tracks().filter((t) => t.provider === "youtube"),
  );

  constructor() {
    console.log("[LikedTracksService] Initializing...");
    this.loadFromStorage();
    console.log(
      "[LikedTracksService] Loaded tracks count:",
      this.tracksSignal().size,
    );
  }

  /**
   * Generate a unique key for a track
   */
  private getKey(provider: "spotify" | "youtube", id: string): string {
    return `${provider}:${id}`;
  }

  /**
   * Load liked tracks from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("[LikedTracksService] Raw stored data:", stored);
      if (stored) {
        const parsed = JSON.parse(stored) as LikedTrackData[];
        console.log("[LikedTracksService] Parsed tracks:", parsed);
        const map = new Map<string, LikedTrackData>();
        for (const track of parsed) {
          const key = this.getKey(track.provider, track.id);
          map.set(key, track);
        }
        this.tracksSignal.set(map);
        console.log(
          "[LikedTracksService] Loaded",
          map.size,
          "tracks from storage",
        );
      } else {
        console.log("[LikedTracksService] No stored tracks found");
      }
    } catch (error) {
      console.error(
        "[LikedTracksService] Failed to load liked tracks from storage:",
        error,
      );
      this.tracksSignal.set(new Map());
    }
  }

  /**
   * Save liked tracks to localStorage
   */
  private saveToStorage(): void {
    try {
      const tracks = Array.from(this.tracksSignal().values());
      console.log(
        "[LikedTracksService] Saving",
        tracks.length,
        "tracks to storage",
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
      console.log("[LikedTracksService] Save successful");
    } catch (error) {
      console.error(
        "[LikedTracksService] Failed to save liked tracks to storage:",
        error,
      );
    }
  }

  /**
   * Check if a track is liked
   */
  isLiked(provider: "spotify" | "youtube", id: string): boolean {
    const key = this.getKey(provider, id);
    const result = this.tracksSignal().has(key);
    console.log("[LikedTracksService] isLiked check:", key, "=", result);
    return result;
  }

  /**
   * Like a track
   */
  like(track: Omit<LikedTrackData, "likedAt">): void {
    console.log("[LikedTracksService] like() called with:", track);
    const key = this.getKey(track.provider, track.id);
    if (this.tracksSignal().has(key)) {
      console.log("[LikedTracksService] Track already liked:", key);
      return; // Already liked
    }

    const likedTrack: LikedTrackData = {
      ...track,
      likedAt: new Date().toISOString(),
    };

    console.log("[LikedTracksService] Adding track:", likedTrack);
    this.tracksSignal.update((map) => {
      const newMap = new Map(map);
      newMap.set(key, likedTrack);
      return newMap;
    });

    this.saveToStorage();
    console.log(
      "[LikedTracksService] Track liked successfully, total:",
      this.tracksSignal().size,
    );
  }

  /**
   * Unlike a track
   */
  unlike(provider: "spotify" | "youtube", id: string): void {
    console.log("[LikedTracksService] unlike() called:", provider, id);
    const key = this.getKey(provider, id);
    if (!this.tracksSignal().has(key)) {
      console.log("[LikedTracksService] Track not found to unlike:", key);
      return; // Not liked
    }

    this.tracksSignal.update((map) => {
      const newMap = new Map(map);
      newMap.delete(key);
      return newMap;
    });

    this.saveToStorage();
    console.log(
      "[LikedTracksService] Track unliked successfully, total:",
      this.tracksSignal().size,
    );
  }

  /**
   * Toggle like status for a track
   * Returns true if now liked, false if now unliked
   */
  toggle(track: Omit<LikedTrackData, "likedAt">): boolean {
    const key = this.getKey(track.provider, track.id);
    if (this.tracksSignal().has(key)) {
      this.unlike(track.provider, track.id);
      return false;
    } else {
      this.like(track);
      return true;
    }
  }

  /**
   * Get a specific liked track
   */
  get(provider: "spotify" | "youtube", id: string): LikedTrackData | undefined {
    const key = this.getKey(provider, id);
    return this.tracksSignal().get(key);
  }

  /**
   * Get all liked tracks filtered by provider
   */
  getByProvider(provider: "spotify" | "youtube" | "all"): LikedTrackData[] {
    if (provider === "all") {
      return this.tracks();
    }
    return this.tracks().filter((t) => t.provider === provider);
  }

  /**
   * Search liked tracks by title or artist
   */
  search(query: string): LikedTrackData[] {
    if (!query.trim()) {
      return this.tracks();
    }
    const lowerQuery = query.toLowerCase();
    return this.tracks().filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQuery) ||
        t.artist.toLowerCase().includes(lowerQuery) ||
        (t.album && t.album.toLowerCase().includes(lowerQuery)),
    );
  }

  /**
   * Clear all liked tracks
   */
  clearAll(): void {
    this.tracksSignal.set(new Map());
    this.saveToStorage();
  }

  /**
   * Import tracks (useful for migration or sync)
   */
  import(tracks: LikedTrackData[]): void {
    this.tracksSignal.update((map) => {
      const newMap = new Map(map);
      for (const track of tracks) {
        const key = this.getKey(track.provider, track.id);
        if (!newMap.has(key)) {
          newMap.set(key, track);
        }
      }
      return newMap;
    });
    this.saveToStorage();
  }

  /**
   * Export all liked tracks
   */
  export(): LikedTrackData[] {
    return this.tracks();
  }
}

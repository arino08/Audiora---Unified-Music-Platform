import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface LikedTrack {
  id: string;
  provider: 'spotify' | 'youtube';
  title: string;
  artist: string;
  album?: string;
  image?: string;
  uri?: string; // Spotify URI
  videoId?: string; // YouTube video ID
  durationMs?: number;
  likedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LikedSongsService {
  private readonly STORAGE_KEY = 'audiora_liked_songs';
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly backendBase = `http://${window.location.hostname}:8080`;

  // Signal for reactive UI updates
  likedTracks = signal<LikedTrack[]>([]);

  constructor() {
    this.loadFromStorage();

    // Watch for authentication changes using Angular effect
    this.setupAuthWatcher();
  }

  private setupAuthWatcher(): void {
    // Use effect to watch auth state changes
    effect(() => {
      const isAuthenticated = this.auth.isAuthenticated();
      const userId = this.auth.userId();

      // When user logs in, sync local tracks to server
      if (isAuthenticated && userId) {
        // Small delay to ensure auth state is fully settled
        setTimeout(() => this.syncToServer(), 100);
      }
      // When user logs out, we keep the tracks in local storage for next session
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const tracks = JSON.parse(stored).map((track: any) => ({
          ...track,
          likedAt: new Date(track.likedAt)
        }));
        this.likedTracks.set(tracks);
      }
    } catch (error) {
      console.warn('Failed to load liked songs from storage:', error);
      this.likedTracks.set([]);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.likedTracks()));
    } catch (error) {
      console.warn('Failed to save liked songs to storage:', error);
    }
  }

  isLiked(trackId: string, provider: 'spotify' | 'youtube'): boolean {
    return this.likedTracks().some(track =>
      track.id === trackId && track.provider === provider
    );
  }

  toggleLike(track: any, provider: 'spotify' | 'youtube'): boolean {
    const trackId = this.getTrackId(track, provider);
    const isCurrentlyLiked = this.isLiked(trackId, provider);

    if (isCurrentlyLiked) {
      this.removeLike(trackId, provider);
      return false;
    } else {
      this.addLike(track, provider);
      return true;
    }
  }

  private addLike(track: any, provider: 'spotify' | 'youtube'): void {
    const likedTrack: LikedTrack = {
      id: this.getTrackId(track, provider),
      provider,
      title: this.getTrackTitle(track, provider),
      artist: this.getTrackArtist(track, provider),
      album: this.getTrackAlbum(track, provider),
      image: this.getTrackImage(track, provider),
      likedAt: new Date()
    };

    if (provider === 'spotify') {
      likedTrack.uri = track.uri;
      likedTrack.durationMs = track.durationMs || track.duration_ms;
    } else if (provider === 'youtube') {
      likedTrack.videoId = track.videoId || track.id;
    }

    const currentTracks = this.likedTracks();
    this.likedTracks.set([likedTrack, ...currentTracks]);
    this.saveToStorage();
  }

  private removeLike(trackId: string, provider: 'spotify' | 'youtube'): void {
    const currentTracks = this.likedTracks();
    const filtered = currentTracks.filter(track =>
      !(track.id === trackId && track.provider === provider)
    );
    this.likedTracks.set(filtered);
    this.saveToStorage();
  }

  private getTrackId(track: any, provider: 'spotify' | 'youtube'): string {
    if (provider === 'spotify') {
      return track.track?.id || track.id;
    } else {
      return track.videoId || track.id;
    }
  }

  private getTrackTitle(track: any, provider: 'spotify' | 'youtube'): string {
    if (provider === 'spotify') {
      return track.track?.name || track.name || 'Unknown Track';
    } else {
      return track.title || 'Unknown Track';
    }
  }

  private getTrackArtist(track: any, provider: 'spotify' | 'youtube'): string {
    if (provider === 'spotify') {
      const artists = track.track?.artists || track.artists;
      return Array.isArray(artists) ? artists.join(', ') : 'Unknown Artist';
    } else {
      return track.channel || 'YouTube';
    }
  }

  private getTrackAlbum(track: any, provider: 'spotify' | 'youtube'): string | undefined {
    if (provider === 'spotify') {
      return track.track?.album || track.album;
    }
    return undefined;
  }

  private getTrackImage(track: any, provider: 'spotify' | 'youtube'): string | undefined {
    if (provider === 'spotify') {
      return track.track?.image || track.image;
    } else {
      return track.thumbnail || track.image;
    }
  }

  getLikedTracksByProvider(provider: 'spotify' | 'youtube'): LikedTrack[] {
    return this.likedTracks().filter(track => track.provider === provider);
  }

  clearAllLikes(): void {
    this.likedTracks.set([]);
    this.saveToStorage();
  }

  exportLikes(): string {
    return JSON.stringify(this.likedTracks(), null, 2);
  }

  importLikes(jsonData: string): boolean {
    try {
      const tracks = JSON.parse(jsonData).map((track: any) => ({
        ...track,
        likedAt: new Date(track.likedAt)
      }));
      this.likedTracks.set(tracks);
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import likes:', error);
      return false;
    }
  }

  // Server synchronization methods
  private async syncToServer(): Promise<void> {
    if (!this.auth.isAuthenticated()) return;

    const userId = this.auth.userId();
    if (!userId) return;

    try {
      // First, get current server tracks
      const serverTracks = await this.fetchServerTracks(userId);

      // Import local tracks to server if user has local tracks
      const localTracks = this.likedTracks();
      if (localTracks.length > 0) {
        await this.importTracksToServer(userId, localTracks);
        // After successful import, clear local storage
        localStorage.removeItem(this.STORAGE_KEY);
      }

      // Refresh from server
      await this.loadFromServer(userId);
    } catch (error) {
      console.error('Failed to sync to server:', error);
    }
  }

  private getAuthHeaders(): { [header: string]: string } {
    const token = localStorage.getItem('audiora_auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async fetchServerTracks(userId: string): Promise<LikedTrack[]> {
    const headers = this.getAuthHeaders();
    const response = await this.http.get<any[]>(`${this.backendBase}/api/users/${userId}/liked-tracks`,
      { headers }).toPromise();
    return response?.map(track => ({
      id: track.trackId,
      provider: track.provider.toLowerCase() as 'spotify' | 'youtube',
      title: track.title,
      artist: track.artist,
      album: track.album,
      image: track.imageUrl,
      uri: track.provider === 'SPOTIFY' ? `spotify:track:${track.trackId}` : undefined,
      videoId: track.provider === 'YOUTUBE' ? track.trackId : undefined,
      likedAt: new Date(track.likedAt)
    })) || [];
  }

  private async loadFromServer(userId: string): Promise<void> {
    try {
      const serverTracks = await this.fetchServerTracks(userId);
      this.likedTracks.set(serverTracks);
    } catch (error) {
      console.error('Failed to load from server:', error);
    }
  }

  private async importTracksToServer(userId: string, tracks: LikedTrack[]): Promise<void> {
    const importData = tracks.map(track => ({
      provider: track.provider.toUpperCase(),
      trackId: track.provider === 'spotify' ? track.id : track.videoId || track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      imageUrl: track.image,
      externalUrl: track.uri || (track.videoId ? `https://youtube.com/watch?v=${track.videoId}` : undefined),
      likedAt: track.likedAt.toISOString()
    }));

    const headers = this.getAuthHeaders();
    await this.http.post(`${this.backendBase}/api/users/${userId}/liked-tracks/import`, importData, { headers }).toPromise();
  }

  async toggleLikeServer(track: any, provider: 'spotify' | 'youtube'): Promise<boolean> {
    if (!this.auth.isAuthenticated()) {
      // Fall back to local storage
      return this.toggleLike(track, provider);
    }

    const userId = this.auth.userId();
    if (!userId) return false;

    const trackId = provider === 'spotify' ? track.id : track.videoId || track.id;
    const isCurrentlyLiked = this.isLiked(trackId, provider);

    try {
      const headers = this.getAuthHeaders();

      if (isCurrentlyLiked) {
        // Unlike on server
        await this.http.delete(`${this.backendBase}/api/users/${userId}/liked-tracks/${provider.toUpperCase()}/${trackId}`, { headers }).toPromise();
      } else {
        // Like on server
        const likeRequest = {
          provider: provider.toUpperCase(),
          trackId: trackId,
          title: track.name || track.title,
          artist: provider === 'spotify' ? track.artists?.[0]?.name : track.artist,
          album: track.album?.name || track.album,
          imageUrl: provider === 'spotify' ? track.album?.images?.[0]?.url : track.image,
          externalUrl: provider === 'spotify' ? track.external_urls?.spotify : `https://youtube.com/watch?v=${track.videoId}`
        };
        await this.http.post(`${this.backendBase}/api/users/${userId}/liked-tracks`, likeRequest, { headers }).toPromise();
      }

      // Refresh from server
      await this.loadFromServer(userId);
      return !isCurrentlyLiked;
    } catch (error) {
      console.error('Failed to toggle like on server:', error);
      // Fall back to local storage
      return this.toggleLike(track, provider);
    }
  }

  // Method to manually trigger sync (for UI button)
  async manualSync(): Promise<void> {
    if (this.auth.isAuthenticated()) {
      await this.syncToServer();
    }
  }
}

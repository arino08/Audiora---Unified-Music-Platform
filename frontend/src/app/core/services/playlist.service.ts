import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin, map, tap, catchError } from 'rxjs';
import {
  Playlist,
  PlaylistTrack,
  Track,
  Provider,
  PaginatedResponse,
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
  PlaylistOwner,
} from '../models';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface PlaylistSortOption {
  field: 'name' | 'dateAdded' | 'lastPlayed' | 'trackCount';
  direction: 'asc' | 'desc';
}

export interface PlaylistFilter {
  provider?: Provider;
  isOwned?: boolean;
  searchQuery?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  // Playlists state
  private playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  readonly playlists$ = this.playlistsSubject.asObservable();

  // Loading states
  private isLoadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Current playlist being viewed
  private currentPlaylistSignal = signal<Playlist | null>(null);
  private currentPlaylistTracksSignal = signal<PlaylistTrack[]>([]);

  // Public computed signals
  readonly isLoading = computed(() => this.isLoadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly currentPlaylist = computed(() => this.currentPlaylistSignal());
  readonly currentPlaylistTracks = computed(() => this.currentPlaylistTracksSignal());

  readonly playlistCount = computed(() => this.playlistsSubject.getValue().length);

  // ============================================================================
  // Playlist CRUD Operations
  // ============================================================================

  /**
   * Get all user playlists from all connected providers
   */
  loadPlaylists(): Observable<Playlist[]> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    const observables: Observable<Playlist[]>[] = [];

    // Get local/Audiora playlists
    observables.push(
      this.getLocalPlaylists().pipe(catchError(() => of([])))
    );

    // Get Spotify playlists if connected
    const spotifySession = this.authService.getProviderSession('spotify');
    if (spotifySession) {
      observables.push(
        this.getSpotifyPlaylists(spotifySession).pipe(catchError(() => of([])))
      );
    }

    // Get YouTube playlists if connected
    const youtubeSession = this.authService.getProviderSession('youtube');
    if (youtubeSession) {
      observables.push(
        this.getYouTubePlaylists(youtubeSession).pipe(catchError(() => of([])))
      );
    }

    return forkJoin(observables).pipe(
      map((results) => results.flat()),
      tap((playlists) => {
        this.playlistsSubject.next(playlists);
        this.isLoadingSignal.set(false);
      }),
      catchError((error) => {
        this.errorSignal.set(error.message || 'Failed to load playlists');
        this.isLoadingSignal.set(false);
        return of([]);
      })
    );
  }

  /**
   * Get a single playlist by ID
   */
  getPlaylist(playlistId: string, provider: Provider = 'local'): Observable<Playlist> {
    this.isLoadingSignal.set(true);

    let request$: Observable<Playlist>;

    switch (provider) {
      case 'spotify':
        const spotifySession = this.authService.getProviderSession('spotify');
        if (!spotifySession) {
          return of(this.createEmptyPlaylist(playlistId, provider));
        }
        request$ = this.http.get<Playlist>(
          `${this.apiUrl}/spotify/playlists/${playlistId}`,
          { params: new HttpParams().set('sessionId', spotifySession) }
        );
        break;

      case 'youtube':
        const youtubeSession = this.authService.getProviderSession('youtube');
        if (!youtubeSession) {
          return of(this.createEmptyPlaylist(playlistId, provider));
        }
        request$ = this.http.get<Playlist>(
          `${this.apiUrl}/youtube/playlists/${playlistId}`,
          { params: new HttpParams().set('sessionId', youtubeSession) }
        );
        break;

      default:
        request$ = this.http.get<Playlist>(`${this.apiUrl}/playlists/${playlistId}`);
    }

    return request$.pipe(
      tap((playlist) => {
        this.currentPlaylistSignal.set(playlist);
        this.isLoadingSignal.set(false);
      }),
      catchError((error) => {
        this.errorSignal.set(error.message || 'Failed to load playlist');
        this.isLoadingSignal.set(false);
        throw error;
      })
    );
  }

  /**
   * Get playlist tracks
   */
  getPlaylistTracks(
    playlistId: string,
    provider: Provider = 'local',
    limit = 100,
    offset = 0
  ): Observable<PaginatedResponse<PlaylistTrack>> {
    let request$: Observable<PaginatedResponse<PlaylistTrack>>;
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    switch (provider) {
      case 'spotify':
        const spotifySession = this.authService.getProviderSession('spotify');
        if (!spotifySession) {
          return of(this.emptyPaginatedResponse<PlaylistTrack>());
        }
        request$ = this.http.get<PaginatedResponse<PlaylistTrack>>(
          `${this.apiUrl}/spotify/playlists/${playlistId}/tracks`,
          { params: params.set('sessionId', spotifySession) }
        );
        break;

      case 'youtube':
        const youtubeSession = this.authService.getProviderSession('youtube');
        if (!youtubeSession) {
          return of(this.emptyPaginatedResponse<PlaylistTrack>());
        }
        request$ = this.http.get<PaginatedResponse<PlaylistTrack>>(
          `${this.apiUrl}/youtube/playlists/${playlistId}/tracks`,
          { params: params.set('sessionId', youtubeSession) }
        );
        break;

      default:
        request$ = this.http.get<PaginatedResponse<PlaylistTrack>>(
          `${this.apiUrl}/playlists/${playlistId}/tracks`,
          { params }
        );
    }

    return request$.pipe(
      tap((response) => {
        this.currentPlaylistTracksSignal.set(response.items);
      })
    );
  }

  /**
   * Create a new playlist
   */
  createPlaylist(data: CreatePlaylistRequest, provider: Provider = 'local'): Observable<Playlist> {
    let request$: Observable<Playlist>;

    switch (provider) {
      case 'spotify':
        const spotifySession = this.authService.getProviderSession('spotify');
        if (!spotifySession) {
          throw new Error('Spotify not connected');
        }
        request$ = this.http.post<Playlist>(
          `${this.apiUrl}/spotify/playlists`,
          { ...data, sessionId: spotifySession }
        );
        break;

      case 'youtube':
        const youtubeSession = this.authService.getProviderSession('youtube');
        if (!youtubeSession) {
          throw new Error('YouTube not connected');
        }
        request$ = this.http.post<Playlist>(
          `${this.apiUrl}/youtube/playlists`,
          { ...data, sessionId: youtubeSession }
        );
        break;

      default:
        request$ = this.http.post<Playlist>(`${this.apiUrl}/playlists`, data);
    }

    return request$.pipe(
      tap((playlist) => {
        const current = this.playlistsSubject.getValue();
        this.playlistsSubject.next([playlist, ...current]);
      })
    );
  }

  /**
   * Update playlist details
   */
  updatePlaylist(
    playlistId: string,
    data: UpdatePlaylistRequest,
    provider: Provider = 'local'
  ): Observable<Playlist> {
    let request$: Observable<Playlist>;

    switch (provider) {
      case 'spotify':
        const spotifySession = this.authService.getProviderSession('spotify');
        if (!spotifySession) {
          throw new Error('Spotify not connected');
        }
        request$ = this.http.put<Playlist>(
          `${this.apiUrl}/spotify/playlists/${playlistId}`,
          { ...data, sessionId: spotifySession }
        );
        break;

      case 'youtube':
        const youtubeSession = this.authService.getProviderSession('youtube');
        if (!youtubeSession) {
          throw new Error('YouTube not connected');
        }
        request$ = this.http.put<Playlist>(
          `${this.apiUrl}/youtube/playlists/${playlistId}`,
          { ...data, sessionId: youtubeSession }
        );
        break;

      default:
        request$ = this.http.put<Playlist>(`${this.apiUrl}/playlists/${playlistId}`, data);
    }

    return request$.pipe(
      tap((updatedPlaylist) => {
        // Update in playlists list
        const current = this.playlistsSubject.getValue();
        const index = current.findIndex((p) => p.id === playlistId && p.provider === provider);
        if (index >= 0) {
          current[index] = updatedPlaylist;
          this.playlistsSubject.next([...current]);
        }

        // Update current playlist if it's the same
        if (
          this.currentPlaylistSignal()?.id === playlistId &&
          this.currentPlaylistSignal()?.provider === provider
        ) {
          this.currentPlaylistSignal.set(updatedPlaylist);
        }
      })
    );
  }

  /**
   * Delete a playlist
   */
  deletePlaylist(playlistId: string, provider: Provider = 'local'): Observable<void> {
    let request$: Observable<void>;

    switch (provider) {
      case 'spotify':
        const spotifySession = this.authService.getProviderSession('spotify');
        if (!spotifySession) {
          throw new Error('Spotify not connected');
        }
        // Spotify doesn't allow deleting playlists, only unfollowing
        request$ = this.http.delete<void>(
          `${this.apiUrl}/spotify/playlists/${playlistId}/follow`,
          { params: new HttpParams().set('sessionId', spotifySession) }
        );
        break;

      case 'youtube':
        const youtubeSession = this.authService.getProviderSession('youtube');
        if (!youtubeSession) {
          throw new Error('YouTube not connected');
        }
        request$ = this.http.delete<void>(
          `${this.apiUrl}/youtube/playlists/${playlistId}`,
          { params: new HttpParams().set('sessionId', youtubeSession) }
        );
        break;

      default:
        request$ = this.http.delete<void>(`${this.apiUrl}/playlists/${playlistId}`);
    }

    return request$.pipe(
      tap(() => {
        const current = this.playlistsSubject.getValue();
        this.playlistsSubject.next(
          current.filter((p) => !(p.id === playlistId && p.provider === provider))
        );

        // Clear current playlist if it was deleted
        if (
          this.currentPlaylistSignal()?.id === playlistId &&
          this.currentPlaylistSignal()?.provider === provider
        ) {
          this.currentPlaylistSignal.set(null);
          this.currentPlaylistTracksSignal.set([]);
        }
      })
    );
  }

  // ============================================================================
  // Track Management
  // ============================================================================

  /**
   * Add tracks to a playlist
   */
  addTracksToPlaylist(
    playlistId: string,
    tracks: Track[],
    provider: Provider = 'local',
    position?: number
  ): Observable<void> {
    let request$: Observable<void>;
    const trackUris = tracks.map((t) => this.getTrackUri(t));

    switch (provider) {
      case 'spotify':
        const spotifySession = this.authService.getProviderSession('spotify');
        if (!spotifySession) {
          throw new Error('Spotify not connected');
        }
        request$ = this.http.post<void>(
          `${this.apiUrl}/spotify/playlists/${playlistId}/tracks`,
          { sessionId: spotifySession, uris: trackUris, position }
        );
        break;

      case 'youtube':
        const youtubeSession = this.authService.getProviderSession('youtube');
        if (!youtubeSession) {
          throw new Error('YouTube not connected');
        }
        request$ = this.http.post<void>(
          `${this.apiUrl}/youtube/playlists/${playlistId}/tracks`,
          { sessionId: youtubeSession, videoIds: tracks.map((t) => t.providerId) }
        );
        break;

      default:
        request$ = this.http.post<void>(
          `${this.apiUrl}/playlists/${playlistId}/tracks`,
          { tracks: tracks.map((t) => ({ trackId: t.id, provider: t.provider })), position }
        );
    }

    return request$.pipe(
      tap(() => {
        // Update track count in playlists list
        this.updatePlaylistTrackCount(playlistId, provider, tracks.length);

        // Reload current playlist tracks if viewing this playlist
        if (
          this.currentPlaylistSignal()?.id === playlistId &&
          this.currentPlaylistSignal()?.provider === provider
        ) {
          this.getPlaylistTracks(playlistId, provider).subscribe();
        }
      })
    );
  }

  /**
   * Remove tracks from a playlist
   */
  removeTracksFromPlaylist(
    playlistId: string,
    tracks: { uri: string; positions?: number[] }[],
    provider: Provider = 'local'
  ): Observable<void> {
    let request$: Observable<void>;

    switch (provider) {
      case 'spotify':
        const spotifySession = this.authService.getProviderSession('spotify');
        if (!spotifySession) {
          throw new Error('Spotify not connected');
        }
        request$ = this.http.request<void>('DELETE', `${this.apiUrl}/spotify/playlists/${playlistId}/tracks`, {
          body: { sessionId: spotifySession, tracks },
        });
        break;

      case 'youtube':
        const youtubeSession = this.authService.getProviderSession('youtube');
        if (!youtubeSession) {
          throw new Error('YouTube not connected');
        }
        request$ = this.http.request<void>('DELETE', `${this.apiUrl}/youtube/playlists/${playlistId}/tracks`, {
          body: { sessionId: youtubeSession, videoIds: tracks.map((t) => t.uri) },
        });
        break;

      default:
        request$ = this.http.request<void>('DELETE', `${this.apiUrl}/playlists/${playlistId}/tracks`, {
          body: { tracks: tracks.map((t) => t.uri) },
        });
    }

    return request$.pipe(
      tap(() => {
        // Update track count
        this.updatePlaylistTrackCount(playlistId, provider, -tracks.length);

        // Update current tracks
        if (
          this.currentPlaylistSignal()?.id === playlistId &&
          this.currentPlaylistSignal()?.provider === provider
        ) {
          const trackUris = tracks.map((t) => t.uri);
          const currentTracks = this.currentPlaylistTracksSignal();
          this.currentPlaylistTracksSignal.set(
            currentTracks.filter((pt) => !trackUris.includes(this.getTrackUri(pt.track)))
          );
        }
      })
    );
  }

  /**
   * Reorder tracks in a playlist
   */
  reorderPlaylistTracks(
    playlistId: string,
    rangeStart: number,
    insertBefore: number,
    rangeLength = 1,
    provider: Provider = 'local'
  ): Observable<void> {
    let request$: Observable<void>;

    switch (provider) {
      case 'spotify':
        const spotifySession = this.authService.getProviderSession('spotify');
        if (!spotifySession) {
          throw new Error('Spotify not connected');
        }
        request$ = this.http.put<void>(
          `${this.apiUrl}/spotify/playlists/${playlistId}/tracks`,
          { sessionId: spotifySession, rangeStart, insertBefore, rangeLength }
        );
        break;

      default:
        request$ = this.http.put<void>(
          `${this.apiUrl}/playlists/${playlistId}/tracks/reorder`,
          { rangeStart, insertBefore, rangeLength }
        );
    }

    return request$.pipe(
      tap(() => {
        // Reorder local state
        if (
          this.currentPlaylistSignal()?.id === playlistId &&
          this.currentPlaylistSignal()?.provider === provider
        ) {
          const tracks = [...this.currentPlaylistTracksSignal()];
          const itemsToMove = tracks.splice(rangeStart, rangeLength);
          const insertIndex = insertBefore > rangeStart ? insertBefore - rangeLength : insertBefore;
          tracks.splice(insertIndex, 0, ...itemsToMove);
          this.currentPlaylistTracksSignal.set(tracks);
        }
      })
    );
  }

  // ============================================================================
  // Playlist Cover Image
  // ============================================================================

  /**
   * Update playlist cover image
   */
  updatePlaylistImage(
    playlistId: string,
    imageBase64: string,
    provider: Provider = 'local'
  ): Observable<void> {
    let request$: Observable<void>;

    switch (provider) {
      case 'spotify':
        const spotifySession = this.authService.getProviderSession('spotify');
        if (!spotifySession) {
          throw new Error('Spotify not connected');
        }
        request$ = this.http.put<void>(
          `${this.apiUrl}/spotify/playlists/${playlistId}/images`,
          { sessionId: spotifySession, image: imageBase64 }
        );
        break;

      default:
        request$ = this.http.put<void>(
          `${this.apiUrl}/playlists/${playlistId}/image`,
          { image: imageBase64 }
        );
    }

    return request$;
  }

  // ============================================================================
  // Filtering & Sorting
  // ============================================================================

  /**
   * Filter playlists
   */
  filterPlaylists(filter: PlaylistFilter): Playlist[] {
    let playlists = this.playlistsSubject.getValue();

    if (filter.provider) {
      playlists = playlists.filter((p) => p.provider === filter.provider);
    }

    if (filter.isOwned !== undefined) {
      const currentUserId = this.authService.currentUser()?.id;
      playlists = playlists.filter((p) =>
        filter.isOwned ? p.owner.id === currentUserId : p.owner.id !== currentUserId
      );
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      playlists = playlists.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.owner.displayName.toLowerCase().includes(query)
      );
    }

    return playlists;
  }

  /**
   * Sort playlists
   */
  sortPlaylists(playlists: Playlist[], sort: PlaylistSortOption): Playlist[] {
    const sorted = [...playlists];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'dateAdded':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'lastPlayed':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'trackCount':
          comparison = a.totalTracks - b.totalTracks;
          break;
      }

      return sort.direction === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private getLocalPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/playlists`);
  }

  private getSpotifyPlaylists(sessionId: string): Observable<Playlist[]> {
    const params = new HttpParams().set('sessionId', sessionId);
    return this.http.get<PaginatedResponse<Playlist>>(
      `${this.apiUrl}/spotify/playlists`,
      { params }
    ).pipe(map((response) => response.items || []));
  }

  private getYouTubePlaylists(sessionId: string): Observable<Playlist[]> {
    const params = new HttpParams().set('sessionId', sessionId);
    return this.http.get<PaginatedResponse<Playlist>>(
      `${this.apiUrl}/youtube/playlists`,
      { params }
    ).pipe(map((response) => response.items || []));
  }

  private getTrackUri(track: Track): string {
    switch (track.provider) {
      case 'spotify':
        return `spotify:track:${track.providerId}`;
      case 'youtube':
        return track.providerId;
      default:
        return track.id;
    }
  }

  private updatePlaylistTrackCount(playlistId: string, provider: Provider, delta: number): void {
    const current = this.playlistsSubject.getValue();
    const index = current.findIndex((p) => p.id === playlistId && p.provider === provider);

    if (index >= 0) {
      current[index] = {
        ...current[index],
        totalTracks: Math.max(0, current[index].totalTracks + delta),
      };
      this.playlistsSubject.next([...current]);
    }

    // Update current playlist
    const currentPlaylist = this.currentPlaylistSignal();
    if (currentPlaylist?.id === playlistId && currentPlaylist?.provider === provider) {
      this.currentPlaylistSignal.set({
        ...currentPlaylist,
        totalTracks: Math.max(0, currentPlaylist.totalTracks + delta),
      });
    }
  }

  private createEmptyPlaylist(id: string, provider: Provider): Playlist {
    return {
      id,
      name: 'Unknown Playlist',
      provider,
      isPublic: false,
      isCollaborative: false,
      totalTracks: 0,
      owner: {
        id: '',
        displayName: 'Unknown',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private emptyPaginatedResponse<T>(): PaginatedResponse<T> {
    return {
      items: [],
      total: 0,
      limit: 0,
      offset: 0,
      hasMore: false,
    };
  }

  /**
   * Clear current playlist state
   */
  clearCurrentPlaylist(): void {
    this.currentPlaylistSignal.set(null);
    this.currentPlaylistTracksSignal.set([]);
  }

  /**
   * Refresh playlists
   */
  refreshPlaylists(): void {
    this.loadPlaylists().subscribe();
  }
}

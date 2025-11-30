import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  Observable,
  forkJoin,
  of,
  catchError,
  map,
  tap,
  BehaviorSubject,
} from "rxjs";
import {
  Track,
  Album,
  Artist,
  Playlist,
  Provider,
  SearchResults,
  SearchResultGroup,
  UnifiedSearchResults,
  SearchType,
  PaginatedResponse,
  LikedTrack,
} from "../models";
import { AuthService } from "./auth.service";
import { environment } from "../../../environments/environment";

export interface SearchOptions {
  query: string;
  types?: SearchType[];
  providers?: Provider[];
  limit?: number;
  offset?: number;
}

export interface RecentSearch {
  query: string;
  timestamp: number;
}

const STORAGE_KEYS = {
  RECENT_SEARCHES: "audiora_recent_searches",
  RECENTLY_PLAYED: "audiora_recently_played",
};

const MAX_RECENT_SEARCHES = 10;
const MAX_RECENTLY_PLAYED = 50;

@Injectable({
  providedIn: "root",
})
export class MusicService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  // Search state
  private searchResultsSignal = signal<UnifiedSearchResults | null>(null);
  private isSearchingSignal = signal(false);
  private searchErrorSignal = signal<string | null>(null);

  // Recent searches and plays
  private recentSearches = signal<RecentSearch[]>([]);
  private recentlyPlayed = signal<Track[]>([]);

  // Liked tracks state
  private likedTracksSubject = new BehaviorSubject<Map<string, LikedTrack>>(
    new Map(),
  );
  readonly likedTracks$ = this.likedTracksSubject.asObservable();

  // Public computed signals
  readonly searchResults = computed(() => this.searchResultsSignal());
  readonly isSearching = computed(() => this.isSearchingSignal());
  readonly searchError = computed(() => this.searchErrorSignal());
  readonly recentSearchesList = computed(() => this.recentSearches());
  readonly recentlyPlayedList = computed(() => this.recentlyPlayed());

  constructor() {
    this.loadFromStorage();
  }

  // ============================================================================
  // Search Methods
  // ============================================================================

  /**
   * Search across all connected providers
   */
  search(options: SearchOptions): Observable<UnifiedSearchResults> {
    const {
      query,
      types = ["track", "artist", "album", "playlist"],
      providers,
      limit = 20,
      offset = 0,
    } = options;

    if (!query.trim()) {
      return of({ query, spotify: undefined, youtube: undefined });
    }

    this.isSearchingSignal.set(true);
    this.searchErrorSignal.set(null);
    this.addRecentSearch(query);

    const enabledProviders = providers || this.getConnectedProviders();
    const searchObservables: Observable<{
      provider: Provider;
      results: SearchResults | null;
    }>[] = [];

    if (enabledProviders.includes("spotify")) {
      searchObservables.push(
        this.searchSpotify(query, types, limit, offset).pipe(
          map((results) => ({ provider: "spotify" as Provider, results })),
          catchError(() =>
            of({ provider: "spotify" as Provider, results: null }),
          ),
        ),
      );
    }

    if (enabledProviders.includes("youtube")) {
      searchObservables.push(
        this.searchYouTube(query, types, limit, offset).pipe(
          map((results) => ({ provider: "youtube" as Provider, results })),
          catchError(() =>
            of({ provider: "youtube" as Provider, results: null }),
          ),
        ),
      );
    }

    if (searchObservables.length === 0) {
      this.isSearchingSignal.set(false);
      return of({ query });
    }

    return forkJoin(searchObservables).pipe(
      map((results) => {
        const unified: UnifiedSearchResults = { query };
        results.forEach(({ provider, results: providerResults }) => {
          if (providerResults) {
            if (provider === "spotify") {
              unified.spotify = providerResults;
            } else if (provider === "youtube") {
              unified.youtube = providerResults;
            }
          }
        });
        return unified;
      }),
      tap((results) => {
        this.searchResultsSignal.set(results);
        this.isSearchingSignal.set(false);
      }),
      catchError((error) => {
        this.searchErrorSignal.set(error.message || "Search failed");
        this.isSearchingSignal.set(false);
        throw error;
      }),
    );
  }

  /**
   * Search Spotify
   */
  searchSpotify(
    query: string,
    types: SearchType[],
    limit = 20,
    offset = 0,
  ): Observable<SearchResults> {
    const sessionId = this.authService.getProviderSession("spotify");
    if (!sessionId) {
      return of(this.emptySearchResults(query));
    }

    const params = new HttpParams()
      .set("sessionId", sessionId)
      .set("query", query)
      .set("types", types.join(","))
      .set("limit", limit.toString())
      .set("offset", offset.toString());

    return this.http.get<SearchResults>(`${this.apiUrl}/spotify/search`, {
      params,
    });
  }

  /**
   * Search YouTube
   */
  searchYouTube(
    query: string,
    types: SearchType[],
    limit = 20,
    offset = 0,
  ): Observable<SearchResults> {
    const sessionId = this.authService.getProviderSession("youtube");
    if (!sessionId) {
      return of(this.emptySearchResults(query));
    }

    const params = new HttpParams()
      .set("sessionId", sessionId)
      .set("query", query)
      .set("types", types.join(","))
      .set("limit", limit.toString())
      .set("offset", offset.toString());

    return this.http.get<SearchResults>(`${this.apiUrl}/youtube/search`, {
      params,
    });
  }

  /**
   * Clear search results
   */
  clearSearchResults(): void {
    this.searchResultsSignal.set(null);
    this.searchErrorSignal.set(null);
  }

  // ============================================================================
  // Track Methods
  // ============================================================================

  /**
   * Get track by ID
   */
  getTrack(provider: Provider, trackId: string): Observable<Track> {
    const sessionId = this.authService.getProviderSession(provider);
    const params = sessionId
      ? new HttpParams().set("sessionId", sessionId)
      : undefined;

    return this.http.get<Track>(
      `${this.apiUrl}/${provider}/tracks/${trackId}`,
      { params },
    );
  }

  /**
   * Get multiple tracks
   */
  getTracks(provider: Provider, trackIds: string[]): Observable<Track[]> {
    const sessionId = this.authService.getProviderSession(provider);
    const params = new HttpParams()
      .set("sessionId", sessionId || "")
      .set("ids", trackIds.join(","));

    return this.http.get<Track[]>(`${this.apiUrl}/${provider}/tracks`, {
      params,
    });
  }

  /**
   * Get track recommendations
   */
  getRecommendations(seedTracks: string[], limit = 20): Observable<Track[]> {
    const sessionId = this.authService.getProviderSession("spotify");
    if (!sessionId) {
      return of([]);
    }

    const params = new HttpParams()
      .set("sessionId", sessionId)
      .set("seedTracks", seedTracks.join(","))
      .set("limit", limit.toString());

    return this.http.get<Track[]>(`${this.apiUrl}/spotify/recommendations`, {
      params,
    });
  }

  /**
   * Mark track as played (adds to recently played)
   */
  trackPlayed(track: Track): void {
    this.addRecentlyPlayed(track);
  }

  // ============================================================================
  // Album Methods
  // ============================================================================

  /**
   * Get album by ID
   */
  getAlbum(provider: Provider, albumId: string): Observable<Album> {
    const sessionId = this.authService.getProviderSession(provider);
    const params = sessionId
      ? new HttpParams().set("sessionId", sessionId)
      : undefined;

    return this.http.get<Album>(
      `${this.apiUrl}/${provider}/albums/${albumId}`,
      { params },
    );
  }

  /**
   * Get album tracks
   */
  getAlbumTracks(provider: Provider, albumId: string): Observable<Track[]> {
    const sessionId = this.authService.getProviderSession(provider);
    const params = sessionId
      ? new HttpParams().set("sessionId", sessionId)
      : undefined;

    return this.http.get<Track[]>(
      `${this.apiUrl}/${provider}/albums/${albumId}/tracks`,
      { params },
    );
  }

  /**
   * Get new releases
   */
  getNewReleases(provider: Provider, limit = 20): Observable<Album[]> {
    const sessionId = this.authService.getProviderSession(provider);
    if (!sessionId) {
      return of([]);
    }

    const params = new HttpParams()
      .set("sessionId", sessionId)
      .set("limit", limit.toString());

    return this.http.get<Album[]>(`${this.apiUrl}/${provider}/new-releases`, {
      params,
    });
  }

  // ============================================================================
  // Artist Methods
  // ============================================================================

  /**
   * Get artist by ID
   */
  getArtist(provider: Provider, artistId: string): Observable<Artist> {
    const sessionId = this.authService.getProviderSession(provider);
    const params = sessionId
      ? new HttpParams().set("sessionId", sessionId)
      : undefined;

    return this.http.get<Artist>(
      `${this.apiUrl}/${provider}/artists/${artistId}`,
      { params },
    );
  }

  /**
   * Get artist's top tracks
   */
  getArtistTopTracks(
    provider: Provider,
    artistId: string,
  ): Observable<Track[]> {
    const sessionId = this.authService.getProviderSession(provider);
    const params = sessionId
      ? new HttpParams().set("sessionId", sessionId)
      : undefined;

    return this.http.get<Track[]>(
      `${this.apiUrl}/${provider}/artists/${artistId}/top-tracks`,
      { params },
    );
  }

  /**
   * Get artist's albums
   */
  getArtistAlbums(provider: Provider, artistId: string): Observable<Album[]> {
    const sessionId = this.authService.getProviderSession(provider);
    const params = sessionId
      ? new HttpParams().set("sessionId", sessionId)
      : undefined;

    return this.http.get<Album[]>(
      `${this.apiUrl}/${provider}/artists/${artistId}/albums`,
      { params },
    );
  }

  /**
   * Get related artists
   */
  getRelatedArtists(
    provider: Provider,
    artistId: string,
  ): Observable<Artist[]> {
    const sessionId = this.authService.getProviderSession(provider);
    const params = sessionId
      ? new HttpParams().set("sessionId", sessionId)
      : undefined;

    return this.http.get<Artist[]>(
      `${this.apiUrl}/${provider}/artists/${artistId}/related`,
      { params },
    );
  }

  // ============================================================================
  // Liked Tracks Methods
  // ============================================================================

  /**
   * Get user's liked tracks
   */
  getLikedTracks(
    limit = 50,
    offset = 0,
  ): Observable<PaginatedResponse<LikedTrack>> {
    const params = new HttpParams()
      .set("limit", limit.toString())
      .set("offset", offset.toString());

    return this.http
      .get<
        PaginatedResponse<LikedTrack>
      >(`${this.apiUrl}/user/liked-tracks`, { params })
      .pipe(
        tap((response) => {
          const likedMap = new Map<string, LikedTrack>();
          response.items.forEach((item) => {
            likedMap.set(`${item.provider}:${item.trackId}`, item);
          });
          this.likedTracksSubject.next(likedMap);
        }),
      );
  }

  /**
   * Like a track
   */
  likeTrack(track: Track): Observable<LikedTrack> {
    return this.http
      .post<LikedTrack>(`${this.apiUrl}/user/liked-tracks`, {
        trackId: track.providerId,
        provider: track.provider,
        trackData: track,
      })
      .pipe(
        tap((likedTrack) => {
          const currentMap = this.likedTracksSubject.getValue();
          currentMap.set(`${track.provider}:${track.providerId}`, likedTrack);
          this.likedTracksSubject.next(new Map(currentMap));
        }),
      );
  }

  /**
   * Unlike a track
   */
  unlikeTrack(provider: Provider, trackId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/user/liked-tracks/${provider}/${trackId}`)
      .pipe(
        tap(() => {
          const currentMap = this.likedTracksSubject.getValue();
          currentMap.delete(`${provider}:${trackId}`);
          this.likedTracksSubject.next(new Map(currentMap));
        }),
      );
  }

  /**
   * Check if track is liked
   */
  isTrackLiked(provider: Provider, trackId: string): boolean {
    return this.likedTracksSubject.getValue().has(`${provider}:${trackId}`);
  }

  /**
   * Toggle like status
   */
  toggleLike(track: Track): Observable<boolean> {
    const key = `${track.provider}:${track.providerId}`;
    const isLiked = this.likedTracksSubject.getValue().has(key);

    if (isLiked) {
      return this.unlikeTrack(track.provider, track.providerId).pipe(
        map(() => false),
      );
    } else {
      return this.likeTrack(track).pipe(map(() => true));
    }
  }

  // ============================================================================
  // Recent Searches & Plays
  // ============================================================================

  /**
   * Add search to recent searches
   */
  private addRecentSearch(query: string): void {
    const current = this.recentSearches();
    const filtered = current.filter(
      (s) => s.query.toLowerCase() !== query.toLowerCase(),
    );
    const updated = [{ query, timestamp: Date.now() }, ...filtered].slice(
      0,
      MAX_RECENT_SEARCHES,
    );
    this.recentSearches.set(updated);
    this.saveRecentSearches(updated);
  }

  /**
   * Remove search from recent searches
   */
  removeRecentSearch(query: string): void {
    const updated = this.recentSearches().filter((s) => s.query !== query);
    this.recentSearches.set(updated);
    this.saveRecentSearches(updated);
  }

  /**
   * Clear all recent searches
   */
  clearRecentSearches(): void {
    this.recentSearches.set([]);
    localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  }

  /**
   * Add track to recently played
   */
  private addRecentlyPlayed(track: Track): void {
    const current = this.recentlyPlayed();
    const filtered = current.filter(
      (t) =>
        !(t.provider === track.provider && t.providerId === track.providerId),
    );
    const updated = [track, ...filtered].slice(0, MAX_RECENTLY_PLAYED);
    this.recentlyPlayed.set(updated);
    this.saveRecentlyPlayed(updated);
  }

  /**
   * Clear recently played
   */
  clearRecentlyPlayed(): void {
    this.recentlyPlayed.set([]);
    localStorage.removeItem(STORAGE_KEYS.RECENTLY_PLAYED);
  }

  // ============================================================================
  // Featured Content
  // ============================================================================

  /**
   * Get featured playlists
   */
  getFeaturedPlaylists(provider: Provider, limit = 20): Observable<Playlist[]> {
    const sessionId = this.authService.getProviderSession(provider);
    if (!sessionId) {
      return of([]);
    }

    const params = new HttpParams()
      .set("sessionId", sessionId)
      .set("limit", limit.toString());

    return this.http.get<Playlist[]>(
      `${this.apiUrl}/${provider}/featured-playlists`,
      { params },
    );
  }

  /**
   * Get browse categories
   */
  getCategories(
    provider: Provider,
  ): Observable<{ id: string; name: string; imageUrl?: string }[]> {
    const sessionId = this.authService.getProviderSession(provider);
    if (!sessionId) {
      return of([]);
    }

    const params = new HttpParams().set("sessionId", sessionId);
    return this.http.get<{ id: string; name: string; imageUrl?: string }[]>(
      `${this.apiUrl}/${provider}/categories`,
      { params },
    );
  }

  /**
   * Get category playlists
   */
  getCategoryPlaylists(
    provider: Provider,
    categoryId: string,
    limit = 20,
  ): Observable<Playlist[]> {
    const sessionId = this.authService.getProviderSession(provider);
    if (!sessionId) {
      return of([]);
    }

    const params = new HttpParams()
      .set("sessionId", sessionId)
      .set("limit", limit.toString());

    return this.http.get<Playlist[]>(
      `${this.apiUrl}/${provider}/categories/${categoryId}/playlists`,
      { params },
    );
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Get list of connected providers
   */
  private getConnectedProviders(): Provider[] {
    const providers: Provider[] = [];
    if (this.authService.getProviderSession("spotify")) {
      providers.push("spotify");
    }
    if (this.authService.getProviderSession("youtube")) {
      providers.push("youtube");
    }
    return providers;
  }

  /**
   * Create empty search results
   */
  private emptySearchResults(query: string): SearchResults {
    const emptyGroup = <T>(): SearchResultGroup<T> => ({
      items: [],
      total: 0,
      limit: 0,
      offset: 0,
    });

    return {
      query,
      tracks: emptyGroup<Track>(),
      artists: emptyGroup<Artist>(),
      albums: emptyGroup<Album>(),
      playlists: emptyGroup<Playlist>(),
    };
  }

  /**
   * Load state from storage
   */
  private loadFromStorage(): void {
    const searchesJson = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    if (searchesJson) {
      try {
        this.recentSearches.set(JSON.parse(searchesJson));
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
      }
    }

    const playedJson = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
    if (playedJson) {
      try {
        this.recentlyPlayed.set(JSON.parse(playedJson));
      } catch (e) {
        console.error("Failed to parse recently played:", e);
      }
    }
  }

  /**
   * Save recent searches to storage
   */
  private saveRecentSearches(searches: RecentSearch[]): void {
    localStorage.setItem(
      STORAGE_KEYS.RECENT_SEARCHES,
      JSON.stringify(searches),
    );
  }

  /**
   * Save recently played to storage
   */
  private saveRecentlyPlayed(tracks: Track[]): void {
    localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(tracks));
  }
}

import { Component, signal, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerService, SpotifyPlayable, YouTubePlayable } from './player.service';
import { SpotifyWebSdkService } from './spotify-web-sdk.service';
import { YouTubePlayerService } from './youtube-player.service';
import { LikedSongsService } from './liked-songs.service';
import { AuthService } from './auth.service';
import { SidebarComponent } from './layout/sidebar.component';
import { NowPlayingPanelComponent } from './now-playing-panel.component';
import { AlbumCarouselComponent } from './album-carousel.component';
import { BottomPlayerComponent } from './bottom-player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, SidebarComponent, NowPlayingPanelComponent, BottomPlayerComponent, AlbumCarouselComponent],
  template: `
    <div class="app-shell">
      <aside class="app-sidebar">
        <audiora-sidebar
          [sessionId]="sessionId()"
          [spotifyPlaylists]="spotifyPlaylists()"
          [youtubePlaylists]="youtubePlaylists()"
          [backendConnected]="backendConnected()"
          (connectSpotify)="loginSpotify()"
          (connectYouTube)="loginYouTube()"
          (playSpotifyPlaylist)="playSpotifyPlaylist($event)"
          (selectYouTubePlaylist)="selectYouTubePlaylist($event)"
          (viewLikedSongs)="showLikedSongs()"
          (clear)="clearSession()"
        />
      </aside>
  <main class="app-main">
        <header class="main-header">
          <div class="header-top">
            <h1 class="page-title">Audiora</h1>
            <div class="header-controls">
              <nav class="nav-tabs" *ngIf="sessionId()">
                <button type="button" class="nav-tab" [class.active]="activeTab()==='for-you'" (click)="setTab('for-you')">For You</button>
                <button type="button" class="nav-tab" [class.active]="activeTab()==='library'" (click)="setTab('library')">Your Library</button>
                <button type="button" class="nav-tab" [class.active]="activeTab()==='playlists'" (click)="setTab('playlists')">Playlists</button>
              </nav>

              <!-- Authentication section -->
              <div class="auth-section">
                <div *ngIf="auth.isLoading()" class="auth-loading">
                  <div class="loading-spinner"></div>
                </div>
                <div class="connection-status" [class.connected]="backendConnected()" [class.disconnected]="!backendConnected()">
                  <span class="status-dot"></span>
                  <span class="status-text">{{ backendConnected() ? 'Backend Connected' : 'Backend Disconnected' }}</span>
                </div>
                <div *ngIf="!auth.isLoading() && !auth.isAuthenticated()" class="auth-login">
                  <button type="button" class="login-btn" (click)="auth.login()">
                    <svg class="google-icon" viewBox="0 0 24 24" width="16" height="16">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                  <button type="button" (click)="auth.debugAuthState()" style="margin-left: 8px; padding: 4px 8px; background: #333; color: white; border: none; border-radius: 4px; font-size: 12px;">Debug</button>
                </div>
                <div *ngIf="auth.isAuthenticated()" class="auth-profile">
                  <div class="user-info">
                    <img *ngIf="auth.userPicture()" [src]="auth.userPicture()" [alt]="auth.userName()" class="user-avatar" />
                    <div *ngIf="!auth.userPicture()" class="user-avatar-placeholder">{{ auth.userName().charAt(0).toUpperCase() }}</div>
                    <span class="user-name">{{ auth.userName() }}</span>
                  </div>
                  <button type="button" class="logout-btn" (click)="auth.logout()" title="Sign out">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Modern Main Content Area -->
        <div class="main-content">
          <!-- Current Playing Track Banner -->
          <section *ngIf="sessionId() && nowPlaying()" class="now-playing-banner">
            <div class="now-playing-artwork">
              <img *ngIf="nowPlaying()?.image" [src]="nowPlaying()?.image" [alt]="nowPlaying()?.title" />
              <div *ngIf="!nowPlaying()?.image" class="artwork-placeholder">♪</div>
            </div>
            <div class="now-playing-info">
              <h1 class="track-title">{{ nowPlaying()?.title || 'No track selected' }}</h1>
              <p class="track-artist">{{ nowPlaying()?.artist || 'Unknown Artist' }}</p>
              <div class="track-actions">
                <button class="action-btn liked" [class.active]="isCurrentTrackLiked()">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
                <button class="action-btn">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </button>
                <button class="action-btn">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.05 4.11c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>
          </section>

          <!-- Content based on active tab -->
          <section class="content-section">
            <!-- For You Tab -->
            <div *ngIf="activeTab() === 'for-you'" class="for-you-content">
              <!-- Recently Played Section -->
              <div *ngIf="spotifyResults().length || youtubeResults().length" class="section">
                <h2 class="section-title">Search Results</h2>
                <div class="track-grid">
                  <!-- Spotify Tracks -->
                  <div *ngFor="let track of spotifyResults().slice(0, 6); let i = index" 
                       class="track-card"
                       (click)="playSpotifyTrack(track)"
                       [style.animation-delay.s]="i * 0.1">
                    <div class="track-cover">
                      <img *ngIf="track.image" [src]="track.image" [alt]="track.name">
                      <div *ngIf="!track.image" class="cover-placeholder">♪</div>
                      <div class="play-overlay">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="track-info">
                      <div class="track-name">{{ track.name }}</div>
                      <div class="track-artist">{{ track.artists?.join(', ') || 'Unknown Artist' }}</div>
                    </div>
                  </div>
                  
                  <!-- YouTube Tracks -->
                  <div *ngFor="let track of youtubeResults().slice(0, 6); let i = index" 
                       class="track-card"
                       (click)="playYouTubeTrack(track)"
                       [style.animation-delay.s]="(spotifyResults().length + i) * 0.1">
                    <div class="track-cover">
                      <img *ngIf="track.thumbnail" [src]="track.thumbnail" [alt]="track.title">
                      <div *ngIf="!track.thumbnail" class="cover-placeholder">▶</div>
                      <div class="play-overlay">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="track-info">
                      <div class="track-name">{{ track.title }}</div>
                      <div class="track-artist">{{ track.channel || 'Unknown Channel' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Album carousel for discovery -->
              <audiora-album-carousel *ngIf="sessionId()" [spotify]="spotifyResults()" [youtube]="youtubeResults()"></audiora-album-carousel>
            </div>
              <div class="col-album">{{ t.album || '-' }}</div>
              <div class="col-like">
                <button class="track-like-btn" [class.liked]="isTrackLiked(t, 'spotify')" (click)="$event.stopPropagation(); toggleTrackLike(t, 'spotify')" title="Like">
                  {{ isTrackLiked(t, 'spotify') ? '♥' : '♡' }}
                </button>
              </div>
              <div class="col-duration">{{ formatDuration(t.durationMs) }}</div>
            </div>
            <!-- YouTube tracks -->
            <div *ngFor="let v of youtubeResults(); let i = index" class="track-row list-item smooth-transition gpu-accelerated" (click)="playYouTubeVideo(v)" (dblclick)="enqueueYouTubeVideo(v)" [style.animation-delay.s]="i * 0.05">
              <div class="col-index">{{ spotifyResults().length + i + 1 }}</div>
              <div class="col-title">
                <div class="track-title">{{ v.title }}</div>
                <div class="track-artist">{{ v.channel || 'YouTube' }}</div>
              </div>
              <div class="col-album">YouTube</div>
              <div class="col-like">
                <button class="track-like-btn" [class.liked]="isTrackLiked(v, 'youtube')" (click)="$event.stopPropagation(); toggleTrackLike(v, 'youtube')" title="Like">
                  {{ isTrackLiked(v, 'youtube') ? '♥' : '♡' }}
                </button>
              </div>
              <div class="col-duration">-</div>
            </div>
          </div>
        </section>

        <!-- Playlist tracks section -->
        <section *ngIf="sessionId() && (selectedPlaylist() || viewingLikedSongs()) && playlistTracks().length" class="tracklist-section">
          <div class="playlist-header" *ngIf="selectedPlaylist()">
            <div class="playlist-info-header">
              <div class="playlist-cover-large">
                <img *ngIf="selectedPlaylist()?.image" [src]="selectedPlaylist()?.image" [alt]="selectedPlaylist()?.name" class="cover-image">
                <div *ngIf="!selectedPlaylist()?.image" class="cover-placeholder" [class.spotify]="playlistProvider() === 'spotify'" [class.youtube]="playlistProvider() === 'youtube'">
                  {{ playlistProvider() === 'spotify' ? '♪' : '▶' }}
                </div>
              </div>
              <div class="playlist-details">
                <h2 class="playlist-title">{{ selectedPlaylist()?.name }}</h2>
                <p class="playlist-meta">{{ selectedPlaylist()?.tracks }} {{ playlistProvider() === 'spotify' ? 'songs' : 'videos' }}</p>
                <div class="playlist-actions">
                  <button class="play-all-btn" (click)="playPlaylistFromStart()">
                    <span class="play-icon">▶</span>
                    Play All
                  </button>
                  <button class="back-btn" (click)="clearPlaylistSelection()">← Back</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Liked songs header -->
          <div class="playlist-header" *ngIf="viewingLikedSongs()">
            <div class="playlist-info-header">
              <div class="playlist-cover-large">
                <div class="cover-placeholder liked">♥</div>
              </div>
              <div class="playlist-details">
                <h2 class="playlist-title">Liked Songs</h2>
                <p class="playlist-meta">{{ playlistTracks().length }} liked songs</p>
                <div class="playlist-actions">
                  <button class="play-all-btn" (click)="playPlaylistFromStart()">
                    <span class="play-icon">▶</span>
                    Play All
                  </button>
                  <button class="back-btn" (click)="clearPlaylistSelection()">← Back</button>
                </div>
              </div>
            </div>
          </div>
          <div class="tracklist-header">
            <div class="track-column-headers">
              <div class="col-index">#</div>
              <div class="col-title">Title</div>
              <div class="col-album">Album</div>
              <div class="col-like">♡</div>
              <div class="col-duration">⏱</div>
            </div>
          </div>
          <div class="tracklist-content">
            <div *ngFor="let track of playlistTracks(); let i = index" class="track-row list-item smooth-transition gpu-accelerated"
                 (click)="playPlaylistTrack(track, i)"
                 (dblclick)="enqueuePlaylistTrack(track)"
                 [style.animation-delay.s]="i * 0.03">
              <div class="col-index">{{ i + 1 }}</div>
              <div class="col-title">
                <div class="track-title">{{ getTrackTitle(track) }}</div>
                <div class="track-artist">{{ getTrackArtist(track) }}</div>
              </div>
              <div class="col-album">{{ getTrackAlbum(track) }}</div>
              <div class="col-like">
                <button class="track-like-btn" [class.liked]="isPlaylistTrackLiked(track)" (click)="$event.stopPropagation(); togglePlaylistTrackLike(track)" title="Like">
                  {{ isPlaylistTrackLiked(track) ? '♥' : '♡' }}
                </button>
              </div>
              <div class="col-duration">{{ getTrackDuration(track) }}</div>
            </div>
          </div>
        </section>

        <!-- Album carousel for For You tab -->
        <audiora-album-carousel *ngIf="sessionId() && activeTab()==='for-you'" [spotify]="spotifyResults()" [youtube]="youtubeResults()"></audiora-album-carousel>

        <!-- Library tab content -->
        <section *ngIf="sessionId() && activeTab()==='library'" class="panel liquid-glass-enhanced">
          <h2 class="panel-title">Your Library</h2>
          <div class="library-content">
            <div class="library-section" *ngIf="likedSongs.likedTracks().length">
              <h3>Liked Songs</h3>
              <div class="liked-songs-preview" (click)="showLikedSongs()">
                <div class="liked-cover">♥</div>
                <div class="liked-info">
                  <div class="liked-title">Liked Songs</div>
                  <div class="liked-count">{{ likedSongs.likedTracks().length }} songs</div>
                </div>
              </div>
            </div>
            <div class="library-section" *ngIf="!likedSongs.likedTracks().length">
              <div class="empty-state">
                <div class="empty-icon">📚</div>
                <p>Start building your library by liking songs!</p>
                <p class="muted">Search for music and click the heart icon to add tracks to your library.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Playlists tab content -->
        <section *ngIf="sessionId() && activeTab()==='playlists'" class="panel liquid-glass-enhanced">
          <h2 class="panel-title">Your Playlists</h2>
          <div class="playlists-content">
            <div class="playlists-grid" *ngIf="spotifyPlaylists().length || youtubePlaylists().length">
              <div *ngFor="let playlist of spotifyPlaylists()"
                   class="playlist-card spotify"
                   (click)="playSpotifyPlaylist(playlist)">
                <div class="playlist-cover">
                  <img *ngIf="playlist.image" [src]="playlist.image" [alt]="playlist.name">
                  <div *ngIf="!playlist.image" class="cover-placeholder">♪</div>
                </div>
                <div class="playlist-info">
                  <div class="playlist-name">{{ playlist.name }}</div>
                  <div class="playlist-meta">{{ playlist.tracks }} songs • Spotify</div>
                </div>
              </div>
              <div *ngFor="let playlist of youtubePlaylists()"
                   class="playlist-card youtube"
                   (click)="selectYouTubePlaylist(playlist)">
                <div class="playlist-cover">
                  <img *ngIf="playlist.image" [src]="playlist.image" [alt]="playlist.name">
                  <div *ngIf="!playlist.image" class="cover-placeholder">▶</div>
                </div>
                <div class="playlist-info">
                  <div class="playlist-name">{{ playlist.name }}</div>
                  <div class="playlist-meta">{{ playlist.tracks }} videos • YouTube</div>
                </div>
              </div>
            </div>
            <div class="empty-state" *ngIf="!spotifyPlaylists().length && !youtubePlaylists().length">
              <div class="empty-icon">🎵</div>
              <p>No playlists connected yet</p>
              <p class="muted">Connect your Spotify or YouTube account to view your playlists.</p>
            </div>
          </div>
        </section>

        <!-- Search section (when no tracks loaded and no playlist or liked songs selected) -->
        <section *ngIf="sessionId() && !selectedPlaylist() && !viewingLikedSongs() && !spotifyResults().length && !youtubeResults().length" class="search-section panel liquid-glass-enhanced">
          <h2 class="panel-title">Search Music</h2>
          <form (submit)="doSearch($event)" class="search-form">
            <input class="search-input" type="text" placeholder="Search for tracks, artists, albums..." [(ngModel)]="searchQuery" name="q" required />
            <select class="search-select" [(ngModel)]="searchProvider" name="provider">
              <option value="both">Both Providers</option>
              <option value="spotify">Spotify</option>
              <option value="youtube">YouTube</option>
            </select>
            <button class="search-btn" type="submit" [disabled]="searching">{{ searching ? 'Searching…' : 'Search' }}</button>
          </form>
        </section>

        <!-- Welcome Section for No Session -->
        <div *ngIf="!sessionId()" class="welcome-section">
          <div class="welcome-content">
            <h2 class="welcome-title">Welcome to Audiora</h2>
            <p class="welcome-description">Connect your Spotify and YouTube accounts to search, queue, and play tracks seamlessly. Start by clicking a provider on the left sidebar.</p>
            <div class="welcome-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Connect a provider</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">Search for music</div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-text">Click to play</div>
              </div>
            </div>
          </div>
        </div>
          </section>
        </div>

        <div *ngIf="authError()" class="alert error">Auth Error: {{ authError() }}</div>

        <audiora-now-playing-panel />
      </main>
      <footer class="bottom-bar" *ngIf="nowPlaying()">
        <audiora-bottom-player />
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
  // Old manual flow signals kept (not used now) in case of fallback
  spotifyAuthUrl = signal<string | null>(null);
  youtubeAuthUrl = signal<string | null>(null);
  sessionId = signal<string | null>(null);
  spotifyPlaylists = signal<any[]>([]);
  youtubePlaylists = signal<any[]>([]);
  youtubeItems = signal<any[]>([]);
  selectedYouTubePlaylistId = signal<string | null>(null);

  // Playlist navigation state
  selectedPlaylist = signal<any | null>(null);
  playlistTracks = signal<any[]>([]);
  playlistProvider = signal<'spotify' | 'youtube' | null>(null);
  viewingLikedSongs = signal<boolean>(false);

  playerState = signal<any | null>(null);
  authError = signal<string | null>(null);
  backendConnected = signal<boolean>(true); // Track backend connection status

  // Search state
  spotifyResults = signal<any[]>([]);
  youtubeResults = signal<any[]>([]);
  selectedYouTubeVideoId = signal<string | null>(null);
  searchQuery = '';
  searchProvider: 'both' | 'spotify' | 'youtube' = 'both';
  searching = false;
  activeTab = signal<'for-you'|'library'|'playlists'>('for-you');

  // nowPlaying & barPlaying provided via getters instead of stored fields to avoid init order issues
  get nowPlaying() { return this.player.current; }
  get barPlaying() { return this.player.isPlaying; }
  // Remove progress features for now to stabilize
  positionMs = 0;
  durationMs = 0;
  private progressTimer?: any;

  private backendBase = `http://${window.location.hostname}:8080`;

  constructor(private http: HttpClient, public player: PlayerService, private spotifySdk: SpotifyWebSdkService, private yt: YouTubePlayerService, public likedSongs: LikedSongsService, public auth: AuthService) {
    this.initialSessionCapture();
    // Provide callbacks to player service
    this.player.setCallbacks({
      onSpotifyPlay: async (track: SpotifyPlayable) => {
        if (!this.sessionId()) return false;
        try {
          const deviceId = this.spotifySdk.deviceId();
          const url = deviceId ? `${this.backendBase}/api/spotify/player/play/track?deviceId=${encodeURIComponent(deviceId)}` : `${this.backendBase}/api/spotify/player/play/track`;
          await this.http.post(url, { uri: track.uri }, { headers: this.authHeaders() }).toPromise();
          this.refreshState();
          return true;
        } catch (e) {
          console.warn('Spotify play failed', e);
          return false;
        }
      },
      onSpotifyPause: async () => {
        if (!this.sessionId()) return false;
        try { await this.http.post(`${this.backendBase}/api/spotify/player/pause`, {}, { headers: this.authHeaders() }).toPromise(); return true; } catch { return false; }
      },
      onYouTubePlay: async (video: YouTubePlayable) => {
        this.selectedYouTubeVideoId.set(video.videoId);
        await this.yt.playVideo(video.videoId);
        return true;
      },
      onYouTubeStop: async () => {
        this.yt.pause();
        this.selectedYouTubeVideoId.set(null);
        return true;
      }
    });
  }

  setTab(tab: 'for-you'|'library'|'playlists'){ this.activeTab.set(tab); }

  ngOnInit(): void {
    // Re-run once after Angular initializes (in case constructor ran before location updated)
    if (!this.sessionId()) {
      setTimeout(() => { if (!this.sessionId()) this.initialSessionCapture(); }, 50);
    }
    this.startProgressLoop(); // keep placeholder; can be a no-op now
    // Theme effect
  }

  private initialSessionCapture() {
    const search = window.location.search;
    const hash = window.location.hash;
    const params = new URLSearchParams(search);
    let sid = params.get('sessionId');
    const err = params.get('authError');
    if (err) this.authError.set(err);
    if (!sid && hash) {
      const h = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : hash);
      sid = h.get('sessionId') || sid;
    }
    // Fallback regex if URLSearchParams missed (edge cases with encoded ?)
    if (!sid) {
      const m = /(sessionId=)([A-Za-z0-9\-]+)/.exec(search + hash);
      if (m) sid = m[2];
    }
    const stored = localStorage.getItem('audiora_session');
    if (!sid && stored) sid = stored;
    if (sid) {
      this.setSession(sid);
    }
    // Diagnostics in console
    // eslint-disable-next-line no-console
    console.debug('[Audiora] Session capture', { search, hash, captured: sid, stored });
    // If session already existed and playlists are not yet loaded (fresh app load), ensure fetch
    if (this.sessionId() && !this.spotifyPlaylists().length && !this.youtubePlaylists().length) {
      this.fetchSpotifyPlaylists();
      this.fetchYouTubePlaylists();
    }
  }

  loginSpotify() {
    const sid = this.sessionId();
    const url = sid ? `${this.backendBase}/auth/spotify/login?sessionId=${encodeURIComponent(sid)}` : `${this.backendBase}/auth/spotify/login`;
    this.http.get<{authUrl: string}>(url).subscribe(r => window.location.href = r.authUrl);
  }
  loginYouTube() {
    const sid = this.sessionId();
    const url = sid ? `${this.backendBase}/auth/youtube/login?sessionId=${encodeURIComponent(sid)}` : `${this.backendBase}/auth/youtube/login`;
    this.http.get<{authUrl: string}>(url).subscribe(r => window.location.href = r.authUrl);
  }

  private setSession(id: string) {
    this.sessionId.set(id);
    localStorage.setItem('audiora_session', id);
    // Auto-load playlists for both providers
    this.fetchSpotifyPlaylists();
    this.fetchYouTubePlaylists();
  }

  clearSession() {
    this.sessionId.set(null);
    localStorage.removeItem('audiora_session');
    this.spotifyPlaylists.set([]);
    this.youtubePlaylists.set([]);
    this.youtubeItems.set([]);
    this.playerState.set(null);
  }

  private authHeaders() {
    return { 'X-Session-Id': this.sessionId() || '' };
  }

  fetchSpotifyPlaylists() {
    if (!this.sessionId()) return;
    this.http.get<{items:any[]}>(`${this.backendBase}/api/spotify/playlists`, { headers: this.authHeaders() }).subscribe({
      next: r => {
        this.spotifyPlaylists.set(r.items || []);
        this.backendConnected.set(true);
      },
      error: err => {
        console.log('Spotify playlists not available (may need Spotify connection):', err.status);
        this.spotifyPlaylists.set([]);
        if (err.status === 0) {
          this.backendConnected.set(false);
        }
      }
    });
  }

  fetchYouTubePlaylists() {
    if (!this.sessionId()) return;
    this.http.get<{items:any[]}>(`${this.backendBase}/api/youtube/playlists`, { headers: this.authHeaders() }).subscribe({
      next: r => {
        this.youtubePlaylists.set(r.items || []);
        this.backendConnected.set(true);
      },
      error: err => {
        console.log('YouTube playlists not available (may need YouTube connection):', err.status);
        this.youtubePlaylists.set([]);
        if (err.status === 0) {
          this.backendConnected.set(false);
        }
      }
    });
  }

  selectYouTubePlaylist(p: any) {
    this.selectedPlaylist.set(p);
    this.playlistProvider.set('youtube');
    this.selectedYouTubePlaylistId.set(p.id);
    this.fetchYouTubePlaylistTracks(p.id);
  }

  fetchYouTubePlaylistTracks(id: string) {
    if (!this.sessionId()) return;
    this.http.get<{items:any[]}>(`${this.backendBase}/api/youtube/playlists/${id}/items`, { headers: this.authHeaders() }).subscribe({
      next: r => {
        this.playlistTracks.set(r.items || []);
        this.youtubeItems.set(r.items || []); // Keep for backward compatibility
      },
      error: err => {
        console.log('YouTube playlist tracks not available:', err.status);
        this.playlistTracks.set([]);
        this.youtubeItems.set([]);
      }
    });
  }

  fetchYouTubeItems(id: string) {
    this.fetchYouTubePlaylistTracks(id); // Redirect to new method
  }

  playSpotifyPlaylist(p: any) {
    this.selectedPlaylist.set(p);
    this.playlistProvider.set('spotify');
    this.fetchSpotifyPlaylistTracks(p.id);
  }

  fetchSpotifyPlaylistTracks(id: string) {
    if (!this.sessionId()) return;
    this.http.get<{items:any[]}>(`${this.backendBase}/api/spotify/playlists/${id}/tracks`, { headers: this.authHeaders() }).subscribe(
      r => this.playlistTracks.set(r.items || []),
      error => {
        console.warn('Failed to fetch Spotify playlist tracks, falling back to direct playback:', error);
        // Fallback to original behavior - start playing the playlist immediately
        const body = { context_uri: `spotify:playlist:${id}` };
        this.http.post(`${this.backendBase}/api/spotify/player/play`, body, { headers: this.authHeaders() }).subscribe(() => this.refreshState());
      }
    );
  }

  // Removed old direct playback control wrappers (play/pause/next/previous/state)
  // Bottom player + PlayerService handle playback. Keep refreshState utility for Spotify SDK play callback.
  refreshState() {
    if (!this.sessionId()) return;
    this.http.get(`${this.backendBase}/api/spotify/player/state`, { headers: this.authHeaders() }).subscribe(r => this.playerState.set(r));
  }

  private async ensureSpotifySdkReady() {
    if (!this.sessionId()) return;
    if (this.spotifySdk.ready()) return;
    await this.spotifySdk.load(async () => {
      const r: any = await this.http.get(`${this.backendBase}/api/spotify/player/access-token`, { headers: this.authHeaders() }).toPromise();
      return r.accessToken;
    });
    // Poll briefly for device
    const start = Date.now();
    while (!this.spotifySdk.deviceId() && Date.now() - start < 5000) {
      await new Promise(r => setTimeout(r, 250));
    }
    const deviceId = this.spotifySdk.deviceId();
    if (deviceId) {
      await this.http.post(`${this.backendBase}/api/spotify/player/transfer`, { deviceId, play: false }, { headers: this.authHeaders() }).toPromise();
    } else {
      console.warn('[Audiora] Spotify SDK device not ready after timeout');
    }
  }

  async playSpotifyTrack(t: any) {
    await this.ensureSpotifySdkReady();
    const playable: SpotifyPlayable = {
      provider: 'spotify',
      uri: t.uri,
      id: t.id,
      title: t.name,
      artists: t.artists || [],
      album: t.album,
      durationMs: t.durationMs,
      image: t.image
    };
    this.player.play(playable, false);
  }

  playYouTubeVideo(v: any) {
    const playable: YouTubePlayable = {
      provider: 'youtube',
      videoId: v.videoId,
      title: v.title,
      channel: v.channel,
      image: v.thumbnail
    };
    this.player.play(playable, false);
  }

  enqueueSpotifyTrack(t: any) {
    const playable: SpotifyPlayable = {
      provider: 'spotify',
      uri: t.uri,
      id: t.id,
      title: t.name,
      artists: t.artists || [],
      album: t.album,
      durationMs: t.durationMs,
      image: t.image
    };
    this.player.play(playable, true);
  }

  enqueueYouTubeVideo(v: any) {
    const playable: YouTubePlayable = {
      provider: 'youtube',
      videoId: v.videoId,
      title: v.title,
      channel: v.channel,
      image: v.thumbnail
    };
    this.player.play(playable, true);
  }

  selectYouTubeVideo(v: any) { // fallback kept (may be used elsewhere)
    this.playYouTubeVideo(v);
  }

  youtubeEmbedUrl() { return ''; }

  doSearch(ev: Event) {
    ev.preventDefault();
    if (!this.sessionId() || !this.searchQuery.trim()) return;
    this.searching = true;
    const headers = this.authHeaders();
    const tasks: Promise<any>[] = [];
    if (this.searchProvider === 'spotify' || this.searchProvider === 'both') {
      tasks.push(this.http.get<{items:any[]}>(`${this.backendBase}/api/spotify/search`, { headers, params: { query: this.searchQuery, limit: 10 } }).toPromise());
    } else {
      this.spotifyResults.set([]);
    }
    if (this.searchProvider === 'youtube' || this.searchProvider === 'both') {
      tasks.push(this.http.get<{items:any[]}>(`${this.backendBase}/api/youtube/search`, { headers, params: { query: this.searchQuery, limit: 10 } }).toPromise());
    } else {
      this.youtubeResults.set([]);
    }
    Promise.allSettled(tasks).then(results => {
      // Order of tasks corresponds to providers conditionally
      let spotifyHandled = false;
      for (const res of results) {
        if (res.status === 'fulfilled' && res.value && Array.isArray(res.value.items)) {
          // Decide if it is spotify or youtube by shape heuristics
          if (!spotifyHandled && res.value.items.length && res.value.items[0].uri) {
            this.spotifyResults.set(res.value.items);
            spotifyHandled = true;
          } else if (res.value.items.length && (res.value.items[0].videoId || res.value.items[0].thumbnail !== undefined)) {
            this.youtubeResults.set(res.value.items);
          } else if (!spotifyHandled && this.searchProvider === 'spotify') {
            this.spotifyResults.set(res.value.items);
            spotifyHandled = true;
          } else if (this.searchProvider === 'youtube') {
            this.youtubeResults.set(res.value.items);
          }
        } else if (res.status === 'rejected') {
          // Handle API errors
          const error = res.reason;
          if (error?.status === 401) {
            console.warn('Search API not available (authentication required):', error.url);
            if (error.url?.includes('/youtube/')) {
              console.log('YouTube search requires YouTube connection. Connect YouTube Music in the sidebar to enable search.');
            }
            if (error.url?.includes('/spotify/')) {
              console.log('Spotify search requires Spotify connection. Connect Spotify in the sidebar to enable search.');
            }
          } else {
            console.error('Search API error:', error);
          }
        }
      }
    }).finally(() => this.searching = false);
  }

  private startProgressLoop() { /* disabled for now */ }

  formatDuration(ms: number): string {
    if (!ms) return '-';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Playlist navigation methods
  clearPlaylistSelection() {
    this.selectedPlaylist.set(null);
    this.playlistTracks.set([]);
    this.playlistProvider.set(null);
    this.viewingLikedSongs.set(false);
  }

  showLikedSongs(): void {
    this.clearPlaylistSelection();
    this.viewingLikedSongs.set(true);
    this.playlistTracks.set(this.likedSongs.likedTracks());
  }

  playPlaylistFromStart() {
    if (!this.playlistTracks().length) return;
    const firstTrack = this.playlistTracks()[0];
    this.playPlaylistTrack(firstTrack, 0);
  }

  playPlaylistTrack(track: any, index: number) {
    if (this.viewingLikedSongs()) {
      // Liked songs have their provider stored
      if (track.provider === 'spotify') {
        const spotifyTrack = {
          id: track.id,
          name: track.title,
          artists: [track.artist],
          album: track.album,
          uri: track.uri,
          durationMs: track.durationMs,
          image: track.image,
          provider: 'spotify'
        };
        this.playSpotifyTrack(spotifyTrack);
      } else if (track.provider === 'youtube') {
        const youtubeTrack = {
          videoId: track.videoId || track.id,
          title: track.title,
          channel: track.artist,
          thumbnail: track.image,
          provider: 'youtube'
        };
        this.playYouTubeVideo(youtubeTrack);
      }
    } else if (this.playlistProvider() === 'spotify') {
      this.playSpotifyTrack(track.track || track);
    } else if (this.playlistProvider() === 'youtube') {
      this.playYouTubeVideo(track);
    }
  }

  enqueuePlaylistTrack(track: any) {
    if (this.viewingLikedSongs()) {
      // Similar logic for enqueuing liked songs
      if (track.provider === 'spotify') {
        const spotifyTrack = {
          id: track.id,
          name: track.title,
          artists: [track.artist],
          album: track.album,
          uri: track.uri,
          durationMs: track.durationMs,
          image: track.image,
          provider: 'spotify'
        };
        this.enqueueSpotifyTrack(spotifyTrack);
      } else if (track.provider === 'youtube') {
        const youtubeTrack = {
          videoId: track.videoId || track.id,
          title: track.title,
          channel: track.artist,
          thumbnail: track.image,
          provider: 'youtube'
        };
        this.enqueueYouTubeVideo(youtubeTrack);
      }
    } else if (this.playlistProvider() === 'spotify') {
      this.enqueueSpotifyTrack(track.track || track);
    } else if (this.playlistProvider() === 'youtube') {
      this.enqueueYouTubeVideo(track);
    }
  }

  getTrackTitle(track: any): string {
    if (this.viewingLikedSongs()) {
      return track.title || 'Unknown Track';
    } else if (this.playlistProvider() === 'spotify') {
      return track.track?.name || track.name || 'Unknown Track';
    } else {
      return track.title || 'Unknown Track';
    }
  }

  getTrackArtist(track: any): string {
    if (this.viewingLikedSongs()) {
      return track.artist || 'Unknown Artist';
    } else if (this.playlistProvider() === 'spotify') {
      const artists = track.track?.artists || track.artists;
      return artists?.join(', ') || 'Unknown Artist';
    } else {
      return track.channel || 'YouTube';
    }
  }

  getTrackAlbum(track: any): string {
    if (this.viewingLikedSongs()) {
      return track.album || track.provider === 'youtube' ? 'YouTube' : '-';
    } else if (this.playlistProvider() === 'spotify') {
      return track.track?.album || track.album || '-';
    } else {
      return 'YouTube';
    }
  }

  getTrackDuration(track: any): string {
    if (this.viewingLikedSongs()) {
      return track.durationMs ? this.formatDuration(track.durationMs) : '-';
    } else if (this.playlistProvider() === 'spotify') {
      const ms = track.track?.durationMs || track.durationMs;
      return this.formatDuration(ms);
    } else {
      return '-';
    }
  }

  // Universal like functionality for track lists
  isTrackLiked(track: any, provider: 'spotify' | 'youtube'): boolean {
    const trackId = provider === 'spotify' ? track.id : (track.videoId || track.id);
    return this.likedSongs.isLiked(trackId, provider);
  }

  async toggleTrackLike(track: any, provider: 'spotify' | 'youtube'): Promise<void> {
    await this.likedSongs.toggleLikeServer(track, provider);
  }

  isPlaylistTrackLiked(track: any): boolean {
    if (this.viewingLikedSongs()) {
      return true; // All tracks in liked songs are by definition liked
    }
    const provider = this.playlistProvider();
    if (!provider) return false;
    return this.isTrackLiked(track.track || track, provider);
  }

  togglePlaylistTrackLike(track: any): void {
    if (this.viewingLikedSongs()) {
      // Remove from liked songs
      this.likedSongs.toggleLike(track, track.provider);
      // Update the displayed list
      this.playlistTracks.set(this.likedSongs.likedTracks());
    } else {
      const provider = this.playlistProvider();
      if (!provider) return;
      this.toggleTrackLike(track.track || track, provider);
    }
  }

  // Bottom bar helpers removed; bottom player component interacts with PlayerService directly.
}

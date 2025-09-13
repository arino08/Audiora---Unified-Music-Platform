import { Component, effect, signal, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerService, SpotifyPlayable, YouTubePlayable } from './player.service';
import { SpotifyWebSdkService } from './spotify-web-sdk.service';
import { YouTubePlayerService } from './youtube-player.service';
import { SidebarComponent } from './layout/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, SidebarComponent],
  template: `
    <div class="app-shell">
      <aside class="app-sidebar">
        <audiora-sidebar
          [sessionId]="sessionId()"
          (connectSpotify)="loginSpotify()"
          (connectYouTube)="loginYouTube()"
          (loadSpotifyPlaylists)="fetchSpotifyPlaylists()"
          (loadYouTubePlaylists)="fetchYouTubePlaylists()"
          (clear)="clearSession()"
        />
      </aside>
      <main class="app-main">
        <header class="main-header">
          <h1 class="page-title">Audiora</h1>
          <p class="subtitle">Unified music platform (Spotify + YouTube)</p>
        </header>
        <section class="session" *ngIf="sessionId(); else noSession">
          <section class="search-block panel">
            <h2 class="panel-title">Search</h2>
            <form (submit)="doSearch($event)" class="search-form">
              <input class="text" type="text" placeholder="Search tracks/videos" [(ngModel)]="searchQuery" name="q" required />
              <select class="select" [(ngModel)]="searchProvider" name="provider">
                <option value="both">Both</option>
                <option value="spotify">Spotify</option>
                <option value="youtube">YouTube</option>
              </select>
              <button class="btn primary" type="submit" [disabled]="searching">{{ searching ? 'Searching…' : 'Search' }}</button>
            </form>
            <div class="results-grid">
              <div *ngIf="spotifyResults().length" class="result-col">
                <h3 class="result-title">Spotify Tracks</h3>
                <ul class="list plain">
                  <li *ngFor="let t of spotifyResults()" class="list-item media-row">
                    <button (click)="playSpotifyTrack(t); $event.stopPropagation();" title="Play" class="icon-btn">▶</button>
                    <div class="meta" (click)="playSpotifyTrack(t)" (dblclick)="enqueueSpotifyTrack(t)" title="Click to play • Double-click to enqueue">
                      <strong>{{ t.name }}</strong><br/>
                      <small>{{ t.album }}</small>
                    </div>
                  </li>
                </ul>
              </div>
              <div *ngIf="youtubeResults().length" class="result-col">
                <h3 class="result-title">YouTube Videos</h3>
                <ul class="list plain">
                  <li *ngFor="let v of youtubeResults()" class="list-item media-row">
                    <button (click)="playYouTubeVideo(v); $event.stopPropagation();" title="Play" class="icon-btn">▶</button>
                    <div class="meta" (click)="playYouTubeVideo(v)" (dblclick)="enqueueYouTubeVideo(v)" title="Click to play • Double-click to enqueue">
                      <strong>{{ v.title }}</strong><br/>
                      <small>{{ v.channel }}</small>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </section>
        <ng-template #noSession>
          <div class="empty panel">
            <strong>No active session.</strong> Connect Spotify or YouTube on the left to begin.
          </div>
        </ng-template>

        <div *ngIf="authError()" class="alert error">Auth Error: {{ authError() }}</div>

        <section *ngIf="spotifyPlaylists().length" class="panel">
          <h2 class="panel-title">Spotify Playlists</h2>
          <ul class="list">
            <li *ngFor="let p of spotifyPlaylists()" (click)="playSpotifyPlaylist(p)" class="list-item clickable">
              <strong>{{ p.name }}</strong> <span class="muted">({{ p.tracks }})</span>
            </li>
          </ul>
        </section>

        <section *ngIf="youtubePlaylists().length" class="panel">
          <h2 class="panel-title">YouTube Playlists</h2>
            <ul class="list">
              <li *ngFor="let p of youtubePlaylists()" (click)="selectYouTubePlaylist(p)" class="list-item clickable">
                <strong>{{ p.name }}</strong> <span class="muted">({{ p.tracks }})</span>
              </li>
            </ul>
        </section>

        <section *ngIf="youtubeItems().length" class="panel">
          <h3 class="panel-title">YouTube Items ({{ selectedYouTubePlaylistId() }})</h3>
          <ol class="yt-items">
            <li *ngFor="let v of youtubeItems()">{{ v.position }}. {{ v.title }} <code>{{ v.videoId }}</code></li>
          </ol>
        </section>

        <section *ngIf="sessionId()" class="panel">
          <h2 class="panel-title">Spotify Playback Controls</h2>
          <div class="controls-row">
            <button class="btn" (click)="play()">Play/Resume</button>
            <button class="btn" (click)="pause()">Pause</button>
            <button class="btn" (click)="next()">Next</button>
            <button class="btn" (click)="previous()">Previous</button>
            <button class="btn" (click)="refreshState()">State</button>
          </div>
          <pre *ngIf="playerState() as s" class="state-dump">{{ s | json }}</pre>
        </section>
      </main>
      <footer class="app-bottom" *ngIf="nowPlaying() as np">
        <div class="now-bar">
          <div class="track-meta">
            <strong>{{ np.title }}</strong>
            <small class="muted" *ngIf="np.provider==='spotify'">Spotify</small>
            <small class="muted" *ngIf="np.provider==='youtube'">YouTube</small>
          </div>
          <div class="actions-inline">
            <button class="btn sm" (click)="toggleBarPlay()">{{ player.isPlaying() ? 'Pause' : 'Play' }}</button>
            <button class="btn sm" (click)="nextInQueue()">Next</button>
          </div>
        </div>
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
  playerState = signal<any | null>(null);
  authError = signal<string | null>(null);
  // Search state
  spotifyResults = signal<any[]>([]);
  youtubeResults = signal<any[]>([]);
  selectedYouTubeVideoId = signal<string | null>(null);
  searchQuery = '';
  searchProvider: 'both' | 'spotify' | 'youtube' = 'both';
  searching = false;

  // nowPlaying & barPlaying provided via getters instead of stored fields to avoid init order issues
  get nowPlaying() { return this.player.current; }
  get barPlaying() { return this.player.isPlaying; }
  // Remove progress features for now to stabilize
  positionMs = 0;
  durationMs = 0;
  private progressTimer?: any;

  private backendBase = `http://${window.location.hostname}:8080`;

  constructor(private http: HttpClient, public player: PlayerService, private spotifySdk: SpotifyWebSdkService, private yt: YouTubePlayerService) {
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

  ngOnInit(): void {
    // Re-run once after Angular initializes (in case constructor ran before location updated)
    if (!this.sessionId()) {
      setTimeout(() => { if (!this.sessionId()) this.initialSessionCapture(); }, 50);
    }
    this.startProgressLoop(); // keep placeholder; can be a no-op now
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
    this.http.get<{items:any[]}>(`${this.backendBase}/api/spotify/playlists`, { headers: this.authHeaders() }).subscribe(r => this.spotifyPlaylists.set(r.items || []));
  }

  fetchYouTubePlaylists() {
    if (!this.sessionId()) return;
    this.http.get<{items:any[]}>(`${this.backendBase}/api/youtube/playlists`, { headers: this.authHeaders() }).subscribe(r => this.youtubePlaylists.set(r.items || []));
  }

  selectYouTubePlaylist(p: any) {
    this.selectedYouTubePlaylistId.set(p.id);
    this.fetchYouTubeItems(p.id);
  }

  fetchYouTubeItems(id: string) {
    if (!this.sessionId()) return;
    this.http.get<{items:any[]}>(`${this.backendBase}/api/youtube/playlists/${id}/items`, { headers: this.authHeaders() }).subscribe(r => this.youtubeItems.set(r.items || []));
  }

  playSpotifyPlaylist(p: any) {
    if (!this.sessionId()) return;
    const body = { context_uri: `spotify:playlist:${p.id}` };
    this.http.post(`${this.backendBase}/api/spotify/player/play`, body, { headers: this.authHeaders() }).subscribe(() => this.refreshState());
  }

  play() {
    if (!this.sessionId()) return;
    this.http.post(`${this.backendBase}/api/spotify/player/play`, {}, { headers: this.authHeaders() }).subscribe(() => this.refreshState());
  }
  pause() {
    if (!this.sessionId()) return;
    this.http.post(`${this.backendBase}/api/spotify/player/pause`, {}, { headers: this.authHeaders() }).subscribe(() => this.refreshState());
  }
  next() {
    if (!this.sessionId()) return;
    this.http.post(`${this.backendBase}/api/spotify/player/next`, {}, { headers: this.authHeaders() }).subscribe(() => this.refreshState());
  }
  previous() {
    if (!this.sessionId()) return;
    this.http.post(`${this.backendBase}/api/spotify/player/previous`, {}, { headers: this.authHeaders() }).subscribe(() => this.refreshState());
  }
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
        }
      }
    }).finally(() => this.searching = false);
  }

  private startProgressLoop() { /* disabled for now */ }

  // Bottom bar helpers
  toggleBarPlay() { if (this.player.isPlaying()) { this.pause(); } else { this.play(); } }
  nextInQueue() { this.player.next(); }
}

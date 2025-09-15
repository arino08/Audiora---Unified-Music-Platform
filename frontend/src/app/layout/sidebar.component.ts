import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikedSongsService } from '../liked-songs.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'audiora-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="sidebar-inner liquid-glass">
      <div class="brand-section float-gentle">
        <div class="brand">Audiora</div>
        <p class="tagline">Unified Music Platform</p>
      </div>

      <div class="nav-section" *ngIf="!sessionId">
        <h4 class="section-title">Sign in to get started</h4>
        <p class="signin-hint">Use YouTube authentication to access your music library</p>
      </div>

      <!-- Spotify connection for additional services -->
      <div class="nav-section" *ngIf="sessionId && !spotifyPlaylists.length">
        <h4 class="section-title">Add More Music</h4>
        <div class="connect-buttons">
          <button (click)="connectSpotify.emit()" class="connect-btn spotify liquid-glass-enhanced glass-glow">
            <span class="provider-icon">♪</span>
            <span>Connect Spotify</span>
          </button>
        </div>
        <p class="connect-hint">Link Spotify to access your playlists and library</p>
      </div>

      <!-- Liked Songs section -->
      <div class="nav-section" *ngIf="sessionId && likedSongs.likedTracks().length">
        <div class="section-header">
          <h4 class="section-title">Liked Songs</h4>
          <button *ngIf="auth.isAuthenticated()"
                  (click)="syncLikedSongs()"
                  class="sync-btn"
                  title="Sync liked songs to your account">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
          </button>
        </div>
        <div class="liked-songs-summary liquid-glass liquid-morph" (click)="viewLikedSongs.emit()">
          <div class="liked-icon">♥</div>
          <div class="liked-info">
            <div class="liked-title">Liked Songs</div>
            <div class="liked-count">
              {{ likedSongs.likedTracks().length }} songs
              <span *ngIf="auth.isAuthenticated()" class="sync-status">• Synced</span>
              <span *ngIf="!auth.isAuthenticated()" class="sync-status local">• Local only</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Playlists in sidebar when connected -->
      <div class="nav-section" *ngIf="sessionId && (spotifyPlaylists.length || youtubePlaylists.length)">
        <h4 class="section-title">Playlists</h4>
        <div class="sidebar-playlists">
          <div *ngFor="let p of spotifyPlaylists; let i = index" (click)="playSpotifyPlaylist.emit(p)" class="sidebar-playlist-item liquid-glass glass-glow list-item smooth-transition gpu-accelerated" [style.animation-delay.s]="i * 0.1">
            <div class="playlist-cover">
              <img *ngIf="p.image" [src]="p.image" [alt]="p.name" class="cover-image">
              <div *ngIf="!p.image" class="cover-placeholder spotify">♪</div>
              <div class="provider-badge spotify">♪</div>
            </div>
            <div class="playlist-info">
              <div class="playlist-name">{{ p.name }}</div>
              <div class="playlist-meta">{{ p.tracks }} songs</div>
            </div>
          </div>
          <div *ngFor="let p of youtubePlaylists; let i = index" (click)="selectYouTubePlaylist.emit(p)" class="sidebar-playlist-item liquid-glass glass-glow list-item smooth-transition gpu-accelerated" [style.animation-delay.s]="(spotifyPlaylists.length + i) * 0.1">
            <div class="playlist-cover">
              <img *ngIf="p.image" [src]="p.image" [alt]="p.name" class="cover-image">
              <div *ngIf="!p.image" class="cover-placeholder youtube">▶</div>
              <div class="provider-badge youtube">▶</div>
            </div>
            <div class="playlist-info">
              <div class="playlist-name">{{ p.name }}</div>
              <div class="playlist-meta">{{ p.tracks }} videos</div>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-section" *ngIf="sessionId && (!spotifyPlaylists.length && !youtubePlaylists.length)">
        <h4 class="section-title">Quick Actions</h4>
        <div class="quick-actions">
          <div class="status-indicator" [class.connected]="backendConnected" [class.disconnected]="!backendConnected">
            <span class="status-dot"></span>
            <span>{{ backendConnected ? 'Connected & Ready' : 'Backend Offline' }}</span>
          </div>
        </div>
      </div>

      <div class="spacer"></div>

      <div class="session-section" *ngIf="sessionId">
        <div class="session-info">
          <small class="session-label">Session ID</small>
          <code class="session-id">{{ sessionId }}</code>
        </div>
        <button (click)="clear.emit()" class="clear-btn">
          <span>🚪</span>
          <span>Disconnect</span>
        </button>
      </div>

    </nav>
  `,
  styles: [`
    :host { display: block; height: 100%; }

    nav.sidebar-inner {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--space-6) var(--space-4);
      gap: var(--space-6);
      background: linear-gradient(180deg, #0f161e 0%, #0c1218 60%, #09101a 100%);
      border-right: 1px solid rgba(255,255,255,.08);
      position: relative;
    }

    nav.sidebar-inner:before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 20%, rgba(36,134,255,.15), transparent 70%);
      pointer-events: none;
    }

    .brand-section {
      text-align: center;
      padding: var(--space-4) 0;
    }

    .brand {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: .8px;
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--space-2);
    }

    .tagline {
      font-size: 11px;
      color: var(--color-text-dim);
      margin: 0;
      letter-spacing: .5px;
      text-transform: uppercase;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .section-title {
      font-size: 11px;
      color: var(--color-text-dim);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 var(--space-2);
      font-weight: 600;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-2);
    }

    .sync-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--color-text-dim);
      padding: 4px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s ease;
    }

    .sync-btn:hover {
      background: rgba(255,255,255,0.05);
      color: var(--color-accent);
      border-color: var(--color-accent);
      transform: rotate(180deg);
    }

    .sync-status {
      font-size: 10px;
      opacity: 0.7;
      margin-left: 4px;
    }

    .sync-status.local {
      color: var(--color-warning);
    }

    .connect-buttons {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .connect-btn {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border: 1px solid rgba(255,255,255,.12);
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,.04);
      color: var(--color-text);
      font: inherit;
      cursor: pointer;
      transition: all var(--transition-base);
      text-align: left;
    }

    .connect-btn:hover {
      background: rgba(255,255,255,.08);
      border-color: rgba(255,255,255,.2);
      transform: translateY(-1px);
    }

    .connect-btn.spotify:hover {
      border-color: #1db954;
      box-shadow: 0 0 0 1px rgba(29,185,84,.3);
    }

    .connect-btn.youtube:hover {
      border-color: #ff0000;
      box-shadow: 0 0 0 1px rgba(255,0,0,.3);
    }

    .provider-icon {
      font-size: 16px;
      width: 20px;
      text-align: center;
    }

    .signin-hint, .connect-hint {
      font-size: 13px;
      color: var(--color-text-dim);
      line-height: 1.4;
      margin: 0;
      text-align: center;
      opacity: 0.8;
    }

    .connect-hint {
      margin-top: var(--space-2);
      font-size: 12px;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: 12px;
      background: rgba(46,160,67,.15);
      border: 1px solid rgba(46,160,67,.3);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2ea043;
      animation: pulse-status 2s infinite;
    }

    @keyframes pulse-status {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }

    .spacer {
      flex: 1;
    }

    .session-section {
      border-top: 1px solid rgba(255,255,255,.08);
      padding-top: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .session-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .session-label {
      font-size: 10px;
      color: var(--color-text-dim);
      text-transform: uppercase;
      letter-spacing: .5px;
    }

    .session-id {
      font-size: 9px;
      font-family: var(--font-mono);
      color: var(--color-text-dim);
      background: rgba(255,255,255,.04);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-xs);
      word-break: break-all;
      border: 1px solid rgba(255,255,255,.06);
    }

    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      background: rgba(227,79,79,.15);
      border: 1px solid rgba(227,79,79,.3);
      color: #ff6b6b;
      border-radius: var(--radius-md);
      font: inherit;
      cursor: pointer;
      transition: all var(--transition-base);
      font-size: 12px;
    }

    .clear-btn:hover {
      background: rgba(227,79,79,.25);
      border-color: rgba(227,79,79,.5);
    }

    /* Sidebar playlist styling */
    .sidebar-playlists {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      max-height: 320px;
      overflow-y: auto;
      padding-right: 4px;
    }

    .sidebar-playlist-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      border: 1px solid transparent;
    }

    .sidebar-playlist-item:hover {
      background: rgba(255,255,255,.06);
      border-color: rgba(255,255,255,.12);
    }

    .playlist-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .playlist-icon.spotify {
      background: linear-gradient(135deg, #1db954, #1ed760);
      color: white;
    }

    .playlist-icon.youtube {
      background: linear-gradient(135deg, #ff0000, #ff4444);
      color: white;
    }

    .playlist-cover {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      flex-shrink: 0;
      overflow: hidden;
      background: rgba(255,255,255,.08);
    }

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .cover-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      color: white;
    }

    .cover-placeholder.spotify {
      background: linear-gradient(135deg, #1db954, #1ed760);
    }

    .cover-placeholder.youtube {
      background: linear-gradient(135deg, #ff0000, #ff4444);
    }

    .provider-badge {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      font-weight: bold;
      color: white;
      border: 2px solid var(--color-bg);
    }

    .provider-badge.spotify {
      background: #1db954;
    }

    .provider-badge.youtube {
      background: #ff0000;
    }

    .playlist-info {
      min-width: 0;
      flex: 1;
    }

    .playlist-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.3;
    }

    .playlist-meta {
      font-size: 11px;
      color: var(--color-text-dim);
      margin-top: 1px;
    }

    .sidebar-playlists::-webkit-scrollbar {
      width: 6px;
    }
    .sidebar-playlists::-webkit-scrollbar-track {
      background: transparent;
    }
    .sidebar-playlists::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.15);
      border-radius: 3px;
    }
    .sidebar-playlists::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.25);
    }

    /* Liked songs section styling */
    .liked-songs-summary {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      border: 1px solid transparent;
      background: linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,82,82,0.05));
    }

    .liked-songs-summary:hover {
      background: linear-gradient(135deg, rgba(255,107,107,0.15), rgba(255,82,82,0.1));
      border-color: rgba(255,107,107,0.3);
    }

    .liked-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
      background: linear-gradient(135deg, #ff6b6b, #ff5252);
      flex-shrink: 0;
    }

    .liked-info {
      min-width: 0;
      flex: 1;
    }

    .liked-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text);
      line-height: 1.3;
    }

    .liked-count {
      font-size: 12px;
      color: var(--color-text-dim);
      margin-top: 2px;
    }

  `]
})
export class SidebarComponent {
  @Input() sessionId: string | null = null;
  @Input() spotifyPlaylists: any[] = [];
  @Input() youtubePlaylists: any[] = [];
  @Input() backendConnected: boolean = true;
  @Output() connectSpotify = new EventEmitter<void>();
  @Output() connectYouTube = new EventEmitter<void>();
  @Output() playSpotifyPlaylist = new EventEmitter<any>();
  @Output() selectYouTubePlaylist = new EventEmitter<any>();
  @Output() viewLikedSongs = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  constructor(public likedSongs: LikedSongsService, public auth: AuthService) {}

  async syncLikedSongs(): Promise<void> {
    await this.likedSongs.manualSync();
  }
}

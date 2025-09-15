import { Component, signal, OnInit, NgZone, effect } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  styles: [`
    .inline-instructions-section { margin: var(--space-8) 0; }
    .inline-instructions { position: relative; padding: var(--space-6); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; background: linear-gradient(145deg, rgba(20,28,38,0.85), rgba(12,18,25,0.85)); backdrop-filter: blur(14px) saturate(140%); box-shadow: 0 8px 32px -8px rgba(0,0,0,0.6); animation: fadeIn .4s ease; }
    .inline-header { display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-4); }
    .inline-header h2 { margin:0; font-size: 20px; background: var(--gradient-accent); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .inline-close { background:none; border:none; color: var(--color-text-dim); font-size:24px; cursor:pointer; line-height:1; padding:4px 8px; border-radius:8px; }
    .inline-close:hover { background: rgba(255,255,255,0.08); color: var(--color-text); }
    .inline-instructions .intro { margin:0 0 var(--space-4); color: var(--color-text-dim); line-height:1.5; }
    .inline-instructions .steps { margin:0 0 var(--space-5); padding-left: 1.2em; display:flex; flex-direction:column; gap: var(--space-3); }
    .inline-instructions .steps li { line-height:1.4; }
    .inline-instructions .actions { display:flex; gap: var(--space-3); justify-content:flex-end; margin-top: var(--space-4); }
    .btn-tertiary { background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color: var(--color-text); padding: var(--space-3) var(--space-5); border-radius: 10px; cursor:pointer; font-weight:500; }
    .btn-tertiary:hover { background: rgba(255,255,255,0.12); }
    .btn-accent { background: linear-gradient(135deg,#1db954,#1ed760); color:#fff; border:none; padding: var(--space-3) var(--space-5); border-radius: 10px; cursor:pointer; font-weight:600; box-shadow: 0 4px 18px -4px rgba(29,185,84,0.5); }
    .btn-accent:hover { filter: brightness(1.07); transform: translateY(-1px); }
    .privacy { display:block; margin-top: var(--space-4); font-size:12px; color: var(--color-text-dim); }

    .user-icon {
      font-size: 18px;
    }

    .youtube-signin {
      background: linear-gradient(135deg, #ff0000, #cc0000) !important;
      color: white !important;
      border: none !important;
      padding: 12px 20px !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 18px -4px rgba(255, 0, 0, 0.4) !important;
      transition: all 0.2s ease !important;
    }

    .youtube-signin:hover {
      filter: brightness(1.1) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 24px -4px rgba(255, 0, 0, 0.5) !important;
    }

    .youtube-icon {
      font-size: 18px;
      margin-right: 8px;
    }

    .unverified-badge {
      background: #ffa500;
      color: white;
      font-size: 12px;
      font-weight: bold;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -2px;
      right: -2px;
    }

    /* Modern User Profile Styles */
    .user-chip.modern {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      position: relative;
      min-width: 180px;
    }

    .user-chip.modern:hover {
      background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08));
      border-color: rgba(255,255,255,0.25);
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }

    .avatar-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-fallback {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      color: white;
    }

    .avatar-fallback.large {
      width: 48px;
      height: 48px;
      font-size: 20px;
    }

    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--color-bg);
    }

    .status-indicator.online {
      background: #00ff88;
      box-shadow: 0 0 6px rgba(0,255,136,0.5);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      flex: 1;
    }

    .user-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--color-text);
    }

    .user-status {
      font-size: 12px;
      color: #00ff88;
      font-weight: 500;
    }

    .dropdown-arrow {
      font-size: 12px;
      color: var(--color-text-dim);
      transition: transform 0.2s ease;
    }

    .user-chip.modern:hover .dropdown-arrow {
      transform: rotate(180deg);
    }

    .user-menu.modern {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 280px;
      background: linear-gradient(145deg, rgba(25, 35, 45, 0.98), rgba(15, 22, 30, 0.98));
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      overflow: hidden;
      animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .menu-profile {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
    }

    .profile-avatar {
      position: relative;
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      font-weight: 600;
      font-size: 16px;
      color: var(--color-text);
      margin-bottom: 4px;
    }

    .profile-email {
      font-size: 13px;
      color: var(--color-text-dim);
      margin-bottom: 8px;
    }

    .profile-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #00ff88;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00ff88;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .menu-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      margin: 0 20px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 20px;
      background: none;
      border: none;
      color: var(--color-text);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .menu-item:hover {
      background: rgba(255,255,255,0.08);
    }

    .menu-item.sync:hover {
      background: rgba(29, 185, 84, 0.1);
      color: #1db954;
    }

    .menu-item.settings:hover {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .menu-item.logout:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .menu-icon {
      font-size: 16px;
      width: 20px;
      text-align: center;
    }

    .menu-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .menu-label {
      font-weight: 500;
      font-size: 14px;
    }

    .menu-desc {
      font-size: 12px;
      color: var(--color-text-dim);
    }

    .menu-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: rgba(255, 165, 0, 0.1);
      color: #ffa500;
      font-size: 13px;
    }

    .warning-icon {
      font-size: 16px;
    }

    /* Enhanced Navigation Tabs */
    .nav-tabs.modern {
      display: flex;
      gap: 4px;
      background: rgba(255,255,255,0.05);
      padding: 4px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .nav-tab.modern {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: none;
      border: none;
      color: var(--color-text-dim);
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .nav-tab.modern:hover {
      background: rgba(255,255,255,0.08);
      color: var(--color-text);
      transform: translateY(-1px);
    }

    .nav-tab.modern.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .nav-tab.modern.active::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
      pointer-events: none;
    }

    .tab-icon {
      font-size: 16px;
      filter: grayscale(0.5);
      transition: filter 0.3s ease;
    }

    .nav-tab.modern.active .tab-icon,
    .nav-tab.modern:hover .tab-icon {
      filter: grayscale(0);
    }

    .tab-label {
      font-weight: 600;
    }

    /* Enhanced Header */
    .main-header.modern {
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      font-size: 32px;
      filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }

    .page-title.modern {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientShift 4s ease infinite;
      margin: 0;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .brand-tagline {
      font-size: 12px;
      color: var(--color-text-dim);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
      opacity: 0.8;
    }

    /* Enhanced Loading States */
    .auth-loading.modern {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 20px;
    }

    .loading-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .loading-spinner.modern {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(255,255,255,0.1);
      border-top: 2px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .loading-text {
      font-size: 14px;
      color: var(--color-text-dim);
      font-weight: 500;
    }

    /* Global Enhancements */
    * {
      transition: all 0.2s ease;
    }

    button:not(.nav-tab):not(.user-chip):hover {
      transform: translateY(-1px);
    }

    .liquid-glass, .liquid-glass-enhanced {
      transition: all 0.3s ease;
    }

    .liquid-glass:hover, .liquid-glass-enhanced:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    /* Smooth Entrance Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .main-header, .auth-compact, .nav-tabs {
      animation: fadeInUp 0.6s ease;
    }
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 4px;
    }

    .menu-warning {
      color: #ffa500;
      font-size: 13px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 8px;
    }

    @keyframes fadeIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }
    @keyframes slideIn { from { opacity:0; transform: scale(0.95) translateY(-20px);} to { opacity:1; transform: scale(1) translateY(0);} }
  `],
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
        <header class="main-header modern">
          <div class="header-top">
            <div class="brand-container">
              <div class="brand-icon">🎵</div>
              <h1 class="page-title modern">Audiora</h1>
              <div class="brand-tagline">Unified Music Platform</div>
            </div>
            <div class="header-controls">
              <nav class="nav-tabs modern" *ngIf="sessionId()">
                <button type="button" class="nav-tab modern" [class.active]="activeTab()==='for-you'" (click)="setTab('for-you')">
                  <span class="tab-icon">🎵</span>
                  <span class="tab-label">For You</span>
                </button>
                <button type="button" class="nav-tab modern" [class.active]="activeTab()==='library'" (click)="setTab('library')">
                  <span class="tab-icon">📚</span>
                  <span class="tab-label">Your Library</span>
                </button>
                <button type="button" class="nav-tab modern" [class.active]="activeTab()==='playlists'" (click)="setTab('playlists')">
                  <span class="tab-icon">🎶</span>
                  <span class="tab-label">Playlists</span>
                </button>
              </nav>

              <!-- YouTube-only Authentication section -->
              <div class="auth-compact" *ngIf="!auth.isLoading() && !auth.isAuthenticated()">
                <button type="button" class="auth-btn youtube-signin" (click)="loginYouTube()">
                  <span class="youtube-icon">▶</span>
                  <span>Sign in with YouTube</span>
                </button>
              </div>
              <div class="auth-compact user" *ngIf="!auth.isLoading() && auth.isAuthenticated()">
                <button type="button" class="user-chip modern" (click)="toggleUserMenu()" [title]="auth.userEmail()">
                  <div class="avatar-container">
                    <span class="avatar-fallback">{{ auth.userName().charAt(0).toUpperCase() }}</span>
                    <div class="status-indicator online"></div>
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ shortUserName() }}</span>
                    <span class="user-status">Online</span>
                  </div>
                  <span class="dropdown-arrow">⌄</span>
                  <span *ngIf="!auth.isVerified()" class="unverified-badge" title="Email not verified">!</span>
                </button>
                <div *ngIf="showUserMenu" class="user-menu modern" (mouseleave)="showUserMenu=false">
                  <div class="menu-profile">
                    <div class="profile-avatar">
                      <span class="avatar-fallback large">{{ auth.userName().charAt(0).toUpperCase() }}</span>
                      <div class="status-indicator online"></div>
                    </div>
                    <div class="profile-info">
                      <div class="profile-name">{{ auth.userName() }}</div>
                      <div class="profile-email">{{ auth.userEmail() }}</div>
                      <div class="profile-status">
                        <span class="status-dot"></span>
                        <span>Active now</span>
                      </div>
                    </div>
                  </div>
                  <div class="menu-divider"></div>
                  <div *ngIf="!auth.isVerified()" class="menu-warning">
                    <span class="warning-icon">⚠️</span>
                    <span>Please verify your email</span>
                  </div>
                  <button class="menu-item sync" (click)="likedSongs.manualSync()">
                    <span class="menu-icon">🔄</span>
                    <div class="menu-content">
                      <span class="menu-label">Sync Liked Songs</span>
                      <span class="menu-desc">Update your library</span>
                    </div>
                  </button>
                  <button class="menu-item settings" (click)="openSettings()">
                    <span class="menu-icon">⚙️</span>
                    <div class="menu-content">
                      <span class="menu-label">Settings</span>
                      <span class="menu-desc">Preferences & privacy</span>
                    </div>
                  </button>
                  <div class="menu-divider"></div>
                  <button class="menu-item logout" (click)="auth.logout()">
                    <span class="menu-icon">🚪</span>
                    <div class="menu-content">
                      <span class="menu-label">Sign out</span>
                      <span class="menu-desc">Disconnect from Audiora</span>
                    </div>
                  </button>
                </div>
              </div>
              <div class="auth-loading modern" *ngIf="auth.isLoading()">
                <div class="loading-container">
                  <div class="loading-spinner modern"></div>
                  <span class="loading-text">Connecting...</span>
                </div>
              </div>

            </div>
          </div>
        </header>

        <!-- Hero section with large artwork (when playing) -->
        <section *ngIf="sessionId() && nowPlaying()" class="hero-section">
          <div class="hero-content">
            <div class="hero-artwork">
              <img *ngIf="nowPlaying()?.image" [src]="nowPlaying()?.image" [alt]="nowPlaying()?.title" />
              <div *ngIf="!nowPlaying()?.image" class="artwork-placeholder">♪</div>
            </div>
            <div class="hero-info">
              <h2 class="hero-title">{{ nowPlaying()?.title || 'Deep Intence' }}</h2>
              <div class="hero-controls">
                <button class="hero-btn primary">Like</button>
                <button class="hero-btn">Following</button>
                <button class="hero-btn">⚡</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Inline Spotify Connection Instructions -->
        <section *ngIf="showSpotifyHelp()" class="inline-instructions-section">
          <div class="inline-instructions">
            <div class="inline-header">
              <h2>Connect Spotify</h2>
              <button class="inline-close" (click)="cancelSpotifyHelp()" aria-label="Close">×</button>
            </div>
            <p class="intro">Link your Spotify account to import playlists and enable unified playback.</p>
            <ol class="steps">
              <li><strong>Sign in</strong> with Google first (top-right) if not already.</li>
              <li>Click <strong>Continue with Spotify</strong> below to open Spotify authorization.</li>
              <li><strong>Authorize</strong> read access so we can list your playlists.</li>
              <li>Return automatically—your Spotify playlists will appear in the sidebar.</li>
            </ol>
            <div class="actions">
              <button class="btn-tertiary" (click)="cancelSpotifyHelp()">Cancel</button>
              <button class="btn-accent" (click)="beginSpotifyAuth()">Continue with Spotify ♪</button>
            </div>
            <small class="privacy">Read-only: we never modify or post to your Spotify account.</small>
          </div>
        </section>

        <!-- Track list section for search results -->
        <section *ngIf="sessionId() && !selectedPlaylist() && (spotifyResults().length || youtubeResults().length)" class="tracklist-section">
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
            <!-- Spotify tracks -->
            <div *ngFor="let t of spotifyResults(); let i = index" class="track-row list-item smooth-transition gpu-accelerated" (click)="playSpotifyTrack(t)" (dblclick)="enqueueSpotifyTrack(t)" [style.animation-delay.s]="i * 0.05">
              <div class="col-index">{{ i + 1 }}</div>
              <div class="col-title">
                <div class="track-title">{{ t.name }}</div>
                <div class="track-artist">{{ t.artists?.join(', ') || 'Unknown Artist' }}</div>
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
        <ng-template #noSession>
          <div class="hero panel liquid-glass-enhanced">
            <h2 class="panel-title">Welcome to Audiora</h2>
            <p class="muted" style="max-width:520px;line-height:1.4">Connect your Spotify and YouTube accounts to search, queue, and play tracks seamlessly. Start by clicking a provider on the left sidebar. Your session persists locally so you can pick up where you left off.</p>
            <div class="hero-steps">
              <div class="step">1. Connect a provider</div>
              <div class="step">2. Search for music</div>
              <div class="step">3. Click to play / Double-click to enqueue</div>
            </div>
          </div>
        </ng-template>

        <div *ngIf="authError()" class="alert error">Auth Error: {{ authError() }}</div>

        <section *ngIf="youtubeItems().length" class="panel liquid-glass-enhanced">
          <h3 class="panel-title">YouTube Items ({{ selectedYouTubePlaylistId() }})</h3>
          <ol class="yt-items">
            <li *ngFor="let v of youtubeItems()">{{ v.position }}. {{ v.title }} <code>{{ v.videoId }}</code></li>
          </ol>
        </section>

        <!-- Legacy Spotify playback control panel removed; bottom player & now-playing panel handle controls -->

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
  // Inline help panel state
  showSpotifyHelp = signal(false);

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

  // auth compact UI state
  showUserMenu = false;

  shortUserName() {
    const name = this.auth.userName();
    if (!name) return 'User';
    return name.split(' ')[0];
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  openSettings() {
    // TODO: Implement settings modal
    console.log('Settings clicked');
    this.showUserMenu = false;
  }

  // nowPlaying & barPlaying provided via getters instead of stored fields to avoid init order issues
  get nowPlaying() { return this.player.current; }
  get barPlaying() { return this.player.isPlaying; }
  // Remove progress features for now to stabilize
  positionMs = 0;
  durationMs = 0;
  private progressTimer?: any;

  private backendBase = `http://${window.location.hostname}:8080`;

  constructor(
    private http: HttpClient,
    public player: PlayerService,
    private spotifySdk: SpotifyWebSdkService,
    private yt: YouTubePlayerService,
    public likedSongs: LikedSongsService,
    public auth: AuthService,
    private ngZone: NgZone,
    private router: Router
  ) {
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

  private async initialSessionCapture() {
    const search = window.location.search;
    const hash = window.location.hash;
    const params = new URLSearchParams(search);
    let sid = params.get('sessionId');
    let userId = params.get('userId');
    const err = params.get('authError');

    if (err) this.authError.set(err);

    if (!sid && hash) {
      const h = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : hash);
      sid = h.get('sessionId') || sid;
      userId = userId || h.get('userId');
    }

    // Fallback regex if URLSearchParams missed (edge cases with encoded ?)
    if (!sid) {
      const m = /(sessionId=)([A-Za-z0-9\-]+)/.exec(search + hash);
      if (m) sid = m[2];
    }
    if (!userId && sid) {
      const m = /(userId=)([A-Za-z0-9\-]+)/.exec(search + hash);
      if (m) userId = m[2];
    }

    // If we have both sessionId and userId from OAuth callback, exchange for JWT token
    if (sid && userId) {
      try {
        console.log('OAuth callback detected, exchanging for JWT token...');
        const response = await this.auth.exchangeOAuthSession(sid, userId);

        console.log('OAuth authentication successful, user logged in');

        // Clean up URL parameters
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (error) {
        console.error('Failed to exchange OAuth session for JWT token:', error);
        this.authError.set('Authentication failed');
      }
    }

    // Handle regular session for API calls
    const stored = localStorage.getItem('audiora_session');
    if (!sid && stored) sid = stored;
    if (sid) {
      this.setSession(sid);
    }

    // Diagnostics in console
    // eslint-disable-next-line no-console
    console.debug('[Audiora] Session capture', { search, hash, captured: sid, userId, stored });

    // If session already existed and playlists are not yet loaded (fresh app load), ensure fetch
    if (this.sessionId() && !this.spotifyPlaylists().length && !this.youtubePlaylists().length) {
      this.fetchSpotifyPlaylists();
      this.fetchYouTubePlaylists();
    }
  }

  loginSpotify() {
    if (!this.spotifyPlaylists().length) {
      this.showSpotifyHelp.set(true);
      return;
    }
    this.startSpotifyAuth();
  }

  private startSpotifyAuth() {
    const sid = this.sessionId();
    const url = sid ? `${this.backendBase}/api/auth/spotify/login?sessionId=${encodeURIComponent(sid)}` : `${this.backendBase}/api/auth/spotify/login`;
    this.http.get<{authUrl: string}>(url).subscribe(r => window.location.href = r.authUrl);
  }

  beginSpotifyAuth() {
    this.showSpotifyHelp.set(false);
    this.startSpotifyAuth();
  }

  cancelSpotifyHelp() { this.showSpotifyHelp.set(false); }
  loginYouTube() {
    const sid = this.sessionId();
    const url = sid ? `${this.backendBase}/api/auth/youtube/login?sessionId=${encodeURIComponent(sid)}` : `${this.backendBase}/api/auth/youtube/login`;
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
        if ((r.items || []).length > 0 && this.showSpotifyHelp()) {
          // Hide instructions once playlists are available
          this.showSpotifyHelp.set(false);
        }
      },
      error: err => {
        console.log('Spotify playlists not available (may need Spotify connection):', err.status);
        this.spotifyPlaylists.set([]);
        if (err.status === 0) {
          this.backendConnected.set(false);
        }
        // If user has a session but no playlists, show help panel automatically (unless explicitly dismissed)
        if (this.sessionId() && !this.showSpotifyHelp()) {
          this.showSpotifyHelp.set(true);
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

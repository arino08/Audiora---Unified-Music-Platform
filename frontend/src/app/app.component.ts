import {
  Component,
  OnInit,
  inject,
  OnDestroy,
  ViewChild,
  HostListener,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter } from "rxjs/operators";
import { Subject, takeUntil } from "rxjs";
import {
  PlayerService,
  ThemeService,
  DynamicThemeService,
  ToastService,
  AuthService,
  YouTubePlayerService,
  SpotifySdkService,
  LikedTracksService,
  KeyboardShortcutsService,
  SleepTimerService,
  MediaSessionService,
  SleepTimerPreset,
} from "./core/services";
import { ToastContainerComponent } from "./shared/components/toast/toast-container.component";
import { QueuePanelComponent } from "./shared/components/queue-panel/queue-panel.component";
import { YouTubePlayerComponent } from "./shared/components/youtube-player/youtube-player.component";
import { Track, RepeatMode } from "./core/models";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    ToastContainerComponent,
    QueuePanelComponent,
    YouTubePlayerComponent,
  ],
  template: `
    <!-- Aurora Background -->
    <div class="aurora-background"></div>
    <div class="aurora-dynamic"></div>
    <!-- Dynamic color orbs -->
    <div class="aurora-orb aurora-orb-primary"></div>
    <div class="aurora-orb aurora-orb-secondary"></div>
    <div class="aurora-orb aurora-orb-accent"></div>
    <div class="noise-overlay"></div>

    <!-- Toast Notifications -->
    <app-toast-container></app-toast-container>

    <!-- Skip Link for Accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Main App Shell -->
    <div class="app-shell" [class.queue-open]="queueVisible">
      <!-- Sidebar -->
      <aside class="sidebar glass-surface" [class.collapsed]="sidebarCollapsed">
        <!-- Logo -->
        <div class="sidebar-header">
          <div class="logo" (click)="toggleSidebar()">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="logo-icon"
            >
              <defs>
                <linearGradient
                  id="sidebar-logo-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style="stop-color:#a855f7" />
                  <stop offset="50%" style="stop-color:#3b82f6" />
                  <stop offset="100%" style="stop-color:#14b8a6" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#sidebar-logo-gradient)"
                stroke-width="2"
                fill="none"
                opacity="0.3"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="url(#sidebar-logo-gradient)"
                stroke-width="2"
                fill="none"
                opacity="0.5"
              />
              <circle
                cx="50"
                cy="50"
                r="25"
                stroke="url(#sidebar-logo-gradient)"
                stroke-width="2"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M42 35 L42 65 L68 50 Z"
                fill="url(#sidebar-logo-gradient)"
              />
            </svg>
            <span class="logo-text" *ngIf="!sidebarCollapsed">Audiora</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="nav-section-title" *ngIf="!sidebarCollapsed"
              >Menu</span
            >
            <a
              class="nav-item"
              [class.active]="activeRoute === 'home'"
              (click)="setActiveRoute('home')"
            >
              <svg
                class="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed">Home</span>
            </a>
            <a
              class="nav-item"
              [class.active]="activeRoute === 'search'"
              (click)="setActiveRoute('search')"
            >
              <svg
                class="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed">Search</span>
            </a>
            <a
              class="nav-item"
              [class.active]="activeRoute === 'library'"
              (click)="setActiveRoute('library')"
            >
              <svg
                class="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path
                  d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                />
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed">Library</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-section-title" *ngIf="!sidebarCollapsed"
              >Playlists</span
            >
            <a
              class="nav-item"
              [class.active]="activeRoute === 'liked'"
              (click)="setActiveRoute('liked')"
            >
              <svg
                class="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed"
                >Liked Songs</span
              >
            </a>
            <a class="nav-item" (click)="createPlaylist()">
              <svg
                class="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed"
                >Create Playlist</span
              >
            </a>
          </div>
        </nav>

        <!-- Connected Services -->
        <div class="sidebar-footer" *ngIf="!sidebarCollapsed">
          <span class="nav-section-title">Connected</span>
          <div class="connected-services">
            <button
              class="service-badge spotify"
              [class.connected]="spotifyConnected"
              (click)="
                spotifyConnected ? navigateToSettings() : connectSpotify()
              "
              [title]="
                spotifyConnected
                  ? 'Manage Spotify connection'
                  : 'Connect Spotify'
              "
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
              <span>Spotify</span>
            </button>
            <button
              class="service-badge youtube"
              [class.connected]="youtubeConnected"
              (click)="
                youtubeConnected ? navigateToSettings() : connectYouTube()
              "
              [title]="
                youtubeConnected
                  ? 'Manage YouTube connection'
                  : 'Connect YouTube'
              "
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
              <span>YouTube</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="main-wrapper">
        <!-- Header -->
        <header class="header glass-surface">
          <div class="header-left">
            <button
              class="btn-icon nav-btn"
              (click)="goBack()"
              [disabled]="!canGoBack"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              class="btn-icon nav-btn"
              (click)="goForward()"
              [disabled]="!canGoForward"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div class="header-center">
            <div class="search-bar glass">
              <svg
                class="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                [(ngModel)]="searchQuery"
                (keyup.enter)="performSearch()"
              />
              <kbd class="search-shortcut">⌘K</kbd>
            </div>
          </div>

          <div class="header-right">
            <button class="btn-icon" (click)="toggleTheme()">
              <svg
                *ngIf="isDarkTheme"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <svg
                *ngIf="!isDarkTheme"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
            <button class="btn-icon notifications-btn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span class="notification-dot"></span>
            </button>
            <div class="user-menu-container">
              <button class="user-menu glass" (click)="toggleUserMenu()">
                <div class="user-avatar">
                  <img
                    *ngIf="userAvatar"
                    [src]="userAvatar"
                    alt="User avatar"
                  />
                  <svg
                    *ngIf="!userAvatar"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span class="user-name">{{ userName || "Guest" }}</span>
                <svg
                  class="dropdown-icon"
                  [class.rotated]="userMenuOpen"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <!-- User Menu Dropdown -->
              <div
                class="user-menu-dropdown glass-surface"
                *ngIf="userMenuOpen"
              >
                <div class="dropdown-header">
                  <div class="dropdown-avatar">
                    <img
                      *ngIf="userAvatar"
                      [src]="userAvatar"
                      alt="User avatar"
                    />
                    <svg
                      *ngIf="!userAvatar"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div class="dropdown-user-info">
                    <span class="dropdown-user-name">{{
                      userName || "Guest"
                    }}</span>
                    <span class="dropdown-user-email"
                      >user&#64;audiora.app</span
                    >
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" (click)="navigateToProfile()">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Profile</span>
                </button>
                <button class="dropdown-item" (click)="navigateToSettings()">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path
                      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                    />
                  </svg>
                  <span>Settings</span>
                </button>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout" (click)="logout()">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Log out</span>
                </button>
              </div>

              <!-- Backdrop to close menu on click outside -->
              <div
                class="user-menu-backdrop"
                *ngIf="userMenuOpen"
                (click)="closeUserMenu()"
              ></div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main id="main-content" class="main-content">
          <router-outlet></router-outlet>

          <!-- Placeholder content when no route matched -->
          <div class="welcome-content" *ngIf="!hasRouteContent">
            <div class="welcome-hero">
              <h1 class="text-gradient">Welcome to Audiora</h1>
              <p>
                Your unified music streaming experience. Connect your favorite
                services and enjoy all your music in one beautiful place.
              </p>
            </div>

            <div class="quick-actions">
              <div class="action-card glass-card" (click)="connectSpotify()">
                <div class="action-icon spotify-bg">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                    />
                  </svg>
                </div>
                <h3>Connect Spotify</h3>
                <p>Access your Spotify playlists and favorites</p>
              </div>

              <div class="action-card glass-card" (click)="connectYouTube()">
                <div class="action-icon youtube-bg">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                </div>
                <h3>Connect YouTube</h3>
                <p>Stream YouTube Music and videos</p>
              </div>

              <div
                class="action-card glass-card"
                (click)="setActiveRoute('search')"
              >
                <div class="action-icon search-bg">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3>Discover Music</h3>
                <p>Search across all your connected services</p>
              </div>
            </div>

            <div class="recent-section" *ngIf="recentlyPlayed.length > 0">
              <h2>Recently Played</h2>
              <div class="recent-grid">
                <div
                  class="recent-item glass-card"
                  *ngFor="let item of recentlyPlayed"
                >
                  <img [src]="item.albumArt" [alt]="item.title" />
                  <div class="recent-info">
                    <span class="recent-title">{{ item.title }}</span>
                    <span class="recent-artist">{{ item.artist }}</span>
                  </div>
                  <button class="play-btn" (click)="playTrack(item)">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Player Bar -->
      <footer class="player-bar glass-surface">
        <div class="player-track">
          <div class="track-art" *ngIf="currentTrack">
            <img [src]="currentTrack.albumArt" [alt]="currentTrack.title" />
          </div>
          <div class="track-art placeholder" *ngIf="!currentTrack">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="2" y="2" width="20" height="20" rx="4" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="12" cy="12" r="1" />
            </svg>
          </div>
          <div class="track-info" *ngIf="currentTrack">
            <span class="track-title truncate">{{ currentTrack.title }}</span>
            <span class="track-artist truncate">{{ currentTrack.artist }}</span>
          </div>
          <div class="track-info" *ngIf="!currentTrack">
            <span class="track-title text-muted">No track playing</span>
            <span class="track-artist text-muted">Select a song to play</span>
          </div>
          <button
            class="btn-icon like-btn"
            *ngIf="currentTrack"
            (click)="toggleLike()"
          >
            <svg
              viewBox="0 0 24 24"
              [attr.fill]="isLiked ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </button>
          <!-- Provider indicator - shows when playing from Spotify or YouTube -->
          <button
            class="btn-icon provider-btn spotify"
            *ngIf="currentTrack?.provider === 'spotify'"
            (click)="openInSpotify()"
            title="Playing from Spotify - Click to open in Spotify"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
              />
            </svg>
          </button>
          <button
            class="btn-icon provider-btn youtube"
            *ngIf="currentTrack?.provider === 'youtube'"
            (click)="openInYouTube()"
            title="Playing from YouTube - Click to open in YouTube"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
          </button>
        </div>

        <div class="player-controls">
          <div class="control-buttons">
            <button
              class="btn-icon"
              (click)="toggleShuffle()"
              [class.active]="isShuffled"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
            </button>
            <button class="btn-icon" (click)="previousTrack()">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" />
              </svg>
            </button>
            <button class="btn-icon play-pause-btn" (click)="togglePlayPause()">
              <svg *ngIf="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <svg *ngIf="isPlaying" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>
            <button class="btn-icon" (click)="nextTrack()">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>
            <button
              class="btn-icon"
              (click)="toggleRepeat()"
              [class.active]="repeatMode !== 'off'"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              <span class="repeat-indicator" *ngIf="repeatMode === 'track'"
                >1</span
              >
            </button>
          </div>

          <div class="progress-bar">
            <span class="time-current">{{ formatTime(currentTime) }}</span>
            <div class="progress-track" (click)="seekTo($event)">
              <div
                class="progress-fill"
                [style.width.%]="progressPercent"
              ></div>
              <div
                class="progress-handle"
                [style.left.%]="progressPercent"
              ></div>
            </div>
            <span class="time-total">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <div class="player-extra">
          <!-- Sleep Timer -->
          <div class="sleep-timer-wrapper" style="position: relative;">
            <button
              class="btn-icon"
              [class.active]="sleepTimerActive"
              (click)="toggleSleepTimerDropdown()"
              title="Sleep Timer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>
            <!-- Sleep timer badge showing remaining time -->
            <span *ngIf="sleepTimerActive" class="sleep-timer-badge">
              {{ sleepTimerRemaining }}
            </span>
            <!-- Dropdown -->
            <div class="sleep-timer-dropdown" *ngIf="sleepTimerDropdownOpen">
              <div *ngIf="sleepTimerActive" class="sleep-timer-active-display">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  style="width: 20px; height: 20px;"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span class="sleep-timer-time">{{ sleepTimerRemaining }}</span>
                <button class="sleep-timer-cancel" (click)="cancelSleepTimer()">
                  Cancel
                </button>
              </div>
              <button
                *ngFor="let preset of sleepTimerPresets"
                class="sleep-timer-option"
                (click)="setSleepTimer(preset.value)"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
          <button
            class="btn-icon"
            [class.active]="queueVisible"
            (click)="toggleQueue()"
            title="Queue (Q)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button class="btn-icon" (click)="toggleDevices()">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
          <div class="volume-control">
            <button class="btn-icon" (click)="toggleMute()">
              <svg
                *ngIf="volume > 0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <svg
                *ngIf="volume > 0 && volume <= 0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <svg
                *ngIf="volume === 0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            </button>
            <div class="volume-slider">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                [value]="volume"
                (input)="setVolume($event)"
              />
              <div class="volume-fill" [style.width.%]="volume * 100"></div>
            </div>
          </div>
          <button class="btn-icon" (click)="toggleFullscreen()">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>
      </footer>

      <!-- Queue Panel -->
      <app-queue-panel #queuePanel></app-queue-panel>

      <!-- YouTube Embedded Player -->
      <app-youtube-player #youtubePlayer></app-youtube-player>
    </div>

    <!-- Keyboard Shortcuts Modal -->
    <div
      class="shortcuts-modal-overlay"
      *ngIf="shortcutsModalOpen"
      (click)="closeShortcutsModal()"
    >
      <div class="shortcuts-modal" (click)="$event.stopPropagation()">
        <div class="shortcuts-modal-header">
          <h2>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path
                d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M6 16h8"
              />
            </svg>
            Keyboard Shortcuts
          </h2>
          <button class="shortcuts-modal-close" (click)="closeShortcutsModal()">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="shortcuts-modal-body">
          <div
            class="shortcuts-category"
            *ngFor="
              let category of ['playback', 'volume', 'navigation', 'other']
            "
          >
            <h3 class="shortcuts-category-title">{{ category }}</h3>
            <div
              class="shortcut-item"
              *ngFor="let shortcut of shortcutsByCategory[category]"
            >
              <span class="shortcut-description">{{
                shortcut.description
              }}</span>
              <span class="shortcut-keys">
                <kbd
                  class="shortcut-key"
                  [class.wide]="
                    shortcut.key === ' ' || shortcut.key === 'Escape'
                  "
                >
                  {{ formatShortcut(shortcut) }}
                </kbd>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PWA Install Banner -->
    <div class="pwa-install-banner" *ngIf="showPwaInstallBanner">
      <div class="pwa-install-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <div class="pwa-install-content">
        <h4>Install Audiora</h4>
        <p>Add to your home screen for a better experience</p>
      </div>
      <div class="pwa-install-actions">
        <button class="pwa-install-btn" (click)="installPwa()">Install</button>
        <button class="pwa-dismiss-btn" (click)="dismissPwaBanner()">
          Not now
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        overflow: hidden;
      }

      /* ============================================
         APP SHELL LAYOUT - Premium Glass Design
         ============================================ */
      .app-shell {
        display: grid;
        grid-template-columns: var(--sidebar-width) 1fr;
        grid-template-rows: 1fr var(--player-height);
        height: 100vh;
        overflow: hidden;
        transition: grid-template-columns var(--transition-slow)
          cubic-bezier(0.4, 0, 0.2, 1);
      }

      .app-shell.queue-open {
        grid-template-columns: var(--sidebar-width) 1fr 380px;
      }

      .app-shell.queue-open .main-wrapper {
        grid-column: 2;
      }

      .app-shell.queue-open .player-bar {
        grid-column: 1 / 4;
      }

      /* ============================================
         SIDEBAR - Glassmorphic Navigation
         ============================================ */
      .sidebar {
        grid-row: 1 / 3;
        display: flex;
        flex-direction: column;
        padding: var(--space-5);
        border-right: 1px solid var(--surface-border);
        overflow-y: auto;
        overflow-x: hidden;
        transition: all var(--transition-slow);
        position: relative;
      }

      .sidebar::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(var(--dynamic-primary-rgb), 0.03) 0%,
          transparent 30%
        );
        pointer-events: none;
        transition: background var(--transition-slow);
      }

      .sidebar.collapsed {
        width: var(--sidebar-collapsed-width);
      }

      .sidebar-header {
        padding: var(--space-2) 0 var(--space-8);
        position: relative;
        z-index: 1;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        cursor: pointer;
        transition: transform var(--transition-base);
      }

      .logo:hover {
        transform: scale(1.02);
      }

      .logo-icon {
        width: 42px;
        height: 42px;
        flex-shrink: 0;
        filter: drop-shadow(0 0 25px rgba(var(--dynamic-primary-rgb), 0.5));
        transition: filter var(--transition-slow);
      }

      .logo:hover .logo-icon {
        filter: drop-shadow(0 0 35px rgba(var(--dynamic-primary-rgb), 0.7));
      }

      .logo-text {
        font-family: var(--font-family-display);
        font-size: var(--text-xl);
        font-weight: 800;
        background: linear-gradient(
          135deg,
          var(--dynamic-primary, var(--aurora-purple)),
          var(--dynamic-secondary, var(--aurora-teal))
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
      }

      /* Navigation */
      .sidebar-nav {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-8);
        position: relative;
        z-index: 1;
      }

      .nav-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }

      .nav-section-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        padding: var(--space-2) var(--space-3);
        margin-bottom: var(--space-1);
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-3);
        border-radius: var(--radius-xl);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-base);
        position: relative;
        overflow: hidden;
      }

      .nav-item::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(var(--dynamic-primary-rgb), 0.15),
          rgba(var(--dynamic-secondary-rgb), 0.05)
        );
        opacity: 0;
        transition: opacity var(--transition-base);
        border-radius: inherit;
      }

      .nav-item:hover {
        color: var(--text-primary);
      }

      .nav-item:hover::before {
        opacity: 1;
      }

      .nav-item.active {
        color: var(--text-primary);
        background: rgba(var(--dynamic-primary-rgb), 0.1);
        border: 1px solid rgba(var(--dynamic-primary-rgb), 0.2);
      }

      .nav-item.active::before {
        opacity: 1;
      }

      .nav-item.active .nav-icon {
        color: var(--dynamic-primary, var(--aurora-purple));
        filter: drop-shadow(0 0 8px rgba(var(--dynamic-primary-rgb), 0.5));
      }

      .nav-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        transition: all var(--transition-base);
      }

      .nav-label {
        font-size: var(--text-sm);
        font-weight: 500;
        position: relative;
        z-index: 1;
      }

      /* Sidebar Footer - Connected Services */
      .sidebar-footer {
        padding-top: var(--space-5);
        border-top: 1px solid var(--surface-border);
        margin-top: auto;
        position: relative;
        z-index: 1;
      }

      .connected-services {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-top: var(--space-3);
      }

      .service-badge {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius-lg);
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--text-tertiary);
        background: var(--surface-glass);
        border: 1px solid var(--surface-border);
        cursor: pointer;
        transition: all var(--transition-base);
        backdrop-filter: blur(10px);
      }

      .service-badge svg {
        width: 16px;
        height: 16px;
        transition: transform var(--transition-base);
      }

      .service-badge:hover svg {
        transform: scale(1.1);
      }

      .service-badge.spotify.connected {
        color: var(--spotify-green);
        border-color: rgba(29, 185, 84, 0.4);
        background: rgba(29, 185, 84, 0.1);
      }

      .service-badge.youtube.connected {
        color: var(--youtube-red);
        border-color: rgba(255, 0, 0, 0.4);
        background: rgba(255, 0, 0, 0.1);
      }

      .service-badge:hover {
        background: var(--surface-glass-hover);
        transform: translateX(4px);
      }

      /* ============================================
         MAIN WRAPPER
         ============================================ */
      .main-wrapper {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
      }

      /* ============================================
         HEADER - Floating Glass Bar
         ============================================ */
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: var(--header-height);
        padding: 0 var(--space-6);
        border-bottom: 1px solid var(--surface-border);
        flex-shrink: 0;
        position: relative;
        z-index: 10;
      }

      .header::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(var(--dynamic-primary-rgb), 0.3),
          transparent
        );
      }

      .header-left,
      .header-right {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .nav-btn {
        width: 34px;
        height: 34px;
        border-radius: var(--radius-full);
        background: var(--surface-glass);
        border: 1px solid var(--surface-border);
        transition: all var(--transition-base);
      }

      .nav-btn:hover:not(:disabled) {
        background: var(--surface-glass-hover);
        border-color: var(--surface-border-hover);
        transform: scale(1.05);
      }

      .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .nav-btn svg {
        width: 16px;
        height: 16px;
      }

      /* Search Bar - Premium Glass Style */
      .header-center {
        flex: 1;
        max-width: 520px;
        margin: 0 var(--space-8);
      }

      .search-bar {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-2-5) var(--space-4);
        border-radius: var(--radius-full);
        background: var(--surface-glass);
        border: 1px solid var(--surface-border);
        transition: all var(--transition-base);
        backdrop-filter: blur(20px);
      }

      .search-bar:focus-within {
        background: var(--surface-glass-hover);
        border-color: rgba(var(--dynamic-primary-rgb), 0.4);
        box-shadow:
          0 0 0 3px rgba(var(--dynamic-primary-rgb), 0.1),
          0 8px 32px rgba(0, 0, 0, 0.2);
      }

      .search-icon {
        width: 18px;
        height: 18px;
        color: var(--text-muted);
        flex-shrink: 0;
        transition: color var(--transition-base);
      }

      .search-bar:focus-within .search-icon {
        color: var(--dynamic-primary, var(--aurora-purple));
      }

      .search-bar input {
        flex: 1;
        font-size: var(--text-sm);
        font-weight: 500;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-primary);
      }

      .search-bar input::placeholder {
        color: var(--text-muted);
        font-weight: 400;
      }

      .search-shortcut {
        padding: var(--space-1) var(--space-2);
        font-size: 11px;
        font-family: var(--font-family-mono);
        font-weight: 500;
        color: var(--text-muted);
        background: var(--surface-glass-hover);
        border-radius: var(--radius-md);
        border: 1px solid var(--surface-border);
      }

      /* Header Buttons */
      .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: var(--radius-lg);
        color: var(--text-secondary);
        transition: all var(--transition-base);
        position: relative;
      }

      .btn-icon:hover {
        background: var(--surface-glass);
        color: var(--text-primary);
        transform: scale(1.05);
      }

      .btn-icon:active {
        transform: scale(0.95);
      }

      .btn-icon svg {
        width: 20px;
        height: 20px;
      }

      .notifications-btn {
        position: relative;
      }

      .notification-dot {
        position: absolute;
        top: 7px;
        right: 7px;
        width: 8px;
        height: 8px;
        background: linear-gradient(
          135deg,
          var(--aurora-pink),
          var(--aurora-rose)
        );
        border-radius: 50%;
        border: 2px solid var(--color-bg-secondary);
        animation: pulse-scale 2s ease-in-out infinite;
      }

      /* User Menu Container */
      .user-menu-container {
        position: relative;
      }

      /* User Menu - Premium Pill Button */
      .user-menu {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-1) var(--space-3) var(--space-1) var(--space-1);
        border-radius: var(--radius-full);
        background: var(--surface-glass);
        border: 1px solid var(--surface-border);
        cursor: pointer;
        transition: all var(--transition-base);
        backdrop-filter: blur(20px);
      }

      .user-menu:hover {
        background: var(--surface-glass-hover);
        border-color: var(--surface-border-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .user-menu .dropdown-icon {
        transition: transform var(--transition-base);
      }

      .user-menu .dropdown-icon.rotated {
        transform: rotate(180deg);
      }

      /* User Menu Dropdown - Glass Panel */
      .user-menu-dropdown {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        min-width: 280px;
        border-radius: var(--radius-2xl);
        padding: var(--space-2);
        z-index: 1001;
        animation: dropdownSlideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow:
          0 20px 50px rgba(0, 0, 0, 0.4),
          0 0 1px rgba(255, 255, 255, 0.1) inset;
      }

      @keyframes dropdownSlideIn {
        from {
          opacity: 0;
          transform: translateY(-12px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .dropdown-header {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-xl);
        background: linear-gradient(
          135deg,
          rgba(var(--dynamic-primary-rgb), 0.1),
          transparent
        );
        margin-bottom: var(--space-2);
      }

      .dropdown-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          var(--dynamic-primary, var(--aurora-purple)),
          var(--dynamic-secondary, var(--aurora-teal))
        );
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(var(--dynamic-primary-rgb), 0.3);
      }

      .dropdown-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .dropdown-avatar svg {
        width: 24px;
        height: 24px;
        color: white;
      }

      .dropdown-user-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .dropdown-user-name {
        font-weight: 700;
        color: var(--text-primary);
        font-size: var(--text-base);
      }

      .dropdown-user-email {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .dropdown-divider {
        height: 1px;
        background: var(--surface-border);
        margin: var(--space-2) 0;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        width: 100%;
        padding: var(--space-3) var(--space-4);
        border: none;
        background: transparent;
        border-radius: var(--radius-lg);
        cursor: pointer;
        color: var(--text-primary);
        font-size: var(--text-sm);
        font-weight: 500;
        transition: all var(--transition-fast);
      }

      .dropdown-item:hover {
        background: var(--surface-glass-hover);
      }

      .dropdown-item svg {
        width: 18px;
        height: 18px;
        color: var(--text-tertiary);
        transition: color var(--transition-fast);
      }

      .dropdown-item:hover svg {
        color: var(--dynamic-primary, var(--aurora-purple));
      }

      .dropdown-item.logout {
        color: var(--color-error);
      }

      .dropdown-item.logout svg {
        color: var(--color-error);
      }

      .dropdown-item.logout:hover {
        background: rgba(239, 68, 68, 0.1);
      }

      /* Backdrop for closing menu */
      .user-menu-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
      }

      .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          var(--dynamic-primary, var(--aurora-purple)),
          var(--dynamic-secondary, var(--aurora-teal))
        );
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(var(--dynamic-primary-rgb), 0.3);
      }

      .user-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .user-avatar svg {
        width: 16px;
        height: 16px;
        color: white;
      }

      .user-name {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-primary);
      }

      .dropdown-icon {
        width: 16px;
        height: 16px;
        color: var(--text-muted);
      }

      /* ============================================
         MAIN CONTENT
         ============================================ */
      .main-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: var(--space-8);
        position: relative;
      }

      /* Welcome Content */
      .welcome-content {
        animation: slide-up var(--transition-slow) ease forwards;
      }

      .welcome-hero {
        text-align: center;
        padding: var(--space-16) 0 var(--space-12);
        position: relative;
      }

      .welcome-hero h1 {
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 800;
        margin-bottom: var(--space-5);
        letter-spacing: -0.03em;
        line-height: 1.1;
      }

      .welcome-hero p {
        font-size: var(--text-lg);
        color: var(--text-secondary);
        max-width: 550px;
        margin: 0 auto;
        line-height: 1.7;
      }

      /* Quick Actions - Premium Cards */
      .quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-6);
        margin-top: var(--space-10);
      }

      .action-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: var(--space-10) var(--space-6);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .action-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(
          circle at 50% 0%,
          rgba(255, 255, 255, 0.08),
          transparent 60%
        );
        opacity: 0;
        transition: opacity var(--transition-base);
      }

      .action-card:hover::before {
        opacity: 1;
      }

      .action-icon {
        width: 72px;
        height: 72px;
        border-radius: var(--radius-2xl);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--space-5);
        position: relative;
        transition: all var(--transition-base);
      }

      .action-card:hover .action-icon {
        transform: scale(1.1) translateY(-4px);
      }

      .action-icon::after {
        content: "";
        position: absolute;
        inset: -4px;
        border-radius: inherit;
        background: inherit;
        filter: blur(20px);
        opacity: 0.5;
        z-index: -1;
      }

      .action-icon svg {
        width: 32px;
        height: 32px;
        color: white;
      }

      .spotify-bg {
        background: linear-gradient(135deg, #1db954, #1aa34a);
        box-shadow: 0 8px 25px rgba(29, 185, 84, 0.4);
      }

      .youtube-bg {
        background: linear-gradient(135deg, #ff0000, #cc0000);
        box-shadow: 0 8px 25px rgba(255, 0, 0, 0.4);
      }

      .search-bg {
        background: linear-gradient(
          135deg,
          var(--dynamic-primary, var(--aurora-purple)),
          var(--dynamic-secondary, var(--aurora-teal))
        );
        box-shadow: 0 8px 25px rgba(var(--dynamic-primary-rgb), 0.4);
      }

      .action-card h3 {
        font-size: var(--text-lg);
        font-weight: 700;
        margin-bottom: var(--space-2);
        color: var(--text-primary);
      }

      .action-card p {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        line-height: 1.5;
      }

      /* Recently Played */
      .recent-section {
        margin-top: var(--space-16);
      }

      .recent-section h2 {
        margin-bottom: var(--space-6);
        font-weight: 700;
      }

      .recent-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .recent-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .recent-item::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(var(--dynamic-primary-rgb), 0.1),
          transparent
        );
        opacity: 0;
        transition: opacity var(--transition-base);
      }

      .recent-item:hover::before {
        opacity: 1;
      }

      .recent-item img {
        width: 56px;
        height: 56px;
        border-radius: var(--radius-lg);
        object-fit: cover;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        transition: all var(--transition-base);
      }

      .recent-item:hover img {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      }

      .recent-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }

      .recent-title {
        font-weight: 600;
        color: var(--text-primary);
        font-size: var(--text-sm);
      }

      .recent-artist {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .play-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          var(--dynamic-primary, var(--aurora-purple)),
          var(--dynamic-secondary, var(--aurora-teal))
        );
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: scale(0.8);
        transition: all var(--transition-base);
        box-shadow: 0 4px 15px rgba(var(--dynamic-primary-rgb), 0.4);
      }

      .play-btn svg {
        width: 18px;
        height: 18px;
        color: white;
        margin-left: 2px;
      }

      .recent-item:hover .play-btn {
        opacity: 1;
        transform: scale(1);
      }

      .play-btn:hover {
        transform: scale(1.1) !important;
      }

      /* Provider button styles */
      .provider-btn {
        position: relative;
        transition: all var(--transition-base);
      }

      .provider-btn.spotify {
        color: var(--spotify-green);
      }

      .provider-btn.youtube {
        color: var(--youtube-red);
      }

      .provider-btn:hover {
        transform: scale(1.15);
      }

      .provider-btn svg {
        width: 18px;
        height: 18px;
      }

      /* ============================================
         PLAYER BAR - Premium Glass Player
         ============================================ */
      .player-bar {
        grid-column: 1 / 3;
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        align-items: center;
        padding: 0 var(--space-5);
        border-top: 1px solid var(--surface-border);
        position: relative;
        background: linear-gradient(
          180deg,
          rgba(var(--dynamic-primary-rgb), 0.03) 0%,
          transparent 100%
        );
      }

      .player-bar::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(var(--dynamic-primary-rgb), 0.4),
          transparent
        );
      }

      /* Track Info */
      .player-track {
        display: flex;
        align-items: center;
        gap: var(--space-4);
      }

      .track-art {
        width: 60px;
        height: 60px;
        border-radius: var(--radius-lg);
        overflow: hidden;
        flex-shrink: 0;
        position: relative;
        box-shadow:
          0 4px 20px rgba(0, 0, 0, 0.3),
          0 0 40px rgba(var(--dynamic-primary-rgb), 0.15);
        transition: all var(--transition-base);
      }

      .track-art:hover {
        transform: scale(1.05);
      }

      .track-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .track-art.placeholder {
        background: linear-gradient(
          135deg,
          var(--surface-glass),
          var(--surface-glass-hover)
        );
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .track-art.placeholder svg {
        width: 24px;
        height: 24px;
        color: var(--text-muted);
      }

      .track-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
        max-width: 200px;
        gap: var(--space-1);
      }

      .track-title {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-primary);
        transition: color var(--transition-base);
      }

      .track-title:hover {
        color: var(--dynamic-primary, var(--aurora-purple));
        cursor: pointer;
      }

      .track-artist {
        font-size: var(--text-xs);
        color: var(--text-tertiary);
      }

      .track-artist:hover {
        color: var(--text-secondary);
        cursor: pointer;
      }

      .like-btn {
        transition: all var(--transition-base);
      }

      .like-btn:hover {
        transform: scale(1.15);
      }

      .like-btn.active svg {
        color: var(--dynamic-accent, var(--aurora-pink));
        fill: var(--dynamic-accent, var(--aurora-pink));
        filter: drop-shadow(
          0 0 8px rgba(var(--dynamic-accent-rgb, 236, 72, 153), 0.5)
        );
      }

      /* Player Controls */
      .player-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3);
      }

      .control-buttons {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .control-buttons .btn-icon {
        transition: all var(--transition-base);
      }

      .control-buttons .btn-icon:hover {
        color: var(--text-primary);
      }

      .play-pause-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--text-primary);
        color: var(--text-inverse);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-base);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }

      .play-pause-btn:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }

      .play-pause-btn:active {
        transform: scale(0.95);
      }

      .play-pause-btn svg {
        width: 18px;
        height: 18px;
      }

      .control-buttons .btn-icon.active {
        color: var(--dynamic-primary, var(--aurora-purple));
      }

      .control-buttons .btn-icon.active:hover {
        color: var(--dynamic-primary, var(--aurora-purple));
        filter: drop-shadow(0 0 8px rgba(var(--dynamic-primary-rgb), 0.5));
      }

      .repeat-indicator {
        position: absolute;
        font-size: 9px;
        font-weight: 700;
        bottom: 4px;
        right: 4px;
        color: var(--dynamic-primary, var(--aurora-purple));
      }

      /* Progress Bar - Dynamic Gradient */
      .progress-bar {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        width: 100%;
        max-width: 600px;
      }

      .time-current,
      .time-total {
        font-size: 11px;
        font-weight: 500;
        font-family: var(--font-family-mono);
        color: var(--text-muted);
        min-width: 40px;
        text-align: center;
      }

      .progress-track {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-full);
        cursor: pointer;
        position: relative;
        transition: height var(--transition-fast);
      }

      .progress-track:hover {
        height: 6px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(
          90deg,
          var(--dynamic-primary, var(--aurora-purple)),
          var(--dynamic-secondary, var(--aurora-teal))
        );
        border-radius: var(--radius-full);
        transition: width 0.1s linear;
        position: relative;
      }

      .progress-handle {
        position: absolute;
        top: 50%;
        width: 14px;
        height: 14px;
        background: white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: all var(--transition-fast);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .progress-track:hover .progress-handle {
        opacity: 1;
      }

      .progress-track:hover .progress-fill {
        box-shadow: 0 0 12px rgba(var(--dynamic-primary-rgb), 0.5);
      }

      /* Player Extra Controls */
      .player-extra {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--space-2);
      }

      .player-extra .btn-icon.active {
        color: var(--dynamic-primary, var(--aurora-purple));
      }

      /* Sleep Timer Wrapper */
      .sleep-timer-wrapper {
        position: relative;
      }

      .sleep-timer-wrapper .sleep-timer-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        padding: 2px 6px;
        background: rgba(var(--dynamic-primary-rgb), 0.9);
        border-radius: var(--radius-full);
        font-size: 10px;
        font-weight: 600;
        color: white;
        pointer-events: none;
        animation: pulse 2s ease-in-out infinite;
      }

      .sleep-timer-dropdown {
        position: absolute;
        bottom: 100%;
        right: 0;
        margin-bottom: var(--space-3);
        min-width: 200px;
        padding: var(--space-2);
        background: var(--color-bg-elevated);
        backdrop-filter: var(--glass-blur);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        z-index: var(--z-dropdown);
        animation: slide-up var(--transition-fast);
      }

      .sleep-timer-active-display {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3);
        background: rgba(var(--dynamic-primary-rgb), 0.1);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-2);
      }

      .sleep-timer-time {
        font-family: var(--font-family-mono);
        font-weight: 600;
        color: var(--dynamic-primary);
      }

      .sleep-timer-cancel {
        margin-left: auto;
        padding: var(--space-1) var(--space-2);
        background: transparent;
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .sleep-timer-cancel:hover {
        background: var(--color-error);
        border-color: var(--color-error);
        color: white;
      }

      .sleep-timer-option {
        display: block;
        width: 100%;
        padding: var(--space-3) var(--space-4);
        background: transparent;
        border: none;
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        color: var(--text-primary);
        text-align: left;
        cursor: pointer;
        transition: background var(--transition-fast);
      }

      .sleep-timer-option:hover {
        background: var(--surface-glass-hover);
      }

      .volume-control {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .volume-slider {
        width: 100px;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-full);
        position: relative;
        transition: height var(--transition-fast);
      }

      .volume-slider:hover {
        height: 6px;
      }

      .volume-slider input {
        position: absolute;
        width: 100%;
        height: 200%;
        top: -50%;
        opacity: 0;
        cursor: pointer;
      }

      .volume-fill {
        height: 100%;
        background: var(--text-primary);
        border-radius: var(--radius-full);
        pointer-events: none;
        transition: background var(--transition-base);
      }

      .volume-slider:hover .volume-fill {
        background: var(--dynamic-primary, var(--aurora-purple));
      }

      /* Responsive */
      @media (max-width: 1023px) {
        .app-shell {
          grid-template-columns: var(--sidebar-collapsed-width) 1fr;
        }

        .sidebar {
          width: var(--sidebar-collapsed-width);
          align-items: center;
        }

        .nav-label,
        .nav-section-title,
        .logo-text,
        .sidebar-footer,
        .user-name,
        .search-shortcut {
          display: none;
        }

        .nav-item {
          justify-content: center;
          padding: var(--space-3);
        }
      }

      @media (max-width: 767px) {
        .app-shell {
          grid-template-columns: 1fr;
          grid-template-rows: var(--header-height) 1fr var(--player-height) 64px;
        }

        .sidebar {
          grid-row: 4;
          grid-column: 1;
          display: flex;
          flex-direction: row;
          width: 100%;
          border-right: none;
          border-top: 1px solid var(--surface-border);
          z-index: 100;
          background: var(--surface-elevated);
          padding: 0;
        }

        .sidebar-header {
          display: none;
        }
        
        .sidebar-nav {
          display: flex;
          flex-direction: row;
          width: 100%;
          justify-content: space-around;
          align-items: center;
          padding: 0;
          gap: 0;
          overflow: hidden;
        }

        .nav-section {
          display: flex;
          flex-direction: row;
          width: 100%;
          justify-content: space-around;
          margin-bottom: 0;
        }

        /* Hide playlists section on mobile to save space */
        .nav-section:nth-child(2) {
          display: none; 
        }

        .nav-section-title {
          display: none;
        }

        .nav-item {
          flex-direction: column;
          padding: var(--space-2);
          gap: 4px;
          border-radius: 0;
        }

        .nav-item.active {
          background: transparent;
          color: var(--brand-primary);
        }

        .nav-label {
          display: block !important;
          font-size: 10px;
        }

        .player-bar {
          grid-row: 3;
          grid-column: 1;
          grid-template-columns: 1fr auto;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-3);
          border-top: 1px solid var(--surface-border);
        }

        .player-controls {
          display: flex;
          width: auto;
        }

        .playback-bar {
          display: none;
        }

        .player-extra {
          display: none;
        }

        .header-center {
          display: none;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("queuePanel") queuePanel!: QueuePanelComponent;
  @ViewChild("youtubePlayer") youtubePlayer!: YouTubePlayerComponent;
  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  // Inject services
  private readonly playerService = inject(PlayerService);
  private readonly themeService = inject(ThemeService);
  private readonly dynamicThemeService = inject(DynamicThemeService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly youtubePlayerService = inject(YouTubePlayerService);
  private readonly spotifySdkService = inject(SpotifySdkService);
  private readonly router = inject(Router);
  private readonly likedTracksService = inject(LikedTracksService);
  private readonly keyboardShortcuts = inject(KeyboardShortcutsService);
  private readonly sleepTimerService = inject(SleepTimerService);
  private readonly mediaSessionService = inject(MediaSessionService);

  private readonly destroy$ = new Subject<void>();

  // Queue visibility
  queueVisible = false;

  // Sleep timer
  sleepTimerDropdownOpen = false;
  get sleepTimerActive(): boolean {
    return this.sleepTimerService.isActive();
  }
  get sleepTimerRemaining(): string {
    return this.sleepTimerService.remainingFormatted();
  }
  get sleepTimerPresets() {
    return this.sleepTimerService.presetOptions;
  }

  // Keyboard shortcuts modal
  shortcutsModalOpen = false;
  get shortcutsByCategory() {
    return this.keyboardShortcuts.getShortcutsByCategory();
  }

  // PWA install
  showPwaInstallBanner = false;
  private pwaInstallPrompt: any = null;

  // Sidebar state
  sidebarCollapsed = false;
  activeRoute = "home";

  // User menu dropdown state
  userMenuOpen = false;

  // Navigation state
  canGoBack = false;
  canGoForward = false;

  // Search
  searchQuery = "";

  // Theme - now backed by ThemeService
  get isDarkTheme(): boolean {
    return this.themeService.isDarkMode();
  }

  get dynamicThemeEnabled(): boolean {
    return this.dynamicThemeService.isEnabled();
  }

  // User
  userName = "";
  userAvatar = "";

  // Provider connections - now backed by AuthService
  get spotifyConnected(): boolean {
    return this.authService.isProviderConnected("spotify");
  }

  get youtubeConnected(): boolean {
    return this.authService.isProviderConnected("youtube");
  }

  // Player state - now backed by PlayerService signals
  get currentTrack(): Track | null {
    return this.playerService.currentTrack();
  }

  get isPlaying(): boolean {
    return this.playerService.isPlaying();
  }

  get isShuffled(): boolean {
    return this.playerService.isShuffled();
  }

  get repeatMode(): RepeatMode {
    return this.playerService.repeatMode();
  }

  // isLiked is now computed from LikedTracksService
  get isLiked(): boolean {
    const track = this.currentTrack;
    if (!track) return false;
    const provider = track.provider as "spotify" | "youtube";
    return this.likedTracksService.isLiked(provider, track.id);
  }

  get currentTime(): number {
    return this.playerService.position() / 1000; // Convert ms to seconds
  }

  get duration(): number {
    return this.playerService.duration() / 1000; // Convert ms to seconds
  }

  get volume(): number {
    return this.playerService.volume();
  }

  get isMuted(): boolean {
    return this.playerService.isMuted();
  }

  // Content
  hasRouteContent = false;
  recentlyPlayed: Track[] = [];

  get progressPercent(): number {
    return this.playerService.progressPercent();
  }

  get currentPlaybackSource() {
    return this.playerService.currentPlaybackSource();
  }

  // Open track in Spotify web player
  openInSpotify(): void {
    const track = this.currentTrack;
    if (track && track.provider === "spotify") {
      const trackId = track.providerId || track.id;
      window.open(`https://open.spotify.com/track/${trackId}`, "_blank");
    }
  }

  // Open track in YouTube
  openInYouTube(): void {
    const track = this.currentTrack;
    if (track && track.provider === "youtube") {
      const videoId = track.providerId || track.id;
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    }
  }

  ngOnInit(): void {
    // Initialize theme from ThemeService (it auto-initializes from localStorage)
    this.loadUserData();
    this.loadRecentlyPlayed();

    // Track active route from router events
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.updateActiveRouteFromUrl(event.urlAfterRedirects);
      });

    // Set initial active route from current URL
    this.updateActiveRouteFromUrl(this.router.url);

    // Connect player service to SDK services
    this.playerService.setYouTubePlayerService(this.youtubePlayerService);
    this.playerService.setSpotifySdkService(this.spotifySdkService);

    // Subscribe to track changes to update liked status
    this.playerService.trackChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((track) => {
        this.updateLikedStatus(track);
      });

    // Subscribe to YouTube video requests
    this.playerService.youtubeVideoRequested$
      .pipe(takeUntil(this.destroy$))
      .subscribe((videoId) => {
        console.log("YouTube video requested:", videoId);
        // Use setTimeout to ensure ViewChild is available
        setTimeout(() => {
          if (this.youtubePlayer) {
            this.youtubePlayer.playVideo(videoId);
          } else {
            console.error("YouTube player component not available");
          }
        }, 0);
      });

    // Subscribe to Spotify SDK errors to show toast messages
    this.spotifySdkService.playerError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((errorMessage) => {
        this.toastService.error("Spotify Playback Error", errorMessage);
      });

    // Initialize Spotify SDK when connected
    if (this.spotifyConnected) {
      this.initializeSpotifySdk();
    }

    // Setup keyboard shortcuts listeners
    this.setupKeyboardShortcuts();

    // Setup sleep timer listeners
    this.setupSleepTimerListeners();

    // Setup PWA install prompt
    this.setupPwaInstallPrompt();

    // Show welcome toast if first visit
    const hasVisited = localStorage.getItem("audiora_visited");
    if (!hasVisited) {
      this.toastService.info(
        "Welcome to Audiora!",
        "Connect your music services to get started. Press ? to see keyboard shortcuts.",
      );
      localStorage.setItem("audiora_visited", "true");
    }
  }

  private setupKeyboardShortcuts(): void {
    // Toggle queue from keyboard
    this.keyboardShortcuts.toggleQueue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toggleQueue();
      });

    // Toggle like from keyboard
    this.keyboardShortcuts.toggleLike$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toggleLike();
      });

    // Focus search from keyboard
    this.keyboardShortcuts.focusSearch$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.focusSearchInput();
      });

    // Show shortcuts modal
    this.keyboardShortcuts.showShortcuts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.shortcutsModalOpen = true;
      });
  }

  private setupSleepTimerListeners(): void {
    // Sleep timer ended
    this.sleepTimerService.timerEnded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toastService.info(
          "Sleep Timer",
          "Playback stopped. Goodnight! 🌙",
        );
      });

    // Sleep timer started
    this.sleepTimerService.timerStarted$
      .pipe(takeUntil(this.destroy$))
      .subscribe((preset) => {
        const label =
          preset === "end-of-track"
            ? "End of current track"
            : `${preset} minutes`;
        this.toastService.success(
          "Sleep Timer Set",
          `Music will stop in ${label}`,
        );
      });

    // Sleep timer cancelled
    this.sleepTimerService.timerCancelled$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toastService.info("Sleep Timer", "Timer cancelled");
      });
  }

  private setupPwaInstallPrompt(): void {
    // Listen for PWA installable event
    window.addEventListener("pwa-installable", (event: any) => {
      this.pwaInstallPrompt = event.detail;
      // Check if user hasn't dismissed the banner before
      const dismissed = localStorage.getItem("audiora_pwa_dismissed");
      if (!dismissed) {
        setTimeout(() => {
          this.showPwaInstallBanner = true;
        }, 5000); // Show after 5 seconds
      }
    });
  }

  // Focus search input
  focusSearchInput(): void {
    // Navigate to search if not already there
    if (this.activeRoute !== "search") {
      this.router.navigate(["/search"]);
    }
    // Try to focus the search input
    setTimeout(() => {
      const searchInput = document.querySelector(
        ".search-input",
      ) as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 100);
  }

  // Sleep timer methods
  toggleSleepTimerDropdown(): void {
    this.sleepTimerDropdownOpen = !this.sleepTimerDropdownOpen;
  }

  setSleepTimer(preset: SleepTimerPreset): void {
    this.sleepTimerService.startTimer(preset);
    this.sleepTimerDropdownOpen = false;
  }

  cancelSleepTimer(): void {
    this.sleepTimerService.cancelTimer();
    this.sleepTimerDropdownOpen = false;
  }

  // Keyboard shortcuts modal
  closeShortcutsModal(): void {
    this.shortcutsModalOpen = false;
  }

  formatShortcut(shortcut: any): string {
    return this.keyboardShortcuts.formatShortcut(shortcut);
  }

  // PWA install methods
  async installPwa(): Promise<void> {
    if ((window as any).installPWA) {
      const accepted = await (window as any).installPWA();
      if (accepted) {
        this.showPwaInstallBanner = false;
        this.toastService.success(
          "Installed!",
          "Audiora has been added to your home screen",
        );
      }
    }
  }

  dismissPwaBanner(): void {
    this.showPwaInstallBanner = false;
    localStorage.setItem("audiora_pwa_dismissed", "true");
  }

  private async initializeSpotifySdk(): Promise<void> {
    try {
      const connected = await this.spotifySdkService.connect();
      if (connected) {
        this.toastService.success(
          "Spotify Web Player Ready",
          "You can now play music directly in the browser",
        );
      }
    } catch (error) {
      console.error("Failed to initialize Spotify SDK:", error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateLikedStatus(track: Track | null): void {
    // isLiked is now a getter that checks LikedTracksService automatically
    // This method is kept for compatibility but no longer needs to do anything
  }

  // Sidebar
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private updateActiveRouteFromUrl(url: string): void {
    const path = url.split("?")[0]; // Remove query params
    if (path === "/" || path === "") {
      this.activeRoute = "home";
    } else if (path.startsWith("/search")) {
      this.activeRoute = "search";
    } else if (path.startsWith("/library")) {
      this.activeRoute = "library";
    } else if (path.startsWith("/liked")) {
      this.activeRoute = "liked";
    } else if (path.startsWith("/playlist")) {
      this.activeRoute = "library";
    } else if (path.startsWith("/profile")) {
      this.activeRoute = "profile";
    } else if (path.startsWith("/settings")) {
      this.activeRoute = "settings";
    }
  }

  setActiveRoute(route: string): void {
    this.activeRoute = route;
    // Navigate to the corresponding route
    switch (route) {
      case "home":
        this.router.navigate(["/"]);
        break;
      case "search":
        this.router.navigate(["/search"]);
        break;
      case "library":
        this.router.navigate(["/library"]);
        break;
      case "liked":
        this.router.navigate(["/liked"]);
        break;
      default:
        this.router.navigate(["/"]);
    }
  }

  // Navigation
  goBack(): void {
    window.history.back();
  }

  goForward(): void {
    window.history.forward();
  }

  // Search
  performSearch(): void {
    if (this.searchQuery.trim()) {
      // Navigate to search page with query parameter
      this.router.navigate(["/search"], {
        queryParams: { q: this.searchQuery.trim() },
      });
      this.activeRoute = "search";
    }
  }

  // Theme - now using ThemeService
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleDynamicTheme(): void {
    this.dynamicThemeService.setEnabled(!this.dynamicThemeEnabled);
    if (this.dynamicThemeEnabled) {
      this.toastService.success(
        "Dynamic theme enabled",
        "Colors will adapt to album art",
      );
    } else {
      this.toastService.info(
        "Dynamic theme disabled",
        "Using default aurora colors",
      );
    }
  }

  // User
  loadUserData(): void {
    // Load user data from storage/API
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  navigateToProfile(): void {
    this.router.navigate(["/profile"]);
    this.closeUserMenu();
  }

  navigateToSettings(): void {
    this.router.navigate(["/settings"]);
    this.closeUserMenu();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
    this.closeUserMenu();
    this.toastService.info(
      "Logged out",
      "You have been logged out successfully",
    );
  }

  // Services
  connectSpotify(): void {
    this.authService.initiateOAuthFlow("spotify").subscribe({
      next: (response) => {
        // Redirect to Spotify auth URL
        window.location.href = response.authUrl;
      },
      error: (error) => {
        this.toastService.error("Failed to connect Spotify", error.message);
      },
    });
  }

  connectYouTube(): void {
    this.authService.initiateOAuthFlow("youtube").subscribe({
      next: (response) => {
        // Redirect to YouTube auth URL
        window.location.href = response.authUrl;
      },
      error: (error) => {
        this.toastService.error("Failed to connect YouTube", error.message);
      },
    });
  }

  // Playlists
  createPlaylist(): void {
    console.log("Create playlist");
  }

  // Player controls - now using PlayerService
  togglePlayPause(): void {
    this.playerService.togglePlayPause();
  }

  previousTrack(): void {
    this.playerService.previous();
  }

  nextTrack(): void {
    this.playerService.next();
  }

  toggleShuffle(): void {
    this.playerService.toggleShuffle();
  }

  toggleRepeat(): void {
    this.playerService.cycleRepeatMode();
  }

  toggleLike(): void {
    const track = this.currentTrack;
    if (!track) return;

    const provider = track.provider as "spotify" | "youtube";
    const isCurrentlyLiked = this.likedTracksService.isLiked(
      provider,
      track.id,
    );

    if (isCurrentlyLiked) {
      this.likedTracksService.unlike(provider, track.id);
      this.toastService.info("Removed from Liked Songs");
    } else {
      // For YouTube tracks, artist might be in different places
      const artistName =
        track.artist ||
        (track as any).channel ||
        (track as any).channelTitle ||
        "Unknown Artist";

      this.likedTracksService.like({
        id: track.id,
        providerId: track.providerId || track.id,
        title: track.title,
        artist: artistName,
        album: track.provider === "spotify" ? track.album : undefined,
        albumArt: track.albumArt,
        duration: track.duration || 0,
        provider: provider,
        uri:
          track.provider === "spotify"
            ? `spotify:track:${track.providerId || track.id}`
            : undefined,
        videoId:
          track.provider === "youtube"
            ? track.providerId || track.id
            : undefined,
      });
      this.toastService.success("Added to Liked Songs");
    }
  }

  seekTo(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    this.playerService.seekPercent(percent);
  }

  toggleMute(): void {
    this.playerService.toggleMute();
  }

  setVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.playerService.setVolume(parseFloat(target.value));
  }

  toggleQueue(): void {
    this.queueVisible = !this.queueVisible;
    if (this.queuePanel) {
      this.queuePanel.toggle();
    }
  }

  toggleDevices(): void {
    console.log("Toggle devices");
  }

  toggleFullscreen(): void {
    console.log("Toggle fullscreen");
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Content
  loadRecentlyPlayed(): void {
    // TODO: Load from MusicService
    // this.musicService.recentlyPlayedList() can be used with signals
  }

  playTrack(track: Track): void {
    this.playerService.play(track);
  }

  // Queue management
  addToQueue(track: Track): void {
    this.playerService.addToQueue(track);
    this.toastService.success("Added to queue", track.title);
  }

  playNext(track: Track): void {
    this.playerService.playNext(track);
    this.toastService.success("Playing next", track.title);
  }
}

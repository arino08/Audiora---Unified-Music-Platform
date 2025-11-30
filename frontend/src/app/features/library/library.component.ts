import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  inject,
  computed,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Subject, takeUntil, forkJoin, of, catchError } from "rxjs";
import { AuthService } from "../../core/services/auth.service";
import { PlayerService } from "../../core/services/player.service";
import { ToastService } from "../../core/services/toast.service";
import { environment } from "../../../environments/environment";
import { Track, Provider } from "../../core/models";

interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  provider: "spotify" | "youtube" | "local";
  isOwned: boolean;
}

interface Album {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  trackCount: number;
  provider: "spotify" | "youtube";
}

interface ProviderTrack {
  id: string;
  videoId?: string;
  title: string;
  artist?: string;
  channel?: string;
  channelTitle?: string;
  thumbnail?: string;
  albumArt?: string;
  duration?: number;
  provider: "spotify" | "youtube";
}

type LibraryView = "playlists" | "provider" | "albums" | "artists";
type SortOption = "recent" | "alphabetical" | "creator";

@Component({
  selector: "app-library",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="library-container">
      <!-- Header -->
      <header class="library-header">
        <h1>Your Library</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="createPlaylist()">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span>Create Playlist</span>
          </button>
        </div>
      </header>

      <!-- Filters -->
      <div class="library-filters">
        <div class="view-tabs">
          <button
            class="tab-btn"
            [class.active]="currentView() === 'playlists'"
            (click)="setView('playlists')"
          >
            My Playlists
          </button>
          <button
            class="tab-btn provider-tab"
            [class.active]="currentView() === 'provider'"
            (click)="setView('provider')"
          >
            <span class="tab-icons">
              <svg viewBox="0 0 24 24" fill="currentColor" class="spotify-icon">
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor" class="youtube-icon">
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
            </span>
            Connected
          </button>
          <button
            class="tab-btn"
            [class.active]="currentView() === 'albums'"
            (click)="setView('albums')"
          >
            Albums
          </button>
          <button
            class="tab-btn"
            [class.active]="currentView() === 'artists'"
            (click)="setView('artists')"
          >
            Artists
          </button>
        </div>

        <div class="filter-actions">
          <!-- Provider filter (for provider view) -->
          <div class="filter-dropdown" *ngIf="currentView() === 'provider'">
            <button class="filter-btn" (click)="toggleProviderFilter()">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>{{ providerFilterLabel() }}</span>
            </button>
          </div>

          <!-- Sort -->
          <div class="sort-dropdown">
            <button class="filter-btn" (click)="toggleSortMenu()">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="16" y2="12" />
                <line x1="4" y1="18" x2="12" y2="18" />
              </svg>
              <span>{{ sortLabel() }}</span>
            </button>
          </div>

          <!-- Grid/List toggle -->
          <button class="view-toggle" (click)="toggleGridView()">
            <svg
              *ngIf="isGridView()"
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
            <svg
              *ngIf="!isGridView()"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="library-content">
        <!-- Loading state -->
        <div class="loading-grid" *ngIf="isLoading()">
          <div class="skeleton-card" *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8]">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-subtitle"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          class="empty-state"
          *ngIf="
            !isLoading() &&
            displayItems().length === 0 &&
            currentView() !== 'provider'
          "
        >
          <div class="empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
              />
            </svg>
          </div>
          <h2>Your library is empty</h2>
          <p>Start building your collection by adding playlists and albums</p>
          <button class="btn btn-primary" (click)="navigateToSearch()">
            Discover Music
          </button>
        </div>

        <!-- Provider Playlists View -->
        <ng-container *ngIf="currentView() === 'provider'">
          <!-- Connection prompt if nothing connected -->
          <div
            class="connection-prompt"
            *ngIf="!spotifyConnected() && !youtubeConnected() && !isLoading()"
          >
            <div class="prompt-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                />
              </svg>
            </div>
            <h2>Connect Your Music Services</h2>
            <p>
              Link your Spotify or YouTube account to see your playlists here
            </p>
            <div class="connect-buttons">
              <button class="btn btn-spotify" (click)="connectSpotify()">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                  />
                </svg>
                Connect Spotify
              </button>
              <button class="btn btn-youtube" (click)="connectYouTube()">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
                Connect YouTube
              </button>
            </div>
          </div>

          <!-- Provider playlists grid -->
          <div
            class="items-grid"
            [class.list-view]="!isGridView()"
            *ngIf="!isLoading() && filteredProviderPlaylists().length > 0"
          >
            <div
              class="library-card glass-card"
              *ngFor="let playlist of filteredProviderPlaylists()"
              (click)="openProviderPlaylist(playlist)"
            >
              <div class="card-image">
                <img
                  *ngIf="playlist.imageUrl"
                  [src]="playlist.imageUrl"
                  [alt]="playlist.name"
                />
                <div class="placeholder-img" *ngIf="!playlist.imageUrl">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
                <button
                  class="play-btn"
                  (click)="
                    playProviderPlaylist(playlist); $event.stopPropagation()
                  "
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
                <span class="provider-badge" [class]="playlist.provider">
                  <ng-container *ngIf="playlist.provider === 'spotify'"
                    >S</ng-container
                  >
                  <ng-container *ngIf="playlist.provider === 'youtube'"
                    >Y</ng-container
                  >
                </span>
              </div>
              <div class="card-info">
                <h3 class="truncate">{{ playlist.name }}</h3>
                <p class="truncate">{{ playlist.trackCount }} tracks</p>
              </div>
            </div>
          </div>

          <!-- Empty provider playlists -->
          <div
            class="empty-state"
            *ngIf="
              !isLoading() &&
              filteredProviderPlaylists().length === 0 &&
              (spotifyConnected() || youtubeConnected())
            "
          >
            <div class="empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <h2>No playlists found</h2>
            <p>
              Create some playlists on
              {{
                selectedProviderFilter() === "all"
                  ? "your connected services"
                  : selectedProviderFilter()
              }}
            </p>
          </div>
        </ng-container>

        <!-- Provider Playlist Tracks View (Modal-like) -->
        <div class="playlist-tracks-overlay" *ngIf="selectedProviderPlaylist()">
          <div class="playlist-tracks-panel glass-surface">
            <div class="panel-header">
              <button class="back-btn" (click)="closePlaylistTracks()">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div class="panel-title">
                <h2>{{ selectedProviderPlaylist()?.name }}</h2>
                <span class="track-count"
                  >{{ providerTracks().length }} tracks</span
                >
              </div>
              <button class="close-btn" (click)="closePlaylistTracks()">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="panel-actions">
              <button
                class="action-btn primary"
                (click)="playAllProviderTracks()"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Play All
              </button>
              <button
                class="action-btn"
                (click)="addAllProviderTracksToQueue()"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add to Queue
              </button>
            </div>

            <div class="tracks-loading" *ngIf="isLoadingTracks()">
              <div class="spinner"></div>
              <span>Loading tracks...</span>
            </div>

            <div class="tracks-list" *ngIf="!isLoadingTracks()">
              <div
                class="track-item"
                *ngFor="let track of providerTracks(); let i = index"
                (click)="playProviderTrack(track, i)"
              >
                <div class="track-index">{{ i + 1 }}</div>
                <div class="track-image">
                  <img
                    *ngIf="track.thumbnail || track.albumArt"
                    [src]="track.thumbnail || track.albumArt"
                    [alt]="track.title"
                  />
                  <div
                    class="placeholder-img small"
                    *ngIf="!track.thumbnail && !track.albumArt"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                  </div>
                </div>
                <div class="track-info">
                  <span class="track-title">{{ track.title }}</span>
                  <span class="track-artist">{{
                    track.artist ||
                      track.channel ||
                      track.channelTitle ||
                      "Unknown"
                  }}</span>
                </div>
                <div class="track-actions">
                  <button
                    class="icon-btn"
                    (click)="
                      addProviderTrackToQueue(track); $event.stopPropagation()
                    "
                    title="Add to queue"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <button
                    class="icon-btn"
                    (click)="
                      playProviderTrackNext(track); $event.stopPropagation()
                    "
                    title="Play next"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polygon points="5 4 15 12 5 20 5 4"></polygon>
                      <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Playlists Grid -->
        <div
          class="items-grid"
          [class.list-view]="!isGridView()"
          *ngIf="
            !isLoading() &&
            currentView() === 'playlists' &&
            playlists().length > 0
          "
        >
          <div
            class="library-card glass-card"
            *ngFor="let playlist of playlists()"
            (click)="openPlaylist(playlist)"
          >
            <div class="card-image">
              <img
                [src]="
                  playlist.imageUrl || 'assets/images/default-playlist.png'
                "
                [alt]="playlist.name"
              />
              <button
                class="play-btn"
                (click)="playPlaylist(playlist); $event.stopPropagation()"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <span class="provider-badge" [class]="playlist.provider">
                <ng-container *ngIf="playlist.provider === 'spotify'"
                  >S</ng-container
                >
                <ng-container *ngIf="playlist.provider === 'youtube'"
                  >Y</ng-container
                >
                <ng-container *ngIf="playlist.provider === 'local'"
                  >A</ng-container
                >
              </span>
            </div>
            <div class="card-info">
              <h3 class="truncate">{{ playlist.name }}</h3>
              <p class="truncate">{{ playlist.trackCount }} tracks</p>
            </div>
          </div>
        </div>

        <!-- Albums Grid -->
        <div
          class="items-grid"
          [class.list-view]="!isGridView()"
          *ngIf="
            !isLoading() && currentView() === 'albums' && albums().length > 0
          "
        >
          <div
            class="library-card glass-card"
            *ngFor="let album of albums()"
            (click)="openAlbum(album)"
          >
            <div class="card-image">
              <img [src]="album.imageUrl" [alt]="album.name" />
              <button
                class="play-btn"
                (click)="playAlbum(album); $event.stopPropagation()"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <span class="provider-badge" [class]="album.provider">
                <ng-container *ngIf="album.provider === 'spotify'"
                  >S</ng-container
                >
                <ng-container *ngIf="album.provider === 'youtube'"
                  >Y</ng-container
                >
              </span>
            </div>
            <div class="card-info">
              <h3 class="truncate">{{ album.name }}</h3>
              <p class="truncate">{{ album.artist }}</p>
            </div>
          </div>
        </div>

        <!-- Artists (coming soon) -->
        <div class="coming-soon" *ngIf="currentView() === 'artists'">
          <div class="coming-soon-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2>Artists view coming soon</h2>
          <p>We're working on bringing you a beautiful artist library view</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .library-container {
        padding-bottom: var(--space-12);
        animation: fade-in var(--transition-slow) ease;
      }

      /* Header */
      .library-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-6);
      }

      .library-header h1 {
        font-size: var(--text-3xl);
        font-weight: 700;
      }

      .header-actions .btn {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .header-actions .btn svg {
        width: 18px;
        height: 18px;
      }

      /* Filters */
      .library-filters {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
        flex-wrap: wrap;
      }

      .view-tabs {
        display: flex;
        gap: var(--space-2);
      }

      .tab-btn {
        padding: var(--space-2) var(--space-4);
        background: rgba(255, 255, 255, 0.05);
        border: none;
        border-radius: var(--radius-full);
        color: var(--text-secondary);
        font-size: var(--text-sm);
        cursor: pointer;
        transition: all var(--transition-fast) ease;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .tab-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
      }

      .tab-btn.active {
        background: var(--primary);
        color: white;
      }

      .tab-btn.provider-tab .tab-icons {
        display: flex;
        gap: 4px;
      }

      .tab-btn.provider-tab .spotify-icon {
        width: 14px;
        height: 14px;
        color: #1db954;
      }

      .tab-btn.provider-tab .youtube-icon {
        width: 14px;
        height: 14px;
        color: #ff0000;
      }

      .tab-btn.provider-tab.active .spotify-icon,
      .tab-btn.provider-tab.active .youtube-icon {
        color: white;
      }

      .filter-actions {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .filter-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        background: rgba(255, 255, 255, 0.05);
        border: none;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        font-size: var(--text-sm);
        cursor: pointer;
        transition: all var(--transition-fast) ease;
      }

      .filter-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
      }

      .filter-btn svg {
        width: 16px;
        height: 16px;
      }

      .view-toggle {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        border: none;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast) ease;
      }

      .view-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
      }

      .view-toggle svg {
        width: 18px;
        height: 18px;
      }

      /* Content */
      .library-content {
        position: relative;
      }

      /* Grid View */
      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--space-5);
      }

      .items-grid.list-view {
        grid-template-columns: 1fr;
        gap: var(--space-2);
      }

      /* Library Card */
      .library-card {
        padding: var(--space-4);
        cursor: pointer;
        transition: all var(--transition-normal) ease;
      }

      .library-card:hover {
        transform: translateY(-4px);
      }

      .list-view .library-card {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3);
      }

      .list-view .library-card:hover {
        transform: none;
        background: rgba(255, 255, 255, 0.08);
      }

      .card-image {
        position: relative;
        aspect-ratio: 1;
        border-radius: var(--radius-lg);
        overflow: hidden;
        margin-bottom: var(--space-3);
        background: rgba(0, 0, 0, 0.3);
      }

      .list-view .card-image {
        width: 56px;
        height: 56px;
        margin-bottom: 0;
        border-radius: var(--radius-md);
        flex-shrink: 0;
      }

      .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-normal) ease;
      }

      .library-card:hover .card-image img {
        transform: scale(1.05);
      }

      .placeholder-img {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.2);
      }

      .placeholder-img svg {
        width: 40%;
        height: 40%;
      }

      .placeholder-img.small svg {
        width: 50%;
        height: 50%;
      }

      .play-btn {
        position: absolute;
        bottom: var(--space-2);
        right: var(--space-2);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: var(--primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transform: translateY(8px);
        transition: all var(--transition-fast) ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .library-card:hover .play-btn {
        opacity: 1;
        transform: translateY(0);
      }

      .play-btn:hover {
        transform: scale(1.1);
        background: var(--primary-dark);
      }

      .play-btn svg {
        width: 18px;
        height: 18px;
        margin-left: 2px;
      }

      .provider-badge {
        position: absolute;
        top: var(--space-2);
        left: var(--space-2);
        width: 24px;
        height: 24px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        color: white;
      }

      .provider-badge.spotify {
        background: #1db954;
      }

      .provider-badge.youtube {
        background: #ff0000;
      }

      .provider-badge.local {
        background: var(--primary);
      }

      .card-info h3 {
        font-size: var(--text-base);
        font-weight: 600;
        margin-bottom: var(--space-1);
      }

      .card-info p {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      /* Loading State */
      .loading-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--space-5);
      }

      .skeleton-card {
        padding: var(--space-4);
      }

      .skeleton {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.05) 0%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(255, 255, 255, 0.05) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-md);
      }

      .skeleton-image {
        aspect-ratio: 1;
        border-radius: var(--radius-lg);
        margin-bottom: var(--space-3);
      }

      .skeleton-title {
        height: 18px;
        margin-bottom: var(--space-2);
        width: 80%;
      }

      .skeleton-subtitle {
        height: 14px;
        width: 50%;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* Empty State */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-16) var(--space-8);
        text-align: center;
      }

      .empty-icon {
        width: 80px;
        height: 80px;
        margin-bottom: var(--space-6);
        color: var(--text-tertiary);
        opacity: 0.5;
      }

      .empty-icon svg {
        width: 100%;
        height: 100%;
      }

      .empty-state h2 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-2);
      }

      .empty-state p {
        color: var(--text-secondary);
        margin-bottom: var(--space-6);
      }

      /* Connection Prompt */
      .connection-prompt {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-16) var(--space-8);
        text-align: center;
      }

      .prompt-icon {
        width: 80px;
        height: 80px;
        margin-bottom: var(--space-6);
        color: var(--text-tertiary);
        opacity: 0.5;
      }

      .prompt-icon svg {
        width: 100%;
        height: 100%;
      }

      .connection-prompt h2 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-2);
      }

      .connection-prompt p {
        color: var(--text-secondary);
        margin-bottom: var(--space-6);
      }

      .connect-buttons {
        display: flex;
        gap: var(--space-4);
        flex-wrap: wrap;
        justify-content: center;
      }

      .btn-spotify {
        background: #1db954;
        color: white;
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-5);
        border: none;
        border-radius: var(--radius-full);
        font-size: var(--text-sm);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast) ease;
      }

      .btn-spotify:hover {
        background: #1ed760;
        transform: translateY(-2px);
      }

      .btn-spotify svg {
        width: 20px;
        height: 20px;
      }

      .btn-youtube {
        background: #ff0000;
        color: white;
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-5);
        border: none;
        border-radius: var(--radius-full);
        font-size: var(--text-sm);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast) ease;
      }

      .btn-youtube:hover {
        background: #cc0000;
        transform: translateY(-2px);
      }

      .btn-youtube svg {
        width: 20px;
        height: 20px;
      }

      /* Playlist Tracks Overlay */
      .playlist-tracks-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-8);
        animation: fade-in 0.2s ease;
      }

      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .playlist-tracks-panel {
        width: 100%;
        max-width: 700px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        border-radius: var(--radius-xl);
        overflow: hidden;
        animation: slide-up 0.3s ease;
      }

      @keyframes slide-up {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .panel-header {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4) var(--space-5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .back-btn,
      .close-btn {
        width: 36px;
        height: 36px;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        border-radius: var(--radius-md);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast) ease;
      }

      .back-btn:hover,
      .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
      }

      .back-btn svg,
      .close-btn svg {
        width: 20px;
        height: 20px;
      }

      .panel-title {
        flex: 1;
      }

      .panel-title h2 {
        font-size: var(--text-lg);
        font-weight: 600;
        margin-bottom: 2px;
      }

      .panel-title .track-count {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .panel-actions {
        display: flex;
        gap: var(--space-3);
        padding: var(--space-4) var(--space-5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        border: none;
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        border-radius: var(--radius-full);
        font-size: var(--text-sm);
        cursor: pointer;
        transition: all var(--transition-fast) ease;
      }

      .action-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .action-btn.primary {
        background: var(--primary);
        color: white;
      }

      .action-btn.primary:hover {
        background: var(--primary-dark);
      }

      .action-btn svg {
        width: 16px;
        height: 16px;
      }

      .tracks-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-12);
        gap: var(--space-3);
        color: var(--text-secondary);
      }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .tracks-list {
        flex: 1;
        overflow-y: auto;
        padding: var(--space-2) 0;
      }

      .track-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-5);
        cursor: pointer;
        transition: background var(--transition-fast) ease;
      }

      .track-item:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .track-index {
        width: 24px;
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        text-align: center;
      }

      .track-image {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-sm);
        overflow: hidden;
        flex-shrink: 0;
        background: rgba(0, 0, 0, 0.3);
      }

      .track-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .track-info {
        flex: 1;
        min-width: 0;
      }

      .track-title {
        display: block;
        font-size: var(--text-sm);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 2px;
      }

      .track-artist {
        display: block;
        font-size: var(--text-xs);
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-actions {
        display: flex;
        gap: var(--space-1);
        opacity: 0;
        transition: opacity var(--transition-fast) ease;
      }

      .track-item:hover .track-actions {
        opacity: 1;
      }

      .icon-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast) ease;
      }

      .icon-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
      }

      .icon-btn svg {
        width: 16px;
        height: 16px;
      }

      /* Coming Soon */
      .coming-soon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-16) var(--space-8);
        text-align: center;
      }

      .coming-soon-icon {
        width: 80px;
        height: 80px;
        margin-bottom: var(--space-6);
        color: var(--text-tertiary);
        opacity: 0.5;
      }

      .coming-soon-icon svg {
        width: 100%;
        height: 100%;
      }

      .coming-soon h2 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-2);
      }

      .coming-soon p {
        color: var(--text-secondary);
      }

      /* Scrollbar */
      .tracks-list::-webkit-scrollbar {
        width: 8px;
      }

      .tracks-list::-webkit-scrollbar-track {
        background: transparent;
      }

      .tracks-list::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }

      .tracks-list::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      /* Responsive */
      @media (max-width: 767px) {
        .library-header {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-4);
        }

        .library-filters {
          flex-direction: column;
          align-items: stretch;
        }

        .view-tabs {
          overflow-x: auto;
          padding-bottom: var(--space-2);
        }

        .filter-actions {
          justify-content: flex-end;
        }

        .items-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        .library-card {
          padding: var(--space-3);
        }

        .playlist-tracks-overlay {
          padding: 0;
        }

        .playlist-tracks-panel {
          max-width: 100%;
          max-height: 100%;
          border-radius: 0;
        }

        .connect-buttons {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class LibraryComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly playerService = inject(PlayerService);
  private readonly toastService = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/api`;
  private readonly destroy$ = new Subject<void>();

  // State
  currentView = signal<LibraryView>("playlists");
  sortOption = signal<SortOption>("recent");
  selectedProviderFilter = signal<"all" | "spotify" | "youtube">("all");
  isGridView = signal(true);
  isLoading = signal(true);
  isLoadingTracks = signal(false);

  // Data
  playlists = signal<Playlist[]>([]);
  albums = signal<Album[]>([]);
  spotifyPlaylists = signal<Playlist[]>([]);
  youtubePlaylists = signal<Playlist[]>([]);
  selectedProviderPlaylist = signal<Playlist | null>(null);
  providerTracks = signal<ProviderTrack[]>([]);

  // Computed
  spotifyConnected = computed(
    () => !!this.authService.getProviderSession("spotify"),
  );
  youtubeConnected = computed(
    () => !!this.authService.getProviderSession("youtube"),
  );

  displayItems = computed(() => {
    const view = this.currentView();
    if (view === "playlists") return this.playlists();
    if (view === "albums") return this.albums();
    return [];
  });

  filteredProviderPlaylists = computed(() => {
    const filter = this.selectedProviderFilter();
    const spotify = this.spotifyPlaylists();
    const youtube = this.youtubePlaylists();

    if (filter === "spotify") return spotify;
    if (filter === "youtube") return youtube;
    return [...spotify, ...youtube];
  });

  ngOnInit(): void {
    this.loadLibrary();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLibrary(): void {
    this.isLoading.set(true);

    // Load local playlists
    setTimeout(() => {
      this.playlists.set([]);
      this.albums.set([]);
      this.isLoading.set(false);
    }, 500);

    // Load provider playlists
    this.loadProviderPlaylists();
  }

  private loadProviderPlaylists(): void {
    const requests: { spotify?: any; youtube?: any } = {};

    const spotifySession = this.authService.getProviderSession("spotify");
    if (spotifySession) {
      requests.spotify = this.http
        .get<{ items: any[] }>(`${this.apiUrl}/spotify/playlists`, {
          headers: { "X-Session-Id": spotifySession },
        })
        .pipe(
          catchError((err) => {
            console.error("Failed to load Spotify playlists:", err);
            return of({ items: [] });
          }),
        );
    }

    const youtubeSession = this.authService.getProviderSession("youtube");
    if (youtubeSession) {
      requests.youtube = this.http
        .get<{ items: any[] }>(`${this.apiUrl}/youtube/playlists`, {
          headers: { "X-Session-Id": youtubeSession },
        })
        .pipe(
          catchError((err) => {
            console.error("Failed to load YouTube playlists:", err);
            return of({ items: [] });
          }),
        );
    }

    if (Object.keys(requests).length === 0) return;

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results: any) => {
          if (results.spotify?.items) {
            this.spotifyPlaylists.set(
              results.spotify.items.map((p: any) => ({
                id: p.id,
                name: p.name,
                description: "",
                imageUrl: p.image || "",
                trackCount: p.tracks || 0,
                provider: "spotify" as const,
                isOwned: true,
              })),
            );
          }

          if (results.youtube?.items) {
            this.youtubePlaylists.set(
              results.youtube.items.map((p: any) => ({
                id: p.id,
                name: p.name,
                description: "",
                imageUrl: p.image || "",
                trackCount: p.tracks || 0,
                provider: "youtube" as const,
                isOwned: true,
              })),
            );
          }
        },
      });
  }

  setView(view: LibraryView): void {
    this.currentView.set(view);
    if (view === "provider" && this.filteredProviderPlaylists().length === 0) {
      this.loadProviderPlaylists();
    }
  }

  sortLabel(): string {
    const labels: Record<SortOption, string> = {
      recent: "Recent",
      alphabetical: "A-Z",
      creator: "Creator",
    };
    return labels[this.sortOption()];
  }

  providerFilterLabel(): string {
    const filter = this.selectedProviderFilter();
    if (filter === "spotify") return "Spotify";
    if (filter === "youtube") return "YouTube";
    return "All Services";
  }

  toggleProviderFilter(): void {
    const current = this.selectedProviderFilter();
    if (current === "all") {
      this.selectedProviderFilter.set("spotify");
    } else if (current === "spotify") {
      this.selectedProviderFilter.set("youtube");
    } else {
      this.selectedProviderFilter.set("all");
    }
  }

  toggleSortMenu(): void {
    const options: SortOption[] = ["recent", "alphabetical", "creator"];
    const currentIndex = options.indexOf(this.sortOption());
    const nextIndex = (currentIndex + 1) % options.length;
    this.sortOption.set(options[nextIndex]);
  }

  toggleGridView(): void {
    this.isGridView.update((v) => !v);
  }

  createPlaylist(): void {
    console.log("Create playlist");
    this.toastService.info(
      "Coming Soon",
      "Playlist creation will be available soon",
    );
  }

  // Provider playlist methods
  openProviderPlaylist(playlist: Playlist): void {
    this.selectedProviderPlaylist.set(playlist);
    this.loadProviderPlaylistTracks(playlist);
  }

  closePlaylistTracks(): void {
    this.selectedProviderPlaylist.set(null);
    this.providerTracks.set([]);
  }

  loadProviderPlaylistTracks(playlist: Playlist): void {
    this.isLoadingTracks.set(true);

    const session =
      playlist.provider === "spotify"
        ? this.authService.getProviderSession("spotify")
        : this.authService.getProviderSession("youtube");

    if (!session) {
      this.isLoadingTracks.set(false);
      return;
    }

    const endpoint =
      playlist.provider === "spotify"
        ? `${this.apiUrl}/spotify/playlists/${playlist.id}/tracks`
        : `${this.apiUrl}/youtube/playlists/${playlist.id}/items`;

    this.http
      .get<{ items: any[] }>(endpoint, {
        headers: { "X-Session-Id": session },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const tracks = response.items.map((item: any) =>
            this.mapToProviderTrack(
              item,
              playlist.provider as "spotify" | "youtube",
            ),
          );
          this.providerTracks.set(tracks);
          this.isLoadingTracks.set(false);
        },
        error: (err) => {
          console.error("Failed to load playlist tracks:", err);
          this.isLoadingTracks.set(false);
          this.toastService.error("Failed to load tracks");
        },
      });
  }

  private mapToProviderTrack(
    item: any,
    provider: "spotify" | "youtube",
  ): ProviderTrack {
    if (provider === "spotify") {
      const track = item.track || item;
      return {
        id: track.id,
        title: track.name,
        artist:
          track.artists?.map((a: any) => a.name).join(", ") || track.artist,
        albumArt:
          track.album?.images?.[0]?.url || track.albumArt || track.image,
        duration: track.duration_ms || track.duration,
        provider: "spotify",
      };
    } else {
      return {
        id: item.videoId,
        videoId: item.videoId,
        title: item.title,
        channel: item.channelTitle || item.channel,
        channelTitle: item.channelTitle,
        thumbnail: item.thumbnail,
        provider: "youtube",
      };
    }
  }

  private convertToTrack(providerTrack: ProviderTrack): Track {
    return {
      id: providerTrack.id,
      providerId: providerTrack.videoId || providerTrack.id,
      title: providerTrack.title,
      artist:
        providerTrack.artist ||
        providerTrack.channel ||
        providerTrack.channelTitle ||
        "Unknown",
      album: "",
      albumArt: providerTrack.thumbnail || providerTrack.albumArt || "",
      duration: providerTrack.duration || 0,
      provider: providerTrack.provider as Provider,
      externalUrl:
        providerTrack.provider === "youtube"
          ? `https://www.youtube.com/watch?v=${providerTrack.videoId}`
          : `https://open.spotify.com/track/${providerTrack.id}`,
      isPlayable: true,
    };
  }

  playProviderPlaylist(playlist: Playlist): void {
    this.openProviderPlaylist(playlist);
    setTimeout(() => {
      if (this.providerTracks().length > 0) {
        this.playAllProviderTracks();
      }
    }, 1000);
  }

  playProviderTrack(track: ProviderTrack, index: number): void {
    const tracks = this.providerTracks().map((t) => this.convertToTrack(t));
    this.playerService.playTracks(tracks, index);
  }

  playAllProviderTracks(): void {
    const tracks = this.providerTracks().map((t) => this.convertToTrack(t));
    if (tracks.length > 0) {
      this.playerService.playTracks(tracks, 0);
      this.toastService.success(
        "Now Playing",
        `Playing ${tracks.length} tracks`,
      );
    }
  }

  addAllProviderTracksToQueue(): void {
    const tracks = this.providerTracks().map((t) => this.convertToTrack(t));
    tracks.forEach((track) => this.playerService.addToQueue(track));
    this.toastService.success(
      "Added to Queue",
      `${tracks.length} tracks added`,
    );
  }

  addProviderTrackToQueue(track: ProviderTrack): void {
    const converted = this.convertToTrack(track);
    this.playerService.addToQueue(converted);
    this.toastService.info("Added to Queue", converted.title);
  }

  playProviderTrackNext(track: ProviderTrack): void {
    const converted = this.convertToTrack(track);
    this.playerService.playNext(converted);
    this.toastService.info("Playing Next", converted.title);
  }

  // Local playlist methods
  openPlaylist(playlist: Playlist): void {
    this.router.navigate(["/playlist", playlist.id]);
  }

  playPlaylist(playlist: Playlist): void {
    console.log("Play playlist:", playlist.name);
  }

  openAlbum(album: Album): void {
    console.log("Open album:", album.name);
  }

  playAlbum(album: Album): void {
    console.log("Play album:", album.name);
  }

  navigateToSearch(): void {
    this.router.navigate(["/search"]);
  }

  connectSpotify(): void {
    this.authService.connectProvider("spotify");
  }

  connectYouTube(): void {
    this.authService.connectProvider("youtube");
  }
}

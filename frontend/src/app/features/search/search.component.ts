import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  forkJoin,
  of,
  catchError,
} from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../core/services/auth.service";
import { PlayerService } from "../../core/services/player.service";
import { ToastService } from "../../core/services/toast.service";
import { LikedTracksService } from "../../core/services/liked-tracks.service";
import { Track, Provider } from "../../core/models";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  type: "track" | "artist" | "album" | "playlist";
  provider: "spotify" | "youtube";
  duration?: number;
  uri?: string;
  videoId?: string;
  previewUrl?: string;
}

interface SearchCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
}

interface SpotifyTrackResponse {
  id: string;
  name: string;
  artists: string[];
  album: string;
  durationMs: number;
  uri: string;
  image: string;
  provider: string;
}

interface YouTubeTrackResponse {
  videoId: string;
  title: string;
  channel: string;
  channelTitle?: string;
  thumbnail: string;
  provider: string;
  duration?: number;
}

@Component({
  selector: "app-search",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-page">
      <!-- Search Header -->
      <div class="search-header">
        <div class="search-input-container glass">
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
            class="search-input"
            placeholder="What do you want to listen to?"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            autofocus
          />
          <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">
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

        <!-- Provider Filter -->
        <div class="provider-filters" *ngIf="hasConnectedProviders()">
          <button
            class="provider-filter"
            [class.active]="activeProvider() === 'all'"
            (click)="setProvider('all')"
          >
            <span>All</span>
          </button>
          <button
            class="provider-filter spotify"
            [class.active]="activeProvider() === 'spotify'"
            [class.disabled]="!spotifyConnected()"
            (click)="setProvider('spotify')"
            [disabled]="!spotifyConnected()"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
              />
            </svg>
            <span>Spotify</span>
          </button>
          <button
            class="provider-filter youtube"
            [class.active]="activeProvider() === 'youtube'"
            [class.disabled]="!youtubeConnected()"
            (click)="setProvider('youtube')"
            [disabled]="!youtubeConnected()"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
            <span>YouTube</span>
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs" *ngIf="hasResults()">
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'all'"
            (click)="setFilter('all')"
          >
            All
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'tracks'"
            (click)="setFilter('tracks')"
          >
            Songs
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'artists'"
            (click)="setFilter('artists')"
            *ngIf="filteredArtists().length > 0"
          >
            Artists
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'albums'"
            (click)="setFilter('albums')"
            *ngIf="filteredAlbums().length > 0"
          >
            Albums
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'playlists'"
            (click)="setFilter('playlists')"
            *ngIf="filteredPlaylists().length > 0"
          >
            Playlists
          </button>
        </div>
      </div>

      <!-- Connection Required Message -->
      <div
        class="connection-required"
        *ngIf="!hasConnectedProviders() && !isLoading()"
      >
        <div class="connection-card glass-card">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="connection-icon"
          >
            <path
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
            />
            <path
              d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101"
            />
          </svg>
          <h3>Connect a Music Service</h3>
          <p>
            Link your Spotify or YouTube account to start searching and playing
            music.
          </p>
          <div class="connection-buttons">
            <button class="btn btn-spotify" (click)="connectSpotify()">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
              Connect Spotify
            </button>
            <button class="btn btn-youtube" (click)="connectYouTube()">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
              Connect YouTube
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading()">
        <div class="loading-grid">
          <div class="skeleton-card" *ngFor="let _ of [1, 2, 3, 4, 5, 6, 7, 8]">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-subtitle"></div>
          </div>
        </div>
      </div>

      <!-- Browse Categories (shown when no search) -->
      <div
        class="browse-section"
        *ngIf="!searchQuery && !isLoading() && hasConnectedProviders()"
      >
        <h2>Browse All</h2>
        <div class="categories-grid">
          <div
            class="category-card"
            *ngFor="let category of categories"
            [style.background]="category.gradient"
            (click)="browseCategory(category)"
          >
            <span class="category-name">{{ category.name }}</span>
            <div class="category-icon">{{ category.icon }}</div>
          </div>
        </div>

        <!-- Recent Searches -->
        <div class="recent-searches" *ngIf="recentSearches().length > 0">
          <div class="section-header">
            <h2>Recent Searches</h2>
            <button class="clear-all-btn" (click)="clearRecentSearches()">
              Clear all
            </button>
          </div>
          <div class="recent-grid">
            <div
              class="recent-item glass-card"
              *ngFor="let item of recentSearches()"
              (click)="searchFor(item.query)"
            >
              <div class="recent-image">
                <img
                  [src]="item.imageUrl"
                  [alt]="item.query"
                  *ngIf="item.imageUrl"
                />
                <div class="recent-placeholder" *ngIf="!item.imageUrl">
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
              </div>
              <div class="recent-info">
                <span class="recent-query">{{ item.query }}</span>
                <span class="recent-type">{{ item.type }}</span>
              </div>
              <button
                class="remove-btn"
                (click)="removeRecentSearch(item); $event.stopPropagation()"
              >
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
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div
        class="search-results"
        *ngIf="searchQuery && !isLoading() && hasConnectedProviders()"
      >
        <!-- No Results -->
        <div class="no-results" *ngIf="!hasResults() && searchQuery">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <h3>No results found for "{{ searchQuery }}"</h3>
          <p>Please check your spelling or try different keywords.</p>
        </div>

        <!-- Top Result + Songs -->
        <div
          class="top-results-section"
          *ngIf="
            hasResults() &&
            (activeFilter() === 'all' || activeFilter() === 'tracks')
          "
        >
          <div class="results-row">
            <!-- Top Result -->
            <div
              class="top-result"
              *ngIf="topResult() && activeFilter() === 'all'"
            >
              <h3>Top Result</h3>
              <div
                class="top-result-card glass-card"
                (click)="playResult(topResult()!)"
              >
                <img
                  [src]="topResult()!.imageUrl"
                  [alt]="topResult()!.title"
                  class="top-result-image"
                />
                <h4 class="top-result-title">{{ topResult()!.title }}</h4>
                <p class="top-result-subtitle">
                  <span class="result-type-badge">{{ topResult()!.type }}</span>
                  {{ topResult()!.subtitle }}
                </p>
                <button
                  class="play-btn-lg"
                  (click)="playResult(topResult()!); $event.stopPropagation()"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
                <span class="provider-badge" [class]="topResult()!.provider">
                  {{ topResult()!.provider === "spotify" ? "S" : "Y" }}
                </span>
              </div>
            </div>

            <!-- Songs -->
            <div
              class="songs-results"
              [class.full-width]="activeFilter() === 'tracks'"
            >
              <h3>Songs</h3>
              <div class="songs-list">
                <div
                  class="song-row"
                  *ngFor="
                    let track of filteredTracks().slice(
                      0,
                      activeFilter() === 'all' ? 4 : 50
                    );
                    let i = index
                  "
                  (click)="playResult(track)"
                  [class.playing]="isTrackPlaying(track)"
                >
                  <div class="song-index">
                    <span class="index-number" *ngIf="!isTrackPlaying(track)">{{
                      i + 1
                    }}</span>
                    <div
                      class="playing-indicator"
                      *ngIf="isTrackPlaying(track)"
                    >
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                  <div class="song-image">
                    <img [src]="track.imageUrl" [alt]="track.title" />
                    <div class="song-play-overlay">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                  <div class="song-info">
                    <span
                      class="song-title truncate"
                      [class.text-accent]="isTrackPlaying(track)"
                      >{{ track.title }}</span
                    >
                    <span class="song-artist truncate">{{
                      track.subtitle
                    }}</span>
                  </div>
                  <span class="provider-badge small" [class]="track.provider">
                    {{ track.provider === "spotify" ? "S" : "Y" }}
                  </span>
                  <span class="song-duration">{{
                    formatDuration(track.duration || 0)
                  }}</span>
                  <button
                    class="more-btn"
                    (click)="showTrackMenu(track, $event)"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Artists -->
        <div
          class="results-section"
          *ngIf="
            filteredArtists().length > 0 &&
            (activeFilter() === 'all' || activeFilter() === 'artists')
          "
        >
          <h3>Artists</h3>
          <div class="results-grid artists-grid">
            <div
              class="result-card glass-card artist-card"
              *ngFor="
                let artist of filteredArtists().slice(
                  0,
                  activeFilter() === 'all' ? 6 : 50
                )
              "
              (click)="viewArtist(artist)"
            >
              <div class="result-image artist-image">
                <img [src]="artist.imageUrl" [alt]="artist.title" />
              </div>
              <h4 class="result-title truncate">{{ artist.title }}</h4>
              <p class="result-subtitle">Artist</p>
              <span class="provider-badge" [class]="artist.provider">
                {{ artist.provider === "spotify" ? "S" : "Y" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Albums -->
        <div
          class="results-section"
          *ngIf="
            filteredAlbums().length > 0 &&
            (activeFilter() === 'all' || activeFilter() === 'albums')
          "
        >
          <h3>Albums</h3>
          <div class="results-grid">
            <div
              class="result-card glass-card"
              *ngFor="
                let album of filteredAlbums().slice(
                  0,
                  activeFilter() === 'all' ? 6 : 50
                )
              "
              (click)="viewAlbum(album)"
            >
              <div class="result-image">
                <img [src]="album.imageUrl" [alt]="album.title" />
                <button
                  class="play-btn"
                  (click)="playResult(album); $event.stopPropagation()"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
              <h4 class="result-title truncate">{{ album.title }}</h4>
              <p class="result-subtitle truncate">{{ album.subtitle }}</p>
              <span class="provider-badge" [class]="album.provider">
                {{ album.provider === "spotify" ? "S" : "Y" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Playlists -->
        <div
          class="results-section"
          *ngIf="
            filteredPlaylists().length > 0 &&
            (activeFilter() === 'all' || activeFilter() === 'playlists')
          "
        >
          <h3>Playlists</h3>
          <div class="results-grid">
            <div
              class="result-card glass-card"
              *ngFor="
                let playlist of filteredPlaylists().slice(
                  0,
                  activeFilter() === 'all' ? 6 : 50
                )
              "
              (click)="viewPlaylist(playlist)"
            >
              <div class="result-image">
                <img [src]="playlist.imageUrl" [alt]="playlist.title" />
                <button
                  class="play-btn"
                  (click)="playResult(playlist); $event.stopPropagation()"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
              <h4 class="result-title truncate">{{ playlist.title }}</h4>
              <p class="result-subtitle truncate">{{ playlist.subtitle }}</p>
              <span class="provider-badge" [class]="playlist.provider">
                {{ playlist.provider === "spotify" ? "S" : "Y" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Track Context Menu -->
      <div
        class="context-menu glass"
        *ngIf="contextMenuVisible()"
        [style.top.px]="contextMenuPosition().y"
        [style.left.px]="contextMenuPosition().x"
        (mouseleave)="hideContextMenu()"
      >
        <button
          class="context-menu-item"
          (click)="addToQueue(contextMenuTrack()!)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add to Queue
        </button>
        <button
          class="context-menu-item"
          (click)="playNext(contextMenuTrack()!)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
          Play Next
        </button>
        <div class="context-menu-divider"></div>
        <button
          class="context-menu-item"
          (click)="addToPlaylist(contextMenuTrack()!)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" />
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          Add to Playlist
        </button>
        <button
          class="context-menu-item"
          (click)="toggleLike(contextMenuTrack()!)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
          {{
            isTrackLiked(contextMenuTrack()!)
              ? "Remove from Liked"
              : "Add to Liked"
          }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .search-page {
        padding: 0 24px 24px;
        min-height: 100%;
      }

      .search-header {
        position: sticky;
        top: 0;
        z-index: 10;
        padding: 24px 0 16px;
        background: linear-gradient(
          to bottom,
          var(--bg-primary) 0%,
          var(--bg-primary) 70%,
          transparent 100%
        );
      }

      .search-input-container {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 24px;
        max-width: 600px;
      }

      .search-icon {
        width: 20px;
        height: 20px;
        color: var(--text-secondary);
        flex-shrink: 0;
      }

      .search-input {
        flex: 1;
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-size: 14px;
        outline: none;
      }

      .search-input::placeholder {
        color: var(--text-tertiary);
      }

      .clear-btn {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .clear-btn:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
      }

      .clear-btn svg {
        width: 16px;
        height: 16px;
      }

      .provider-filters {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        flex-wrap: wrap;
      }

      .provider-filter {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-primary);
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .provider-filter:hover:not(.disabled) {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }

      .provider-filter.active {
        background: var(--text-primary);
        color: var(--bg-primary);
        border-color: var(--text-primary);
      }

      .provider-filter.spotify.active {
        background: #1db954;
        border-color: #1db954;
        color: white;
      }

      .provider-filter.youtube.active {
        background: #ff0000;
        border-color: #ff0000;
        color: white;
      }

      .provider-filter.disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .provider-filter svg {
        width: 16px;
        height: 16px;
      }

      .filter-tabs {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        flex-wrap: wrap;
      }

      .filter-tab {
        padding: 8px 16px;
        border-radius: 20px;
        background: var(--bg-secondary);
        border: none;
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .filter-tab:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }

      .filter-tab.active {
        background: var(--text-primary);
        color: var(--bg-primary);
      }

      /* Connection Required */
      .connection-required {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 60px 20px;
      }

      .connection-card {
        text-align: center;
        padding: 48px;
        max-width: 480px;
        border-radius: 24px;
      }

      .connection-icon {
        width: 64px;
        height: 64px;
        color: var(--accent-primary);
        margin-bottom: 24px;
      }

      .connection-card h3 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .connection-card p {
        color: var(--text-secondary);
        margin-bottom: 32px;
        line-height: 1.6;
      }

      .connection-buttons {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .connection-buttons .btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        font-weight: 600;
      }

      /* Loading */
      .loading-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 24px;
        padding: 24px 0;
      }

      .skeleton-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .skeleton {
        background: linear-gradient(
          90deg,
          var(--bg-secondary) 25%,
          var(--bg-tertiary) 50%,
          var(--bg-secondary) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
      }

      .skeleton-image {
        aspect-ratio: 1;
        border-radius: 8px;
      }

      .skeleton-title {
        height: 16px;
        width: 80%;
      }

      .skeleton-subtitle {
        height: 14px;
        width: 60%;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* Browse Section */
      .browse-section h2 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 20px;
      }

      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 48px;
      }

      .category-card {
        position: relative;
        aspect-ratio: 1.5;
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        overflow: hidden;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
      }

      .category-card:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
      }

      .category-name {
        font-size: 18px;
        font-weight: 700;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .category-icon {
        position: absolute;
        bottom: 8px;
        right: 8px;
        font-size: 48px;
        opacity: 0.8;
        transform: rotate(15deg);
      }

      /* Recent Searches */
      .recent-searches {
        margin-top: 32px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .section-header h2 {
        margin-bottom: 0;
      }

      .clear-all-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 13px;
        cursor: pointer;
        transition: color 0.2s;
      }

      .clear-all-btn:hover {
        color: var(--text-primary);
      }

      .recent-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 12px;
      }

      .recent-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .recent-image {
        width: 48px;
        height: 48px;
        border-radius: 4px;
        overflow: hidden;
        flex-shrink: 0;
      }

      .recent-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .recent-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary);
        color: var(--text-tertiary);
      }

      .recent-placeholder svg {
        width: 20px;
        height: 20px;
      }

      .recent-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .recent-query {
        font-weight: 500;
        color: var(--text-primary);
      }

      .recent-type {
        font-size: 12px;
        color: var(--text-tertiary);
      }

      .remove-btn {
        opacity: 0;
        background: none;
        border: none;
        padding: 8px;
        cursor: pointer;
        color: var(--text-tertiary);
        border-radius: 50%;
        transition: all 0.2s;
      }

      .recent-item:hover .remove-btn {
        opacity: 1;
      }

      .remove-btn:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
      }

      .remove-btn svg {
        width: 16px;
        height: 16px;
      }

      /* No Results */
      .no-results {
        text-align: center;
        padding: 60px 20px;
      }

      .no-results svg {
        width: 64px;
        height: 64px;
        color: var(--text-tertiary);
        margin-bottom: 24px;
      }

      .no-results h3 {
        font-size: 20px;
        margin-bottom: 8px;
      }

      .no-results p {
        color: var(--text-secondary);
      }

      /* Results Section */
      .results-section {
        margin-top: 32px;
      }

      .results-section h3,
      .top-results-section h3 {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 16px;
      }

      .results-row {
        display: grid;
        grid-template-columns: 360px 1fr;
        gap: 24px;
      }

      @media (max-width: 1024px) {
        .results-row {
          grid-template-columns: 1fr;
        }
      }

      /* Top Result Card */
      .top-result-card {
        position: relative;
        padding: 20px;
        border-radius: 12px;
        cursor: pointer;
        transition: background 0.3s;
      }

      .top-result-card:hover .play-btn-lg {
        opacity: 1;
        transform: translateY(0);
      }

      .top-result-image {
        width: 92px;
        height: 92px;
        border-radius: 8px;
        object-fit: cover;
        margin-bottom: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      }

      .top-result-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
        line-height: 1.2;
      }

      .top-result-subtitle {
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .result-type-badge {
        background: var(--bg-tertiary);
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .play-btn-lg {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--accent-primary);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: translateY(8px);
        transition: all 0.3s;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      }

      .play-btn-lg:hover {
        transform: scale(1.05) translateY(0);
        background: var(--accent-secondary);
      }

      .play-btn-lg svg {
        width: 20px;
        height: 20px;
        color: white;
        margin-left: 2px;
      }

      /* Songs List */
      .songs-results {
        min-width: 0;
      }

      .songs-results.full-width {
        grid-column: 1 / -1;
      }

      .songs-list {
        display: flex;
        flex-direction: column;
      }

      .song-row {
        display: grid;
        grid-template-columns: 40px 48px 1fr auto auto auto;
        gap: 12px;
        align-items: center;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .song-row:hover {
        background: var(--bg-secondary);
      }

      .song-row.playing {
        background: var(--bg-secondary);
      }

      .song-index {
        text-align: center;
        color: var(--text-tertiary);
        font-size: 14px;
        width: 24px;
      }

      .song-row:hover .index-number {
        display: none;
      }

      .song-row:hover .song-play-overlay {
        opacity: 1;
      }

      .playing-indicator {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 2px;
        height: 16px;
      }

      .playing-indicator span {
        width: 3px;
        background: var(--accent-primary);
        border-radius: 2px;
        animation: equalizer 0.8s ease-in-out infinite;
      }

      .playing-indicator span:nth-child(1) {
        height: 8px;
        animation-delay: 0s;
      }

      .playing-indicator span:nth-child(2) {
        height: 16px;
        animation-delay: 0.2s;
      }

      .playing-indicator span:nth-child(3) {
        height: 12px;
        animation-delay: 0.4s;
      }

      @keyframes equalizer {
        0%,
        100% {
          transform: scaleY(0.5);
        }
        50% {
          transform: scaleY(1);
        }
      }

      .song-image {
        position: relative;
        width: 48px;
        height: 48px;
        border-radius: 4px;
        overflow: hidden;
      }

      .song-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .song-play-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .song-play-overlay svg {
        width: 20px;
        height: 20px;
        color: white;
      }

      .song-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }

      .song-title {
        font-weight: 500;
        color: var(--text-primary);
      }

      .song-title.text-accent {
        color: var(--accent-primary);
      }

      .song-artist {
        font-size: 13px;
        color: var(--text-secondary);
      }

      .song-duration {
        color: var(--text-tertiary);
        font-size: 13px;
        font-variant-numeric: tabular-nums;
      }

      .more-btn {
        opacity: 0;
        background: none;
        border: none;
        padding: 8px;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: 50%;
        transition: all 0.2s;
      }

      .song-row:hover .more-btn {
        opacity: 1;
      }

      .more-btn:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
      }

      .more-btn svg {
        width: 16px;
        height: 16px;
      }

      /* Results Grid */
      .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 24px;
      }

      .result-card {
        padding: 16px;
        border-radius: 12px;
        cursor: pointer;
        transition: background 0.3s;
        position: relative;
      }

      .result-card:hover .play-btn {
        opacity: 1;
        transform: translateY(0);
      }

      .result-image {
        position: relative;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 16px;
      }

      .artist-card .result-image,
      .artists-grid .artist-image {
        border-radius: 50%;
      }

      .result-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
      }

      .result-card:hover .result-image img {
        transform: scale(1.05);
      }

      .play-btn {
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--accent-primary);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: translateY(8px);
        transition: all 0.3s;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      }

      .play-btn:hover {
        transform: scale(1.05) translateY(0);
      }

      .play-btn svg {
        width: 18px;
        height: 18px;
        color: white;
        margin-left: 2px;
      }

      .result-title {
        font-weight: 600;
        margin-bottom: 4px;
        font-size: 15px;
      }

      .result-subtitle {
        font-size: 13px;
        color: var(--text-secondary);
      }

      .provider-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 700;
        color: white;
        z-index: 1;
      }

      .provider-badge.small {
        position: static;
        width: 18px;
        height: 18px;
        font-size: 9px;
      }

      .provider-badge.spotify {
        background: #1db954;
      }

      .provider-badge.youtube {
        background: #ff0000;
      }

      /* Context Menu */
      .context-menu {
        position: fixed;
        min-width: 200px;
        padding: 8px 0;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      }

      .context-menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 10px 16px;
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s;
        text-align: left;
      }

      .context-menu-item:hover {
        background: var(--bg-tertiary);
      }

      .context-menu-item svg {
        width: 16px;
        height: 16px;
        color: var(--text-secondary);
      }

      .context-menu-divider {
        height: 1px;
        background: var(--border-primary);
        margin: 8px 0;
      }

      @media (max-width: 767px) {
        .search-page {
          padding: 0 16px 16px;
        }

        .song-row {
          grid-template-columns: 48px 1fr auto;
        }

        .song-index {
          display: none;
        }

        .song-duration {
          display: none;
        }

        .categories-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .results-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .result-card {
          padding: 12px;
        }
      }
    `,
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly playerService = inject(PlayerService);
  private readonly toastService = inject(ToastService);
  private readonly likedTracksService = inject(LikedTracksService);

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private readonly apiUrl = environment.apiUrl;

  searchQuery = "";
  isLoading = signal(false);
  activeFilter = signal<"all" | "tracks" | "artists" | "albums" | "playlists">(
    "all",
  );
  activeProvider = signal<"all" | "spotify" | "youtube">("all");

  // Connection status
  spotifyConnected = signal(false);
  youtubeConnected = signal(false);

  // Results
  private allResults = signal<SearchResult[]>([]);
  recentSearches = signal<{ query: string; type: string; imageUrl?: string }[]>(
    [],
  );

  // Context menu
  contextMenuVisible = signal(false);
  contextMenuPosition = signal({ x: 0, y: 0 });
  contextMenuTrack = signal<SearchResult | null>(null);

  // Liked tracks - now uses LikedTracksService

  // Computed filtered results
  filteredTracks = computed(() =>
    this.allResults().filter((r) => r.type === "track"),
  );
  filteredArtists = computed(() =>
    this.allResults().filter((r) => r.type === "artist"),
  );
  filteredAlbums = computed(() =>
    this.allResults().filter((r) => r.type === "album"),
  );
  filteredPlaylists = computed(() =>
    this.allResults().filter((r) => r.type === "playlist"),
  );

  topResult = computed(() => {
    const results = this.allResults();
    return results.length > 0 ? results[0] : null;
  });

  hasResults = computed(() => this.allResults().length > 0);

  hasConnectedProviders = computed(
    () => this.spotifyConnected() || this.youtubeConnected(),
  );

  // Browse categories
  categories: SearchCategory[] = [
    {
      id: "pop",
      name: "Pop",
      icon: "🎵",
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    },
    {
      id: "hiphop",
      name: "Hip-Hop",
      icon: "🎤",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    },
    {
      id: "rock",
      name: "Rock",
      icon: "🎸",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    },
    {
      id: "electronic",
      name: "Electronic",
      icon: "🎧",
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    },
    {
      id: "jazz",
      name: "Jazz",
      icon: "🎷",
      color: "#84cc16",
      gradient: "linear-gradient(135deg, #84cc16, #65a30d)",
    },
    {
      id: "classical",
      name: "Classical",
      icon: "🎻",
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899, #db2777)",
    },
    {
      id: "rnb",
      name: "R&B",
      icon: "💜",
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    },
    {
      id: "country",
      name: "Country",
      icon: "🤠",
      color: "#f97316",
      gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    },
    {
      id: "indie",
      name: "Indie",
      icon: "🌿",
      color: "#22c55e",
      gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    },
    {
      id: "metal",
      name: "Metal",
      icon: "🤘",
      color: "#64748b",
      gradient: "linear-gradient(135deg, #64748b, #475569)",
    },
    {
      id: "latin",
      name: "Latin",
      icon: "💃",
      color: "#f43f5e",
      gradient: "linear-gradient(135deg, #f43f5e, #e11d48)",
    },
    {
      id: "kpop",
      name: "K-Pop",
      icon: "✨",
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899, #d946ef)",
    },
  ];

  ngOnInit(): void {
    // Check provider connections
    this.checkProviderConnections();

    // Load recent searches
    this.loadRecentSearches();

    // Setup debounced search
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        if (query.trim()) {
          this.performSearch(query);
        } else {
          this.allResults.set([]);
        }
      });

    // Check for query param
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params["q"]) {
          this.searchQuery = params["q"];
          this.onSearchChange(params["q"]);
        }
      });

    // Close context menu on click outside
    document.addEventListener("click", this.onDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener("click", this.onDocumentClick.bind(this));
  }

  private onDocumentClick(): void {
    this.hideContextMenu();
  }

  private checkProviderConnections(): void {
    const spotifySession = this.authService.getProviderSession(
      "spotify" as Provider,
    );
    const youtubeSession = this.authService.getProviderSession(
      "youtube" as Provider,
    );

    this.spotifyConnected.set(!!spotifySession);
    this.youtubeConnected.set(!!youtubeSession);
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  setProvider(provider: "all" | "spotify" | "youtube"): void {
    this.activeProvider.set(provider);
    if (this.searchQuery) {
      this.performSearch(this.searchQuery);
    }
  }

  performSearch(query: string): void {
    this.isLoading.set(true);
    this.allResults.set([]);

    const provider = this.activeProvider();
    const searchObservables: any[] = [];

    // Search Spotify
    if (
      (provider === "all" || provider === "spotify") &&
      this.spotifyConnected()
    ) {
      const spotifySession = this.authService.getProviderSession(
        "spotify" as Provider,
      );
      if (spotifySession) {
        const headers = new HttpHeaders().set("X-Session-Id", spotifySession);
        searchObservables.push(
          this.http
            .get<{
              items: SpotifyTrackResponse[];
            }>(
              `${this.apiUrl}/api/spotify/search?query=${encodeURIComponent(query)}&limit=20`,
              { headers },
            )
            .pipe(
              catchError((err) => {
                console.error("Spotify search error:", err);
                return of({ items: [] });
              }),
            ),
        );
      }
    }

    // Search YouTube
    if (
      (provider === "all" || provider === "youtube") &&
      this.youtubeConnected()
    ) {
      const youtubeSession = this.authService.getProviderSession(
        "youtube" as Provider,
      );
      if (youtubeSession) {
        const headers = new HttpHeaders().set("X-Session-Id", youtubeSession);
        searchObservables.push(
          this.http
            .get<{
              items: YouTubeTrackResponse[];
            }>(
              `${this.apiUrl}/api/youtube/search?query=${encodeURIComponent(query)}&limit=20`,
              { headers },
            )
            .pipe(
              catchError((err) => {
                console.error("YouTube search error:", err);
                return of({ items: [] });
              }),
            ),
        );
      }
    }

    if (searchObservables.length === 0) {
      this.isLoading.set(false);
      return;
    }

    forkJoin(searchObservables).subscribe({
      next: (results: any[]) => {
        const allItems: SearchResult[] = [];

        results.forEach((result, index) => {
          if (result.items) {
            result.items.forEach((item: any) => {
              if (item.provider === "spotify") {
                allItems.push(this.mapSpotifyResult(item));
              } else if (item.provider === "youtube") {
                allItems.push(this.mapYouTubeResult(item));
              }
            });
          }
        });

        // Sort by provider if searching all (interleave results)
        if (provider === "all") {
          const spotifyResults = allItems.filter(
            (r) => r.provider === "spotify",
          );
          const youtubeResults = allItems.filter(
            (r) => r.provider === "youtube",
          );
          const interleaved: SearchResult[] = [];

          const maxLen = Math.max(spotifyResults.length, youtubeResults.length);
          for (let i = 0; i < maxLen; i++) {
            if (spotifyResults[i]) interleaved.push(spotifyResults[i]);
            if (youtubeResults[i]) interleaved.push(youtubeResults[i]);
          }

          this.allResults.set(interleaved);
        } else {
          this.allResults.set(allItems);
        }

        this.isLoading.set(false);

        // Save to recent searches
        if (query.trim() && allItems.length > 0) {
          this.addToRecentSearches(query, allItems[0]?.imageUrl);
        }
      },
      error: (err) => {
        console.error("Search error:", err);
        this.isLoading.set(false);
        this.toastService.error("Search failed", "Please try again");
      },
    });
  }

  private mapSpotifyResult(item: SpotifyTrackResponse): SearchResult {
    return {
      id: item.id,
      title: item.name,
      subtitle: item.artists?.join(", ") || "",
      imageUrl: item.image || "https://via.placeholder.com/300?text=No+Image",
      type: "track",
      provider: "spotify",
      duration: item.durationMs,
      uri: item.uri,
    };
  }

  private mapYouTubeResult(item: YouTubeTrackResponse): SearchResult {
    // Use channel or channelTitle as the artist name
    const artistName = item.channel || item.channelTitle || "Unknown Artist";
    return {
      id: item.videoId,
      title: item.title,
      subtitle: artistName,
      imageUrl:
        item.thumbnail || "https://via.placeholder.com/300?text=No+Image",
      type: "track",
      provider: "youtube",
      videoId: item.videoId,
      duration: item.duration || 0,
    };
  }

  clearSearch(): void {
    this.searchQuery = "";
    this.allResults.set([]);
  }

  setFilter(
    filter: "all" | "tracks" | "artists" | "albums" | "playlists",
  ): void {
    this.activeFilter.set(filter);
  }

  searchFor(query: string): void {
    this.searchQuery = query;
    this.onSearchChange(query);
  }

  browseCategory(category: SearchCategory): void {
    this.searchFor(category.name);
  }

  // Recent searches management
  private loadRecentSearches(): void {
    const saved = localStorage.getItem("audiora_recent_searches");
    if (saved) {
      try {
        this.recentSearches.set(JSON.parse(saved));
      } catch {
        this.recentSearches.set([]);
      }
    }
  }

  private saveRecentSearches(): void {
    localStorage.setItem(
      "audiora_recent_searches",
      JSON.stringify(this.recentSearches()),
    );
  }

  private addToRecentSearches(query: string, imageUrl?: string): void {
    const current = this.recentSearches();
    const filtered = current.filter(
      (s) => s.query.toLowerCase() !== query.toLowerCase(),
    );
    const updated = [{ query, type: "Search", imageUrl }, ...filtered].slice(
      0,
      10,
    );
    this.recentSearches.set(updated);
    this.saveRecentSearches();
  }

  removeRecentSearch(item: { query: string }): void {
    const updated = this.recentSearches().filter((s) => s.query !== item.query);
    this.recentSearches.set(updated);
    this.saveRecentSearches();
  }

  clearRecentSearches(): void {
    this.recentSearches.set([]);
    localStorage.removeItem("audiora_recent_searches");
  }

  // Playback actions
  playResult(result: SearchResult): void {
    const track: Track = this.convertToTrack(result);
    this.playerService.play(track);
    this.toastService.success(
      "Now Playing",
      `${result.title} by ${result.subtitle}`,
    );
  }

  private convertToTrack(result: SearchResult): Track {
    return {
      id: result.id,
      provider: result.provider as Provider,
      providerId: result.id,
      title: result.title,
      artist: result.subtitle,
      albumArt: result.imageUrl,
      duration: result.duration || 0,
      isPlayable: true,
      externalUrl:
        result.provider === "youtube"
          ? `https://www.youtube.com/watch?v=${result.videoId}`
          : `https://open.spotify.com/track/${result.id}`,
      previewUrl: result.previewUrl,
    };
  }

  isTrackPlaying(track: SearchResult): boolean {
    const currentTrack = this.playerService.currentTrack();
    return currentTrack?.id === track.id && this.playerService.isPlaying();
  }

  // Context menu
  showTrackMenu(track: SearchResult, event: Event): void {
    event.stopPropagation();
    const mouseEvent = event as MouseEvent;

    // Position the menu near the click
    const x = Math.min(mouseEvent.clientX, window.innerWidth - 220);
    const y = Math.min(mouseEvent.clientY, window.innerHeight - 200);

    this.contextMenuPosition.set({ x, y });
    this.contextMenuTrack.set(track);
    this.contextMenuVisible.set(true);
  }

  hideContextMenu(): void {
    this.contextMenuVisible.set(false);
    this.contextMenuTrack.set(null);
  }

  addToQueue(track: SearchResult): void {
    const t = this.convertToTrack(track);
    this.playerService.addToQueue(t);
    this.toastService.success("Added to Queue", track.title);
    this.hideContextMenu();
  }

  playNext(track: SearchResult): void {
    const t = this.convertToTrack(track);
    this.playerService.playNext(t);
    this.toastService.success("Playing Next", track.title);
    this.hideContextMenu();
  }

  addToPlaylist(track: SearchResult): void {
    // TODO: Open playlist picker modal
    this.toastService.info("Coming Soon", "Add to playlist feature");
    this.hideContextMenu();
  }

  toggleLike(track: SearchResult): void {
    const isCurrentlyLiked = this.likedTracksService.isLiked(
      track.provider as "spotify" | "youtube",
      track.id,
    );

    if (isCurrentlyLiked) {
      this.likedTracksService.unlike(
        track.provider as "spotify" | "youtube",
        track.id,
      );
      this.toastService.success("Removed", "Removed from Liked Songs");
    } else {
      // For YouTube, subtitle is the channel/artist name
      // For Spotify, subtitle might be artist name or album
      const artistName = track.subtitle || "Unknown Artist";
      this.likedTracksService.like({
        id: track.id,
        providerId: track.videoId || track.id,
        title: track.title,
        artist: artistName,
        album: track.provider === "spotify" ? track.subtitle : undefined,
        albumArt: track.imageUrl,
        duration: track.duration || 0,
        provider: track.provider as "spotify" | "youtube",
        uri: track.uri,
        videoId: track.videoId,
      });
      this.toastService.success("Added", "Added to Liked Songs");
    }

    this.hideContextMenu();
  }

  isTrackLiked(track: SearchResult): boolean {
    return this.likedTracksService.isLiked(
      track.provider as "spotify" | "youtube",
      track.id,
    );
  }

  // Navigation
  viewArtist(artist: SearchResult): void {
    this.router.navigate(["/artist", artist.id], {
      queryParams: { provider: artist.provider },
    });
  }

  viewAlbum(album: SearchResult): void {
    this.router.navigate(["/album", album.id], {
      queryParams: { provider: album.provider },
    });
  }

  viewPlaylist(playlist: SearchResult): void {
    this.router.navigate(["/playlist", playlist.id], {
      queryParams: { provider: playlist.provider },
    });
  }

  // Connect providers
  connectSpotify(): void {
    this.authService.connectProvider("spotify" as Provider);
  }

  connectYouTube(): void {
    this.authService.connectProvider("youtube" as Provider);
  }

  formatDuration(ms: number): string {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

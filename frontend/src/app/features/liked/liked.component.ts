import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  computed,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import {
  LikedTracksService,
  LikedTrackData,
} from "../../core/services/liked-tracks.service";
import { PlayerService } from "../../core/services/player.service";
import { ToastService } from "../../core/services/toast.service";
import { Track } from "../../core/models";

@Component({
  selector: "app-liked",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="liked-container">
      <!-- Header -->
      <header class="liked-header">
        <div class="header-gradient" [style.background]="headerGradient"></div>
        <div class="header-content">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </div>
          <div class="header-info">
            <span class="header-type">Playlist</span>
            <h1 class="header-title">Liked Songs</h1>
            <p class="header-meta">
              <span class="track-count">{{ tracks().length }} songs</span>
              <span class="separator">•</span>
              <span class="total-duration">{{ formatTotalDuration() }}</span>
            </p>
          </div>
        </div>
      </header>

      <!-- Controls -->
      <div class="controls-section">
        <button
          class="play-all-btn"
          (click)="playAll()"
          [disabled]="tracks().length === 0"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
        <button
          class="shuffle-btn"
          (click)="shufflePlay()"
          [disabled]="tracks().length === 0"
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

        <!-- Filter by provider -->
        <div class="filter-group">
          <button
            class="filter-btn"
            [class.active]="providerFilter() === 'all'"
            (click)="setProviderFilter('all')"
          >
            All
          </button>
          <button
            class="filter-btn spotify"
            [class.active]="providerFilter() === 'spotify'"
            (click)="setProviderFilter('spotify')"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="filter-icon">
              <path
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
              />
            </svg>
            Spotify
          </button>
          <button
            class="filter-btn youtube"
            [class.active]="providerFilter() === 'youtube'"
            (click)="setProviderFilter('youtube')"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="filter-icon">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
            YouTube
          </button>
        </div>

        <!-- Search -->
        <div class="search-box">
          <svg
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
            placeholder="Search in liked songs..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          />
        </div>
      </div>

      <!-- Track List -->
      <div class="track-list" *ngIf="filteredTracks().length > 0">
        <!-- Table Header -->
        <div class="track-list-header">
          <span class="col-num">#</span>
          <span class="col-title">Title</span>
          <span class="col-album">Album</span>
          <span class="col-date">Date Added</span>
          <span class="col-duration">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
        </div>

        <!-- Track Items -->
        <div
          class="track-item"
          *ngFor="let track of filteredTracks(); let i = index"
          (click)="playTrack(track)"
          (dblclick)="playTrack(track)"
          [class.playing]="currentTrackId() === track.id"
        >
          <span class="col-num">
            <span class="track-number">{{ i + 1 }}</span>
            <button class="play-btn-small">
              <svg
                *ngIf="currentTrackId() !== track.id || !isPlaying()"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <svg
                *ngIf="currentTrackId() === track.id && isPlaying()"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>
          </span>

          <div class="col-title">
            <img [src]="track.albumArt" [alt]="track.album" class="track-art" />
            <div class="track-info">
              <span
                class="track-name truncate"
                [class.active]="currentTrackId() === track.id"
              >
                {{ track.title }}
              </span>
              <span class="track-artist truncate">{{ track.artist }}</span>
            </div>
            <span class="provider-badge" [class]="track.provider">
              {{ track.provider === "spotify" ? "S" : "Y" }}
            </span>
          </div>

          <span class="col-album truncate">{{ track.album }}</span>

          <span class="col-date">{{ formatDate(track.likedAt) }}</span>

          <div class="col-duration">
            <button
              class="action-btn unlike-btn"
              (click)="unlikeTrack(track, $event)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="0"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
            </button>
            <span class="duration-text">{{
              formatDuration(track.duration || 0)
            }}</span>
            <button
              class="action-btn more-btn"
              (click)="showTrackMenu(track, $event)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        class="empty-state"
        *ngIf="filteredTracks().length === 0 && !isLoading()"
      >
        <div class="empty-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </div>
        <h3 *ngIf="tracks().length === 0">Songs you like will appear here</h3>
        <h3 *ngIf="tracks().length > 0 && filteredTracks().length === 0">
          No songs match your search
        </h3>
        <p *ngIf="tracks().length === 0">
          Save songs by tapping the heart icon
        </p>
        <p *ngIf="tracks().length > 0 && filteredTracks().length === 0">
          Try a different search term or filter
        </p>
        <button
          class="btn btn-primary"
          (click)="navigateToSearch()"
          *ngIf="tracks().length === 0"
        >
          Find something to like
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading()">
        <div class="loading-spinner">
          <svg
            class="animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
          </svg>
        </div>
        <p>Loading your liked songs...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .liked-container {
        padding-bottom: var(--space-12);
        animation: fade-in var(--transition-slow) ease;
      }

      /* Header */
      .liked-header {
        position: relative;
        padding: var(--space-12) var(--space-6);
        margin: calc(var(--space-6) * -1);
        margin-bottom: var(--space-6);
        overflow: hidden;
      }

      .header-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(236, 72, 153, 0.4),
          rgba(168, 85, 247, 0.3),
          transparent
        );
        z-index: 0;
      }

      .header-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: flex-end;
        gap: var(--space-6);
      }

      .header-icon {
        width: 200px;
        height: 200px;
        background: linear-gradient(
          135deg,
          var(--aurora-purple),
          var(--aurora-pink)
        );
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-xl);
        flex-shrink: 0;
      }

      .header-icon svg {
        width: 80px;
        height: 80px;
        color: white;
      }

      .header-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .header-type {
        font-size: var(--text-sm);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: var(--tracking-wider);
        color: var(--text-secondary);
      }

      .header-title {
        font-size: var(--text-6xl);
        font-weight: 700;
        line-height: 1.1;
      }

      .header-meta {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      .separator {
        color: var(--text-muted);
      }

      /* Controls Section */
      .controls-section {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-6) 0;
        flex-wrap: wrap;
      }

      .play-all-btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--aurora-purple);
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        transition: all var(--transition-base);
        box-shadow: var(--shadow-lg);
      }

      .play-all-btn:hover:not(:disabled) {
        transform: scale(1.05);
        background: var(--aurora-purple-light);
      }

      .play-all-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .play-all-btn svg {
        width: 24px;
        height: 24px;
        color: white;
        margin-left: 3px;
      }

      .shuffle-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        transition: all var(--transition-base);
      }

      .shuffle-btn:hover:not(:disabled) {
        color: var(--text-primary);
      }

      .shuffle-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .shuffle-btn svg {
        width: 22px;
        height: 22px;
      }

      .filter-group {
        display: flex;
        gap: var(--space-2);
        margin-left: var(--space-4);
      }

      .filter-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-full);
        background: var(--surface-glass);
        border: 1px solid var(--surface-border);
        color: var(--text-secondary);
        font-size: var(--text-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .filter-btn:hover {
        background: var(--surface-glass-hover);
        color: var(--text-primary);
      }

      .filter-btn.active {
        background: var(--aurora-purple);
        border-color: var(--aurora-purple);
        color: white;
      }

      .filter-btn.spotify.active {
        background: var(--spotify-green);
        border-color: var(--spotify-green);
      }

      .filter-btn.youtube.active {
        background: var(--youtube-red);
        border-color: var(--youtube-red);
      }

      .filter-icon {
        width: 14px;
        height: 14px;
      }

      .search-box {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        background: var(--surface-glass);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-full);
        margin-left: auto;
        min-width: 200px;
        max-width: 300px;
      }

      .search-box svg {
        width: 16px;
        height: 16px;
        color: var(--text-muted);
        flex-shrink: 0;
      }

      .search-box input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-primary);
        font-size: var(--text-sm);
      }

      .search-box input::placeholder {
        color: var(--text-muted);
      }

      /* Track List */
      .track-list {
        display: flex;
        flex-direction: column;
      }

      .track-list-header {
        display: grid;
        grid-template-columns: 48px 1fr 200px 150px 120px;
        gap: var(--space-4);
        padding: var(--space-3) var(--space-4);
        border-bottom: 1px solid var(--surface-border);
        color: var(--text-muted);
        font-size: var(--text-xs);
        text-transform: uppercase;
        letter-spacing: var(--tracking-wider);
      }

      .track-list-header .col-duration {
        display: flex;
        justify-content: flex-end;
      }

      .track-list-header .col-duration svg {
        width: 16px;
        height: 16px;
      }

      .track-item {
        display: grid;
        grid-template-columns: 48px 1fr 200px 150px 120px;
        gap: var(--space-4);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-md);
        align-items: center;
        cursor: pointer;
        transition: background var(--transition-fast);
      }

      .track-item:hover {
        background: var(--surface-glass);
      }

      .track-item.playing {
        background: var(--surface-glass-hover);
      }

      .col-num {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        font-size: var(--text-sm);
      }

      .track-number {
        display: block;
      }

      .play-btn-small {
        display: none;
        width: 24px;
        height: 24px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--text-primary);
      }

      .play-btn-small svg {
        width: 16px;
        height: 16px;
      }

      .track-item:hover .track-number,
      .track-item.playing .track-number {
        display: none;
      }

      .track-item:hover .play-btn-small,
      .track-item.playing .play-btn-small {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .col-title {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        min-width: 0;
      }

      .track-art {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-sm);
        object-fit: cover;
        flex-shrink: 0;
      }

      .track-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1;
      }

      .track-name {
        font-size: var(--text-base);
        font-weight: 500;
        color: var(--text-primary);
      }

      .track-name.active {
        color: var(--aurora-purple);
      }

      .track-artist {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .provider-badge {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        font-size: 10px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
      }

      .provider-badge.spotify {
        background: var(--spotify-green);
      }

      .provider-badge.youtube {
        background: var(--youtube-red);
      }

      .col-album {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
      }

      .col-date {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
      }

      .col-duration {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--space-3);
      }

      .action-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        opacity: 0;
        transition: all var(--transition-fast);
      }

      .track-item:hover .action-btn {
        opacity: 1;
      }

      .action-btn:hover {
        color: var(--text-primary);
        background: var(--surface-glass);
      }

      .unlike-btn svg {
        width: 16px;
        height: 16px;
        color: var(--aurora-pink);
      }

      .unlike-btn:hover svg {
        color: var(--text-muted);
      }

      .more-btn svg {
        width: 18px;
        height: 18px;
      }

      .duration-text {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
        min-width: 40px;
        text-align: right;
      }

      /* Empty State */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-16) var(--space-6);
        text-align: center;
      }

      .empty-icon {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        background: var(--surface-glass);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--space-6);
      }

      .empty-icon svg {
        width: 48px;
        height: 48px;
        color: var(--text-muted);
      }

      .empty-state h3 {
        font-size: var(--text-xl);
        font-weight: 600;
        margin-bottom: var(--space-2);
      }

      .empty-state p {
        color: var(--text-tertiary);
        margin-bottom: var(--space-6);
      }

      /* Loading State */
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-16);
      }

      .loading-spinner svg {
        width: 48px;
        height: 48px;
        color: var(--aurora-purple);
      }

      .loading-state p {
        margin-top: var(--space-4);
        color: var(--text-tertiary);
      }

      .animate-spin {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      /* Responsive */
      @media (max-width: 1023px) {
        .track-list-header,
        .track-item {
          grid-template-columns: 40px 1fr 100px;
        }

        .col-album,
        .col-date {
          display: none;
        }

        .header-icon {
          width: 150px;
          height: 150px;
        }

        .header-icon svg {
          width: 60px;
          height: 60px;
        }

        .header-title {
          font-size: var(--text-4xl);
        }
      }

      @media (max-width: 767px) {
        .liked-header {
          padding: var(--space-6);
        }

        .header-content {
          flex-direction: column;
          align-items: flex-start;
        }

        .header-icon {
          width: 120px;
          height: 120px;
        }

        .header-icon svg {
          width: 48px;
          height: 48px;
        }

        .header-title {
          font-size: var(--text-3xl);
        }

        .controls-section {
          flex-wrap: wrap;
        }

        .filter-group {
          margin-left: 0;
          width: 100%;
          order: 3;
        }

        .search-box {
          margin-left: 0;
          width: 100%;
          max-width: none;
          order: 4;
        }

        .track-list-header {
          display: none;
        }

        .track-item {
          grid-template-columns: 1fr auto;
          gap: var(--space-3);
        }

        .col-num {
          display: none;
        }

        .provider-badge {
          display: none;
        }
      }
    `,
  ],
})
export class LikedComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly likedTracksService = inject(LikedTracksService);
  private readonly playerService = inject(PlayerService);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = new Subject<void>();

  // State signals
  providerFilter = signal<"all" | "spotify" | "youtube">("all");
  searchQuery = "";
  isLoading = signal(false);

  // Computed signals from service
  tracks = computed(() => this.likedTracksService.tracks());

  filteredTracks = computed(() => {
    let result = this.tracks();

    // Apply provider filter
    const provider = this.providerFilter();
    if (provider !== "all") {
      result = result.filter((t) => t.provider === provider);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query) ||
          (t.album && t.album.toLowerCase().includes(query)),
      );
    }

    return result;
  });

  // Current playback state
  currentTrackId = computed(() => {
    const current = this.playerService.currentTrack();
    return current?.id || null;
  });

  isPlaying = computed(() => this.playerService.isPlaying());

  headerGradient =
    "linear-gradient(135deg, rgba(236, 72, 153, 0.4), rgba(168, 85, 247, 0.3), transparent)";

  ngOnInit(): void {
    // Service loads from localStorage automatically
    // Show brief loading state for UX
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 200);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setProviderFilter(filter: "all" | "spotify" | "youtube"): void {
    this.providerFilter.set(filter);
  }

  onSearch(): void {
    // Triggers computed signal re-evaluation automatically
  }

  playAll(): void {
    const tracks = this.filteredTracks();
    if (tracks.length > 0) {
      this.playTrackList(tracks, 0);
    }
  }

  shufflePlay(): void {
    const tracks = [...this.filteredTracks()];
    if (tracks.length > 0) {
      // Shuffle array
      for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
      }
      this.playTrackList(tracks, 0);
    }
  }

  private playTrackList(tracks: LikedTrackData[], startIndex: number): void {
    const playerTracks = tracks.map((t) => this.convertToPlayerTrack(t));
    // Play the first track and add rest to queue
    if (playerTracks[startIndex]) {
      this.playerService.play(playerTracks[startIndex]);
      // Add remaining tracks to queue
      for (let i = startIndex + 1; i < playerTracks.length; i++) {
        this.playerService.addToQueue(playerTracks[i]);
      }
    }
  }

  playTrack(track: LikedTrackData): void {
    const playerTrack = this.convertToPlayerTrack(track);
    this.playerService.play(playerTrack);
  }

  private convertToPlayerTrack(track: LikedTrackData): Track {
    return {
      id: track.id,
      provider: track.provider,
      providerId: track.providerId || track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      albumArt: track.albumArt || "",
      duration: track.duration || 0,
      isPlayable: true,
      externalUrl:
        track.provider === "spotify"
          ? `https://open.spotify.com/track/${track.providerId || track.id}`
          : `https://www.youtube.com/watch?v=${track.videoId || track.providerId || track.id}`,
    };
  }

  unlikeTrack(track: LikedTrackData, event: Event): void {
    event.stopPropagation();
    this.likedTracksService.unlike(track.provider, track.id);
    this.toastService.success(
      "Removed",
      `"${track.title}" removed from Liked Songs`,
    );
  }

  showTrackMenu(track: LikedTrackData, event: Event): void {
    event.stopPropagation();
    // TODO: Implement context menu
    console.log("Show menu for:", track.title);
  }

  isTrackPlaying(track: LikedTrackData): boolean {
    return this.currentTrackId() === track.id && this.isPlaying();
  }

  navigateToSearch(): void {
    this.router.navigate(["/search"]);
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  formatTotalDuration(): string {
    const totalMs = this.tracks().reduce(
      (acc, t) => acc + (t.duration || 0),
      0,
    );
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

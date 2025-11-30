import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Subject, takeUntil, forkJoin, of, catchError } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";
import { PlayerService } from "../../../core/services/player.service";
import { ToastService } from "../../../core/services/toast.service";
import { environment } from "../../../../environments/environment";
import { Track, Provider } from "../../../core/models";

interface ProviderPlaylist {
  id: string;
  name: string;
  tracks: number;
  image: string | null;
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

type ViewState = "playlists" | "tracks";

@Component({
  selector: "app-provider-playlists",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="provider-playlists-container">
      <!-- Header -->
      <div class="panel-header">
        <button
          class="back-btn"
          *ngIf="viewState() === 'tracks'"
          (click)="goBack()"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h2>
          {{
            viewState() === "playlists"
              ? "Your Playlists"
              : selectedPlaylist()?.name
          }}
        </h2>
        <button class="close-btn" (click)="close.emit()">
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

      <!-- Provider Tabs -->
      <div class="provider-tabs" *ngIf="viewState() === 'playlists'">
        <button
          class="tab-btn"
          [class.active]="selectedProvider() === 'all'"
          (click)="selectProvider('all')"
        >
          All
        </button>
        <button
          class="tab-btn spotify"
          [class.active]="selectedProvider() === 'spotify'"
          [class.disabled]="!spotifyConnected()"
          (click)="selectProvider('spotify')"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
            />
          </svg>
          Spotify
        </button>
        <button
          class="tab-btn youtube"
          [class.active]="selectedProvider() === 'youtube'"
          [class.disabled]="!youtubeConnected()"
          (click)="selectProvider('youtube')"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            />
          </svg>
          YouTube
        </button>
      </div>

      <!-- Connection prompts -->
      <div
        class="connection-prompt"
        *ngIf="
          !spotifyConnected() &&
          !youtubeConnected() &&
          viewState() === 'playlists'
        "
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
        <h3>Connect Your Music</h3>
        <p>Link your Spotify or YouTube account to access your playlists</p>
      </div>

      <!-- Loading state -->
      <div class="loading-state" *ngIf="isLoading()">
        <div class="spinner"></div>
        <span>Loading playlists...</span>
      </div>

      <!-- Playlists Grid -->
      <div
        class="playlists-grid"
        *ngIf="
          !isLoading() &&
          viewState() === 'playlists' &&
          filteredPlaylists().length > 0
        "
      >
        <div
          class="playlist-card"
          *ngFor="let playlist of filteredPlaylists()"
          (click)="openPlaylist(playlist)"
        >
          <div class="card-image">
            <img
              *ngIf="playlist.image"
              [src]="playlist.image"
              [alt]="playlist.name"
            />
            <div class="placeholder-image" *ngIf="!playlist.image">
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
              class="play-overlay"
              (click)="playPlaylist(playlist); $event.stopPropagation()"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
            <span class="provider-badge" [class]="playlist.provider">
              {{ playlist.provider === "spotify" ? "S" : "Y" }}
            </span>
          </div>
          <div class="card-info">
            <h3>{{ playlist.name }}</h3>
            <p>{{ playlist.tracks }} tracks</p>
          </div>
        </div>
      </div>

      <!-- Empty playlists state -->
      <div
        class="empty-state"
        *ngIf="
          !isLoading() &&
          viewState() === 'playlists' &&
          filteredPlaylists().length === 0 &&
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
        <h3>No playlists found</h3>
        <p>
          Create some playlists on
          {{
            selectedProvider() === "all"
              ? "your connected services"
              : selectedProvider()
          }}
        </p>
      </div>

      <!-- Tracks View -->
      <div class="tracks-view" *ngIf="viewState() === 'tracks'">
        <!-- Track actions bar -->
        <div class="tracks-actions">
          <button class="action-btn primary" (click)="playAllTracks()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Play All
          </button>
          <button class="action-btn" (click)="addAllToQueue()">
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

        <!-- Loading tracks -->
        <div class="loading-state" *ngIf="isLoadingTracks()">
          <div class="spinner"></div>
          <span>Loading tracks...</span>
        </div>

        <!-- Tracks list -->
        <div
          class="tracks-list"
          *ngIf="!isLoadingTracks() && playlistTracks().length > 0"
        >
          <div
            class="track-item"
            *ngFor="let track of playlistTracks(); let i = index"
            (click)="playTrack(track, i)"
          >
            <div class="track-index">{{ i + 1 }}</div>
            <div class="track-image">
              <img
                *ngIf="track.thumbnail || track.albumArt"
                [src]="track.thumbnail || track.albumArt"
                [alt]="track.title"
              />
              <div
                class="placeholder-image"
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
                track.artist || track.channel || track.channelTitle || "Unknown"
              }}</span>
            </div>
            <div class="track-actions">
              <button
                class="action-icon"
                (click)="addTrackToQueue(track); $event.stopPropagation()"
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
                class="action-icon"
                (click)="playTrackNext(track); $event.stopPropagation()"
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

        <!-- Empty tracks state -->
        <div
          class="empty-state"
          *ngIf="!isLoadingTracks() && playlistTracks().length === 0"
        >
          <p>This playlist is empty</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .provider-playlists-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: rgba(18, 18, 26, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        overflow: hidden;
      }

      .panel-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .panel-header h2 {
        flex: 1;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .back-btn,
      .close-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: rgba(255, 255, 255, 0.7);
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .back-btn:hover,
      .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .back-btn svg,
      .close-btn svg {
        width: 20px;
        height: 20px;
      }

      /* Provider Tabs */
      .provider-tabs {
        display: flex;
        gap: 8px;
        padding: 12px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .tab-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border: none;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.7);
        border-radius: 20px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tab-btn:hover:not(.disabled) {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .tab-btn.active {
        background: linear-gradient(135deg, var(--primary, #a855f7), #3b82f6);
        color: white;
      }

      .tab-btn.disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .tab-btn svg {
        width: 16px;
        height: 16px;
      }

      .tab-btn.spotify.active svg {
        color: #1db954;
      }

      .tab-btn.youtube.active svg {
        color: #ff0000;
      }

      /* Connection prompt */
      .connection-prompt {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;
      }

      .prompt-icon {
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        color: rgba(255, 255, 255, 0.3);
      }

      .prompt-icon svg {
        width: 100%;
        height: 100%;
      }

      .connection-prompt h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .connection-prompt p {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
      }

      /* Loading state */
      .loading-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: rgba(255, 255, 255, 0.7);
      }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--primary, #a855f7);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Playlists Grid */
      .playlists-grid {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 16px;
        align-content: start;
      }

      .playlist-card {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 12px;
        padding: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .playlist-card:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
      }

      .card-image {
        position: relative;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 12px;
        background: rgba(0, 0, 0, 0.3);
      }

      .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .placeholder-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.2);
      }

      .placeholder-image svg {
        width: 40%;
        height: 40%;
      }

      .play-overlay {
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, var(--primary, #a855f7), #3b82f6);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: translateY(8px);
        transition: all 0.2s ease;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .playlist-card:hover .play-overlay {
        opacity: 1;
        transform: translateY(0);
      }

      .play-overlay svg {
        width: 18px;
        height: 18px;
        margin-left: 2px;
      }

      .provider-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 24px;
        height: 24px;
        border-radius: 6px;
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

      .card-info h3 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-info p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      /* Empty state */
      .empty-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
      }

      .empty-icon {
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        color: rgba(255, 255, 255, 0.2);
      }

      .empty-icon svg {
        width: 100%;
        height: 100%;
      }

      .empty-state h3 {
        font-size: 16px;
        margin-bottom: 4px;
        color: rgba(255, 255, 255, 0.7);
      }

      /* Tracks View */
      .tracks-view {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .tracks-actions {
        display: flex;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .action-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .action-btn.primary {
        background: linear-gradient(135deg, var(--primary, #a855f7), #3b82f6);
        color: white;
      }

      .action-btn.primary:hover {
        opacity: 0.9;
      }

      .action-btn svg {
        width: 16px;
        height: 16px;
      }

      .tracks-list {
        flex: 1;
        overflow-y: auto;
        padding: 8px 0;
      }

      .track-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 20px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .track-item:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .track-index {
        width: 24px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.4);
        text-align: center;
      }

      .track-image {
        width: 48px;
        height: 48px;
        border-radius: 6px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.3);
        flex-shrink: 0;
      }

      .track-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .track-image .placeholder-image {
        background: rgba(255, 255, 255, 0.05);
      }

      .track-image .placeholder-image svg {
        width: 50%;
        height: 50%;
      }

      .track-info {
        flex: 1;
        min-width: 0;
      }

      .track-title {
        display: block;
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 2px;
      }

      .track-artist {
        display: block;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .track-item:hover .track-actions {
        opacity: 1;
      }

      .action-icon {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: rgba(255, 255, 255, 0.6);
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .action-icon:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .action-icon svg {
        width: 16px;
        height: 16px;
      }

      /* Scrollbar */
      .playlists-grid::-webkit-scrollbar,
      .tracks-list::-webkit-scrollbar {
        width: 8px;
      }

      .playlists-grid::-webkit-scrollbar-track,
      .tracks-list::-webkit-scrollbar-track {
        background: transparent;
      }

      .playlists-grid::-webkit-scrollbar-thumb,
      .tracks-list::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }

      .playlists-grid::-webkit-scrollbar-thumb:hover,
      .tracks-list::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      @media (max-width: 600px) {
        .playlists-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .tracks-actions {
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class ProviderPlaylistsComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() trackSelected = new EventEmitter<Track>();

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly playerService = inject(PlayerService);
  private readonly toastService = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/api`;
  private readonly destroy$ = new Subject<void>();

  // State
  viewState = signal<ViewState>("playlists");
  selectedProvider = signal<"all" | "spotify" | "youtube">("all");
  selectedPlaylist = signal<ProviderPlaylist | null>(null);

  isLoading = signal(false);
  isLoadingTracks = signal(false);

  spotifyPlaylists = signal<ProviderPlaylist[]>([]);
  youtubePlaylists = signal<ProviderPlaylist[]>([]);
  playlistTracks = signal<ProviderTrack[]>([]);

  // Computed
  spotifyConnected = computed(
    () => !!this.authService.getProviderSession("spotify"),
  );
  youtubeConnected = computed(
    () => !!this.authService.getProviderSession("youtube"),
  );

  filteredPlaylists = computed(() => {
    const provider = this.selectedProvider();
    const spotify = this.spotifyPlaylists();
    const youtube = this.youtubePlaylists();

    if (provider === "spotify") return spotify;
    if (provider === "youtube") return youtube;
    return [...spotify, ...youtube];
  });

  ngOnInit(): void {
    this.loadPlaylists();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPlaylists(): void {
    this.isLoading.set(true);

    const requests: { spotify?: any; youtube?: any } = {};

    // Load Spotify playlists if connected
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

    // Load YouTube playlists if connected
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

    if (Object.keys(requests).length === 0) {
      this.isLoading.set(false);
      return;
    }

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results: any) => {
          if (results.spotify?.items) {
            this.spotifyPlaylists.set(
              results.spotify.items.map((p: any) => ({
                id: p.id,
                name: p.name,
                tracks: p.tracks || 0,
                image: p.image,
                provider: "spotify" as const,
              })),
            );
          }

          if (results.youtube?.items) {
            this.youtubePlaylists.set(
              results.youtube.items.map((p: any) => ({
                id: p.id,
                name: p.name,
                tracks: p.tracks || 0,
                image: p.image,
                provider: "youtube" as const,
              })),
            );
          }

          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.toastService.error("Failed to load playlists");
        },
      });
  }

  selectProvider(provider: "all" | "spotify" | "youtube"): void {
    if (provider === "spotify" && !this.spotifyConnected()) return;
    if (provider === "youtube" && !this.youtubeConnected()) return;
    this.selectedProvider.set(provider);
  }

  openPlaylist(playlist: ProviderPlaylist): void {
    this.selectedPlaylist.set(playlist);
    this.viewState.set("tracks");
    this.loadPlaylistTracks(playlist);
  }

  goBack(): void {
    this.viewState.set("playlists");
    this.selectedPlaylist.set(null);
    this.playlistTracks.set([]);
  }

  loadPlaylistTracks(playlist: ProviderPlaylist): void {
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
            this.mapToProviderTrack(item, playlist.provider),
          );
          this.playlistTracks.set(tracks);
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

  playTrack(providerTrack: ProviderTrack, index: number): void {
    const tracks = this.playlistTracks().map((t) => this.convertToTrack(t));
    this.playerService.playTracks(tracks, index);
  }

  playPlaylist(playlist: ProviderPlaylist): void {
    // Load tracks and play
    this.openPlaylist(playlist);
    // After loading, play all
    setTimeout(() => {
      if (this.playlistTracks().length > 0) {
        this.playAllTracks();
      }
    }, 500);
  }

  playAllTracks(): void {
    const tracks = this.playlistTracks().map((t) => this.convertToTrack(t));
    if (tracks.length > 0) {
      this.playerService.playTracks(tracks, 0);
      this.toastService.success(
        "Now Playing",
        `Playing ${tracks.length} tracks`,
      );
    }
  }

  addAllToQueue(): void {
    const tracks = this.playlistTracks().map((t) => this.convertToTrack(t));
    tracks.forEach((track) => this.playerService.addToQueue(track));
    this.toastService.success(
      "Added to Queue",
      `${tracks.length} tracks added`,
    );
  }

  addTrackToQueue(providerTrack: ProviderTrack): void {
    const track = this.convertToTrack(providerTrack);
    this.playerService.addToQueue(track);
    this.toastService.info("Added to Queue", track.title);
  }

  playTrackNext(providerTrack: ProviderTrack): void {
    const track = this.convertToTrack(providerTrack);
    this.playerService.playNext(track);
    this.toastService.info("Playing Next", track.title);
  }
}

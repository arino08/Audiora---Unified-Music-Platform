import { Component, OnInit, OnDestroy, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject, takeUntil } from "rxjs";
import { AuthService } from "../../core/services/auth.service";
import { PlayerService } from "../../core/services/player.service";
import { ToastService } from "../../core/services/toast.service";
import { Track, Provider } from "../../core/models";

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  provider: "spotify" | "youtube";
  addedAt: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  trackCount: number;
  totalDuration: number;
  isPublic: boolean;
  provider: "spotify" | "youtube" | "local";
  tracks: PlaylistTrack[];
}

@Component({
  selector: "app-playlist",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="playlist-container" *ngIf="playlist()">
      <!-- Header -->
      <header class="playlist-header">
        <div class="header-gradient" [style.background]="headerGradient"></div>
        <div class="header-content">
          <div class="playlist-image">
            <img
              [src]="
                playlist()!.imageUrl || 'assets/images/default-playlist.png'
              "
              [alt]="playlist()!.name"
            />
          </div>
          <div class="playlist-info">
            <span class="playlist-type">{{
              playlist()!.isPublic ? "Public Playlist" : "Private Playlist"
            }}</span>
            <h1 class="playlist-name">{{ playlist()!.name }}</h1>
            <p class="playlist-description" *ngIf="playlist()!.description">
              {{ playlist()!.description }}
            </p>
            <div class="playlist-meta">
              <span class="owner">{{ playlist()!.owner }}</span>
              <span class="separator">•</span>
              <span class="track-count"
                >{{ playlist()!.trackCount }} songs</span
              >
              <span class="separator">•</span>
              <span class="duration">{{
                formatTotalDuration(playlist()!.totalDuration)
              }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Controls -->
      <div class="controls-section">
        <button class="play-all-btn" (click)="playAll()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
        <button class="shuffle-btn" (click)="shufflePlay()">
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
        <button class="action-btn" (click)="toggleLike()">
          <svg
            viewBox="0 0 24 24"
            [attr.fill]="isLiked() ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </button>
        <button class="action-btn" (click)="showMenu()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      <!-- Track List -->
      <div class="track-list" *ngIf="playlist()!.tracks.length > 0">
        <!-- Header -->
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

        <!-- Tracks -->
        <div
          class="track-item"
          *ngFor="let track of playlist()!.tracks; let i = index"
          (click)="playTrack(track)"
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
          <span class="col-date">{{ formatDate(track.addedAt) }}</span>

          <div class="col-duration">
            <button class="like-btn" (click)="likeTrack(track, $event)">
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
            </button>
            <span class="duration-text">{{
              formatDuration(track.duration)
            }}</span>
            <button class="more-btn" (click)="showTrackMenu(track, $event)">
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
      <div class="empty-state" *ngIf="playlist()!.tracks.length === 0">
        <div class="empty-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <h3>This playlist is empty</h3>
        <p>Add some songs to get started</p>
        <button class="btn btn-primary" (click)="navigateToSearch()">
          Find Songs
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="isLoading()">
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
      <p>Loading playlist...</p>
    </div>
  `,
  styles: [
    `
      .playlist-container {
        padding-bottom: var(--space-12);
        animation: fade-in var(--transition-slow) ease;
      }

      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      /* Header */
      .playlist-header {
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
          rgba(168, 85, 247, 0.4),
          rgba(59, 130, 246, 0.3),
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

      .playlist-image {
        width: 232px;
        height: 232px;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-xl);
        flex-shrink: 0;
      }

      .playlist-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .playlist-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .playlist-type {
        font-size: var(--text-sm);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: var(--tracking-wider);
        color: var(--text-secondary);
      }

      .playlist-name {
        font-size: var(--text-6xl);
        font-weight: 700;
        line-height: 1.1;
      }

      .playlist-description {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        max-width: 600px;
      }

      .playlist-meta {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--text-secondary);
        font-size: var(--text-sm);
        margin-top: var(--space-2);
      }

      .owner {
        font-weight: 600;
        color: var(--text-primary);
      }

      .separator {
        color: var(--text-muted);
      }

      /* Controls */
      .controls-section {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-6) 0;
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

      .play-all-btn:hover {
        transform: scale(1.05);
        background: var(--aurora-purple-light);
      }

      .play-all-btn svg {
        width: 24px;
        height: 24px;
        color: white;
        margin-left: 3px;
      }

      .shuffle-btn,
      .action-btn {
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

      .shuffle-btn:hover,
      .action-btn:hover {
        color: var(--text-primary);
      }

      .shuffle-btn svg,
      .action-btn svg {
        width: 22px;
        height: 22px;
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

      .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

      .like-btn,
      .more-btn {
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

      .track-item:hover .like-btn,
      .track-item:hover .more-btn {
        opacity: 1;
      }

      .like-btn:hover,
      .more-btn:hover {
        color: var(--text-primary);
        background: var(--surface-glass);
      }

      .like-btn svg,
      .more-btn svg {
        width: 16px;
        height: 16px;
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

      .btn {
        padding: var(--space-3) var(--space-6);
        border-radius: var(--radius-lg);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .btn-primary {
        background: var(--gradient-aurora);
        color: white;
        border: none;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      /* Loading */
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
      }

      .loading-spinner svg {
        width: 48px;
        height: 48px;
        color: var(--aurora-purple);
      }

      .loading-container p {
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

        .playlist-image {
          width: 180px;
          height: 180px;
        }

        .playlist-name {
          font-size: var(--text-4xl);
        }
      }

      @media (max-width: 767px) {
        .playlist-header {
          padding: var(--space-6);
        }

        .header-content {
          flex-direction: column;
          align-items: flex-start;
        }

        .playlist-image {
          width: 140px;
          height: 140px;
        }

        .playlist-name {
          font-size: var(--text-3xl);
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
export class PlaylistComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  playlist = signal<Playlist | null>(null);
  isLoading = signal(true);
  isLiked = signal(false);
  currentTrackId = signal<string | null>(null);
  isPlaying = signal(false);

  headerGradient =
    "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.3), transparent)";

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly playerService = inject(PlayerService);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = new Subject<void>();
  private readonly apiUrl = "http://localhost:8080/api";

  ngOnInit(): void {
    const playlistId = this.route.snapshot.params["id"];
    const provider = this.route.snapshot.queryParams["provider"] as
      | "spotify"
      | "youtube"
      | undefined;

    if (playlistId && provider) {
      this.loadPlaylist(playlistId, provider);
    } else if (playlistId) {
      // Try to determine provider from session
      const spotifySession = this.authService.getProviderSession("spotify");
      const youtubeSession = this.authService.getProviderSession("youtube");

      if (spotifySession) {
        this.loadPlaylist(playlistId, "spotify");
      } else if (youtubeSession) {
        this.loadPlaylist(playlistId, "youtube");
      } else {
        this.loadEmptyPlaylist(playlistId);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPlaylist(id: string, provider: "spotify" | "youtube"): void {
    this.isLoading.set(true);

    const session = this.authService.getProviderSession(provider);
    if (!session) {
      this.toastService.error(
        "Not connected",
        `Please connect your ${provider} account first`,
      );
      this.loadEmptyPlaylist(id);
      return;
    }

    const headers = new HttpHeaders().set("X-Session-Id", session);
    const endpoint =
      provider === "spotify"
        ? `${this.apiUrl}/spotify/playlists/${id}`
        : `${this.apiUrl}/youtube/playlists/${id}`;

    this.http
      .get<any>(endpoint, { headers })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const tracks: PlaylistTrack[] = (
            data.tracks?.items ||
            data.items ||
            []
          ).map((item: any) => {
            if (provider === "spotify") {
              const track = item.track || item;
              return {
                id: track.id,
                title: track.name,
                artist:
                  track.artists?.map((a: any) => a.name).join(", ") ||
                  "Unknown",
                album: track.album?.name || "",
                albumArt: track.album?.images?.[0]?.url || "",
                duration: track.duration_ms || 0,
                provider: "spotify" as const,
                addedAt: item.added_at || new Date().toISOString(),
              };
            } else {
              const snippet = item.snippet || item;
              return {
                id: item.id || snippet.resourceId?.videoId,
                title: snippet.title || "Unknown",
                artist: snippet.videoOwnerChannelTitle || "Unknown",
                album: "",
                albumArt:
                  snippet.thumbnails?.medium?.url ||
                  snippet.thumbnails?.default?.url ||
                  "",
                duration: 0,
                provider: "youtube" as const,
                addedAt: snippet.publishedAt || new Date().toISOString(),
              };
            }
          });

          this.playlist.set({
            id,
            name: data.name || data.snippet?.title || "Playlist",
            description: data.description || data.snippet?.description || "",
            imageUrl:
              data.images?.[0]?.url ||
              data.snippet?.thumbnails?.medium?.url ||
              "",
            owner:
              data.owner?.display_name || data.snippet?.channelTitle || "You",
            trackCount: tracks.length,
            totalDuration: tracks.reduce((sum, t) => sum + t.duration, 0),
            isPublic: data.public !== false,
            provider,
            tracks,
          });
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error("Failed to load playlist:", err);
          this.toastService.error("Error", "Failed to load playlist");
          this.loadEmptyPlaylist(id);
        },
      });
  }

  private loadEmptyPlaylist(id: string): void {
    this.playlist.set({
      id,
      name: "Playlist",
      description: "",
      imageUrl: "",
      owner: "You",
      trackCount: 0,
      totalDuration: 0,
      isPublic: false,
      provider: "local",
      tracks: [],
    });
    this.isLoading.set(false);
  }

  playAll(): void {
    const tracks = this.playlist()?.tracks;
    if (tracks && tracks.length > 0) {
      this.playTrack(tracks[0]);
    }
  }

  shufflePlay(): void {
    const tracks = [...(this.playlist()?.tracks || [])];
    if (tracks.length > 0) {
      for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
      }
      this.playTrack(tracks[0]);
    }
  }

  toggleLike(): void {
    this.isLiked.update((v) => !v);
  }

  showMenu(): void {
    console.log("Show playlist menu");
  }

  playTrack(track: PlaylistTrack): void {
    this.currentTrackId.set(track.id);
    this.isPlaying.set(true);
    console.log("Playing:", track.title);
  }

  likeTrack(track: PlaylistTrack, event: Event): void {
    event.stopPropagation();
    console.log("Like track:", track.title);
  }

  showTrackMenu(track: PlaylistTrack, event: Event): void {
    event.stopPropagation();
    console.log("Show menu for:", track.title);
  }

  navigateToSearch(): void {
    this.router.navigate(["/search"]);
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  formatTotalDuration(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);

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

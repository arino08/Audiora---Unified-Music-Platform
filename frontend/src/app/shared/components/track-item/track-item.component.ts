import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track, Provider } from '../../../core/models';
import { PlayerService } from '../../../core/services/player.service';
import { MusicService } from '../../../core/services/music.service';

@Component({
  selector: 'app-track-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="track-item"
      [class.playing]="isCurrentTrack"
      [class.compact]="compact"
      (click)="onPlay()"
    >
      <!-- Track Number / Play Button -->
      <div class="col-num" *ngIf="showNumber">
        <span class="track-number">{{ index + 1 }}</span>
        <button class="play-btn-small" (click)="onPlay(); $event.stopPropagation()">
          <svg *ngIf="!isCurrentTrack || !isPlaying" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <svg *ngIf="isCurrentTrack && isPlaying" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        </button>
      </div>

      <!-- Track Image (for compact mode without number) -->
      <div class="track-image-small" *ngIf="!showNumber && compact">
        <img *ngIf="track.albumArt" [src]="track.albumArt" [alt]="track.title" />
        <div class="image-placeholder" *ngIf="!track.albumArt">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div class="image-overlay" *ngIf="isCurrentTrack">
          <svg *ngIf="isPlaying" viewBox="0 0 24 24" fill="currentColor" class="playing-icon">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
          <svg *ngIf="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
      </div>

      <!-- Track Info -->
      <div class="col-title">
        <div class="track-art" *ngIf="showImage && !compact">
          <img *ngIf="track.albumArt" [src]="track.albumArt" [alt]="track.title" />
          <div class="art-placeholder" *ngIf="!track.albumArt">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        </div>
        <div class="track-info">
          <span class="track-name" [class.active]="isCurrentTrack">{{ track.title }}</span>
          <div class="track-meta">
            <span *ngIf="track.explicit" class="explicit-badge">E</span>
            <span class="track-artist">{{ track.artist }}</span>
          </div>
        </div>
        <span class="provider-badge" [class]="track.provider" *ngIf="showProvider">
          <svg *ngIf="track.provider === 'spotify'" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <svg *ngIf="track.provider === 'youtube'" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </span>
      </div>

      <!-- Album -->
      <div class="col-album" *ngIf="showAlbum && !compact">
        <span>{{ track.album || '-' }}</span>
      </div>

      <!-- Date Added -->
      <div class="col-date" *ngIf="showDate && dateAdded && !compact">
        <span>{{ formatDate(dateAdded) }}</span>
      </div>

      <!-- Actions & Duration -->
      <div class="col-duration">
        <button
          class="action-btn like-btn"
          [class.liked]="isLiked"
          (click)="onLike($event)"
          *ngIf="showLike"
        >
          <svg *ngIf="!isLiked" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <svg *ngIf="isLiked" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <span class="duration-text">{{ formatDuration(track.duration) }}</span>
        <button class="action-btn more-btn" (click)="onMenu($event)" *ngIf="showMenu">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .track-item {
      display: grid;
      grid-template-columns: 40px 1fr 180px 140px 120px;
      gap: var(--space-4);
      align-items: center;
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background-color var(--transition-base);
    }

    .track-item:hover {
      background: var(--surface-glass-hover);
    }

    .track-item.playing {
      background: var(--surface-glass);
    }

    .track-item.compact {
      grid-template-columns: 48px 1fr auto;
      padding: var(--space-2);
      gap: var(--space-3);
    }

    /* Number Column */
    .col-num {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .track-number {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
    }

    .play-btn-small {
      position: absolute;
      width: 24px;
      height: 24px;
      padding: 0;
      background: none;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
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
    }

    /* Track Image Small (compact mode) */
    .track-image-small {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }

    .track-image-small img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      background: var(--surface-glass);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-placeholder svg {
      width: 24px;
      height: 24px;
      color: var(--text-muted);
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-overlay svg {
      width: 20px;
      height: 20px;
      color: white;
    }

    .playing-icon {
      animation: pulse 1s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Title Column */
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
      overflow: hidden;
      flex-shrink: 0;
    }

    .track-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .art-placeholder {
      width: 100%;
      height: 100%;
      background: var(--surface-glass);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .art-placeholder svg {
      width: 20px;
      height: 20px;
      color: var(--text-muted);
    }

    .track-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      min-width: 0;
    }

    .track-name {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-name.active {
      color: var(--aurora-purple);
    }

    .track-meta {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .explicit-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      font-size: 9px;
      font-weight: 700;
      color: var(--color-bg-primary);
      background: var(--text-tertiary);
      border-radius: 2px;
      flex-shrink: 0;
    }

    .track-artist {
      font-size: var(--text-xs);
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .provider-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-left: auto;
    }

    .provider-badge svg {
      width: 12px;
      height: 12px;
    }

    .provider-badge.spotify {
      background: var(--spotify-green);
      color: white;
    }

    .provider-badge.youtube {
      background: var(--youtube-red);
      color: white;
    }

    /* Album Column */
    .col-album {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-item:hover .col-album {
      color: var(--text-secondary);
    }

    /* Date Column */
    .col-date {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    /* Duration Column */
    .col-duration {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-3);
    }

    .action-btn {
      width: 32px;
      height: 32px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: var(--radius-md);
      opacity: 0;
      transition: all var(--transition-base);
    }

    .track-item:hover .action-btn {
      opacity: 1;
    }

    .action-btn:hover {
      color: var(--text-primary);
      background: var(--surface-glass);
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    .like-btn.liked {
      color: var(--color-error);
      opacity: 1;
    }

    .like-btn.liked:hover {
      color: var(--color-error);
    }

    .duration-text {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
      min-width: 40px;
      text-align: right;
    }

    /* Responsive */
    @media (max-width: 1023px) {
      .track-item {
        grid-template-columns: 40px 1fr 100px;
      }

      .col-album,
      .col-date {
        display: none;
      }
    }

    @media (max-width: 767px) {
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
  `]
})
export class TrackItemComponent {
  private readonly playerService = inject(PlayerService);
  private readonly musicService = inject(MusicService);

  @Input({ required: true }) track!: Track;
  @Input() index = 0;
  @Input() dateAdded?: string;
  @Input() isLiked = false;
  @Input() showNumber = true;
  @Input() showImage = true;
  @Input() showAlbum = true;
  @Input() showDate = false;
  @Input() showProvider = true;
  @Input() showLike = true;
  @Input() showMenu = true;
  @Input() compact = false;

  @Output() play = new EventEmitter<Track>();
  @Output() like = new EventEmitter<Track>();
  @Output() menu = new EventEmitter<{ track: Track; event: MouseEvent }>();

  get isCurrentTrack(): boolean {
    const current = this.playerService.currentTrack();
    return current?.provider === this.track.provider &&
           current?.providerId === this.track.providerId;
  }

  get isPlaying(): boolean {
    return this.isCurrentTrack && this.playerService.isPlaying();
  }

  onPlay(): void {
    if (this.isCurrentTrack) {
      this.playerService.togglePlayPause();
    } else {
      this.play.emit(this.track);
    }
  }

  onLike(event: MouseEvent): void {
    event.stopPropagation();
    this.like.emit(this.track);
  }

  onMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menu.emit({ track: this.track, event });
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

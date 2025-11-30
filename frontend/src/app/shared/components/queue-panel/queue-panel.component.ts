import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { PlayerService } from '../../../core/services/player.service';
import { Track } from '../../../core/models';

@Component({
  selector: 'app-queue-panel',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  template: `
    <div class="queue-panel" [class.visible]="isVisible()">
      <div class="queue-header">
        <h2>Queue</h2>
        <div class="queue-actions">
          <button class="btn-icon" (click)="clearQueue()" title="Clear queue" [disabled]="queue().length === 0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
          <button class="btn-icon close-btn" (click)="close()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Now Playing -->
      <div class="now-playing-section" *ngIf="currentTrack()">
        <h3>Now Playing</h3>
        <div class="now-playing-track">
          <div class="track-art">
            <img *ngIf="currentTrack()?.albumArt" [src]="currentTrack()?.albumArt" [alt]="currentTrack()?.title" />
            <div class="track-art-placeholder" *ngIf="!currentTrack()?.albumArt">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="20" height="20" rx="4"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="12" cy="12" r="1"/>
              </svg>
            </div>
            <div class="playing-indicator" *ngIf="isPlaying()">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="track-info">
            <span class="track-title">{{ currentTrack()?.title }}</span>
            <span class="track-artist">{{ currentTrack()?.artist }}</span>
          </div>
          <div class="provider-badge" [class]="currentTrack()?.provider">
            <svg *ngIf="currentTrack()?.provider === 'spotify'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <svg *ngIf="currentTrack()?.provider === 'youtube'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Up Next -->
      <div class="up-next-section">
        <h3>Up Next <span class="track-count" *ngIf="upcomingTracks().length > 0">({{ upcomingTracks().length }})</span></h3>

        <div class="empty-queue" *ngIf="upcomingTracks().length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          <p>No tracks in queue</p>
          <span>Add songs to your queue to see them here</span>
        </div>

        <div
          class="queue-list"
          cdkDropList
          [cdkDropListData]="upcomingTracks()"
          (cdkDropListDropped)="onDrop($event)"
          *ngIf="upcomingTracks().length > 0"
        >
          <div
            class="queue-item"
            *ngFor="let track of upcomingTracks(); let i = index"
            cdkDrag
            [cdkDragData]="track"
          >
            <div class="drag-handle" cdkDragHandle>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="9" cy="6" r="1.5"/>
                <circle cx="15" cy="6" r="1.5"/>
                <circle cx="9" cy="12" r="1.5"/>
                <circle cx="15" cy="12" r="1.5"/>
                <circle cx="9" cy="18" r="1.5"/>
                <circle cx="15" cy="18" r="1.5"/>
              </svg>
            </div>

            <div class="track-art" (click)="playFromQueue(i)">
              <img *ngIf="track.albumArt" [src]="track.albumArt" [alt]="track.title" />
              <div class="track-art-placeholder" *ngIf="!track.albumArt">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="4"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
              <div class="play-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>

            <div class="track-info" (click)="playFromQueue(i)">
              <span class="track-title">{{ track.title }}</span>
              <span class="track-artist">{{ track.artist }}</span>
            </div>

            <div class="provider-badge small" [class]="track.provider">
              <svg *ngIf="track.provider === 'spotify'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <svg *ngIf="track.provider === 'youtube'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>

            <span class="track-duration">{{ formatDuration(track.duration) }}</span>

            <button class="btn-icon remove-btn" (click)="removeFromQueue(i)" title="Remove from queue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <!-- Drag preview -->
            <div class="drag-preview" *cdkDragPreview>
              <div class="preview-art">
                <img *ngIf="track.albumArt" [src]="track.albumArt" [alt]="track.title" />
              </div>
              <span class="preview-title">{{ track.title }}</span>
            </div>

            <!-- Drag placeholder -->
            <div class="drag-placeholder" *cdkDragPlaceholder></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .queue-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: var(--player-height, 90px);
      width: 380px;
      background: rgba(18, 18, 26, 0.95);
      backdrop-filter: blur(20px);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 100;
      overflow: hidden;
    }

    .queue-panel.visible {
      transform: translateX(0);
    }

    .queue-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .queue-header h2 {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      margin: 0;
    }

    .queue-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .btn-icon:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .btn-icon:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-icon svg {
      width: 18px;
      height: 18px;
    }

    /* Now Playing Section */
    .now-playing-section {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .now-playing-section h3,
    .up-next-section h3 {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0 0 12px 0;
    }

    .track-count {
      color: rgba(255, 255, 255, 0.4);
      font-weight: 400;
    }

    .now-playing-track {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(168, 85, 247, 0.1);
      border-radius: 12px;
      border: 1px solid rgba(168, 85, 247, 0.2);
    }

    .track-art {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      position: relative;
    }

    .track-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .track-art-placeholder {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .track-art-placeholder svg {
      width: 24px;
      height: 24px;
      color: rgba(255, 255, 255, 0.3);
    }

    .playing-indicator {
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 2px;
      align-items: flex-end;
      height: 12px;
    }

    .playing-indicator span {
      width: 3px;
      background: #a855f7;
      border-radius: 1px;
      animation: eq-bar 0.8s ease-in-out infinite;
    }

    .playing-indicator span:nth-child(1) { animation-delay: 0s; }
    .playing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .playing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes eq-bar {
      0%, 100% { height: 4px; }
      50% { height: 12px; }
    }

    .track-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .track-title {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-artist {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .provider-badge {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .provider-badge svg {
      width: 12px;
      height: 12px;
    }

    .provider-badge.spotify {
      background: rgba(30, 215, 96, 0.2);
      color: #1ed760;
    }

    .provider-badge.youtube {
      background: rgba(255, 0, 0, 0.2);
      color: #ff0000;
    }

    .provider-badge.small {
      width: 18px;
      height: 18px;
    }

    .provider-badge.small svg {
      width: 10px;
      height: 10px;
    }

    /* Up Next Section */
    .up-next-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px;
      overflow: hidden;
    }

    .empty-queue {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      padding: 32px;
    }

    .empty-queue svg {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-queue p {
      font-size: 14px;
      font-weight: 500;
      margin: 0 0 4px 0;
    }

    .empty-queue span {
      font-size: 12px;
      opacity: 0.7;
    }

    .queue-list {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .queue-list::-webkit-scrollbar {
      width: 6px;
    }

    .queue-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .queue-list::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .queue-list::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .queue-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .queue-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .queue-item:hover .remove-btn {
      opacity: 1;
    }

    .queue-item:hover .play-overlay {
      opacity: 1;
    }

    .drag-handle {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      color: rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .drag-handle svg {
      width: 14px;
      height: 14px;
    }

    .queue-item .track-art {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }

    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .play-overlay svg {
      width: 16px;
      height: 16px;
      color: #fff;
    }

    .queue-item .track-info {
      cursor: pointer;
    }

    .track-duration {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      flex-shrink: 0;
    }

    .remove-btn {
      opacity: 0;
      width: 28px;
      height: 28px;
    }

    .remove-btn svg {
      width: 14px;
      height: 14px;
    }

    /* Drag and Drop Styles */
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 8px;
      background: rgba(18, 18, 26, 0.95);
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .drag-preview {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .preview-art {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      overflow: hidden;
    }

    .preview-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-title {
      font-size: 13px;
      color: #fff;
      font-weight: 500;
    }

    .drag-placeholder {
      background: rgba(168, 85, 247, 0.1);
      border: 2px dashed rgba(168, 85, 247, 0.3);
      border-radius: 8px;
      min-height: 56px;
      margin: 4px 0;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .queue-list.cdk-drop-list-dragging .queue-item:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    /* Responsive */
    @media (max-width: 767px) {
      .queue-panel {
        width: 100%;
      }
    }
  `]
})
export class QueuePanelComponent implements OnInit, OnDestroy {
  private readonly playerService = inject(PlayerService);
  private destroy$ = new Subject<void>();

  isVisible = signal(false);

  // Computed signals from player service
  queue = computed(() => this.playerService.queue());
  queueIndex = computed(() => this.playerService.queueIndex());
  currentTrack = computed(() => this.playerService.currentTrack());
  isPlaying = computed(() => this.playerService.isPlaying());

  // Get upcoming tracks (after current track)
  upcomingTracks = computed(() => {
    const q = this.queue();
    const idx = this.queueIndex();
    if (idx < 0 || idx >= q.length - 1) return [];
    return q.slice(idx + 1);
  });

  ngOnInit(): void {
    // Subscribe to queue visibility toggle
    this.playerService.queueUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Queue was updated, component will re-render via signals
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  show(): void {
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }

  toggle(): void {
    this.isVisible.update(v => !v);
  }

  close(): void {
    this.hide();
  }

  playFromQueue(relativeIndex: number): void {
    const actualIndex = this.queueIndex() + 1 + relativeIndex;
    const q = this.queue();
    if (actualIndex >= 0 && actualIndex < q.length) {
      this.playerService.playTracks(q, actualIndex);
    }
  }

  removeFromQueue(relativeIndex: number): void {
    const actualIndex = this.queueIndex() + 1 + relativeIndex;
    this.playerService.removeFromQueue(actualIndex);
  }

  clearQueue(): void {
    this.playerService.clearQueue();
  }

  onDrop(event: CdkDragDrop<Track[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const q = [...this.queue()];
    const currentIdx = this.queueIndex();

    // Calculate actual indices in the full queue
    const actualPrevIndex = currentIdx + 1 + event.previousIndex;
    const actualCurrentIndex = currentIdx + 1 + event.currentIndex;

    // Move item in the queue
    moveItemInArray(q, actualPrevIndex, actualCurrentIndex);

    // Update the queue in player service
    this.playerService.reorderQueue(q);
  }

  formatDuration(ms: number): string {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

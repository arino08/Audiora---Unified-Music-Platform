import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  inject,
  signal,
  AfterViewInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { YouTubePlayerService } from "../../../core/services/youtube-player.service";

export type PlayerMode = "full" | "mini" | "audio-only" | "background";

@Component({
  selector: "app-youtube-player",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="youtube-player-wrapper"
      [class.visible]="isVisible()"
      [class.expanded]="isExpanded()"
      [class.mini]="playerMode() === 'mini'"
      [class.audio-only]="playerMode() === 'audio-only'"
      [class.background]="playerMode() === 'background'"
    >
      <!-- Mini/Audio-only header -->
      <div class="player-header" [class.compact]="playerMode() !== 'full'">
        <div class="header-info">
          <svg viewBox="0 0 24 24" fill="currentColor" class="youtube-icon">
            <path
              d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            />
          </svg>
          <span class="header-title" *ngIf="playerMode() === 'full'"
            >YouTube Player</span
          >
          <span
            class="header-title track-title"
            *ngIf="playerMode() !== 'full' && playerMode() !== 'background'"
            >{{ currentVideoTitle() || "YouTube" }}</span
          >
        </div>
        <div class="header-actions">
          <!-- Show expand button in background mode -->
          <button
            class="btn-icon mode-btn"
            *ngIf="playerMode() === 'background'"
            (click)="setPlayerMode('full')"
            title="Show Full Player"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
          <button
            class="btn-icon"
            *ngIf="playerMode() === 'background'"
            (click)="hide()"
            title="Hide"
          >
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
        <div class="header-actions" *ngIf="playerMode() !== 'background'">
          <!-- Mode toggle buttons -->
          <button
            class="btn-icon mode-btn"
            (click)="setPlayerMode('background')"
            [class.active]="playerMode() === 'background'"
            title="Background (Use Native Player)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </button>
          <button
            class="btn-icon mode-btn"
            (click)="setPlayerMode('audio-only')"
            [class.active]="playerMode() === 'audio-only'"
            title="Audio Only"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </button>
          <button
            class="btn-icon mode-btn"
            (click)="setPlayerMode('mini')"
            [class.active]="playerMode() === 'mini'"
            title="Mini Player"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
          </button>
          <button
            class="btn-icon mode-btn"
            (click)="setPlayerMode('full')"
            [class.active]="playerMode() === 'full'"
            title="Full Player"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </button>
          <button
            class="btn-icon"
            (click)="toggleExpand()"
            *ngIf="playerMode() === 'full'"
            [title]="isExpanded() ? 'Minimize' : 'Expand'"
          >
            <svg
              *ngIf="!isExpanded()"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
            <svg
              *ngIf="isExpanded()"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="14" y1="10" x2="21" y2="3"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
          <button class="btn-icon" (click)="hide()" title="Close">
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
      </div>

      <!-- Video container - hidden in audio-only and background modes -->
      <div
        class="player-container"
        [class.hidden]="
          playerMode() === 'audio-only' || playerMode() === 'background'
        "
      >
        <div id="youtube-player-container" #playerContainer></div>

        <!-- Loading state -->
        <div class="loading-overlay" *ngIf="isLoading()">
          <div class="spinner"></div>
          <span>Loading video...</span>
        </div>

        <!-- Error state -->
        <div class="error-overlay" *ngIf="hasError()">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ errorMessage() }}</span>
          <button class="retry-btn" (click)="retry()">Retry</button>
        </div>
      </div>

      <!-- Audio-only visualizer -->
      <div
        class="audio-visualizer"
        *ngIf="
          (playerMode() === 'audio-only' || playerMode() === 'background') &&
          !isLoading() &&
          !hasError()
        "
      >
        <div class="visualizer-bars">
          <div
            class="bar"
            *ngFor="let bar of visualizerBars"
            [class.active]="isPlaying()"
          ></div>
        </div>
        <div class="audio-info">
          <span class="audio-title">{{
            currentVideoTitle() || "No track"
          }}</span>
          <span class="audio-channel">{{ currentVideoChannel() || "" }}</span>
        </div>
      </div>

      <!-- Custom Controls - hidden in background mode (native player handles controls) -->
      <div
        class="player-controls"
        [class.compact]="playerMode() !== 'full'"
        *ngIf="playerMode() !== 'background'"
      >
        <div class="progress-bar" (click)="seekTo($event)" #progressBar>
          <div class="progress-track">
            <div
              class="progress-buffered"
              [style.width.%]="bufferedPercent()"
            ></div>
            <div
              class="progress-fill"
              [style.width.%]="progressPercent()"
            ></div>
            <div
              class="progress-handle"
              [style.left.%]="progressPercent()"
            ></div>
          </div>
        </div>

        <div class="controls-row">
          <div class="time-display" *ngIf="playerMode() === 'full'">
            <span class="current-time">{{ formatTime(currentTime()) }}</span>
            <span class="separator">/</span>
            <span class="duration">{{ formatTime(duration()) }}</span>
          </div>

          <div class="main-controls">
            <button
              class="btn-icon"
              (click)="seekBackward()"
              title="Rewind 10s"
              *ngIf="playerMode() === 'full'"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 8 14"></polyline>
              </svg>
            </button>

            <button class="btn-icon play-btn" (click)="togglePlay()">
              <svg *ngIf="!isPlaying()" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <svg *ngIf="isPlaying()" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>

            <button
              class="btn-icon"
              (click)="seekForward()"
              title="Forward 10s"
              *ngIf="playerMode() === 'full'"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </button>
          </div>

          <div class="time-compact" *ngIf="playerMode() !== 'full'">
            <span
              >{{ formatTime(currentTime()) }} /
              {{ formatTime(duration()) }}</span
            >
          </div>

          <div class="volume-control" *ngIf="playerMode() === 'full'">
            <button class="btn-icon" (click)="toggleMute()">
              <svg
                *ngIf="volume() > 50 && !isMuted()"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <svg
                *ngIf="volume() > 0 && volume() <= 50 && !isMuted()"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <svg
                *ngIf="volume() === 0 || isMuted()"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            </button>
            <div class="volume-slider">
              <input
                type="range"
                min="0"
                max="100"
                [value]="volume()"
                (input)="onVolumeChange($event)"
              />
              <div class="volume-fill" [style.width.%]="volume()"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .youtube-player-wrapper {
        position: fixed;
        bottom: calc(var(--player-height, 90px) + 16px);
        right: 16px;
        width: 400px;
        background: rgba(18, 18, 26, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        overflow: hidden;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 150;
      }

      .youtube-player-wrapper.visible {
        transform: translateY(0) scale(1);
        opacity: 1;
        visibility: visible;
      }

      .youtube-player-wrapper.expanded {
        width: 640px;
        right: 50%;
        transform: translateX(50%) translateY(0) scale(1);
      }

      /* Mini mode */
      .youtube-player-wrapper.mini {
        width: 320px;
        border-radius: 12px;
      }

      .youtube-player-wrapper.mini .player-container {
        height: 180px;
      }

      /* Audio-only mode */
      .youtube-player-wrapper.audio-only {
        width: 300px;
        border-radius: 12px;
      }

      /* Background mode - minimal widget, native player controls everything */
      .youtube-player-wrapper.background {
        width: 200px;
        border-radius: 12px;
        bottom: calc(var(--player-height, 90px) + 8px);
      }

      .youtube-player-wrapper.background .player-header {
        padding: 6px 10px;
        border-bottom: none;
      }

      .youtube-player-wrapper.background .audio-visualizer {
        padding: 8px 10px;
      }

      .youtube-player-wrapper.background .audio-info {
        display: none;
      }

      .youtube-player-wrapper.background .visualizer-bars {
        height: 24px;
      }

      .player-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.2);
      }

      .player-header.compact {
        padding: 8px 12px;
      }

      .header-info {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        flex: 1;
      }

      .youtube-icon {
        width: 24px;
        height: 24px;
        color: #ff0000;
        flex-shrink: 0;
      }

      .header-title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }

      .header-title.track-title {
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .btn-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .btn-icon:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .btn-icon.active {
        color: var(--primary, #a855f7);
        background: rgba(168, 85, 247, 0.1);
      }

      .btn-icon svg {
        width: 18px;
        height: 18px;
      }

      .mode-btn {
        width: 28px;
        height: 28px;
      }

      .mode-btn svg {
        width: 14px;
        height: 14px;
      }

      .player-container {
        position: relative;
        width: 100%;
        aspect-ratio: 16/9;
        background: #000;
      }

      .player-container.hidden {
        display: none;
      }

      #youtube-player-container {
        width: 100%;
        height: 100%;
      }

      #youtube-player-container iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      /* Audio visualizer */
      .audio-visualizer {
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      .visualizer-bars {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 4px;
        height: 40px;
      }

      .visualizer-bars .bar {
        width: 4px;
        height: 10px;
        background: linear-gradient(to top, var(--primary, #a855f7), #3b82f6);
        border-radius: 2px;
        transition: height 0.1s ease;
      }

      .visualizer-bars .bar:nth-child(1) {
        height: 15px;
        animation-delay: 0s;
      }
      .visualizer-bars .bar:nth-child(2) {
        height: 25px;
        animation-delay: 0.1s;
      }
      .visualizer-bars .bar:nth-child(3) {
        height: 35px;
        animation-delay: 0.2s;
      }
      .visualizer-bars .bar:nth-child(4) {
        height: 20px;
        animation-delay: 0.15s;
      }
      .visualizer-bars .bar:nth-child(5) {
        height: 30px;
        animation-delay: 0.25s;
      }
      .visualizer-bars .bar:nth-child(6) {
        height: 40px;
        animation-delay: 0.05s;
      }
      .visualizer-bars .bar:nth-child(7) {
        height: 25px;
        animation-delay: 0.2s;
      }
      .visualizer-bars .bar:nth-child(8) {
        height: 15px;
        animation-delay: 0.1s;
      }

      .visualizer-bars .bar.active {
        animation: visualize 0.5s ease-in-out infinite alternate;
      }

      @keyframes visualize {
        0% {
          height: 10px;
        }
        100% {
          height: 40px;
        }
      }

      .visualizer-bars .bar:nth-child(odd).active {
        animation-duration: 0.6s;
      }

      .visualizer-bars .bar:nth-child(even).active {
        animation-duration: 0.4s;
      }

      .audio-info {
        text-align: center;
      }

      .audio-title {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 4px;
      }

      .audio-channel {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      .loading-overlay,
      .error-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: rgba(0, 0, 0, 0.8);
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
      }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.2);
        border-top-color: var(--primary, #a855f7);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .error-overlay svg {
        width: 32px;
        height: 32px;
        color: #ef4444;
      }

      .retry-btn {
        padding: 8px 16px;
        border-radius: 8px;
        border: none;
        background: var(--primary, #a855f7);
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .retry-btn:hover {
        opacity: 0.9;
      }

      .player-controls {
        padding: 12px 16px;
      }

      .player-controls.compact {
        padding: 8px 12px;
      }

      .progress-bar {
        height: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-bottom: 8px;
      }

      .progress-track {
        position: relative;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: visible;
      }

      .progress-buffered {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        transition: width 0.2s ease;
      }

      .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(90deg, var(--primary, #a855f7), #3b82f6);
        border-radius: 2px;
        transition: width 0.1s linear;
      }

      .progress-handle {
        position: absolute;
        top: 50%;
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .progress-bar:hover .progress-handle {
        transform: translate(-50%, -50%) scale(1);
      }

      .controls-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .time-display {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        display: flex;
        gap: 4px;
        min-width: 80px;
      }

      .time-compact {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .separator {
        color: rgba(255, 255, 255, 0.4);
      }

      .main-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .play-btn {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, var(--primary, #a855f7), #3b82f6);
        border-radius: 50%;
        color: white;
      }

      .play-btn:hover {
        transform: scale(1.05);
        background: linear-gradient(135deg, #9333ea, #2563eb);
      }

      .play-btn svg {
        width: 20px;
        height: 20px;
      }

      .volume-control {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 100px;
      }

      .volume-slider {
        position: relative;
        flex: 1;
        height: 4px;
      }

      .volume-slider input {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 2;
      }

      .volume-slider::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
      }

      .volume-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 4px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 2px;
        pointer-events: none;
      }

      @media (max-width: 767px) {
        .youtube-player-wrapper {
          width: calc(100% - 32px);
          left: 16px;
          right: 16px;
        }

        .youtube-player-wrapper.expanded {
          width: calc(100% - 32px);
          right: 16px;
          transform: translateY(0) scale(1);
        }

        .youtube-player-wrapper.mini,
        .youtube-player-wrapper.audio-only {
          width: 260px;
          left: auto;
        }

        .volume-slider {
          display: none;
        }
      }
    `,
  ],
})
export class YouTubePlayerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("playerContainer") playerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild("progressBar") progressBar!: ElementRef<HTMLDivElement>;

  @Output() playStateChanged = new EventEmitter<boolean>();
  @Output() trackEnded = new EventEmitter<void>();

  private readonly youtubeService = inject(YouTubePlayerService);

  isVisible = signal(false);
  isExpanded = signal(false);
  isLoading = signal(false);
  hasError = signal(false);
  errorMessage = signal("");
  bufferedPercent = signal(0);
  playerMode = signal<PlayerMode>("background");
  currentVideoTitle = signal<string | null>(null);
  currentVideoChannel = signal<string | null>(null);
  isMuted = signal(false);

  visualizerBars = Array(8).fill(0);

  private lastVideoId: string | null = null;

  // Computed from service
  isPlaying = this.youtubeService.isPlaying;
  isPaused = this.youtubeService.isPaused;
  currentTime = this.youtubeService.currentTime;
  duration = this.youtubeService.duration;
  volume = this.youtubeService.volume;

  progressPercent = () => {
    const dur = this.duration();
    if (dur === 0) return 0;
    return (this.currentTime() / dur) * 100;
  };

  ngOnInit(): void {
    // Subscribe to service events
    this.youtubeService.videoEnded$.subscribe(() => {
      this.trackEnded.emit();
    });

    this.youtubeService.videoError$.subscribe((errorCode) => {
      this.hasError.set(true);
      this.isLoading.set(false);
      this.errorMessage.set(this.getErrorMessage(errorCode));
    });

    this.youtubeService.stateChanged$.subscribe((state) => {
      this.isLoading.set(state.isBuffering && !state.isPlaying);
      if (state.isPlaying || state.isPaused) {
        this.hasError.set(false);
      }
      this.playStateChanged.emit(state.isPlaying);
      this.isMuted.set(state.isMuted);

      // Update video info
      const videoData = this.youtubeService.getVideoData();
      if (videoData) {
        this.currentVideoTitle.set(videoData.title || null);
        this.currentVideoChannel.set(videoData.author || null);
      }
    });

    // Load saved player mode - default to background mode for native player integration
    const savedMode = localStorage.getItem("audiora_yt_player_mode");
    if (
      savedMode &&
      ["full", "mini", "audio-only", "background"].includes(savedMode)
    ) {
      this.playerMode.set(savedMode as PlayerMode);
    } else {
      // Default to background mode so native player controls everything
      this.playerMode.set("background");
    }
  }

  ngAfterViewInit(): void {
    // Initialize the YouTube player after view init
    console.log("YouTubePlayerComponent ngAfterViewInit");
    setTimeout(() => {
      this.youtubeService.initializePlayer("youtube-player-container");
    }, 100);
  }

  ngOnDestroy(): void {
    this.youtubeService.destroy();
  }

  show(): void {
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
    this.youtubeService.pause();
  }

  toggle(): void {
    this.isVisible.update((v) => !v);
  }

  toggleExpand(): void {
    this.isExpanded.update((v) => !v);
  }

  setPlayerMode(mode: PlayerMode): void {
    this.playerMode.set(mode);
    localStorage.setItem("audiora_yt_player_mode", mode);

    // When switching to audio-only, keep playing
    // The video element stays in DOM but hidden
  }

  playVideo(videoId: string): void {
    console.log("YouTubePlayerComponent playVideo called:", videoId);
    this.lastVideoId = videoId;
    this.isLoading.set(true);
    this.hasError.set(false);
    this.currentVideoTitle.set(null);
    this.currentVideoChannel.set(null);
    this.show();

    // Ensure player container is in DOM before playing
    setTimeout(() => {
      // Re-initialize player if needed (container might have been hidden)
      this.youtubeService.initializePlayer("youtube-player-container");
      // Play the video
      setTimeout(() => {
        this.youtubeService.playVideo(videoId);
      }, 100);
    }, 50);
  }

  togglePlay(): void {
    if (this.isPlaying()) {
      this.youtubeService.pause();
    } else {
      this.youtubeService.play();
    }
  }

  seekTo(event: MouseEvent): void {
    const bar = this.progressBar?.nativeElement;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const position = percent * this.duration();
    this.youtubeService.seek(position);
  }

  seekForward(): void {
    const newTime = Math.min(this.currentTime() + 10000, this.duration());
    this.youtubeService.seek(newTime);
  }

  seekBackward(): void {
    const newTime = Math.max(this.currentTime() - 10000, 0);
    this.youtubeService.seek(newTime);
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const volume = parseInt(target.value, 10);
    this.youtubeService.setVolume(volume);
  }

  toggleMute(): void {
    this.youtubeService.toggleMute();
    this.isMuted.update((v) => !v);
  }

  retry(): void {
    if (this.lastVideoId) {
      this.playVideo(this.lastVideoId);
    }
  }

  formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  private getErrorMessage(errorCode: number): string {
    switch (errorCode) {
      case 2:
        return "Invalid video ID";
      case 5:
        return "HTML5 player error";
      case 100:
        return "Video not found";
      case 101:
      case 150:
        return "Video cannot be embedded";
      default:
        return "Playback error occurred";
    }
  }
}

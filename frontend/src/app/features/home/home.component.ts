import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { forkJoin, Subject, takeUntil, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../../core/services/auth.service";
import { PlayerService } from "../../core/services/player.service";
import { ToastService } from "../../core/services/toast.service";
import { DynamicThemeService } from "../../core/services/dynamic-theme.service";
import { Track, Provider } from "../../core/models";

interface FeaturedPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  provider: "spotify" | "youtube";
}

interface RecentTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  provider: "spotify" | "youtube";
  providerId: string;
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <!-- Ambient Background - Synced to Album Colors -->
      <div class="home-ambient-bg">
        <div class="ambient-orb ambient-orb-1"></div>
        <div class="ambient-orb ambient-orb-2"></div>
        <div class="ambient-orb ambient-orb-3"></div>
        <div class="ambient-mesh"></div>
      </div>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="greeting-text">Good {{ greeting }}</span>
            <span class="greeting-emoji">{{ greetingEmoji }}</span>
          </h1>
          <p class="hero-subtitle" *ngIf="userName()">
            Welcome back, <span class="user-highlight">{{ userName() }}</span>
          </p>
          <p class="hero-subtitle" *ngIf="!userName()">
            Your unified music experience awaits
          </p>
        </div>
      </section>

      <!-- Quick Play Section - Recently Played -->
      <section class="quick-play-section" *ngIf="recentTracks().length > 0">
        <div class="section-header">
          <div class="section-title-wrapper">
            <div class="section-icon recent-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2>Recently Played</h2>
          </div>
          <button class="see-all-btn" (click)="navigateTo('/library')">
            <span>See all</span>
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
        <div class="quick-play-grid">
          <div
            class="quick-play-card"
            *ngFor="let track of recentTracks().slice(0, 6); let i = index"
            [style.--delay]="i * 0.05 + 's'"
            (click)="playTrack(track)"
          >
            <div class="quick-play-image">
              <img [src]="track.albumArt" [alt]="track.title" loading="lazy" />
              <div class="play-overlay">
                <button class="play-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
              <span class="provider-badge" [class]="track.provider">
                <svg
                  *ngIf="track.provider === 'spotify'"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                  />
                </svg>
                <svg
                  *ngIf="track.provider === 'youtube'"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
              </span>
            </div>
            <div class="quick-play-info">
              <span class="track-name">{{ track.title }}</span>
              <span class="track-artist">{{ track.artist }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Connect Services Section (shown when not connected) -->
      <section class="connect-section" *ngIf="!hasConnectedServices()">
        <div class="section-header">
          <div class="section-title-wrapper">
            <div class="section-icon connect-icon-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                />
                <path
                  d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                />
              </svg>
            </div>
            <h2>Connect Your Music</h2>
          </div>
        </div>
        <p class="section-description">
          Link your streaming services to unlock the full Audiora experience
        </p>
        <div class="connect-grid">
          <div class="connect-card spotify" (click)="connectSpotify()">
            <div class="connect-card-bg"></div>
            <div class="connect-card-content">
              <div class="connect-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                  />
                </svg>
              </div>
              <h3>Connect Spotify</h3>
              <p>Access millions of songs from your Spotify library</p>
              <button class="btn btn-spotify">
                <span>Connect</span>
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
          </div>

          <div class="connect-card youtube" (click)="connectYouTube()">
            <div class="connect-card-bg"></div>
            <div class="connect-card-content">
              <div class="connect-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
              </div>
              <h3>Connect YouTube</h3>
              <p>Stream videos and music from YouTube</p>
              <button class="btn btn-youtube">
                <span>Connect</span>
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
          </div>
        </div>
      </section>

      <!-- Your Playlists Section - HORIZONTAL CARDS -->
      <section class="playlists-section" *ngIf="playlists().length > 0">
        <div class="section-header">
          <div class="section-title-wrapper">
            <div class="section-icon playlist-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 15V6" />
                <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path d="M12 12H3" />
                <path d="M16 6H3" />
                <path d="M12 18H3" />
              </svg>
            </div>
            <h2>Your Playlists</h2>
          </div>
          <button class="see-all-btn" (click)="navigateTo('/library')">
            <span>See all</span>
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

        <!-- Horizontal Playlist Cards -->
        <div class="playlists-horizontal">
          <div
            class="playlist-card-horizontal"
            *ngFor="let playlist of playlists().slice(0, 4); let i = index"
            [style.--delay]="i * 0.1 + 's'"
            (click)="openPlaylist(playlist)"
          >
            <div class="playlist-artwork">
              <img
                [src]="playlist.imageUrl"
                [alt]="playlist.name"
                loading="lazy"
              />
              <div class="playlist-artwork-overlay">
                <button
                  class="playlist-play-btn"
                  (click)="playPlaylist(playlist); $event.stopPropagation()"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
              <div class="playlist-provider-badge" [class]="playlist.provider">
                <svg
                  *ngIf="playlist.provider === 'spotify'"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                  />
                </svg>
                <svg
                  *ngIf="playlist.provider === 'youtube'"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
              </div>
            </div>
            <div class="playlist-details">
              <h3 class="playlist-name">{{ playlist.name }}</h3>
              <p class="playlist-desc">
                {{ playlist.description || "Playlist" }}
              </p>
              <div class="playlist-stats">
                <span class="playlist-track-count">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                  {{ playlist.trackCount }} tracks
                </span>
                <span class="playlist-provider-name">{{
                  playlist.provider === "spotify" ? "Spotify" : "YouTube"
                }}</span>
              </div>
            </div>
            <div class="playlist-hover-glow" [class]="playlist.provider"></div>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <section
        class="loading-section"
        *ngIf="isLoading() && hasConnectedServices()"
      >
        <div class="loading-grid">
          <div class="skeleton-card" *ngFor="let _ of [1, 2, 3, 4]">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-subtitle"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <section
        class="empty-section"
        *ngIf="
          !isLoading() &&
          hasConnectedServices() &&
          recentTracks().length === 0 &&
          playlists().length === 0
        "
      >
        <div class="empty-card">
          <div class="empty-icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="empty-icon"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <h3>Start Your Journey</h3>
          <p>Search for music to start building your library</p>
          <button class="btn btn-primary" (click)="navigateTo('/search')">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search Music
          </button>
        </div>
      </section>

      <!-- Discover Section -->
      <section class="discover-section">
        <div class="section-header">
          <div class="section-title-wrapper">
            <div class="section-icon discover-icon-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon
                  points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
                />
              </svg>
            </div>
            <h2>Discover</h2>
          </div>
        </div>
        <div class="discover-grid">
          <div
            class="discover-card search-card"
            (click)="navigateTo('/search')"
          >
            <div class="discover-card-bg"></div>
            <div class="discover-icon search-gradient">
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
            <h3>Search</h3>
            <p>Find your favorite songs across all platforms</p>
          </div>

          <div class="discover-card liked-card" (click)="navigateTo('/liked')">
            <div class="discover-card-bg"></div>
            <div class="discover-icon liked-gradient">
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
            </div>
            <h3>Liked Songs</h3>
            <p>All your favorites in one place</p>
          </div>

          <div
            class="discover-card library-card"
            (click)="navigateTo('/library')"
          >
            <div class="discover-card-bg"></div>
            <div class="discover-icon library-gradient">
              <svg
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
            </div>
            <h3>Your Library</h3>
            <p>Browse your playlists and albums</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-container {
        padding: 0 24px 120px;
        position: relative;
        z-index: 1;
      }

      /* ============================================
         Ambient Background - Album Color Synced
         ============================================ */
      .home-ambient-bg {
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        overflow: hidden;
      }

      .ambient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(120px);
        opacity: 0.5;
        transition: background 2s cubic-bezier(0.4, 0, 0.2, 1);
        animation: orb-float 30s ease-in-out infinite;
      }

      .ambient-orb-1 {
        width: 60vw;
        height: 60vw;
        max-width: 700px;
        max-height: 700px;
        background: rgba(var(--dynamic-primary-rgb, 168, 85, 247), 0.25);
        top: -15%;
        left: -10%;
        animation-delay: 0s;
      }

      .ambient-orb-2 {
        width: 50vw;
        height: 50vw;
        max-width: 600px;
        max-height: 600px;
        background: rgba(var(--dynamic-secondary-rgb, 20, 184, 166), 0.2);
        top: 40%;
        right: -15%;
        animation-delay: -10s;
      }

      .ambient-orb-3 {
        width: 45vw;
        height: 45vw;
        max-width: 500px;
        max-height: 500px;
        background: rgba(var(--dynamic-accent-rgb, 236, 72, 153), 0.15);
        bottom: -10%;
        left: 20%;
        animation-delay: -20s;
      }

      .ambient-mesh {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(
            ellipse 80% 50% at 20% 30%,
            rgba(var(--dynamic-primary-rgb, 168, 85, 247), 0.06) 0%,
            transparent 50%
          ),
          radial-gradient(
            ellipse 60% 40% at 80% 70%,
            rgba(var(--dynamic-secondary-rgb, 20, 184, 166), 0.04) 0%,
            transparent 50%
          );
        transition: background 2s ease;
      }

      @keyframes orb-float {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }
        25% {
          transform: translate(20px, -15px) scale(1.02);
        }
        50% {
          transform: translate(-15px, 20px) scale(0.98);
        }
        75% {
          transform: translate(-20px, -10px) scale(1.01);
        }
      }

      /* ============================================
         Hero Section
         ============================================ */
      .hero-section {
        padding: 48px 0 40px;
      }

      .hero-content {
        max-width: 700px;
      }

      .hero-title {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 52px;
        font-weight: 800;
        margin-bottom: 12px;
        line-height: 1.1;
        letter-spacing: -0.02em;
      }

      .greeting-text {
        color: var(--text-primary);
      }

      .greeting-emoji {
        font-size: 44px;
      }

      .hero-subtitle {
        font-size: 18px;
        color: var(--text-secondary);
        font-weight: 400;
      }

      .user-highlight {
        color: var(--dynamic-primary, var(--aurora-purple));
        font-weight: 600;
        transition: color 1.5s ease;
      }

      /* ============================================
         Section Headers
         ============================================ */
      section {
        margin-bottom: 48px;
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }

      .section-title-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .section-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 1.5s ease;
      }

      .section-icon svg {
        width: 20px;
        height: 20px;
      }

      .section-icon.recent-icon {
        background: rgba(var(--dynamic-secondary-rgb, 20, 184, 166), 0.15);
        color: var(--dynamic-secondary, var(--aurora-teal));
      }

      .section-icon.playlist-icon {
        background: rgba(var(--dynamic-accent-rgb, 236, 72, 153), 0.15);
        color: var(--dynamic-accent, var(--aurora-pink));
      }

      .section-icon.connect-icon-title {
        background: rgba(99, 102, 241, 0.15);
        color: #6366f1;
      }

      .section-icon.discover-icon-title {
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
      }

      .section-header h2 {
        font-size: 26px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .section-description {
        color: var(--text-secondary);
        margin-top: -16px;
        margin-bottom: 24px;
        font-size: 15px;
      }

      .see-all-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-secondary);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        padding: 10px 18px;
        border-radius: 24px;
        transition: all 0.3s ease;
      }

      .see-all-btn svg {
        width: 16px;
        height: 16px;
        transition: transform 0.3s ease;
      }

      .see-all-btn:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .see-all-btn:hover svg {
        transform: translateX(4px);
      }

      /* ============================================
         Quick Play Grid (Recently Played)
         ============================================ */
      .quick-play-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
      }

      .quick-play-card {
        position: relative;
        padding: 12px;
        border-radius: 14px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: fadeInUp 0.5s ease backwards;
        animation-delay: var(--delay, 0s);
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .quick-play-card:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.12);
        transform: translateY(-4px);
      }

      .quick-play-image {
        position: relative;
        aspect-ratio: 1;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }

      .quick-play-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      .quick-play-card:hover .quick-play-image img {
        transform: scale(1.06);
      }

      .play-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .quick-play-card:hover .play-overlay {
        opacity: 1;
      }

      .play-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--dynamic-primary, var(--aurora-purple));
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0.8);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 4px 16px
          rgba(var(--dynamic-primary-rgb, 168, 85, 247), 0.4);
      }

      .quick-play-card:hover .play-btn {
        transform: scale(1);
      }

      .play-btn svg {
        width: 18px;
        height: 18px;
        color: white;
        margin-left: 2px;
      }

      .provider-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
      }

      .provider-badge svg {
        width: 12px;
        height: 12px;
      }

      .provider-badge.spotify {
        background: rgba(29, 185, 84, 0.9);
        color: white;
      }

      .provider-badge.youtube {
        background: rgba(255, 0, 0, 0.9);
        color: white;
      }

      .quick-play-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .track-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .track-artist {
        font-size: 13px;
        color: var(--text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* ============================================
         Connect Section
         ============================================ */
      .connect-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }

      .connect-card {
        position: relative;
        border-radius: 20px;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.4s ease;
      }

      .connect-card-bg {
        position: absolute;
        inset: 0;
        opacity: 0.1;
        transition: opacity 0.4s ease;
      }

      .connect-card.spotify .connect-card-bg {
        background: linear-gradient(135deg, #1db954 0%, #1aa34a 100%);
      }

      .connect-card.youtube .connect-card-bg {
        background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
      }

      .connect-card:hover .connect-card-bg {
        opacity: 0.2;
      }

      .connect-card-content {
        position: relative;
        z-index: 1;
        padding: 32px;
        text-align: center;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        backdrop-filter: blur(20px);
        transition: all 0.4s ease;
      }

      .connect-card:hover .connect-card-content {
        border-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-4px);
      }

      .connect-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        transition: transform 0.4s ease;
      }

      .connect-icon svg {
        width: 32px;
        height: 32px;
      }

      .connect-card.spotify .connect-icon {
        background: rgba(29, 185, 84, 0.15);
        color: #1db954;
      }

      .connect-card.youtube .connect-icon {
        background: rgba(255, 0, 0, 0.15);
        color: #ff0000;
      }

      .connect-card:hover .connect-icon {
        transform: scale(1.1);
      }

      .connect-card h3 {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .connect-card p {
        color: var(--text-secondary);
        margin-bottom: 20px;
        line-height: 1.5;
        font-size: 14px;
      }

      .connect-card .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 24px;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      .connect-card .btn svg {
        width: 16px;
        height: 16px;
        transition: transform 0.3s ease;
      }

      .connect-card .btn:hover svg {
        transform: translateX(4px);
      }

      .btn-spotify {
        background: #1db954;
        color: white;
        border: none;
        cursor: pointer;
      }

      .btn-spotify:hover {
        background: #1ed760;
      }

      .btn-youtube {
        background: #ff0000;
        color: white;
        border: none;
        cursor: pointer;
      }

      .btn-youtube:hover {
        background: #cc0000;
      }

      /* ============================================
         HORIZONTAL PLAYLIST CARDS - NEW DESIGN
         ============================================ */
      .playlists-horizontal {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .playlist-card-horizontal {
        position: relative;
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 16px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        animation: fadeInUp 0.5s ease backwards;
        animation-delay: var(--delay, 0s);
        overflow: hidden;
      }

      .playlist-card-horizontal:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.12);
        transform: translateX(8px);
      }

      .playlist-artwork {
        position: relative;
        width: 100px;
        height: 100px;
        min-width: 100px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      }

      .playlist-artwork img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .playlist-card-horizontal:hover .playlist-artwork img {
        transform: scale(1.1);
      }

      .playlist-artwork-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .playlist-card-horizontal:hover .playlist-artwork-overlay {
        opacity: 1;
      }

      .playlist-play-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--dynamic-primary, var(--aurora-purple));
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0.8);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 4px 16px
          rgba(var(--dynamic-primary-rgb, 168, 85, 247), 0.5);
      }

      .playlist-card-horizontal:hover .playlist-play-btn {
        transform: scale(1);
      }

      .playlist-play-btn:hover {
        transform: scale(1.1) !important;
      }

      .playlist-play-btn svg {
        width: 20px;
        height: 20px;
        color: white;
        margin-left: 2px;
      }

      .playlist-provider-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        background: rgba(0, 0, 0, 0.5);
      }

      .playlist-provider-badge svg {
        width: 14px;
        height: 14px;
        color: white;
      }

      .playlist-details {
        flex: 1;
        min-width: 0;
        padding-right: 16px;
      }

      .playlist-name {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .playlist-desc {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .playlist-stats {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .playlist-track-count {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--text-tertiary);
      }

      .playlist-track-count svg {
        width: 14px;
        height: 14px;
        opacity: 0.7;
      }

      .playlist-provider-name {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-tertiary);
        opacity: 0.8;
      }

      .playlist-hover-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 150px;
        height: 100%;
        opacity: 0;
        filter: blur(40px);
        transition: opacity 0.5s ease;
        pointer-events: none;
        z-index: -1;
      }

      .playlist-hover-glow.spotify {
        background: radial-gradient(
          circle at left,
          rgba(29, 185, 84, 0.3) 0%,
          transparent 70%
        );
      }

      .playlist-hover-glow.youtube {
        background: radial-gradient(
          circle at left,
          rgba(255, 0, 0, 0.3) 0%,
          transparent 70%
        );
      }

      .playlist-card-horizontal:hover .playlist-hover-glow {
        opacity: 1;
      }

      /* ============================================
         Loading State
         ============================================ */
      .loading-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .skeleton-card {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 16px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.02);
      }

      .skeleton {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.03) 25%,
          rgba(255, 255, 255, 0.06) 50%,
          rgba(255, 255, 255, 0.03) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
      }

      .skeleton-image {
        width: 100px;
        height: 100px;
        min-width: 100px;
        border-radius: 12px;
      }

      .skeleton-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .skeleton-title {
        height: 20px;
        width: 60%;
      }

      .skeleton-subtitle {
        height: 16px;
        width: 40%;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* ============================================
         Empty State
         ============================================ */
      .empty-section {
        display: flex;
        justify-content: center;
        padding: 48px 0;
      }

      .empty-card {
        text-align: center;
        padding: 48px 40px;
        max-width: 400px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .empty-icon-wrapper {
        width: 72px;
        height: 72px;
        border-radius: 20px;
        background: rgba(var(--dynamic-primary-rgb, 168, 85, 247), 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
      }

      .empty-icon {
        width: 36px;
        height: 36px;
        color: var(--dynamic-primary, var(--aurora-purple));
      }

      .empty-card h3 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 10px;
        color: var(--text-primary);
      }

      .empty-card p {
        color: var(--text-secondary);
        margin-bottom: 24px;
        font-size: 15px;
      }

      .empty-card .btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 14px 28px;
        border-radius: 28px;
        font-weight: 600;
        font-size: 15px;
      }

      .empty-card .btn svg {
        width: 20px;
        height: 20px;
      }

      .btn-primary {
        background: var(--dynamic-primary, var(--aurora-purple));
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-primary:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }

      /* ============================================
         Discover Section
         ============================================ */
      .discover-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .discover-card {
        position: relative;
        padding: 24px;
        border-radius: 16px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        overflow: hidden;
        transition: all 0.4s ease;
      }

      .discover-card-bg {
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      .search-card .discover-card-bg {
        background: linear-gradient(
          135deg,
          rgba(139, 92, 246, 0.12) 0%,
          rgba(168, 85, 247, 0.08) 100%
        );
      }

      .liked-card .discover-card-bg {
        background: linear-gradient(
          135deg,
          rgba(236, 72, 153, 0.12) 0%,
          rgba(244, 63, 94, 0.08) 100%
        );
      }

      .library-card .discover-card-bg {
        background: linear-gradient(
          135deg,
          rgba(6, 182, 212, 0.12) 0%,
          rgba(8, 145, 178, 0.08) 100%
        );
      }

      .discover-card:hover .discover-card-bg {
        opacity: 1;
      }

      .discover-card:hover {
        transform: translateY(-4px);
        border-color: rgba(255, 255, 255, 0.12);
      }

      .discover-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        transition: transform 0.4s ease;
      }

      .discover-icon svg {
        width: 24px;
        height: 24px;
        color: white;
      }

      .discover-card:hover .discover-icon {
        transform: scale(1.1);
      }

      .search-gradient {
        background: linear-gradient(135deg, #8b5cf6, #a855f7);
      }

      .liked-gradient {
        background: linear-gradient(135deg, #ec4899, #f43f5e);
      }

      .library-gradient {
        background: linear-gradient(135deg, #06b6d4, #0891b2);
      }

      .discover-card h3 {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 6px;
        color: var(--text-primary);
        position: relative;
        z-index: 1;
      }

      .discover-card p {
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.4;
        position: relative;
        z-index: 1;
      }

      /* ============================================
         Responsive
         ============================================ */
      @media (max-width: 767px) {
        .home-container {
          padding: 0 16px 120px;
        }

        .hero-title {
          font-size: 36px;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .greeting-emoji {
          font-size: 32px;
        }

        .hero-subtitle {
          font-size: 16px;
        }

        .section-header {
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-header h2 {
          font-size: 22px;
        }

        .quick-play-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .connect-grid {
          grid-template-columns: 1fr;
        }

        .playlist-card-horizontal {
          flex-direction: column;
          align-items: flex-start;
          padding: 16px;
        }

        .playlist-artwork {
          width: 100%;
          height: auto;
          aspect-ratio: 16/9;
        }

        .playlist-details {
          padding-right: 0;
        }

        .discover-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .ambient-orb,
        .quick-play-card,
        .playlist-card-horizontal {
          animation: none;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly playerService = inject(PlayerService);
  private readonly toastService = inject(ToastService);
  private readonly dynamicThemeService = inject(DynamicThemeService);
  private readonly destroy$ = new Subject<void>();
  private readonly apiUrl = "http://localhost:8080/api";

  greeting = "";
  greetingEmoji = "";
  userName = signal<string>("");
  isLoading = signal(true);
  hasConnectedServices = signal(false);
  spotifyConnected = signal(false);
  youtubeConnected = signal(false);

  recentTracks = signal<RecentTrack[]>([]);
  playlists = signal<FeaturedPlaylist[]>([]);

  ngOnInit(): void {
    this.setGreeting();
    this.loadUserData();
    this.checkConnectedServices();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = "Morning";
      this.greetingEmoji = "☀️";
    } else if (hour < 18) {
      this.greeting = "Afternoon";
      this.greetingEmoji = "🌤️";
    } else {
      this.greeting = "Evening";
      this.greetingEmoji = "🌙";
    }
  }

  private loadUserData(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userName.set(user.displayName || user.username || "");
    }
  }

  private checkConnectedServices(): void {
    const spotifySession = this.authService.getProviderSession("spotify");
    const youtubeSession = this.authService.getProviderSession("youtube");

    this.spotifyConnected.set(!!spotifySession);
    this.youtubeConnected.set(!!youtubeSession);
    this.hasConnectedServices.set(!!spotifySession || !!youtubeSession);
  }

  private loadData(): void {
    if (!this.hasConnectedServices()) {
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    const requests: any[] = [];

    if (this.spotifyConnected()) {
      const spotifySession = this.authService.getProviderSession("spotify");
      if (spotifySession) {
        const headers = new HttpHeaders().set("X-Session-Id", spotifySession);
        requests.push(
          this.http
            .get<{
              items: any[];
            }>(`${this.apiUrl}/spotify/playlists`, { headers })
            .pipe(
              catchError((err) => {
                console.error("Failed to load Spotify playlists:", err);
                return of({ items: [] });
              }),
            ),
        );
      }
    }

    if (this.youtubeConnected()) {
      const youtubeSession = this.authService.getProviderSession("youtube");
      if (youtubeSession) {
        const headers = new HttpHeaders().set("X-Session-Id", youtubeSession);
        requests.push(
          this.http
            .get<{
              items: any[];
            }>(`${this.apiUrl}/youtube/playlists`, { headers })
            .pipe(
              catchError((err) => {
                console.error("Failed to load YouTube playlists:", err);
                return of({ items: [] });
              }),
            ),
        );
      }
    }

    if (requests.length === 0) {
      this.isLoading.set(false);
      this.loadRecentlyPlayed();
      return;
    }

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results: any[]) => {
          const allPlaylists: FeaturedPlaylist[] = [];

          results.forEach((result) => {
            if (result.items) {
              result.items.forEach((item: any) => {
                const isSpotify =
                  item.images !== undefined || item.tracks !== undefined;

                if (isSpotify) {
                  allPlaylists.push({
                    id: item.id,
                    name: item.name,
                    description: item.description || "",
                    imageUrl:
                      item.images?.[0]?.url ||
                      "https://via.placeholder.com/300?text=Playlist",
                    trackCount: item.tracks?.total || 0,
                    provider: "spotify",
                  });
                } else {
                  allPlaylists.push({
                    id: item.id,
                    name: item.snippet?.title || item.name || "Playlist",
                    description: item.snippet?.description || "",
                    imageUrl:
                      item.snippet?.thumbnails?.medium?.url ||
                      item.thumbnail ||
                      "https://via.placeholder.com/300?text=Playlist",
                    trackCount: item.contentDetails?.itemCount || 0,
                    provider: "youtube",
                  });
                }
              });
            }
          });

          this.playlists.set(allPlaylists);
          this.isLoading.set(false);
          this.loadRecentlyPlayed();
        },
        error: (err) => {
          console.error("Error loading data:", err);
          this.isLoading.set(false);
          this.loadRecentlyPlayed();
        },
      });
  }

  private loadRecentlyPlayed(): void {
    try {
      const saved = localStorage.getItem("audiora_recently_played");
      if (saved) {
        const tracks = JSON.parse(saved);
        this.recentTracks.set(tracks.slice(0, 12));
      }
    } catch (err) {
      console.error("Failed to load recently played:", err);
    }
  }

  playTrack(track: RecentTrack): void {
    const t: Track = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      albumArt: track.albumArt,
      duration: 0,
      provider: track.provider as Provider,
      providerId: track.providerId,
      isPlayable: true,
    };

    this.playerService.play(t);
    this.toastService.success(
      "Now Playing",
      `${track.title} by ${track.artist}`,
    );
  }

  connectSpotify(): void {
    this.authService.connectProvider("spotify");
  }

  connectYouTube(): void {
    this.authService.connectProvider("youtube");
  }

  openPlaylist(playlist: FeaturedPlaylist): void {
    this.router.navigate(["/library"], {
      queryParams: {
        playlist: playlist.id,
        provider: playlist.provider,
      },
    });
  }

  playPlaylist(playlist: FeaturedPlaylist): void {
    this.toastService.info("Loading...", `Playing ${playlist.name}`);
    this.openPlaylist(playlist);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}

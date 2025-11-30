import { Component, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ThemeService, ThemeMode } from "../../core/services/theme.service";
import { AuthService } from "../../core/services/auth.service";
import { SleepTimerService } from "../../core/services/sleep-timer.service";
import { inject } from "@angular/core";
import { KeyboardShortcutsService } from "../../core/services/keyboard-shortcuts.service";

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
}

interface ThemePreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
}

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <!-- Header -->
      <header class="settings-header">
        <h1>Settings</h1>
        <p>Customize your Audiora experience</p>
      </header>

      <!-- Settings Navigation -->
      <div class="settings-layout">
        <nav class="settings-nav">
          <button
            *ngFor="let section of sections"
            class="nav-item"
            [class.active]="activeSection() === section.id"
            (click)="setActiveSection(section.id)"
          >
            <span class="nav-icon" [innerHTML]="section.icon"></span>
            <span>{{ section.title }}</span>
          </button>
        </nav>

        <!-- Settings Content -->
        <div class="settings-content">
          <!-- Account Section -->
          <section
            class="settings-section"
            *ngIf="activeSection() === 'account'"
          >
            <h2>Account</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>Email</label>
                  <p class="setting-value">{{ userEmail }}</p>
                </div>
                <button class="btn btn-secondary btn-sm">Change</button>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Password</label>
                  <p class="setting-description">Last changed 30 days ago</p>
                </div>
                <button class="btn btn-secondary btn-sm">Update</button>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Two-Factor Authentication</label>
                  <p class="setting-description">
                    Add an extra layer of security
                  </p>
                </div>
                <button class="btn btn-secondary btn-sm">Enable</button>
              </div>
            </div>

            <div class="danger-zone">
              <h3>Danger Zone</h3>
              <div class="setting-item danger">
                <div class="setting-info">
                  <label>Delete Account</label>
                  <p class="setting-description">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button class="btn btn-danger btn-sm">Delete Account</button>
              </div>
            </div>
          </section>

          <!-- Appearance Section -->
          <section
            class="settings-section"
            *ngIf="activeSection() === 'appearance'"
          >
            <h2>Appearance</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>Theme</label>
                  <p class="setting-description">
                    Choose your preferred color scheme
                  </p>
                </div>
                <div class="theme-options">
                  <button
                    class="theme-option"
                    [class.active]="themeMode() === 'dark'"
                    (click)="setTheme('dark')"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                      />
                    </svg>
                    <span>Dark</span>
                  </button>
                  <button
                    class="theme-option"
                    [class.active]="themeMode() === 'light'"
                    (click)="setTheme('light')"
                  >
                    <svg
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
                    <span>Light</span>
                  </button>
                  <button
                    class="theme-option"
                    [class.active]="themeMode() === 'system'"
                    (click)="setTheme('system')"
                  >
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
                    <span>System</span>
                  </button>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Dynamic Theme</label>
                  <p class="setting-description">
                    Adapt colors based on album artwork
                  </p>
                </div>
                <label class="toggle">
                  <input
                    type="checkbox"
                    [checked]="dynamicThemeEnabled()"
                    (change)="toggleDynamicTheme($event)"
                  />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item" *ngIf="!dynamicThemeEnabled()">
                <div class="setting-info">
                  <label>Theme Preset</label>
                  <p class="setting-description">
                    Choose a color scheme when dynamic theme is off
                  </p>
                </div>
              </div>
              <div class="theme-preset-grid" *ngIf="!dynamicThemeEnabled()">
                <button
                  *ngFor="let preset of themePresets"
                  class="theme-preset-card"
                  [class.active]="activePreset === preset.id"
                  [ngClass]="preset.id"
                  (click)="selectThemePreset(preset)"
                >
                  <span class="theme-preset-name">{{ preset.name }}</span>
                  <span
                    class="theme-preset-check"
                    *ngIf="activePreset === preset.id"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <div class="setting-group">
              <h3>Keyboard Shortcuts</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <label>Enable Keyboard Shortcuts</label>
                  <p class="setting-description">
                    Use keyboard to control playback (Space, arrows, etc.)
                  </p>
                </div>
                <label class="toggle">
                  <input
                    type="checkbox"
                    [checked]="keyboardShortcutsEnabled"
                    (change)="toggleKeyboardShortcuts($event)"
                  />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <label>View All Shortcuts</label>
                  <p class="setting-description">
                    Press ? anytime to see all available shortcuts
                  </p>
                </div>
                <button
                  class="btn btn-secondary btn-sm"
                  (click)="showShortcutsHelp()"
                >
                  View Shortcuts
                </button>
              </div>
            </div>
          </section>

          <!-- Playback Section -->
          <section
            class="settings-section"
            *ngIf="activeSection() === 'playback'"
          >
            <h2>Playback</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>Autoplay</label>
                  <p class="setting-description">
                    Automatically play similar songs when queue ends
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="autoplay" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Crossfade</label>
                  <p class="setting-description">
                    Smoothly transition between songs
                  </p>
                </div>
                <div class="slider-control">
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="1"
                    [(ngModel)]="crossfadeDuration"
                    (change)="saveCrossfadeSetting()"
                  />
                  <span class="slider-value">{{ crossfadeDuration }}s</span>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Sleep Timer Fade Out</label>
                  <p class="setting-description">
                    Gradually lower volume before timer ends
                  </p>
                </div>
                <label class="toggle">
                  <input
                    type="checkbox"
                    [checked]="sleepTimerFadeOut"
                    (change)="toggleSleepTimerFadeOut($event)"
                  />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Normalize Volume</label>
                  <p class="setting-description">
                    Set consistent volume for all tracks
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="normalizeVolume" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Audio Quality</label>
                  <p class="setting-description">
                    Higher quality uses more data
                  </p>
                </div>
                <select class="select-field" [(ngModel)]="audioQuality">
                  <option value="low">Low (96 kbps)</option>
                  <option value="normal">Normal (160 kbps)</option>
                  <option value="high">High (320 kbps)</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Connected Services Section -->
          <section
            class="settings-section"
            *ngIf="activeSection() === 'services'"
          >
            <h2>Connected Services</h2>

            <div class="setting-group">
              <div class="service-item">
                <div class="service-icon spotify">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                    />
                  </svg>
                </div>
                <div class="service-info">
                  <label>Spotify</label>
                  <p class="setting-description" *ngIf="spotifyConnected">
                    Connected as spotify_user
                  </p>
                  <p class="setting-description" *ngIf="!spotifyConnected">
                    Not connected
                  </p>
                </div>
                <button
                  class="btn btn-sm"
                  [class.btn-secondary]="spotifyConnected"
                  [class.btn-spotify]="!spotifyConnected"
                  (click)="toggleSpotifyConnection()"
                >
                  {{ spotifyConnected ? "Disconnect" : "Connect" }}
                </button>
              </div>

              <div class="service-item">
                <div class="service-icon youtube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                </div>
                <div class="service-info">
                  <label>YouTube</label>
                  <p class="setting-description" *ngIf="youtubeConnected">
                    Connected as youtube_user
                  </p>
                  <p class="setting-description" *ngIf="!youtubeConnected">
                    Not connected
                  </p>
                </div>
                <button
                  class="btn btn-sm"
                  [class.btn-secondary]="youtubeConnected"
                  [class.btn-youtube]="!youtubeConnected"
                  (click)="toggleYoutubeConnection()"
                >
                  {{ youtubeConnected ? "Disconnect" : "Connect" }}
                </button>
              </div>
            </div>
          </section>

          <!-- Notifications Section -->
          <section
            class="settings-section"
            *ngIf="activeSection() === 'notifications'"
          >
            <h2>Notifications</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>New Releases</label>
                  <p class="setting-description">
                    Get notified about new releases from artists you follow
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="notifyNewReleases" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Playlist Updates</label>
                  <p class="setting-description">
                    Get notified when playlists you follow are updated
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="notifyPlaylistUpdates" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Email Digest</label>
                  <p class="setting-description">
                    Receive weekly email with your listening activity
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="emailDigest" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>
            </div>
          </section>

          <!-- Privacy Section -->
          <section
            class="settings-section"
            *ngIf="activeSection() === 'privacy'"
          >
            <h2>Privacy</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>Private Session</label>
                  <p class="setting-description">
                    Your listening activity won't be shown publicly
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="privateSession" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Show Listening Activity</label>
                  <p class="setting-description">
                    Let others see what you're listening to
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="showListeningActivity" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Data Collection</label>
                  <p class="setting-description">
                    Help improve Audiora by sharing usage data
                  </p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="dataCollection" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>
            </div>

            <div class="setting-group">
              <h3>Your Data</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <label>Download Your Data</label>
                  <p class="setting-description">
                    Get a copy of all your Audiora data
                  </p>
                </div>
                <button class="btn btn-secondary btn-sm">
                  Request Download
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-container {
        padding-bottom: var(--space-12);
        max-width: 1000px;
        margin: 0 auto;
      }

      /* Header */
      .settings-header {
        margin-bottom: var(--space-8);
      }

      .settings-header h1 {
        font-size: var(--text-3xl);
        font-weight: 700;
        margin-bottom: var(--space-2);
      }

      .settings-header p {
        color: var(--text-tertiary);
      }

      /* Layout */
      .settings-layout {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: var(--space-8);
      }

      @media (max-width: 768px) {
        .settings-layout {
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
      }

      /* Navigation */
      .settings-nav {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }

      @media (max-width: 768px) {
        .settings-nav {
          flex-direction: row;
          overflow-x: auto;
          padding-bottom: var(--space-2);
        }
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-lg);
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-size: var(--text-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-base);
        text-align: left;
        white-space: nowrap;
      }

      .nav-item:hover {
        background: var(--surface-glass);
        color: var(--text-primary);
      }

      .nav-item.active {
        background: var(--surface-glass-hover);
        color: var(--text-primary);
      }

      .nav-icon {
        display: flex;
        width: 20px;
        height: 20px;
      }

      .nav-icon svg {
        width: 100%;
        height: 100%;
      }

      /* Content */
      .settings-content {
        min-width: 0;
      }

      .settings-section h2 {
        font-size: var(--text-xl);
        font-weight: 600;
        margin-bottom: var(--space-6);
        padding-bottom: var(--space-4);
        border-bottom: 1px solid var(--surface-border);
      }

      .setting-group {
        margin-bottom: var(--space-8);
      }

      .setting-group h3 {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: var(--space-4);
      }

      /* Setting Item */
      .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-4) 0;
        border-bottom: 1px solid var(--surface-border);
        gap: var(--space-4);
      }

      .setting-item:last-child {
        border-bottom: none;
      }

      .setting-info {
        flex: 1;
        min-width: 0;
      }

      .setting-info label {
        display: block;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: var(--space-1);
      }

      .setting-description {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .setting-value {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      /* Service Items */
      .service-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4);
        background: var(--surface-glass);
        border-radius: var(--radius-lg);
        margin-bottom: var(--space-3);
      }

      .service-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .service-icon svg {
        width: 24px;
        height: 24px;
      }

      .service-icon.spotify {
        background: rgba(29, 185, 84, 0.15);
        color: var(--spotify-green);
      }

      .service-icon.youtube {
        background: rgba(255, 0, 0, 0.15);
        color: var(--youtube-red);
      }

      .service-info {
        flex: 1;
      }

      /* Theme Options */
      .theme-options {
        display: flex;
        gap: var(--space-2);
      }

      .theme-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-4);
        background: var(--surface-glass);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        color: var(--text-secondary);
        font-size: var(--text-xs);
        cursor: pointer;
        transition: all var(--transition-base);
        min-width: 80px;
      }

      .theme-option:hover {
        background: var(--surface-glass-hover);
        color: var(--text-primary);
      }

      .theme-option.active {
        border-color: var(--aurora-purple);
        color: var(--aurora-purple);
      }

      .theme-option svg {
        width: 24px;
        height: 24px;
      }

      /* Toggle */
      .toggle {
        position: relative;
        display: inline-flex;
        align-items: center;
        width: 44px;
        height: 24px;
        cursor: pointer;
        flex-shrink: 0;
      }

      .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-track {
        position: absolute;
        inset: 0;
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-full);
        transition: background var(--transition-base);
      }

      .toggle input:checked + .toggle-track {
        background: var(--aurora-purple);
      }

      .toggle-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        transition: transform var(--transition-base);
      }

      .toggle input:checked ~ .toggle-thumb {
        transform: translateX(20px);
      }

      /* Slider */
      .slider-control {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .slider-control input[type="range"] {
        width: 120px;
        height: 4px;
        background: var(--surface-glass-hover);
        border-radius: var(--radius-full);
        appearance: none;
        cursor: pointer;
      }

      .slider-control input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        background: var(--aurora-purple);
        border-radius: 50%;
        cursor: pointer;
      }

      .slider-value {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        min-width: 30px;
      }

      /* Select */
      .select-field {
        padding: var(--space-2) var(--space-3);
        background: var(--surface-glass);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: var(--text-sm);
        cursor: pointer;
      }

      .select-field:focus {
        outline: none;
        border-color: var(--aurora-purple);
      }

      /* Buttons */
      .btn {
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .btn-sm {
        padding: var(--space-2) var(--space-3);
      }

      .btn-secondary {
        background: var(--surface-glass);
        border: 1px solid var(--surface-border);
        color: var(--text-secondary);
      }

      .btn-secondary:hover {
        background: var(--surface-glass-hover);
        color: var(--text-primary);
      }

      .btn-spotify {
        background: var(--spotify-green);
        border: none;
        color: white;
      }

      .btn-spotify:hover {
        background: var(--spotify-green-dark);
      }

      .btn-youtube {
        background: var(--youtube-red);
        border: none;
        color: white;
      }

      .btn-youtube:hover {
        background: var(--youtube-red-dark);
      }

      .btn-danger {
        background: transparent;
        border: 1px solid var(--color-error);
        color: var(--color-error);
      }

      .btn-danger:hover {
        background: var(--color-error);
        color: white;
      }

      /* Danger Zone */
      .danger-zone {
        margin-top: var(--space-8);
        padding-top: var(--space-6);
        border-top: 1px solid rgba(239, 68, 68, 0.3);
      }

      .danger-zone h3 {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--color-error);
        margin-bottom: var(--space-4);
      }

      .setting-item.danger {
        border-color: rgba(239, 68, 68, 0.2);
      }
    `,
  ],
})
export class SettingsComponent implements OnInit {
  private themeService = new ThemeService();
  private authService: AuthService | null = null;

  // Navigation
  activeSection = signal("account");

  sections: SettingsSection[] = [
    {
      id: "account",
      title: "Account",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M1 12h2m18 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>',
    },
    {
      id: "playback",
      title: "Playback",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    },
    {
      id: "services",
      title: "Connected Services",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    },
    {
      id: "privacy",
      title: "Privacy",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    },
  ];

  // User info
  userEmail = "user@example.com";

  // Theme
  themeMode = signal<ThemeMode>("dark");
  dynamicThemeEnabled = signal(false);

  // Playback
  autoplay = true;
  crossfadeDuration = 0;
  normalizeVolume = false;
  audioQuality = "high";

  // Sleep timer
  sleepTimerFadeOut = true;

  // Keyboard shortcuts
  keyboardShortcutsEnabled = true;

  // Theme presets
  activePreset = "aurora";
  themePresets: ThemePreset[] = [
    {
      id: "aurora",
      name: "Aurora",
      colors: {
        primary: "#a855f7",
        secondary: "#14b8a6",
        accent: "#ec4899",
        muted: "#3b82f6",
      },
    },
    {
      id: "midnight",
      name: "Midnight",
      colors: {
        primary: "#1a1a2e",
        secondary: "#16213e",
        accent: "#0f3460",
        muted: "#e94560",
      },
    },
    {
      id: "sunset",
      name: "Sunset",
      colors: {
        primary: "#ff6b6b",
        secondary: "#feca57",
        accent: "#ff9ff3",
        muted: "#54a0ff",
      },
    },
    {
      id: "ocean",
      name: "Ocean",
      colors: {
        primary: "#0077b6",
        secondary: "#00b4d8",
        accent: "#90e0ef",
        muted: "#03045e",
      },
    },
    {
      id: "forest",
      name: "Forest",
      colors: {
        primary: "#2d6a4f",
        secondary: "#40916c",
        accent: "#95d5b2",
        muted: "#1b4332",
      },
    },
    {
      id: "rose",
      name: "Rose",
      colors: {
        primary: "#be185d",
        secondary: "#ec4899",
        accent: "#f9a8d4",
        muted: "#831843",
      },
    },
    {
      id: "monochrome",
      name: "Mono",
      colors: {
        primary: "#4a4a4a",
        secondary: "#7a7a7a",
        accent: "#a0a0a0",
        muted: "#2a2a2a",
      },
    },
    {
      id: "neon",
      name: "Neon",
      colors: {
        primary: "#f72585",
        secondary: "#7209b7",
        accent: "#4cc9f0",
        muted: "#3a0ca3",
      },
    },
  ];

  // Services
  spotifyConnected = false;
  youtubeConnected = false;

  // Inject services
  private keyboardShortcutsService = inject(KeyboardShortcutsService);
  private sleepTimerService = inject(SleepTimerService);

  // Notifications
  notifyNewReleases = true;
  notifyPlaylistUpdates = true;
  emailDigest = false;

  // Privacy
  privateSession = false;
  showListeningActivity = true;
  dataCollection = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.themeMode.set(this.themeService.themeMode());
    this.dynamicThemeEnabled.set(this.themeService.dynamicTheme().isActive);

    // Load keyboard shortcuts preference
    this.keyboardShortcutsEnabled = this.keyboardShortcutsService.isEnabled();

    // Load sleep timer fade out preference
    this.sleepTimerFadeOut = this.sleepTimerService.fadeOutEnabled();

    // Load active theme preset
    const savedPreset = localStorage.getItem("audiora_theme_preset");
    if (savedPreset) {
      this.activePreset = savedPreset;
    }

    // Load crossfade setting
    const savedCrossfade = localStorage.getItem("audiora_crossfade");
    if (savedCrossfade) {
      this.crossfadeDuration = parseInt(savedCrossfade, 10);
    }
  }

  setActiveSection(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  setTheme(mode: ThemeMode): void {
    this.themeMode.set(mode);
    this.themeService.setThemeMode(mode);
  }

  toggleDynamicTheme(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.dynamicThemeEnabled.set(checked);
    this.themeService.setDynamicThemeEnabled(checked);
  }

  selectThemePreset(preset: ThemePreset): void {
    this.activePreset = preset.id;
    localStorage.setItem("audiora_theme_preset", preset.id);

    // Apply the preset colors to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty("--dynamic-primary", preset.colors.primary);
    root.style.setProperty("--dynamic-secondary", preset.colors.secondary);
    root.style.setProperty("--dynamic-accent", preset.colors.accent);
    root.style.setProperty("--dynamic-muted", preset.colors.muted);

    // Also set RGB versions for transparency
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "168, 85, 247";
    };
    root.style.setProperty(
      "--dynamic-primary-rgb",
      hexToRgb(preset.colors.primary),
    );
    root.style.setProperty(
      "--dynamic-secondary-rgb",
      hexToRgb(preset.colors.secondary),
    );
    root.style.setProperty(
      "--dynamic-accent-rgb",
      hexToRgb(preset.colors.accent),
    );
  }

  toggleKeyboardShortcuts(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.keyboardShortcutsEnabled = checked;
    this.keyboardShortcutsService.setEnabled(checked);
    localStorage.setItem("audiora_keyboard_shortcuts", String(checked));
  }

  showShortcutsHelp(): void {
    // Emit the show shortcuts event
    this.keyboardShortcutsService.showShortcuts$.next();
  }

  toggleSleepTimerFadeOut(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.sleepTimerFadeOut = checked;
    this.sleepTimerService.setFadeOutEnabled(checked);
  }

  saveCrossfadeSetting(): void {
    localStorage.setItem("audiora_crossfade", String(this.crossfadeDuration));
  }

  toggleSpotifyConnection(): void {
    if (this.spotifyConnected) {
      // Disconnect
      this.spotifyConnected = false;
    } else {
      // Connect via OAuth
      console.log("Connecting Spotify...");
    }
  }

  toggleYoutubeConnection(): void {
    if (this.youtubeConnected) {
      // Disconnect
      this.youtubeConnected = false;
    } else {
      // Connect via OAuth
      console.log("Connecting YouTube...");
    }
  }
}

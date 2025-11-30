import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { User } from "../../core/models";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-gradient"></div>
        <div class="header-content">
          <div class="avatar-section">
            <div class="avatar" (click)="triggerAvatarUpload()">
              <img
                *ngIf="user()?.avatarUrl"
                [src]="user()?.avatarUrl"
                [alt]="user()?.displayName"
              />
              <div class="avatar-placeholder" *ngIf="!user()?.avatarUrl">
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
              <div class="avatar-overlay">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <input
                type="file"
                #avatarInput
                accept="image/*"
                (change)="onAvatarChange($event)"
                style="display: none"
              />
            </div>
            <div class="user-info">
              <span class="profile-label">Profile</span>
              <h1 class="display-name">{{ user()?.displayName || "User" }}</h1>
              <p class="username">{{ "@" }}{{ user()?.username }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="profile-content">
        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-card glass-card">
            <span class="stat-value">{{ likedCount() }}</span>
            <span class="stat-label">Liked Songs</span>
          </div>
          <div class="stat-card glass-card">
            <span class="stat-value">{{ playlistCount() }}</span>
            <span class="stat-label">Playlists</span>
          </div>
          <div class="stat-card glass-card">
            <span class="stat-value">{{ connectedServices() }}</span>
            <span class="stat-label">Connected Services</span>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <section class="profile-section">
          <h2>Edit Profile</h2>
          <div class="form-card glass-card">
            <form (ngSubmit)="saveProfile()" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="displayName" class="label">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    class="input-field"
                    [(ngModel)]="displayName"
                    name="displayName"
                    placeholder="Your display name"
                  />
                </div>
                <div class="form-group">
                  <label for="username" class="label">Username</label>
                  <input
                    type="text"
                    id="username"
                    class="input-field"
                    [(ngModel)]="username"
                    name="username"
                    placeholder="Your username"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="bio" class="label">Bio</label>
                <textarea
                  id="bio"
                  class="input-field textarea"
                  [(ngModel)]="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="email" class="label">Email</label>
                <input
                  type="email"
                  id="email"
                  class="input-field"
                  [value]="user()?.email"
                  disabled
                />
                <span class="helper-text">Email cannot be changed</span>
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  class="btn btn-secondary"
                  (click)="resetForm()"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="isSaving()"
                >
                  <span *ngIf="!isSaving()">Save Changes</span>
                  <span *ngIf="isSaving()" class="loading-spinner">
                    <svg
                      class="animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke-linecap="round"
                      />
                    </svg>
                    Saving...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </section>

        <!-- Connected Services -->
        <section class="profile-section">
          <h2>Connected Services</h2>
          <div class="services-grid">
            <div class="service-card glass-card">
              <div class="service-icon spotify">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                  />
                </svg>
              </div>
              <div class="service-info">
                <h3>Spotify</h3>
                <p *ngIf="spotifyConnected()">Connected</p>
                <p *ngIf="!spotifyConnected()" class="not-connected">
                  Not connected
                </p>
              </div>
              <button
                class="btn"
                [class.btn-secondary]="spotifyConnected()"
                [class.btn-spotify]="!spotifyConnected()"
                (click)="toggleSpotify()"
              >
                {{ spotifyConnected() ? "Disconnect" : "Connect" }}
              </button>
            </div>

            <div class="service-card glass-card">
              <div class="service-icon youtube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
              </div>
              <div class="service-info">
                <h3>YouTube</h3>
                <p *ngIf="youtubeConnected()">Connected</p>
                <p *ngIf="!youtubeConnected()" class="not-connected">
                  Not connected
                </p>
              </div>
              <button
                class="btn"
                [class.btn-secondary]="youtubeConnected()"
                [class.btn-youtube]="!youtubeConnected()"
                (click)="toggleYouTube()"
              >
                {{ youtubeConnected() ? "Disconnect" : "Connect" }}
              </button>
            </div>
          </div>
        </section>

        <!-- Danger Zone -->
        <section class="profile-section danger-section">
          <h2>Danger Zone</h2>
          <div class="danger-card glass-card">
            <div class="danger-item">
              <div class="danger-info">
                <h3>Sign Out</h3>
                <p>Sign out of your account on this device</p>
              </div>
              <button class="btn btn-secondary" (click)="logout()">
                Sign Out
              </button>
            </div>
            <hr class="divider" />
            <div class="danger-item">
              <div class="danger-info">
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all data</p>
              </div>
              <button class="btn btn-danger" (click)="deleteAccount()">
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        padding-bottom: var(--space-12);
        animation: fade-in var(--transition-slow) ease;
      }

      /* Header */
      .profile-header {
        position: relative;
        padding: var(--space-12) var(--space-6);
        margin: calc(var(--space-6) * -1);
        margin-bottom: var(--space-8);
        overflow: hidden;
      }

      .header-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(168, 85, 247, 0.3),
          rgba(59, 130, 246, 0.2),
          transparent
        );
        z-index: 0;
      }

      .header-content {
        position: relative;
        z-index: 1;
      }

      .avatar-section {
        display: flex;
        align-items: flex-end;
        gap: var(--space-6);
      }

      .avatar {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: var(--surface-glass);
        position: relative;
        cursor: pointer;
        overflow: hidden;
        box-shadow: var(--shadow-xl);
      }

      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .avatar-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--gradient-aurora);
      }

      .avatar-placeholder svg {
        width: 80px;
        height: 80px;
        color: white;
      }

      .avatar-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity var(--transition-base);
      }

      .avatar:hover .avatar-overlay {
        opacity: 1;
      }

      .avatar-overlay svg {
        width: 32px;
        height: 32px;
        color: white;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }

      .profile-label {
        font-size: var(--text-sm);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: var(--tracking-wider);
        color: var(--text-secondary);
      }

      .display-name {
        font-size: var(--text-5xl);
        font-weight: 700;
        line-height: 1.1;
      }

      .username {
        font-size: var(--text-lg);
        color: var(--text-tertiary);
      }

      /* Content */
      .profile-content {
        max-width: 800px;
      }

      /* Stats */
      .stats-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-10);
      }

      .stat-card {
        padding: var(--space-5);
        text-align: center;
      }

      .stat-value {
        display: block;
        font-size: var(--text-3xl);
        font-weight: 700;
        color: var(--aurora-purple);
        margin-bottom: var(--space-1);
      }

      .stat-label {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      /* Sections */
      .profile-section {
        margin-bottom: var(--space-10);
      }

      .profile-section h2 {
        font-size: var(--text-xl);
        font-weight: 600;
        margin-bottom: var(--space-4);
      }

      /* Form Card */
      .form-card {
        padding: var(--space-6);
      }

      .profile-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-secondary);
        margin-bottom: var(--space-2);
      }

      .input-field {
        padding: var(--space-3) var(--space-4);
        font-size: var(--text-base);
        color: var(--text-primary);
        background: var(--color-bg-secondary);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        transition: all var(--transition-base);
      }

      .input-field:hover:not(:disabled) {
        border-color: var(--surface-border-hover);
      }

      .input-field:focus {
        outline: none;
        border-color: var(--aurora-purple);
        box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
      }

      .input-field:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .input-field::placeholder {
        color: var(--text-muted);
      }

      .textarea {
        resize: vertical;
        min-height: 80px;
      }

      .helper-text {
        font-size: var(--text-xs);
        color: var(--text-muted);
        margin-top: var(--space-1);
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-3);
        padding-top: var(--space-4);
        border-top: 1px solid var(--surface-border);
      }

      /* Buttons */
      .btn {
        padding: var(--space-3) var(--space-5);
        font-size: var(--text-sm);
        font-weight: 600;
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .btn-primary {
        background: var(--gradient-aurora);
        color: white;
        border: none;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .btn-secondary {
        background: var(--surface-glass);
        color: var(--text-secondary);
        border: 1px solid var(--surface-border);
      }

      .btn-secondary:hover {
        background: var(--surface-glass-hover);
        color: var(--text-primary);
      }

      .btn-spotify {
        background: var(--spotify-green);
        color: white;
        border: none;
      }

      .btn-youtube {
        background: var(--youtube-red);
        color: white;
        border: none;
      }

      .btn-danger {
        background: var(--color-error);
        color: white;
        border: none;
      }

      .btn-danger:hover {
        background: #dc2626;
      }

      .loading-spinner {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .loading-spinner svg {
        width: 16px;
        height: 16px;
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

      /* Services */
      .services-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-4);
      }

      .service-card {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-5);
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
        width: 28px;
        height: 28px;
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

      .service-info h3 {
        font-size: var(--text-base);
        font-weight: 600;
        margin-bottom: var(--space-1);
      }

      .service-info p {
        font-size: var(--text-sm);
        color: var(--color-success);
      }

      .service-info p.not-connected {
        color: var(--text-muted);
      }

      /* Danger Zone */
      .danger-section h2 {
        color: var(--color-error);
      }

      .danger-card {
        border-color: rgba(239, 68, 68, 0.3);
      }

      .danger-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-4);
      }

      .danger-info h3 {
        font-size: var(--text-base);
        font-weight: 600;
        margin-bottom: var(--space-1);
      }

      .danger-info p {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .divider {
        border: none;
        border-top: 1px solid var(--surface-border);
        margin: 0;
      }

      /* Responsive */
      @media (max-width: 767px) {
        .avatar-section {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .avatar {
          width: 140px;
          height: 140px;
        }

        .display-name {
          font-size: var(--text-3xl);
        }

        .stats-row {
          grid-template-columns: 1fr;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .services-grid {
          grid-template-columns: 1fr;
        }

        .danger-item {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-3);
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // User data
  user = this.authService.currentUser;

  // Form fields
  displayName = "";
  username = "";
  bio = "";

  // Stats
  likedCount = signal(0);
  playlistCount = signal(0);
  connectedServices = signal(0);

  // Connection status
  spotifyConnected = signal(false);
  youtubeConnected = signal(false);

  // Loading states
  isSaving = signal(false);

  ngOnInit(): void {
    this.loadUserData();
    this.loadStats();
    this.loadConnections();
  }

  private loadUserData(): void {
    const user = this.user();
    if (user) {
      this.displayName = user.displayName || "";
      this.username = user.username || "";
      this.bio = user.bio || "";
    }
  }

  private loadStats(): void {
    // TODO: Load from API
    this.likedCount.set(0);
    this.playlistCount.set(0);
  }

  private loadConnections(): void {
    this.authService.providerConnections$.subscribe((connections) => {
      this.spotifyConnected.set(
        connections.some((c) => c.provider === "spotify" && c.connected),
      );
      this.youtubeConnected.set(
        connections.some((c) => c.provider === "youtube" && c.connected),
      );
      this.connectedServices.set(connections.filter((c) => c.connected).length);
    });
  }

  triggerAvatarUpload(): void {
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    input?.click();
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log("Avatar file selected:", file.name);
      // TODO: Upload avatar
    }
  }

  saveProfile(): void {
    this.isSaving.set(true);

    // TODO: Call API to save profile
    setTimeout(() => {
      this.isSaving.set(false);
      console.log("Profile saved");
    }, 1000);
  }

  resetForm(): void {
    this.loadUserData();
  }

  toggleSpotify(): void {
    if (this.spotifyConnected()) {
      this.authService.disconnectProvider("spotify").subscribe({
        next: () => console.log("Spotify disconnected"),
        error: (err) => console.error("Failed to disconnect Spotify:", err),
      });
    } else {
      this.authService.connectProvider("spotify");
    }
  }

  toggleYouTube(): void {
    if (this.youtubeConnected()) {
      this.authService.disconnectProvider("youtube").subscribe({
        next: () => console.log("YouTube disconnected"),
        error: (err) => console.error("Failed to disconnect YouTube:", err),
      });
    } else {
      this.authService.connectProvider("youtube");
    }
  }

  logout(): void {
    this.authService.logout();
  }

  deleteAccount(): void {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      console.log("Delete account requested");
      // TODO: Call API to delete account
    }
  }
}

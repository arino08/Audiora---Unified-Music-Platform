import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService, UserProfile, ProfileUpdateRequest } from './user-profile.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-profile-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="profile-backdrop" (click)="close()"></div>
      <div class="profile-panel">
        <div class="profile-header">
          <h2>Edit Profile</h2>
          <button class="close-button" (click)="close()" aria-label="Close">
            <span>✕</span>
          </button>
        </div>

        <div class="profile-content">
          @if (isLoading()) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading profile...</p>
            </div>
          } @else if (errorMessage()) {
            <div class="error-state">
              <p class="error-message">{{ errorMessage() }}</p>
              <button (click)="loadProfile()" class="retry-button">Retry</button>
            </div>
          } @else {
            <form (ngSubmit)="saveProfile()" #profileForm="ngForm">
              <div class="profile-section">
                <h3>Basic Information</h3>

                <div class="form-group">
                  <label for="displayName">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    [(ngModel)]="formData.displayName"
                    placeholder="Your display name"
                    maxlength="50"
                  />
                  <small class="field-hint">How your name appears to others</small>
                </div>

                <div class="form-group">
                  <label for="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    [(ngModel)]="formData.username"
                    placeholder="Your unique username"
                    maxlength="30"
                    required
                    pattern="[a-zA-Z0-9_]+"
                  />
                  <small class="field-hint">Letters, numbers, and underscores only</small>
                </div>

                <div class="form-group">
                  <label for="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    [(ngModel)]="formData.bio"
                    placeholder="Tell us about yourself..."
                    maxlength="500"
                    rows="4"
                  ></textarea>
                  <small class="field-hint">{{ formData.bio?.length || 0 }}/500 characters</small>
                </div>
              </div>

              <div class="profile-section">
                <h3>Profile Picture</h3>

                <div class="avatar-section">
                  @if (formData.avatarUrl) {
                    <img [src]="formData.avatarUrl" alt="Profile picture" class="avatar-preview" />
                  } @else {
                    <div class="avatar-placeholder">
                      <span>{{ getInitials() }}</span>
                    </div>
                  }

                  <div class="avatar-controls">
                    <div class="form-group">
                      <label for="avatarUrl">Avatar URL</label>
                      <input
                        type="url"
                        id="avatarUrl"
                        name="avatarUrl"
                        [(ngModel)]="formData.avatarUrl"
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <small class="field-hint">Enter a URL to an image</small>
                    </div>
                  </div>
                </div>
              </div>

              <div class="profile-section account-info">
                <h3>Account Information</h3>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">{{ originalProfile()?.email }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Verified:</span>
                  <span class="info-value">
                    {{ originalProfile()?.emailVerified ? '✓ Yes' : '✗ No' }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Member Since:</span>
                  <span class="info-value">{{ formatDate(originalProfile()?.createdAt) }}</span>
                </div>
              </div>

              <div class="profile-actions">
                <button type="button" (click)="cancel()" class="cancel-button">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="save-button"
                  [disabled]="!profileForm.valid || isSaving() || !hasChanges()"
                >
                  {{ isSaving() ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>

              @if (saveError()) {
                <div class="save-error">{{ saveError() }}</div>
              }
              @if (saveSuccess()) {
                <div class="save-success">Profile updated successfully!</div>
              }
            </form>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .profile-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 999;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .profile-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: min(500px, 100vw);
      height: 100vh;
      background: var(--glass-bg, rgba(255, 255, 255, 0.1));
      backdrop-filter: blur(20px);
      border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease-out;
      overflow: hidden;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .profile-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    .profile-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary, #fff);
    }

    .close-button {
      background: transparent;
      border: none;
      color: var(--text-primary, #fff);
      font-size: 1.5rem;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .close-button:hover {
      background-color: var(--glass-hover, rgba(255, 255, 255, 0.1));
    }

    .profile-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-primary, #fff);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--glass-border, rgba(255, 255, 255, 0.2));
      border-top-color: var(--accent, #1db954);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      color: #ff6b6b;
      margin-bottom: 1rem;
    }

    .retry-button {
      padding: 0.5rem 1rem;
      background: var(--accent, #1db954);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      font-weight: 500;
    }

    .profile-section {
      margin-bottom: 2rem;
    }

    .profile-section h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #fff);
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary, rgba(255, 255, 255, 0.7));
      margin-bottom: 0.5rem;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      background: var(--glass-input-bg, rgba(0, 0, 0, 0.3));
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
      border-radius: 8px;
      color: var(--text-primary, #fff);
      font-size: 0.9375rem;
      font-family: inherit;
      transition: border-color 0.2s, background-color 0.2s;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--accent, #1db954);
      background: var(--glass-input-focus-bg, rgba(0, 0, 0, 0.4));
    }

    .form-group textarea {
      resize: vertical;
      min-height: 100px;
    }

    .field-hint {
      display: block;
      font-size: 0.75rem;
      color: var(--text-tertiary, rgba(255, 255, 255, 0.5));
      margin-top: 0.25rem;
    }

    .avatar-section {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
    }

    .avatar-preview,
    .avatar-placeholder {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      flex-shrink: 0;
      object-fit: cover;
      border: 2px solid var(--glass-border, rgba(255, 255, 255, 0.2));
    }

    .avatar-placeholder {
      background: var(--glass-bg, rgba(255, 255, 255, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary, #fff);
    }

    .avatar-controls {
      flex: 1;
    }

    .account-info .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
    }

    .account-info .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: 500;
      color: var(--text-secondary, rgba(255, 255, 255, 0.7));
    }

    .info-value {
      color: var(--text-primary, #fff);
    }

    .profile-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
    }

    .cancel-button,
    .save-button {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cancel-button {
      background: transparent;
      color: var(--text-primary, #fff);
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
    }

    .cancel-button:hover {
      background: var(--glass-hover, rgba(255, 255, 255, 0.1));
    }

    .save-button {
      background: var(--accent, #1db954);
      color: white;
    }

    .save-button:hover:not(:disabled) {
      background: var(--accent-hover, #1ed760);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
    }

    .save-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .save-error,
    .save-success {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      text-align: center;
    }

    .save-error {
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(255, 107, 107, 0.3);
    }

    .save-success {
      background: rgba(29, 185, 84, 0.2);
      color: #1db954;
      border: 1px solid rgba(29, 185, 84, 0.3);
    }
  `]
})
export class ProfilePanelComponent {
  isOpen = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  saveError = signal<string | null>(null);
  saveSuccess = signal(false);
  originalProfile = signal<UserProfile | null>(null);

  formData: ProfileUpdateRequest = {
    displayName: '',
    username: '',
    bio: '',
    avatarUrl: ''
  };

  constructor(
    private profileService: UserProfileService,
    private authService: AuthService
  ) {}

  open(): void {
    this.isOpen.set(true);
    this.loadProfile();
  }

  close(): void {
    this.isOpen.set(false);
    this.resetForm();
  }

  loadProfile(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.errorMessage.set('You must be logged in to view your profile. Please authenticate first.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.originalProfile.set(profile);
        this.formData = {
          displayName: profile.displayName || '',
          username: profile.username,
          bio: profile.bio || '',
          avatarUrl: profile.avatarUrl || ''
        };
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load profile. Please try again.');
        console.error('Profile load error:', error);
      }
    });
  }

  saveProfile(): void {
    if (this.isSaving()) return;

    this.isSaving.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);

    // Only send fields that have changed
    const updates: ProfileUpdateRequest = {};
    const original = this.originalProfile();

    if (this.formData.displayName !== (original?.displayName || '')) {
      updates.displayName = this.formData.displayName;
    }
    if (this.formData.username !== original?.username) {
      updates.username = this.formData.username;
    }
    if (this.formData.bio !== (original?.bio || '')) {
      updates.bio = this.formData.bio;
    }
    if (this.formData.avatarUrl !== (original?.avatarUrl || '')) {
      updates.avatarUrl = this.formData.avatarUrl;
    }

    this.profileService.updateProfile(updates).subscribe({
      next: (profile) => {
        this.originalProfile.set(profile);
        this.isSaving.set(false);
        this.saveSuccess.set(true);

        // Clear success message after 3 seconds
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (error) => {
        this.isSaving.set(false);

        if (error.status === 400 && error.error?.message?.includes('username')) {
          this.saveError.set('Username is already taken. Please choose another.');
        } else {
          this.saveError.set('Failed to save profile. Please try again.');
        }

        console.error('Profile save error:', error);
      }
    });
  }

  cancel(): void {
    this.resetForm();
    this.close();
  }

  resetForm(): void {
    const original = this.originalProfile();
    if (original) {
      this.formData = {
        displayName: original.displayName || '',
        username: original.username,
        bio: original.bio || '',
        avatarUrl: original.avatarUrl || ''
      };
    }
    this.saveError.set(null);
    this.saveSuccess.set(false);
  }

  hasChanges(): boolean {
    const original = this.originalProfile();
    if (!original) return false;

    return this.formData.displayName !== (original.displayName || '') ||
           this.formData.username !== original.username ||
           this.formData.bio !== (original.bio || '') ||
           this.formData.avatarUrl !== (original.avatarUrl || '');
  }

  getInitials(): string {
    const profile = this.originalProfile();
    if (!profile) return '?';

    if (profile.displayName) {
      return profile.displayName.charAt(0).toUpperCase();
    }
    if (profile.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    if (profile.email) {
      return profile.email.charAt(0).toUpperCase();
    }
    return '?';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

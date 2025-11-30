import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <!-- Aurora background -->
      <div class="aurora-bg">
        <div class="aurora-blob aurora-blob-1"></div>
        <div class="aurora-blob aurora-blob-2"></div>
        <div class="aurora-blob aurora-blob-3"></div>
      </div>

      <!-- Login card -->
      <div class="auth-card glass-card animate-scale-in">
        <!-- Logo -->
        <div class="auth-logo">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="login-logo-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" style="stop-color:#a855f7" />
                <stop offset="50%" style="stop-color:#3b82f6" />
                <stop offset="100%" style="stop-color:#14b8a6" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#login-logo-gradient)"
              stroke-width="2"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="url(#login-logo-gradient)"
              stroke-width="2"
              fill="none"
              opacity="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="25"
              stroke="url(#login-logo-gradient)"
              stroke-width="2"
              fill="none"
              opacity="0.7"
            />
            <path d="M42 35 L42 65 L68 50 Z" fill="url(#login-logo-gradient)" />
          </svg>
          <span class="logo-text">Audiora</span>
        </div>

        <!-- Header -->
        <div class="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your music</p>
        </div>

        <!-- Error message -->
        <div class="error-banner" *ngIf="error()">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{{ error() }}</span>
        </div>

        <!-- Login form -->
        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email" class="label">Email</label>
            <div class="input-group">
              <svg
                class="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                id="email"
                class="input-field"
                placeholder="Enter your email"
                [(ngModel)]="email"
                name="email"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="password" class="label">Password</label>
              <a routerLink="/forgot-password" class="forgot-link"
                >Forgot password?</a
              >
            </div>
            <div class="input-group">
              <svg
                class="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                class="input-field has-icon-right"
                placeholder="Enter your password"
                [(ngModel)]="password"
                name="password"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                class="input-icon-right"
                (click)="togglePasswordVisibility()"
                tabindex="-1"
              >
                <svg
                  *ngIf="!showPassword()"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  *ngIf="showPassword()"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox">
              <input
                type="checkbox"
                [(ngModel)]="rememberMe"
                name="rememberMe"
              />
              <span class="checkbox-label">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg w-full"
            [disabled]="isLoading()"
          >
            <span *ngIf="!isLoading()">Sign In</span>
            <span *ngIf="isLoading()" class="loading-spinner">
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
              Signing in...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="auth-divider">
          <span>or continue with</span>
        </div>

        <!-- OAuth buttons -->
        <div class="oauth-buttons">
          <button
            type="button"
            class="oauth-btn spotify"
            (click)="loginWithSpotify()"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
              />
            </svg>
            <span>Spotify</span>
          </button>
          <button
            type="button"
            class="oauth-btn youtube"
            (click)="loginWithYouTube()"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
            <span>YouTube</span>
          </button>
          <button
            type="button"
            class="oauth-btn google"
            (click)="loginWithGoogle()"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>

        <!-- Footer -->
        <div class="auth-footer">
          <p>
            Don't have an account?
            <a routerLink="/register" class="link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-6);
        position: relative;
        overflow: hidden;
      }

      /* Aurora background */
      .aurora-bg {
        position: fixed;
        inset: 0;
        z-index: -1;
        overflow: hidden;
      }

      .aurora-blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.5;
        animation: aurora-float 20s ease-in-out infinite;
      }

      .aurora-blob-1 {
        width: 600px;
        height: 600px;
        background: var(--aurora-purple);
        top: -20%;
        left: -10%;
        animation-delay: 0s;
      }

      .aurora-blob-2 {
        width: 500px;
        height: 500px;
        background: var(--aurora-teal);
        bottom: -20%;
        right: -10%;
        animation-delay: -7s;
      }

      .aurora-blob-3 {
        width: 400px;
        height: 400px;
        background: var(--aurora-pink);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: -14s;
      }

      @keyframes aurora-float {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }
        25% {
          transform: translate(50px, -30px) scale(1.1);
        }
        50% {
          transform: translate(-30px, 50px) scale(0.95);
        }
        75% {
          transform: translate(-50px, -20px) scale(1.05);
        }
      }

      /* Auth card */
      .auth-card {
        width: 100%;
        max-width: 440px;
        padding: var(--space-8);
        border-radius: var(--radius-2xl);
        background: rgba(18, 18, 26, 0.8);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border: 1px solid var(--surface-border);
        box-shadow: var(--shadow-xl);
      }

      /* Logo */
      .auth-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-3);
        margin-bottom: var(--space-6);
      }

      .auth-logo svg {
        width: 48px;
        height: 48px;
        filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
      }

      .logo-text {
        font-family: var(--font-family-display);
        font-size: var(--text-2xl);
        font-weight: 700;
        background: var(--gradient-aurora);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Header */
      .auth-header {
        text-align: center;
        margin-bottom: var(--space-6);
      }

      .auth-header h1 {
        font-size: var(--text-2xl);
        font-weight: 600;
        margin-bottom: var(--space-2);
      }

      .auth-header p {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
      }

      /* Error banner */
      .error-banner {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-4);
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: var(--radius-lg);
        margin-bottom: var(--space-5);
        color: var(--color-error-light);
        font-size: var(--text-sm);
      }

      .error-banner svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      /* Form */
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-2);
      }

      .label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-secondary);
        margin-bottom: var(--space-2);
      }

      .label-row .label {
        margin-bottom: 0;
      }

      .forgot-link {
        font-size: var(--text-xs);
        color: var(--aurora-purple-light);
        transition: color var(--transition-fast);
      }

      .forgot-link:hover {
        color: var(--aurora-purple);
      }

      /* Input group */
      .input-group {
        position: relative;
        display: flex;
        align-items: center;
      }

      .input-icon {
        position: absolute;
        left: var(--space-4);
        width: 18px;
        height: 18px;
        color: var(--text-muted);
        pointer-events: none;
        z-index: 1;
      }

      .input-icon-right {
        position: absolute;
        right: var(--space-3);
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        cursor: pointer;
        border-radius: var(--radius-md);
        transition: all var(--transition-base);
      }

      .input-icon-right:hover {
        color: var(--text-secondary);
        background: var(--surface-glass);
      }

      .input-icon-right svg {
        width: 18px;
        height: 18px;
      }

      .input-field {
        width: 100%;
        padding: var(--space-3) var(--space-4);
        padding-left: calc(var(--space-4) + 26px);
        font-size: var(--text-base);
        color: var(--text-primary);
        background: var(--color-bg-secondary);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        transition: all var(--transition-base);
      }

      .input-field.has-icon-right {
        padding-right: calc(var(--space-4) + 32px);
      }

      .input-field:hover {
        border-color: var(--surface-border-hover);
      }

      .input-field:focus {
        outline: none;
        border-color: var(--aurora-purple);
        box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
      }

      .input-field::placeholder {
        color: var(--text-muted);
      }

      /* Checkbox */
      .checkbox-group {
        flex-direction: row;
      }

      .checkbox {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        cursor: pointer;
      }

      .checkbox input {
        width: 18px;
        height: 18px;
        accent-color: var(--aurora-purple);
        cursor: pointer;
      }

      .checkbox-label {
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      /* Submit button */
      .btn-lg {
        padding: var(--space-4) var(--space-6);
        font-size: var(--text-base);
        font-weight: 600;
      }

      .loading-spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
      }

      .loading-spinner svg {
        width: 20px;
        height: 20px;
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

      /* Divider */
      .auth-divider {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        margin: var(--space-6) 0;
      }

      .auth-divider::before,
      .auth-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--surface-border);
      }

      .auth-divider span {
        font-size: var(--text-xs);
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: var(--tracking-wider);
      }

      /* OAuth buttons */
      .oauth-buttons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-3);
      }

      .oauth-btn {
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
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .oauth-btn:hover {
        background: var(--surface-glass-hover);
        border-color: var(--surface-border-hover);
        transform: translateY(-2px);
      }

      .oauth-btn svg {
        width: 24px;
        height: 24px;
      }

      .oauth-btn.spotify:hover {
        border-color: var(--spotify-green);
        color: var(--spotify-green);
      }

      .oauth-btn.youtube:hover {
        border-color: var(--youtube-red);
        color: var(--youtube-red);
      }

      .oauth-btn.google:hover {
        border-color: var(--google-blue);
      }

      /* Footer */
      .auth-footer {
        text-align: center;
        margin-top: var(--space-6);
        padding-top: var(--space-6);
        border-top: 1px solid var(--surface-border);
      }

      .auth-footer p {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
      }

      .link {
        color: var(--aurora-purple-light);
        font-weight: 500;
        transition: color var(--transition-fast);
      }

      .link:hover {
        color: var(--aurora-purple);
      }

      /* Responsive */
      @media (max-width: 480px) {
        .auth-card {
          padding: var(--space-6);
        }

        .oauth-buttons {
          grid-template-columns: 1fr;
        }

        .oauth-btn {
          flex-direction: row;
          justify-content: center;
        }
      }
    `,
  ],
})
export class LoginComponent {
  // Form fields
  email = "";
  password = "";
  rememberMe = false;

  // UI state
  isLoading = signal(false);
  showPassword = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error.set("Please enter your email and password");
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          // Navigation handled by AuthService
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(
            err.message || "Failed to sign in. Please check your credentials.",
          );
        },
      });
  }

  loginWithSpotify(): void {
    this.authService.initiateOAuth("spotify");
  }

  loginWithYouTube(): void {
    this.authService.initiateOAuth("youtube");
  }

  loginWithGoogle(): void {
    // Google OAuth flow - use AuthService to initiate properly
    this.authService.initiateOAuth("google");
  }
}

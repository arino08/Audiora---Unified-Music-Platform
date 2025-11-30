import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { Provider } from "../../../core/models";

@Component({
  selector: "app-oauth-callback",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <!-- Aurora background -->
      <div class="aurora-bg">
        <div class="aurora-blob aurora-blob-1"></div>
        <div class="aurora-blob aurora-blob-2"></div>
      </div>

      <!-- Loading state -->
      <div class="callback-card glass-card" *ngIf="!error()">
        <div class="loading-spinner">
          <svg class="spinner" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="url(#spinner-gradient)"
              stroke-width="4"
            />
            <defs>
              <linearGradient
                id="spinner-gradient"
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
          </svg>
        </div>
        <h2>{{ statusMessage() }}</h2>
        <p class="subtitle">Please wait while we complete the connection...</p>

        <!-- Provider indicator -->
        <div class="provider-indicator" *ngIf="provider()">
          <div class="provider-icon" [class]="provider()">
            <svg
              *ngIf="provider() === 'spotify'"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
              />
            </svg>
            <svg
              *ngIf="provider() === 'youtube'"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
          </div>
          <span>Connecting to {{ providerName() }}</span>
        </div>
      </div>

      <!-- Error state -->
      <div class="callback-card glass-card error-card" *ngIf="error()">
        <div class="error-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2>Connection Failed</h2>
        <p class="error-message">{{ error() }}</p>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="retry()">Try Again</button>
          <button class="btn btn-secondary" (click)="goHome()">Go Home</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .callback-container {
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
        width: 500px;
        height: 500px;
        background: var(--aurora-purple);
        top: -20%;
        left: -10%;
      }

      .aurora-blob-2 {
        width: 400px;
        height: 400px;
        background: var(--aurora-teal);
        bottom: -20%;
        right: -10%;
        animation-delay: -10s;
      }

      @keyframes aurora-float {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }
        50% {
          transform: translate(30px, -30px) scale(1.1);
        }
      }

      /* Card */
      .callback-card {
        width: 100%;
        max-width: 400px;
        padding: var(--space-10);
        border-radius: var(--radius-2xl);
        text-align: center;
        background: rgba(18, 18, 26, 0.9);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        animation: scale-in var(--transition-slow) ease;
      }

      @keyframes scale-in {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Loading Spinner */
      .loading-spinner {
        width: 80px;
        height: 80px;
        margin: 0 auto var(--space-6);
      }

      .spinner {
        width: 100%;
        height: 100%;
        animation: spin 1.5s linear infinite;
      }

      .spinner circle {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        animation: dash 1.5s ease-in-out infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes dash {
        0% {
          stroke-dasharray: 1, 150;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -35;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -124;
        }
      }

      h2 {
        font-size: var(--text-xl);
        font-weight: 600;
        margin-bottom: var(--space-2);
      }

      .subtitle {
        color: var(--text-tertiary);
        font-size: var(--text-sm);
        margin-bottom: var(--space-6);
      }

      /* Provider Indicator */
      .provider-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-5);
        background: var(--surface-glass);
        border-radius: var(--radius-full);
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .provider-icon {
        width: 24px;
        height: 24px;
      }

      .provider-icon svg {
        width: 100%;
        height: 100%;
      }

      .provider-icon.spotify {
        color: var(--spotify-green);
      }

      .provider-icon.youtube {
        color: var(--youtube-red);
      }

      /* Error State */
      .error-card .error-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto var(--space-5);
        color: var(--color-error);
      }

      .error-card .error-icon svg {
        width: 100%;
        height: 100%;
      }

      .error-message {
        color: var(--text-secondary);
        font-size: var(--text-sm);
        margin-bottom: var(--space-6);
      }

      .error-actions {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      .btn {
        padding: var(--space-3) var(--space-5);
        border-radius: var(--radius-lg);
        font-weight: 600;
        font-size: var(--text-sm);
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

      .btn-secondary {
        background: var(--surface-glass);
        color: var(--text-secondary);
        border: 1px solid var(--surface-border);
      }

      .btn-secondary:hover {
        background: var(--surface-glass-hover);
        color: var(--text-primary);
      }
    `,
  ],
})
export class OAuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  // State
  provider = signal<Provider | null>(null);
  error = signal<string | null>(null);
  statusMessage = signal("Connecting...");

  providerName(): string {
    const p = this.provider();
    if (p === "spotify") return "Spotify";
    if (p === "youtube") return "YouTube";
    return "Service";
  }

  ngOnInit(): void {
    this.handleCallback();
  }

  private handleCallback(): void {
    // Get query parameters
    const params = this.route.snapshot.queryParams;

    // Check for error in params
    if (params["error"]) {
      this.error.set(
        params["error_description"] ||
          params["error"] ||
          "Authentication was cancelled or failed.",
      );
      return;
    }

    // Get provider from query params, URL fragment, state, or path
    let provider: Provider | null = null;

    // First check query params (primary source after our backend fix)
    if (params["provider"]) {
      provider = params["provider"] as Provider;
    }

    // Check URL fragment (e.g., #provider=spotify)
    if (!provider && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashProvider = hashParams.get("provider");
      if (hashProvider) {
        provider = hashProvider as Provider;
      }
    }

    // Check state param
    if (!provider && params["state"]) {
      const stateProvider = params["state"].split("_")[0];
      if (["spotify", "youtube", "google"].includes(stateProvider)) {
        provider = stateProvider as Provider;
      }
    }

    // Check stored provider from sessionStorage
    if (!provider) {
      const storedProvider = sessionStorage.getItem("oauth_provider");
      if (storedProvider) {
        provider = storedProvider as Provider;
      }
    }

    // Default fallback
    if (!provider) {
      provider = "spotify";
    }

    this.provider.set(provider);

    // Get session ID and user ID from params
    const sessionId = params["sessionId"] || params["session_id"];
    const userId = params["userId"] || params["user_id"];
    const code = params["code"];

    if (sessionId && userId) {
      // We have the session info, exchange for JWT
      this.statusMessage.set("Completing authentication...");
      this.exchangeToken(provider, sessionId, userId);
    } else if (code) {
      // We have an auth code, the backend should handle the exchange
      this.statusMessage.set("Processing authorization...");
      this.handleAuthCode(provider, code, params["state"]);
    } else {
      this.error.set("Missing authentication data. Please try again.");
    }
  }

  private exchangeToken(
    provider: Provider,
    sessionId: string,
    userId: string,
  ): void {
    this.authService
      .handleOAuthCallback(provider, sessionId, userId)
      .subscribe({
        next: () => {
          this.statusMessage.set("Success! Redirecting...");

          // Close popup if this is a popup window
          if (window.opener) {
            window.opener.postMessage(
              { type: "oauth_success", provider },
              window.location.origin,
            );
            window.close();
          } else {
            // Navigate to home or intended destination
            setTimeout(() => {
              this.router.navigate(["/"]);
            }, 500);
          }
        },
        error: (err) => {
          console.error("OAuth exchange error:", err);
          this.error.set(
            err.message ||
              "Failed to complete authentication. Please try again.",
          );
        },
      });
  }

  private handleAuthCode(
    provider: Provider,
    code: string,
    state?: string,
  ): void {
    // For auth code flow, we need to exchange the code on the backend
    // This might redirect or be handled by the backend directly
    // For now, show an error since the backend should redirect with sessionId
    this.error.set("Authentication flow incomplete. Please try again.");
  }

  retry(): void {
    const provider = this.provider();
    if (provider) {
      this.authService.initiateOAuth(provider);
    } else {
      this.router.navigate(["/login"]);
    }
  }

  goHome(): void {
    // Close popup if applicable
    if (window.opener) {
      window.close();
    } else {
      this.router.navigate(["/"]);
    }
  }
}

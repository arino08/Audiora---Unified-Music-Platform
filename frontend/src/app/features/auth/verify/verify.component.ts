import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-card animate-scale-in">
        <!-- Logo -->
        <div class="auth-logo">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="verify-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7"/>
                <stop offset="50%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#14b8a6"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#verify-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" stroke="url(#verify-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
            <circle cx="50" cy="50" r="25" stroke="url(#verify-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M42 35 L42 65 L68 50 Z" fill="url(#verify-logo-gradient)"/>
          </svg>
        </div>

        <!-- Loading State -->
        <div class="verify-content" *ngIf="isLoading()">
          <div class="loading-spinner">
            <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
          </div>
          <h1>Verifying your email</h1>
          <p>Please wait while we verify your email address...</p>
        </div>

        <!-- Success State -->
        <div class="verify-content" *ngIf="!isLoading() && isSuccess()">
          <div class="status-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>Email Verified!</h1>
          <p>Your email has been successfully verified. You can now sign in to your account.</p>
          <a routerLink="/login" class="btn btn-primary btn-lg w-full">
            Sign In
          </a>
        </div>

        <!-- Error State -->
        <div class="verify-content" *ngIf="!isLoading() && !isSuccess() && errorMessage()">
          <div class="status-icon error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h1>Verification Failed</h1>
          <p>{{ errorMessage() }}</p>
          <div class="action-buttons">
            <button class="btn btn-secondary" (click)="resendVerification()">
              Resend Verification Email
            </button>
            <a routerLink="/login" class="btn btn-ghost">
              Back to Login
            </a>
          </div>
        </div>

        <!-- No Token State -->
        <div class="verify-content" *ngIf="!isLoading() && !token">
          <div class="status-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1>Invalid Verification Link</h1>
          <p>The verification link is missing or invalid. Please check your email for the correct link.</p>
          <a routerLink="/login" class="btn btn-primary btn-lg w-full">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: var(--space-8);
      text-align: center;
    }

    .auth-logo {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .auth-logo svg {
      width: 64px;
      height: 64px;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
    }

    .verify-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
    }

    .loading-spinner svg {
      width: 48px;
      height: 48px;
      color: var(--aurora-purple);
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .status-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-2);
    }

    .status-icon svg {
      width: 36px;
      height: 36px;
    }

    .status-icon.success {
      background: rgba(34, 197, 94, 0.15);
      color: var(--color-success);
    }

    .status-icon.error {
      background: rgba(239, 68, 68, 0.15);
      color: var(--color-error);
    }

    .status-icon.warning {
      background: rgba(245, 158, 11, 0.15);
      color: var(--color-warning);
    }

    .verify-content h1 {
      font-size: var(--text-2xl);
      font-weight: 600;
    }

    .verify-content p {
      color: var(--text-secondary);
      max-width: 300px;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      width: 100%;
      margin-top: var(--space-4);
    }
  `]
})
export class VerifyComponent implements OnInit {
  token: string | null = null;

  isLoading = signal(true);
  isSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];

      if (this.token) {
        this.verifyEmail(this.token);
      } else {
        this.isLoading.set(false);
      }
    });
  }

  private verifyEmail(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.isSuccess.set(false);
        this.errorMessage.set(error.message || 'Verification failed. The link may have expired.');
      }
    });
  }

  resendVerification(): void {
    // Navigate to a resend page or show a form to enter email
    this.router.navigate(['/login'], {
      queryParams: { resend: 'true' }
    });
  }
}

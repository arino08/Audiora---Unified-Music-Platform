import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-card animate-scale-in">
        <!-- Logo -->
        <div class="auth-logo">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="forgot-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7"/>
                <stop offset="50%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#14b8a6"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#forgot-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" stroke="url(#forgot-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
            <circle cx="50" cy="50" r="25" stroke="url(#forgot-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M42 35 L42 65 L68 50 Z" fill="url(#forgot-logo-gradient)"/>
          </svg>
        </div>

        <!-- Success State -->
        <div class="success-state" *ngIf="emailSent()">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>Check your email</h1>
          <p>We've sent a password reset link to <strong>{{ email }}</strong></p>
          <p class="helper-text">Didn't receive the email? Check your spam folder or</p>
          <button class="btn btn-secondary" (click)="resendEmail()" [disabled]="isLoading()">
            Resend email
          </button>
          <a routerLink="/login" class="back-link">Back to sign in</a>
        </div>

        <!-- Form State -->
        <div class="form-state" *ngIf="!emailSent()">
          <div class="auth-header">
            <h1>Forgot password?</h1>
            <p>No worries, we'll send you reset instructions.</p>
          </div>

          <!-- Error message -->
          <div class="error-banner" *ngIf="error()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ error() }}</span>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email" class="label">Email</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
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

            <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="isLoading() || !email">
              <span *ngIf="!isLoading()">Reset password</span>
              <span *ngIf="isLoading()" class="loading-spinner">
                <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                </svg>
                Sending...
              </span>
            </button>
          </form>

          <a routerLink="/login" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to sign in
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
      max-width: 400px;
      padding: var(--space-8);
      border-radius: var(--radius-2xl);
    }

    .auth-logo {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .auth-logo svg {
      width: 56px;
      height: 56px;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
    }

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

    /* Success State */
    .success-state {
      text-align: center;
    }

    .success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-6);
    }

    .success-icon svg {
      width: 32px;
      height: 32px;
      color: var(--color-success);
    }

    .success-state h1 {
      font-size: var(--text-xl);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .success-state p {
      color: var(--text-secondary);
      font-size: var(--text-sm);
      margin-bottom: var(--space-4);
    }

    .success-state p strong {
      color: var(--text-primary);
    }

    .success-state .helper-text {
      color: var(--text-muted);
      font-size: var(--text-xs);
      margin-bottom: var(--space-3);
    }

    .success-state .btn {
      margin-bottom: var(--space-4);
    }

    /* Error */
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

    .label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: var(--space-2);
    }

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

    /* Button */
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
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Back link */
    .back-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      margin-top: var(--space-6);
      font-size: var(--text-sm);
      color: var(--text-tertiary);
      transition: color var(--transition-fast);
    }

    .back-link:hover {
      color: var(--text-primary);
    }

    .back-link svg {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: var(--space-6);
      }
    }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = signal(false);
  error = signal<string | null>(null);
  emailSent = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email) {
      this.error.set('Please enter your email address');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.emailSent.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'Failed to send reset email. Please try again.');
      }
    });
  }

  resendEmail(): void {
    this.emailSent.set(false);
    this.onSubmit();
  }
}

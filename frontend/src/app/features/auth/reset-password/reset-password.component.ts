import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-card animate-scale-in">
        <!-- Logo -->
        <div class="auth-logo">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="reset-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7"/>
                <stop offset="50%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#14b8a6"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#reset-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" stroke="url(#reset-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
            <circle cx="50" cy="50" r="25" stroke="url(#reset-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M42 35 L42 65 L68 50 Z" fill="url(#reset-logo-gradient)"/>
          </svg>
        </div>

        <!-- Success State -->
        <div class="success-state" *ngIf="isSuccess()">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>Password Reset!</h1>
          <p>Your password has been successfully reset. You can now sign in with your new password.</p>
          <a routerLink="/login" class="btn btn-primary btn-lg w-full">
            Sign In
          </a>
        </div>

        <!-- Reset Form -->
        <div class="reset-form-container" *ngIf="!isSuccess()">
          <div class="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your new password below</p>
          </div>

          <!-- Error Banner -->
          <div class="error-banner" *ngIf="error()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ error() }}</span>
          </div>

          <!-- Invalid Token State -->
          <div class="invalid-token" *ngIf="!token">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h3>Invalid Reset Link</h3>
            <p>This password reset link is invalid or has expired.</p>
            <a routerLink="/forgot-password" class="btn btn-primary">
              Request New Link
            </a>
          </div>

          <!-- Reset Form -->
          <form (ngSubmit)="onSubmit()" class="auth-form" *ngIf="token">
            <div class="form-group">
              <label for="password" class="label">New Password</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  id="password"
                  class="input-field has-icon-right"
                  placeholder="Enter new password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  minlength="8"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="input-icon-right"
                  (click)="togglePasswordVisibility()"
                  tabindex="-1"
                >
                  <svg *ngIf="!showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <div class="password-requirements">
                <span [class.met]="password.length >= 8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  At least 8 characters
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="label">Confirm Password</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  <circle cx="12" cy="16" r="1"/>
                </svg>
                <input
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  id="confirmPassword"
                  class="input-field has-icon-right"
                  placeholder="Confirm new password"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  required
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="input-icon-right"
                  (click)="toggleConfirmPasswordVisibility()"
                  tabindex="-1"
                >
                  <svg *ngIf="!showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <span class="helper-text error" *ngIf="confirmPassword && password !== confirmPassword">
                Passwords do not match
              </span>
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg w-full"
              [disabled]="isLoading() || !isFormValid()"
            >
              <span *ngIf="!isLoading()">Reset Password</span>
              <span *ngIf="isLoading()" class="loading-spinner">
                <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                </svg>
                Resetting...
              </span>
            </button>
          </form>

          <div class="auth-footer">
            <a routerLink="/login" class="back-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Sign In
            </a>
          </div>
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
      border-radius: var(--radius-2xl);
      background: rgba(18, 18, 26, 0.8);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid var(--surface-border);
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

    .success-state {
      text-align: center;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-6);
    }

    .success-icon svg {
      width: 40px;
      height: 40px;
      color: var(--color-success);
    }

    .success-state h1 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-3);
    }

    .success-state p {
      color: var(--text-tertiary);
      margin-bottom: var(--space-6);
    }

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

    .invalid-token {
      text-align: center;
      padding: var(--space-6);
    }

    .invalid-token svg {
      width: 64px;
      height: 64px;
      color: var(--color-error);
      margin-bottom: var(--space-4);
    }

    .invalid-token h3 {
      font-size: var(--text-lg);
      margin-bottom: var(--space-2);
    }

    .invalid-token p {
      color: var(--text-tertiary);
      margin-bottom: var(--space-6);
    }

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
      background: none;
      border: none;
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

    .password-requirements {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      margin-top: var(--space-2);
    }

    .password-requirements span {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-xs);
      color: var(--text-muted);
      transition: color var(--transition-fast);
    }

    .password-requirements span.met {
      color: var(--color-success);
    }

    .password-requirements svg {
      width: 14px;
      height: 14px;
    }

    .helper-text {
      font-size: var(--text-xs);
      margin-top: var(--space-1);
    }

    .helper-text.error {
      color: var(--color-error);
    }

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

    .auth-footer {
      margin-top: var(--space-6);
      text-align: center;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-sm);
      color: var(--text-secondary);
      transition: color var(--transition-fast);
    }

    .back-link:hover {
      color: var(--aurora-purple-light);
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
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  password = '';
  confirmPassword = '';

  isLoading = signal(false);
  isSuccess = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }

  isFormValid(): boolean {
    return (
      this.password.length >= 8 &&
      this.password === this.confirmPassword
    );
  }

  onSubmit(): void {
    if (!this.isFormValid() || !this.token) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.resetPassword({
      token: this.token,
      newPassword: this.password
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'Failed to reset password. Please try again.');
      }
    });
  }
}

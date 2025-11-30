import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-card">
        <!-- Logo -->
        <div class="auth-header">
          <div class="logo">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
              <defs>
                <linearGradient id="register-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#a855f7"/>
                  <stop offset="50%" style="stop-color:#3b82f6"/>
                  <stop offset="100%" style="stop-color:#14b8a6"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" stroke="url(#register-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
              <circle cx="50" cy="50" r="35" stroke="url(#register-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
              <circle cx="50" cy="50" r="25" stroke="url(#register-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
              <path d="M42 35 L42 65 L68 50 Z" fill="url(#register-logo-gradient)"/>
            </svg>
          </div>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join Audiora and start your music journey</p>
        </div>

        <!-- Register Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <!-- Display Name -->
          <div class="form-group">
            <label for="displayName" class="label">Display Name</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                id="displayName"
                formControlName="displayName"
                class="input-field"
                placeholder="How should we call you?"
                autocomplete="name"
              />
            </div>
            <span class="helper-text error" *ngIf="registerForm.get('displayName')?.touched && registerForm.get('displayName')?.errors?.['required']">
              Display name is required
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('displayName')?.touched && registerForm.get('displayName')?.errors?.['minlength']">
              Display name must be at least 2 characters
            </span>
          </div>

          <!-- Username -->
          <div class="form-group">
            <label for="username" class="label">Username</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <input
                type="text"
                id="username"
                formControlName="username"
                class="input-field"
                placeholder="Choose a unique username"
                autocomplete="username"
              />
            </div>
            <span class="helper-text error" *ngIf="registerForm.get('username')?.touched && registerForm.get('username')?.errors?.['required']">
              Username is required
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('username')?.touched && registerForm.get('username')?.errors?.['minlength']">
              Username must be at least 3 characters
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('username')?.touched && registerForm.get('username')?.errors?.['pattern']">
              Username can only contain letters, numbers, and underscores
            </span>
          </div>

          <!-- Email -->
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
                formControlName="email"
                class="input-field"
                placeholder="you@example.com"
                autocomplete="email"
              />
            </div>
            <span class="helper-text error" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']">
              Email is required
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']">
              Please enter a valid email
            </span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="label">Password</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                formControlName="password"
                class="input-field has-icon-right"
                placeholder="Create a strong password"
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
            <span class="helper-text error" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']">
              Password is required
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['minlength']">
              Password must be at least 8 characters
            </span>

            <!-- Password Strength Indicator -->
            <div class="password-strength" *ngIf="registerForm.get('password')?.value">
              <div class="strength-bars">
                <div class="strength-bar" [class.active]="passwordStrength() >= 1" [class.weak]="passwordStrength() === 1" [class.medium]="passwordStrength() === 2" [class.strong]="passwordStrength() >= 3"></div>
                <div class="strength-bar" [class.active]="passwordStrength() >= 2" [class.medium]="passwordStrength() === 2" [class.strong]="passwordStrength() >= 3"></div>
                <div class="strength-bar" [class.active]="passwordStrength() >= 3" [class.strong]="passwordStrength() >= 3"></div>
                <div class="strength-bar" [class.active]="passwordStrength() >= 4" [class.strong]="passwordStrength() >= 4"></div>
              </div>
              <span class="strength-text">{{ passwordStrengthText() }}</span>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirmPassword" class="label">Confirm Password</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                <path d="M12 16v1"/>
              </svg>
              <input
                [type]="showConfirmPassword() ? 'text' : 'password'"
                id="confirmPassword"
                formControlName="confirmPassword"
                class="input-field has-icon-right"
                placeholder="Confirm your password"
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
            <span class="helper-text error" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.errors?.['required']">
              Please confirm your password
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch']">
              Passwords do not match
            </span>
          </div>

          <!-- Terms Agreement -->
          <div class="form-group">
            <label class="checkbox">
              <input type="checkbox" formControlName="agreeToTerms" />
              <span class="checkbox-label">
                I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
              </span>
            </label>
            <span class="helper-text error" *ngIf="registerForm.get('agreeToTerms')?.touched && registerForm.get('agreeToTerms')?.errors?.['requiredTrue']">
              You must agree to the terms to continue
            </span>
          </div>

          <!-- Error Message -->
          <div class="error-alert" *ngIf="errorMessage()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-lg w-full"
            [disabled]="registerForm.invalid || isLoading()"
          >
            <span *ngIf="!isLoading()">Create Account</span>
            <span *ngIf="isLoading()" class="loading-spinner">
              <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
              </svg>
              Creating account...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="auth-divider">
          <span>or continue with</span>
        </div>

        <!-- OAuth Buttons -->
        <div class="oauth-buttons">
          <button type="button" class="btn btn-secondary oauth-btn" (click)="loginWithSpotify()">
            <svg viewBox="0 0 24 24" fill="currentColor" class="oauth-icon spotify">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Spotify</span>
          </button>
          <button type="button" class="btn btn-secondary oauth-btn" (click)="loginWithGoogle()">
            <svg viewBox="0 0 24 24" class="oauth-icon google">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>
        </div>

        <!-- Login Link -->
        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
        </p>
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
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .logo {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-4);
    }

    .logo-icon {
      width: 64px;
      height: 64px;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
    }

    .auth-title {
      font-size: var(--text-2xl);
      font-weight: 700;
      margin-bottom: var(--space-2);
      background: var(--gradient-aurora);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .auth-subtitle {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
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
      left: var(--space-3);
      width: 20px;
      height: 20px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .input-icon-right {
      position: absolute;
      right: var(--space-3);
      width: 20px;
      height: 20px;
      color: var(--text-muted);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .input-icon-right:hover {
      color: var(--text-secondary);
    }

    .input-icon-right svg {
      width: 20px;
      height: 20px;
    }

    .input-field {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      padding-left: calc(var(--space-3) + 28px);
      background: var(--color-bg-secondary);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      font-size: var(--text-base);
      color: var(--text-primary);
      transition: all var(--transition-base);
    }

    .input-field.has-icon-right {
      padding-right: calc(var(--space-3) + 28px);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--aurora-purple);
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
    }

    .input-field::placeholder {
      color: var(--text-muted);
    }

    .helper-text {
      font-size: var(--text-xs);
      margin-top: var(--space-1);
      color: var(--text-muted);
    }

    .helper-text.error {
      color: var(--color-error);
    }

    .checkbox {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      cursor: pointer;
    }

    .checkbox input {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      accent-color: var(--aurora-purple);
      cursor: pointer;
      flex-shrink: 0;
    }

    .checkbox-label {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .checkbox-label a {
      color: var(--aurora-purple-light);
      text-decoration: none;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
    }

    .password-strength {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-2);
    }

    .strength-bars {
      display: flex;
      gap: var(--space-1);
      flex: 1;
    }

    .strength-bar {
      height: 4px;
      flex: 1;
      background: var(--surface-glass-hover);
      border-radius: var(--radius-full);
      transition: all var(--transition-base);
    }

    .strength-bar.active.weak {
      background: var(--color-error);
    }

    .strength-bar.active.medium {
      background: var(--color-warning);
    }

    .strength-bar.active.strong {
      background: var(--color-success);
    }

    .strength-text {
      font-size: var(--text-xs);
      color: var(--text-muted);
      min-width: 60px;
      text-align: right;
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--radius-lg);
      color: var(--color-error);
      font-size: var(--text-sm);
    }

    .error-alert svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
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

    .auth-divider {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin: var(--space-6) 0;
    }

    .auth-divider::before,
    .auth-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--surface-border);
    }

    .auth-divider span {
      font-size: var(--text-sm);
      color: var(--text-muted);
    }

    .oauth-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
    }

    .oauth-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3);
    }

    .oauth-icon {
      width: 20px;
      height: 20px;
    }

    .oauth-icon.spotify {
      color: #1db954;
    }

    .auth-footer {
      text-align: center;
      margin-top: var(--space-6);
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .auth-footer a {
      color: var(--aurora-purple-light);
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: var(--space-6);
      }

      .oauth-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  // Signals for component state
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  passwordStrength = signal(0);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        displayName: ['', [Validators.required, Validators.minLength(2)]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z0-9_]+$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        agreeToTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    // Watch password changes for strength calculation
    this.registerForm.get('password')?.valueChanges.subscribe((password) => {
      this.calculatePasswordStrength(password);
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength.set(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    this.passwordStrength.set(Math.min(strength, 4));
  }

  passwordStrengthText(): string {
    const strength = this.passwordStrength();
    if (strength <= 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { displayName, username, email, password } = this.registerForm.value;

    this.authService
      .register({
        displayName,
        username,
        email,
        password,
      })
      .subscribe({
        next: () => {
          // AuthService handles redirect
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            error.message || 'Registration failed. Please try again.'
          );
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  loginWithSpotify(): void {
    this.authService.initiateOAuth('spotify');
  }

  loginWithGoogle(): void {
    // Google OAuth through YouTube
    this.authService.initiateOAuth('youtube');
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { authConfig, authEndpoints } from './auth-config';
import { firstValueFrom } from 'rxjs';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthToken {
  token: string;
  expiresAt: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: AuthToken;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Reactive authentication state using Angular signals
  private _isAuthenticated = signal(false);
  private _userProfile = signal<UserProfile | null>(null);
  private _isLoading = signal(false);

  // Public computed signals for components to use
  isAuthenticated = computed(() => this._isAuthenticated());
  userProfile = computed(() => this._userProfile());
  isLoading = computed(() => this._isLoading());

  // Computed properties for easy access to user info
  userName = computed(() => this._userProfile()?.name || 'User');
  userEmail = computed(() => this._userProfile()?.email || '');
  userId = computed(() => this._userProfile()?.id || '');
  isVerified = computed(() => this._userProfile()?.verified || false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this._isLoading.set(true);

    // Check for existing token and auto-login
    const token = this.getStoredToken();
    if (token && this.isTokenValid(token)) {
      this.loadUserProfile().finally(() => {
        this._isLoading.set(false);
      });
    } else {
      this.clearStoredAuth();
      this._isLoading.set(false);
    }
  }

  /**
   * Register a new user account
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    this._isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${authConfig.apiBaseUrl}${authEndpoints.register}`, request)
      );

      this.storeAuth(response.user, response.token);
      this._userProfile.set(response.user);
      this._isAuthenticated.set(true);

      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Login with email and password
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    this._isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${authConfig.apiBaseUrl}${authEndpoints.login}`, request)
      );

      this.storeAuth(response.user, response.token);
      this._userProfile.set(response.user);
      this._isAuthenticated.set(true);

      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Logout the user
   */
  async logout(): Promise<void> {
    this._isLoading.set(true);
    try {
      const token = this.getStoredToken();
      if (token) {
        // Call backend logout endpoint
        await firstValueFrom(
          this.http.post(`${authConfig.apiBaseUrl}${authEndpoints.logout}`, {}, {
            headers: { Authorization: `Bearer ${token.token}` }
          })
        );
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearStoredAuth();
      this._userProfile.set(null);
      this._isAuthenticated.set(false);
      this._isLoading.set(false);
      this.router.navigate(['/']);
    }
  }

  /**
   * Verify email with verification code
   */
  async verifyEmail(request: { email: string; code: string }): Promise<void> {
    this._isLoading.set(true);
    try {
      await firstValueFrom(
        this.http.post(`${authConfig.apiBaseUrl}${authEndpoints.verify}`, request)
      );

      // Reload user profile to get updated verification status
      await this.loadUserProfile();
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode(email: string): Promise<void> {
    this._isLoading.set(true);
    try {
      await firstValueFrom(
        this.http.post(`${authConfig.apiBaseUrl}/auth/resend-verification`, { email })
      );
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    this._isLoading.set(true);
    try {
      await firstValueFrom(
        this.http.post(`${authConfig.apiBaseUrl}${authEndpoints.forgotPassword}`, { email })
      );
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Reset password with reset code
   */
  async resetPassword(code: string, newPassword: string): Promise<void> {
    this._isLoading.set(true);
    try {
      await firstValueFrom(
        this.http.post(`${authConfig.apiBaseUrl}${authEndpoints.resetPassword}`, {
          code,
          password: newPassword
        })
      );
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    const token = this.getStoredToken();
    return token && this.isTokenValid(token) ? token.token : null;
  }

  /**
   * Exchange OAuth session for JWT token
   * Used when returning from OAuth providers like Spotify/YouTube
   */
  async exchangeOAuthSession(sessionId: string, userId: string): Promise<AuthResponse> {
    this._isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${authConfig.apiBaseUrl}/auth/oauth/exchange`, {
          sessionId,
          userId
        })
      );

      this.storeAuth(response.user, response.token);
      this._userProfile.set(response.user);
      this._isAuthenticated.set(true);

      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Load user profile from backend
   */
  private async loadUserProfile(): Promise<void> {
    try {
      const token = this.getStoredToken();
      if (!token || !this.isTokenValid(token)) {
        throw new Error('No valid token');
      }

      const user = await firstValueFrom(
        this.http.get<UserProfile>(`${authConfig.apiBaseUrl}${authEndpoints.profile}`, {
          headers: { Authorization: `Bearer ${token.token}` }
        })
      );

      this._userProfile.set(user);
      this._isAuthenticated.set(true);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      this.clearStoredAuth();
      this._isAuthenticated.set(false);
    }
  }

  /**
   * Store authentication data in localStorage
   */
  private storeAuth(user: UserProfile, token: AuthToken): void {
    try {
      localStorage.setItem(authConfig.userStorageKey, JSON.stringify(user));
      localStorage.setItem(authConfig.tokenStorageKey, JSON.stringify(token));
    } catch (error) {
      console.warn('Failed to store auth data:', error);
    }
  }

  /**
   * Get stored token from localStorage
   */
  private getStoredToken(): AuthToken | null {
    try {
      const tokenStr = localStorage.getItem(authConfig.tokenStorageKey);
      return tokenStr ? JSON.parse(tokenStr) : null;
    } catch (error) {
      console.warn('Failed to parse stored token:', error);
      return null;
    }
  }

  /**
   * Check if token is valid and not expired
   */
  private isTokenValid(token: AuthToken): boolean {
    if (!token || !token.token) return false;

    const expiresAt = new Date(token.expiresAt);
    const now = new Date();
    const bufferMs = authConfig.tokenExpirationBuffer * 60 * 1000;

    return expiresAt.getTime() > (now.getTime() + bufferMs);
  }

  /**
   * Clear stored authentication data
   */
  private clearStoredAuth(): void {
    localStorage.removeItem(authConfig.userStorageKey);
    localStorage.removeItem(authConfig.tokenStorageKey);
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): void {
    console.error('Auth error:', error);

    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        // Unauthorized - clear auth and redirect to login
        this.clearStoredAuth();
        this._isAuthenticated.set(false);
        this._userProfile.set(null);
      }
    }
  }

  /**
   * Debug method to check current authentication state
   */
  debugAuthState(): void {
    console.log('=== AUTH DEBUG ===');
    console.log('isAuthenticated signal:', this._isAuthenticated());
    console.log('isLoading signal:', this._isLoading());
    console.log('userProfile signal:', this._userProfile());
    const token = this.getStoredToken();
    console.log('stored token valid:', token ? this.isTokenValid(token) : false);
    console.log('==================');
  }

  /**
   * Check if user has a valid authentication token
   */
  hasValidToken(): boolean {
    const token = this.getStoredToken();
    return token ? this.isTokenValid(token) : false;
  }

  /**
   * Manually refresh user profile
   */
  async refreshUserProfile(): Promise<void> {
    if (this.hasValidToken()) {
      await this.loadUserProfile();
    }
  }
}

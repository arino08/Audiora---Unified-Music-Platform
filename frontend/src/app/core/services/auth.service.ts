import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import {
  Observable,
  BehaviorSubject,
  tap,
  catchError,
  throwError,
  of,
} from "rxjs";
import {
  User,
  AuthState,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  OAuthExchangeRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  Provider,
  ProviderConnection,
} from "../models";
import { environment } from "../../../environments/environment";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "audiora_access_token",
  REFRESH_TOKEN: "audiora_refresh_token",
  USER: "audiora_user",
  EXPIRES_AT: "audiora_expires_at",
  SESSION_ID: "audiora_session_id",
  PROVIDER_SESSIONS: "audiora_provider_sessions",
  REDIRECT_URL: "audiora_redirect_url",
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  // Auth state using signals for reactivity
  private authStateSignal = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    expiresAt: null,
  });

  // Public readonly computed signals
  readonly isAuthenticated = computed(
    () => this.authStateSignal().isAuthenticated,
  );
  readonly currentUser = computed(() => this.authStateSignal().user);
  readonly authState = computed(() => this.authStateSignal());

  // Provider connections
  private providerConnectionsSubject = new BehaviorSubject<
    ProviderConnection[]
  >([]);
  readonly providerConnections$ =
    this.providerConnectionsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.initializeAuthState();
  }

  /**
   * Initialize auth state from localStorage on app startup
   */
  private initializeAuthState(): void {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const user = this.getStoredUser();
    const expiresAt = this.getExpiresAt();

    if (accessToken && user && expiresAt) {
      // Check if token is expired
      if (Date.now() < expiresAt) {
        this.authStateSignal.set({
          isAuthenticated: true,
          user,
          token: accessToken,
          refreshToken,
          expiresAt,
        });
      } else if (refreshToken) {
        // Token expired but we have refresh token, try to refresh
        this.refreshAccessToken(refreshToken).subscribe({
          error: () => this.clearAuthState(),
        });
      } else {
        this.clearAuthState();
      }
    }

    // Load provider connections
    this.loadProviderConnections();
  }

  // ============================================================================
  // Authentication Methods
  // ============================================================================

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => this.handleAuthError(error)),
      );
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error)),
    );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    // Call logout endpoint if authenticated
    if (this.isAuthenticated()) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        error: () => {}, // Ignore errors on logout
      });
    }

    this.clearAuthState();
    this.router.navigate(["/login"]);
  }

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/verify`, {
      token,
    });
  }

  /**
   * Resend verification email
   */
  resendVerification(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/resend-verification`,
      { email },
    );
  }

  /**
   * Request password reset
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email },
    );
  }

  /**
   * Reset password with token
   */
  resetPassword(data: PasswordResetConfirm): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      data,
    );
  }

  /**
   * Refresh access token
   */
  refreshAccessToken(refreshToken: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          this.clearAuthState();
          return throwError(() => error);
        }),
      );
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap((user) => {
        this.authStateSignal.update((state) => ({ ...state, user }));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }),
    );
  }

  // ============================================================================
  // OAuth Methods
  // ============================================================================

  /**
   * Initiate OAuth flow for a provider
   */
  initiateOAuth(provider: Provider): void {
    // Generate a unique state for CSRF protection
    const state = this.generateRandomString(32);
    sessionStorage.setItem(`oauth_state_${provider}`, state);

    // Build the correct OAuth login URL based on provider
    // Backend endpoints are: /api/auth/spotify/login, /api/auth/youtube/login, /api/auth/google/login
    const loginEndpoint =
      provider === "spotify"
        ? "/api/auth/spotify/login"
        : provider === "youtube"
          ? "/api/auth/youtube/login"
          : "/api/auth/google/login";

    // First, fetch the auth URL from the backend, then redirect
    this.http
      .get<{ authUrl: string }>(`${environment.apiUrl}${loginEndpoint}`, {
        params: { sessionId: state },
      })
      .subscribe({
        next: (response) => {
          // Store session for callback handling
          sessionStorage.setItem("audiora_session_id", state);
          sessionStorage.setItem("oauth_provider", provider);
          // Redirect to provider's OAuth page
          window.location.href = response.authUrl;
        },
        error: (err) => {
          console.error(`Failed to initiate ${provider} OAuth:`, err);
        },
      });
  }

  /**
   * Exchange OAuth callback data for JWT tokens
   */
  exchangeOAuthToken(data: OAuthExchangeRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/oauth/exchange`, data)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => this.handleAuthError(error)),
      );
  }

  /**
   * Handle OAuth callback from provider
   */
  handleOAuthCallback(
    provider: Provider,
    sessionId: string,
    userId: string,
  ): Observable<AuthResponse> {
    // Verify state if available
    const savedState = sessionStorage.getItem(`oauth_state_${provider}`);
    sessionStorage.removeItem(`oauth_state_${provider}`);

    // Store session ID for provider API calls
    this.storeProviderSession(provider, sessionId);

    // Exchange for JWT
    return this.exchangeOAuthToken({ sessionId, userId, provider });
  }

  /**
   * Connect additional provider to existing account
   */
  connectProvider(provider: Provider): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(["/login"]);
      return;
    }

    const state = this.generateRandomString(32);
    sessionStorage.setItem(`oauth_state_${provider}`, state);

    // Build the correct OAuth login URL based on provider
    // Backend endpoints are: /api/auth/spotify/login, /api/auth/youtube/login, /api/auth/google/login
    const loginEndpoint =
      provider === "spotify"
        ? "/api/auth/spotify/login"
        : provider === "youtube"
          ? "/api/auth/youtube/login"
          : "/api/auth/google/login";

    // Fetch the auth URL from backend, then redirect
    this.http
      .get<{ authUrl: string }>(`${environment.apiUrl}${loginEndpoint}`, {
        params: { sessionId: state },
      })
      .subscribe({
        next: (response) => {
          sessionStorage.setItem("audiora_session_id", state);
          sessionStorage.setItem("oauth_provider", provider);
          window.location.href = response.authUrl;
        },
        error: (err) => {
          console.error(`Failed to connect ${provider}:`, err);
        },
      });
  }

  /**
   * Disconnect a provider
   */
  disconnectProvider(provider: Provider): Observable<void> {
    const sessionId = this.getProviderSession(provider);
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers["X-Session-Id"] = sessionId;
    }
    return this.http
      .delete<void>(`${this.apiUrl}/oauth/${provider}/disconnect`, { headers })
      .pipe(
        tap(() => {
          this.removeProviderSession(provider);
          this.updateProviderConnection(provider, false);
        }),
      );
  }

  // ============================================================================
  // Token Management
  // ============================================================================

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Set tokens in storage
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  /**
   * Get session ID for provider API calls
   */
  getSessionId(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticatedSync(): boolean {
    const token = this.getAccessToken();
    const expiresAt = this.getExpiresAt();

    if (!token || !expiresAt) {
      return false;
    }

    return Date.now() < expiresAt;
  }

  // ============================================================================
  // Redirect URL Management
  // ============================================================================

  /**
   * Set redirect URL for after login
   */
  setRedirectUrl(url: string): void {
    sessionStorage.setItem(STORAGE_KEYS.REDIRECT_URL, url);
  }

  /**
   * Get and clear redirect URL
   */
  getAndClearRedirectUrl(): string | null {
    const url = sessionStorage.getItem(STORAGE_KEYS.REDIRECT_URL);
    sessionStorage.removeItem(STORAGE_KEYS.REDIRECT_URL);
    return url;
  }

  // ============================================================================
  // Provider Session Management
  // ============================================================================

  /**
   * Store provider session ID
   */
  storeProviderSession(provider: Provider, sessionId: string): void {
    const sessions = this.getProviderSessions();
    sessions[provider] = sessionId;
    localStorage.setItem(
      STORAGE_KEYS.PROVIDER_SESSIONS,
      JSON.stringify(sessions),
    );
    this.updateProviderConnection(provider, true, sessionId);
  }

  /**
   * Get provider session ID
   */
  getProviderSession(provider: Provider): string | null {
    const sessions = this.getProviderSessions();
    return sessions[provider] || null;
  }

  /**
   * Remove provider session
   */
  removeProviderSession(provider: Provider): void {
    const sessions = this.getProviderSessions();
    delete sessions[provider];
    localStorage.setItem(
      STORAGE_KEYS.PROVIDER_SESSIONS,
      JSON.stringify(sessions),
    );
  }

  /**
   * Get all provider sessions
   */
  private getProviderSessions(): Record<string, string> {
    const sessionsJson = localStorage.getItem(STORAGE_KEYS.PROVIDER_SESSIONS);
    return sessionsJson ? JSON.parse(sessionsJson) : {};
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    const expiresAt = Date.now() + response.expiresIn * 1000;

    // Store tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

    // Update auth state
    this.authStateSignal.set({
      isAuthenticated: true,
      user: response.user,
      token: response.token,
      refreshToken: response.refreshToken,
      expiresAt,
    });

    // Navigate to redirect URL or home
    const redirectUrl = this.getAndClearRedirectUrl();
    this.router.navigate([redirectUrl || "/"]);
  }

  /**
   * Handle authentication error
   */
  private handleAuthError(error: any): Observable<never> {
    console.error("Authentication error:", error);
    return throwError(() => error);
  }

  /**
   * Clear all auth state
   */
  private clearAuthState(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);

    this.authStateSignal.set({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
    });
  }

  /**
   * Get stored user from localStorage
   */
  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Get token expiration time
   */
  private getExpiresAt(): number | null {
    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  /**
   * Load provider connections from storage
   */
  private loadProviderConnections(): void {
    const sessions = this.getProviderSessions();
    const connections: ProviderConnection[] = [
      {
        provider: "spotify",
        connected: !!sessions["spotify"],
        sessionId: sessions["spotify"],
      },
      {
        provider: "youtube",
        connected: !!sessions["youtube"],
        sessionId: sessions["youtube"],
      },
    ];
    this.providerConnectionsSubject.next(connections);
  }

  /**
   * Update a provider connection status
   */
  private updateProviderConnection(
    provider: Provider,
    connected: boolean,
    sessionId?: string,
  ): void {
    const connections = this.providerConnectionsSubject.getValue();
    const index = connections.findIndex((c) => c.provider === provider);

    if (index >= 0) {
      connections[index] = { ...connections[index], connected, sessionId };
    } else {
      connections.push({ provider, connected, sessionId });
    }

    this.providerConnectionsSubject.next([...connections]);
  }

  // ============================================================================
  // Provider Status Methods
  // ============================================================================

  /**
   * Check if a provider is connected
   */
  isProviderConnected(provider: Provider): boolean {
    return !!this.getProviderSession(provider);
  }

  /**
   * Initiate OAuth flow for a provider and return the auth URL
   */
  initiateOAuthFlow(provider: Provider): Observable<{ authUrl: string }> {
    const endpoint =
      provider === "spotify"
        ? "/spotify/login"
        : provider === "youtube"
          ? "/youtube/login"
          : "/google/login";

    const sessionId = this.getSessionId() || this.generateRandomString(32);

    return this.http
      .get<{
        authUrl: string;
      }>(`${this.apiUrl}${endpoint}`, { params: { sessionId } })
      .pipe(
        tap(() => {
          // Store the session ID for callback handling
          sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
          sessionStorage.setItem(`oauth_provider`, provider);
        }),
      );
  }

  /**
   * Generate random string for OAuth state
   */
  private generateRandomString(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    return result;
  }
}

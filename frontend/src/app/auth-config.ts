// Simple auth configuration for email/password authentication
export interface AuthConfig {
  apiBaseUrl: string;
  tokenStorageKey: string;
  userStorageKey: string;
  tokenExpirationBuffer: number; // minutes before expiration to refresh
}

export const authConfig: AuthConfig = {
  // Backend API base URL
  apiBaseUrl: `http://${window.location.hostname}:8080/api`,

  // Local storage keys
  tokenStorageKey: 'audiora_auth_token',
  userStorageKey: 'audiora_user_profile',

  // Refresh token 5 minutes before expiration
  tokenExpirationBuffer: 5
};

// API endpoints for authentication
export const authEndpoints = {
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  verify: '/auth/verify',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  profile: '/auth/profile'
};

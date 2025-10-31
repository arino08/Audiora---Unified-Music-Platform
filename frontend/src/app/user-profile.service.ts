import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = environment.apiUrl;

  // Signal to hold current profile
  currentProfile = signal<UserProfile | null>(null);

  // Signal to indicate loading state
  isLoading = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get authentication headers with JWT token
   */
  private getAuthHeaders(): HttpHeaders {
    const tokenStr = localStorage.getItem('audiora_auth_token');
    if (!tokenStr) {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }

    let token = '';

    try {
      // Try to parse as JSON object first (AuthToken format)
      const tokenObj = JSON.parse(tokenStr);
      token = tokenObj.token || tokenObj; // If it has .token property, use it, otherwise use the whole object
    } catch (error) {
      // If parsing fails, it's likely a plain JWT string
      token = tokenStr;
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Fetch the current user's profile from the backend
   */
  getProfile(): Observable<UserProfile> {
    this.isLoading.set(true);

    const headers = this.getAuthHeaders();

    // Debug: log if we have auth token
    const hasAuth = headers.has('Authorization');
    if (!hasAuth) {
      console.warn('No authorization token found when fetching profile');
    }

    return this.http.get<UserProfile>(`${this.apiUrl}/profile`, {
      headers
    }).pipe(
      tap(profile => {
        this.currentProfile.set(profile);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('Error fetching profile:', error);
        if (error.status === 401) {
          console.error('Authentication failed. Token may be missing or invalid.');
          console.error('Stored token:', localStorage.getItem('audiora_auth_token'));
        }
        return throwError(() => error);
      })
    );
  }  /**
   * Update the current user's profile
   */
  updateProfile(updates: ProfileUpdateRequest): Observable<UserProfile> {
    this.isLoading.set(true);

    return this.http.put<UserProfile>(`${this.apiUrl}/profile`, updates, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(profile => {
        this.currentProfile.set(profile);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('Error updating profile:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get user preferences as JSON object
   */
  getPreferences(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/preferences`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching preferences:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/preferences`, preferences, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error updating preferences:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if a username is available
   */
  checkUsernameAvailability(username: string): Observable<boolean> {
    // This would need a dedicated endpoint, for now we'll try to update and catch errors
    const currentProfile = this.currentProfile();
    if (currentProfile && currentProfile.username === username) {
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }

    // Could implement a dedicated check endpoint later
    return new Observable(observer => {
      observer.next(true); // Assume available, validation happens on save
      observer.complete();
    });
  }

  /**
   * Clear profile data (useful on logout)
   */
  clearProfile(): void {
    this.currentProfile.set(null);
  }
}

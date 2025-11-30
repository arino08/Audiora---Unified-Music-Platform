import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// Track if we're currently refreshing the token
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Skip auth header for certain endpoints
  const skipAuthUrls = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify',
    '/api/auth/resend-verification',
    '/api/health'
  ];

  const shouldSkipAuth = skipAuthUrls.some(url => req.url.includes(url));

  if (shouldSkipAuth) {
    return next(req);
  }

  // Get the current access token
  const accessToken = authService.getAccessToken();

  // Clone and add auth header if we have a token
  let authReq = req;
  if (accessToken) {
    authReq = addTokenToRequest(req, accessToken);
  }

  // Add session ID for provider APIs (Spotify, YouTube)
  const sessionId = authService.getSessionId();
  if (sessionId && (req.url.includes('/api/spotify') || req.url.includes('/api/youtube'))) {
    authReq = authReq.clone({
      setHeaders: {
        'X-Session-Id': sessionId
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (error.status === 401 && !shouldSkipAuth) {
        return handle401Error(authReq, next, authService);
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        console.error('Access forbidden:', error.message);
        // Could navigate to an access denied page
      }

      // Handle other errors
      return throwError(() => error);
    })
  );
};

/**
 * Add the JWT token to the request headers
 */
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Handle 401 errors by attempting to refresh the token
 */
function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authService.getRefreshToken();

    if (refreshToken) {
      return authService.refreshAccessToken(refreshToken).pipe(
        switchMap((response: any) => {
          isRefreshing = false;

          // Store the new tokens
          authService.setTokens(response.accessToken, response.refreshToken);
          refreshTokenSubject.next(response.accessToken);

          // Retry the original request with the new token
          return next(addTokenToRequest(req, response.accessToken));
        }),
        catchError((err) => {
          isRefreshing = false;
          refreshTokenSubject.next(null);

          // Refresh failed, logout the user
          authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // No refresh token available, logout
      isRefreshing = false;
      authService.logout();
      return throwError(() => new Error('No refresh token available'));
    }
  }

  // If we're already refreshing, wait for the new token
  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(addTokenToRequest(req, token!)))
  );
}

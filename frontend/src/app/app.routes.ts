import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Audiora - Home',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Audiora - Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Audiora - Register',
  },
  {
    path: 'verify',
    loadComponent: () =>
      import('./features/auth/verify/verify.component').then(
        (m) => m.VerifyComponent
      ),
    title: 'Audiora - Verify Email',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
    title: 'Audiora - Forgot Password',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
    title: 'Audiora - Reset Password',
  },
  {
    path: 'oauth/callback',
    loadComponent: () =>
      import('./features/auth/oauth-callback/oauth-callback.component').then(
        (m) => m.OAuthCallbackComponent
      ),
    title: 'Audiora - Connecting...',
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then(
        (m) => m.SearchComponent
      ),
    title: 'Audiora - Search',
  },
  {
    path: 'library',
    loadComponent: () =>
      import('./features/library/library.component').then(
        (m) => m.LibraryComponent
      ),
    title: 'Audiora - Library',
  },
  {
    path: 'liked',
    loadComponent: () =>
      import('./features/liked/liked.component').then((m) => m.LikedComponent),
    title: 'Audiora - Liked Songs',
  },
  {
    path: 'playlist/:id',
    loadComponent: () =>
      import('./features/playlist/playlist.component').then(
        (m) => m.PlaylistComponent
      ),
    title: 'Audiora - Playlist',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    title: 'Audiora - Profile',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    title: 'Audiora - Settings',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

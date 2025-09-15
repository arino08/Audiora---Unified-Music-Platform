import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([]), // Add routing support for OAuth redirects
    importProvidersFrom(
      OAuthModule.forRoot({
        resourceServer: {
          allowedUrls: ['http://localhost:8080/api'], // Allow OAuth tokens for backend API calls
          sendAccessToken: true
        }
      })
    )
  ]
}).catch(err => console.error(err));

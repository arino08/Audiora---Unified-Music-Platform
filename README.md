# Audiora

 Unified music aggregation platform (Phase 1: Spotify + YouTube) built with:
 - Backend: Spring Boot (Java 21)
 - Frontend: Angular 18 (standalone components) via Angular CLI

## Vision
Bring multiple streaming platforms into a single interface where a user can:
1. Connect accounts (Spotify, YouTube Music first, later others)
2. View and merge playlists
3. Search across platforms
4. Play tracks (respecting ToS and using platform playback SDKs where required)
5. Create unified smart playlists referencing tracks from different sources

## Phase Roadmap
| Phase | Goal | Key Features |
|-------|------|--------------|
| 1 | Auth Foundations | OAuth login for Spotify + YouTube (read-only playlists) |
| 2 | Playlist Fetch | Retrieve user playlists + list tracks per playlist |
| 3 | Unified Library Model | Normalized track + artist + playlist domain model, caching layer |
| 4 | Cross-Platform Search | Search across connected sources concurrently |
| 5 | Playback Integration | Spotify Web Playback SDK + YouTube embedded player orchestration |
| 6 | Unified Playlist Builder | Create composite playlists + export back to origin services where allowed |
| 7 | Additional Providers | Gaana, Apple Music, etc. (subject to public APIs / SDKs) |
| 8 | Advanced Features | Recommendations, dedupe, sync scheduler, social sharing |

## Tech Decisions
- Keep backend stateless; tokens stored (later encrypted persistence / user store). For now in-memory (development only).
- Use service interface per provider (e.g., `SpotifyService`, `YouTubeService`).
- Future: Introduce persistence (PostgreSQL) + Redis cache for heavy playlist queries.
- Frontend uses signals (Angular >=16) for simple reactive state until state complexity warrants a lightweight store.

## Security & Compliance Notes
- Never cache raw media streams; rely on official playback mechanisms (e.g., Spotify SDK, YouTube iframe API).
- Respect rate limits; implement exponential backoff.
- Provide explicit user controls for disconnecting providers and revoking tokens.

## Setup
### Prerequisites
- Java 21
- Maven 3.9+
- Node 20+

### Environment Variables (development)
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
YOUTUBE_CLIENT_ID=your_google_oauth_client_id
YOUTUBE_CLIENT_SECRET=your_google_oauth_client_secret
# Spotify now disallows 'localhost' hostnames; use explicit loopback IP
BACKEND_BASE_URL=http://127.0.0.1:8080
```

Redirect URI(s) to register with providers:

```
http://127.0.0.1:8080/auth/spotify/callback  (Spotify: 'localhost' forbidden)
http://127.0.0.1:8080/auth/youtube/callback  (YouTube: localhost allowed but we align tooling)
```

### Backend Run
Inside `backend`:
```
mvn spring-boot:run
```
Health: http://127.0.0.1:8080/api/health

### Frontend Run
Inside `frontend`:
```
npm install
npm start   # runs ng serve
```
App: http://localhost:4200 (also accessible via http://127.0.0.1:4200)

### Current Auth Flow (Implemented Prototype)
1. Frontend calls `/auth/{provider}/login` to receive provider authorize URL.
2. User consents and provider redirects to backend callback.
3. Backend exchanges code for access + refresh tokens and issues a generated session UUID (development only) returned in the callback response body.
4. Tokens are kept in-memory keyed by session ID. (Planned: persistence + refresh handling.)

## Next Implementation Steps
- Playlist retrieval endpoints (Spotify & YouTube) using stored tokens.
- Frontend: capture session ID post-auth (URL param or UI flow) & display playlists.
- Token refresh handling before expiry.
- README section on testing + future persistence.
- Add basic unit tests for token exchange + store.

## Contributing Guidelines (Early)
- Keep provider-specific code isolated under `service/provider` package.
- Add unit tests for token exchange logic once implemented.
- Avoid leaking secrets to logs.

## License
Currently unlicensed (private development). Add proper license before any public distribution.

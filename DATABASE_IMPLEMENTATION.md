# PostgreSQL Database Implementation Guide

## ✅ Completed Steps

### 1. Database Dependencies Added
**File:** `backend/pom.xml`

Added dependencies:
- `spring-boot-starter-data-jpa` - JPA/Hibernate support
- `postgresql` - PostgreSQL driver (runtime)
- `h2` - H2 in-memory database for dev/testing (runtime)
- `hibernate-core` - Hibernate ORM

### 2. Database Configuration
**File:** `backend/src/main/resources/application.yaml`

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:audiora  # H2 for development
    username: sa
    password:
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: update  # Auto-create/update tables
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.H2Dialect
  h2:
    console:
      enabled: true  # Access at http://localhost:8080/h2-console
      path: /h2-console
```

**For PostgreSQL in production**, update `.env`:
```properties
DATABASE_URL=jdbc:postgresql://localhost:5432/audiora
DATABASE_USERNAME=audiora_user
DATABASE_PASSWORD=your_secure_password
DATABASE_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

### 3. Entity Models Created

#### User Entity
**File:** `backend/src/main/java/com/audiora/model/User.java`

Upgraded existing User class to JPA entity with:
- UUID primary key
- Email, username, displayName fields
- Bio (TEXT field for user description)
- Avatar URL
- Spotify & YouTube user ID linking
- Preferences (JSON as TEXT - theme, settings, etc.)
- Created/updated timestamps (auto-managed)

#### LikedTrack Entity
**File:** `backend/src/main/java/com/audiora/model/LikedTrack.java`

Upgraded to JPA entity with:
- UUID primary key
- User ID foreign key
- Provider (SPOTIFY/YOUTUBE enum)
- Track ID, title, artist, album, image
- Liked timestamp
- Unique constraint: user can't like same track twice

### 4. Repositories Created

#### UserRepository
**File:** `backend/src/main/java/com/audiora/repository/UserRepository.java`

Spring Data JPA repository with methods:
- `findByEmail(String email)`
- `findByUsername(String username)`
- `findBySpotifyUserId(String spotifyUserId)`
- `findByYoutubeUserId(String youtubeUserId)`
- `existsByEmail(String email)`
- `existsByUsername(String username)`

#### LikedTrackRepository
**File:** `backend/src/main/java/com/audiora/repository/LikedTrackRepository.java`

Methods:
- `findByUserIdOrderByLikedAtDesc(UUID userId)`
- `findByUserIdAndProviderOrderByLikedAtDesc(UUID userId, Provider provider)`
- `findByUserIdAndProviderAndTrackId(...)` - Check if liked
- `existsByUserIdAndProviderAndTrackId(...)` - Quick check
- `countByUserId(UUID userId)` - Total likes
- `deleteByUserIdAndProviderAndTrackId(...)` - Unlike

## 📋 Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    name VARCHAR(100),
    display_name VARCHAR(100),
    bio TEXT,
    picture VARCHAR(500),  -- Avatar URL
    given_name VARCHAR(100),
    family_name VARCHAR(100),
    email_verified BOOLEAN NOT NULL,
    password_hash VARCHAR(255),
    verification_code VARCHAR(100),
    verification_code_expiry TIMESTAMP,
    spotify_user_id VARCHAR(100),
    youtube_user_id VARCHAR(100),
    preferences TEXT,  -- JSON: {"theme": "dark", "autoQueue": true}
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_login_at TIMESTAMP
);

-- Liked tracks table
CREATE TABLE liked_tracks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    provider VARCHAR(20) NOT NULL,  -- 'SPOTIFY' or 'YOUTUBE'
    track_id VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    artist VARCHAR(255),
    album VARCHAR(255),
    image_url VARCHAR(500),
    external_url VARCHAR(500),
    liked_at TIMESTAMP NOT NULL,
    UNIQUE(user_id, provider, track_id)
);

-- Indexes for performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_spotify_user_id ON users(spotify_user_id);
CREATE INDEX idx_youtube_user_id ON users(youtube_user_id);
CREATE INDEX idx_user_id ON liked_tracks(user_id);
CREATE INDEX idx_provider_track ON liked_tracks(provider, track_id);
CREATE INDEX idx_liked_at ON liked_tracks(liked_at);
```

## 🚧 Next Steps (Not Completed Yet)

### 5. Migrate UserService
**Current Issue:** `UserService.java` uses in-memory `ConcurrentHashMap` for storage.

**Migration needed:**
1. Inject `UserRepository` instead of `ConcurrentHashMap`
2. Update all methods to use repository
3. Keep existing business logic (password hashing, email verification)
4. Example:
   ```java
   // OLD
   users.put(userId, newUser);

   // NEW
   userRepository.save(newUser);
   ```

### 6. Create User Profile Controller
**File to create:** `backend/src/main/java/com/audiora/controller/UserProfileController.java`

Endpoints needed:
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update profile (displayName, bio, avatar)
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update preferences
- `POST /api/user/avatar` - Upload avatar image

### 7. Frontend Components
**Files to create:**

1. **User Profile Service** (`frontend/src/app/user-profile.service.ts`)
   - API calls to backend
   - Profile state management

2. **Profile View Component** (`frontend/src/app/profile-view.component.ts`)
   - Display user profile
   - Show stats (liked tracks count, playlists, etc.)

3. **Profile Edit Component** (`frontend/src/app/profile-edit.component.ts`)
   - Edit username, display name, bio
   - Upload avatar
   - Update preferences

4. **Avatar Upload Component**
   - Image upload with preview
   - Crop/resize functionality

## 🗄️ PostgreSQL Setup Instructions

### Local Development

1. **Install PostgreSQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib

   # macOS
   brew install postgresql
   ```

2. **Start PostgreSQL:**
   ```bash
   sudo systemctl start postgresql
   ```

3. **Create Database:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE audiora;
   CREATE USER audiora_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE audiora TO audiora_user;
   \q
   ```

4. **Update .env:**
   ```properties
   SPRING_PROFILE=prod
   DATABASE_URL=jdbc:postgresql://localhost:5432/audiora
   DATABASE_USERNAME=audiora_user
   DATABASE_PASSWORD=your_password
   DATABASE_DRIVER=org.postgresql.Driver
   HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
   ```

### Using H2 (Current Default)

No setup needed! H2 runs in-memory. Access console:
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:audiora`
- Username: `sa`
- Password: (leave blank)

## 📝 User Preferences JSON Schema

```json
{
  "theme": "dark",           // Selected theme name
  "autoQueue": true,         // Radio mode enabled
  "defaultProvider": "spotify",
  "volume": 0.7,
  "repeatMode": "none",      // none, one, all
  "shuffleEnabled": false,
  "notificationsEnabled": true,
  "language": "en"
}
```

## 🔐 Avatar Upload Strategy

**Option 1: Store URLs (Recommended)**
- Upload to external service (AWS S3, Cloudinary, Imgur)
- Store URL in database
- Pros: Scalable, CDN support
- Cons: External dependency

**Option 2: Store as Base64**
- Convert image to base64 string
- Store directly in database
- Pros: Simple, no external deps
- Cons: Large database size

**Option 3: File System**
- Save files to server disk
- Store file path in database
- Pros: No external service
- Cons: Not cloud-friendly, backup issues

## 🎯 Profile Customization Features

1. **Username** - Unique identifier (check availability)
2. **Display Name** - Shown in UI
3. **Bio** - User description (max 500 chars)
4. **Avatar** - Profile picture URL
5. **Theme** - Saved in preferences
6. **Linked Accounts** - Spotify & YouTube IDs
7. **Statistics** - Total likes, playlists, listening time

## 🔧 Build & Run

```bash
# Build backend
cd backend
mvn clean install

# Run with H2 (default)
mvn spring-boot:run

# Run with PostgreSQL
SPRING_PROFILE=prod mvn spring-boot:run
```

Access:
- Backend: http://localhost:8080
- H2 Console: http://localhost:8080/h2-console
- Frontend: http://localhost:4200

## ⚠️ Important Notes

1. **Data Migration:** If switching from in-memory to database, existing user data will be lost. Implement data migration if needed.

2. **UUID vs String IDs:** Changed from String to UUID for better performance and security.

3. **Breaking Changes:** Existing code using `String` user IDs needs to be updated to `UUID`.

4. **Hibernate `ddl-auto`:** Set to `update` for dev. Use `validate` or `none` in production with proper migrations (Flyway/Liquibase).

5. **Transactions:** Use `@Transactional` for database operations that modify data.

## 📚 Additional Entities to Consider

Future enhancements:

- **Playlist** - User-created playlists
- **PlaylistTrack** - Tracks in playlists
- **ListeningHistory** - Track playback history
- **UserSettings** - Separate table for complex settings
- **FollowedArtists** - Artists the user follows
- **UserActivity** - Activity feed/logs

Would you like me to complete any specific part of this implementation?

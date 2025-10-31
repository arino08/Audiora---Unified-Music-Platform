# ✅ RENDER YAML FIX - Docker Configuration

## Problem
Render doesn't support `runtime: java` directly. We need to use Docker.

## Solution Applied

### 1. Updated `render.yaml`
Changed from `runtime: java` to `env: docker`

### 2. Created `backend/Dockerfile`
Multi-stage Docker build:
- **Build stage**: Uses Maven to compile your Spring Boot app
- **Run stage**: Uses lightweight JRE to run the JAR file

### 3. Created `backend/.dockerignore`
Optimizes Docker build by excluding unnecessary files

## 🚀 Deploy Now

```bash
# Commit the Docker files
git add render.yaml backend/Dockerfile backend/.dockerignore
git commit -m "Add Docker configuration for Render deployment"
git push origin main
```

## Render Blueprint Steps

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Blueprint"**
4. Select repository: `arino08/Audiora---Unified-Music-Platform`
5. Render detects `render.yaml` ✅
6. Click **"Apply"**

## Environment Variables to Set in Render

After Blueprint creates your services, add these environment variables:

### Required:
- `BACKEND_BASE_URL`: Will be provided after deployment (like `https://audiora-backend.onrender.com`)
- `FRONTEND_BASE_URL`: Your Vercel URL (add after frontend deployment)
- `SPOTIFY_CLIENT_ID`: From Spotify Developer Dashboard
- `SPOTIFY_CLIENT_SECRET`: From Spotify Developer Dashboard
- `YOUTUBE_CLIENT_ID`: From Google Cloud Console
- `YOUTUBE_CLIENT_SECRET`: From Google Cloud Console

### Optional (Email):
- `EMAIL_USERNAME`: Your Gmail
- `EMAIL_PASSWORD`: Gmail App Password
- `EMAIL_FROM`: noreply@audiora.com

## What Happens During Deployment

1. **Render pulls your code**
2. **Docker builds in `backend/` directory** (due to `rootDir: backend`)
3. **Maven compiles your Spring Boot app** (inside Docker)
4. **Creates optimized Docker image**
5. **Runs on port 8080** (Render auto-detects)
6. **PostgreSQL database created automatically** (from render.yaml)

## First Deployment Notes

⏱️ **First build takes 5-10 minutes** (Maven downloads dependencies)

🔄 **Subsequent builds are faster** (Docker caching)

💤 **Free tier sleeps after 15 min inactivity** (First request wakes it up in ~30 seconds)

## Troubleshooting

### Build fails with "runtime: java" error
✅ **Fixed!** Now using `env: docker`

### Docker build timeout
- Check Render build logs
- Verify `pom.xml` is valid
- Ensure Java 21 compatibility

### Application doesn't start
- Check that jar name matches in Dockerfile: `audiora-backend-0.0.1-SNAPSHOT.jar`
- Verify environment variables are set
- Check logs in Render dashboard

### Database connection fails
- Wait for PostgreSQL provisioning (happens automatically)
- Verify DATABASE_URL env var is set by Render
- Check Hibernate dialect is PostgreSQL

## Next Steps

After backend deploys successfully:

1. ✅ Copy your backend URL from Render
2. Update `frontend/src/environments/environment.prod.ts` with backend URL
3. Deploy frontend to Vercel
4. Update `FRONTEND_BASE_URL` in Render
5. Update OAuth redirect URIs in Spotify & Google
6. Test! 🎉

---

**Ready?** Commit and push, then head to Render! 🚀

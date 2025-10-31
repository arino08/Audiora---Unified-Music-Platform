# Audiora Deployment Guide

## 🚀 Deployment Steps

### Part 1: Deploy Backend to Render (First!)

#### Step 1: Prepare Your Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Add deployment configuration for Render and Vercel"
git push origin main
```

#### Step 2: Sign Up & Connect to Render
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository: `arino08/Audiora---Unified-Music-Platform`
5. Render will detect `backend/render.yaml`

#### Step 3: Configure Environment Variables
In Render dashboard, set these environment variables:

**Required:**
- `BACKEND_BASE_URL`: `https://your-app-name.onrender.com` (you'll see this after creating)
- `FRONTEND_BASE_URL`: (leave empty for now, update after deploying frontend)
- `SPOTIFY_CLIENT_ID`: Your Spotify app client ID
- `SPOTIFY_CLIENT_SECRET`: Your Spotify app client secret
- `YOUTUBE_CLIENT_ID`: Your Google OAuth client ID
- `YOUTUBE_CLIENT_SECRET`: Your Google OAuth client secret

**Email (Optional):**
- `EMAIL_USERNAME`: Your Gmail address
- `EMAIL_PASSWORD`: Your Gmail app password
- `EMAIL_FROM`: noreply@audiora.com (or your email)

#### Step 4: Deploy Backend
1. Click "Apply" or "Create Blueprint"
2. Wait for deployment (5-10 minutes for first deploy)
3. Copy your backend URL: `https://audiora-backend-xxxx.onrender.com`

---

### Part 2: Deploy Frontend to Vercel

#### Step 1: Update Frontend Environment
1. Open `frontend/src/environments/environment.prod.ts`
2. Replace `your-backend-url.onrender.com` with your actual Render URL
3. Commit and push:
```bash
git add frontend/src/environments/environment.prod.ts
git commit -m "Update production API URL"
git push origin main
```

#### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Or use Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Framework Preset: Angular
6. Click "Deploy"

#### Step 3: Get Your Frontend URL
After deployment, you'll get a URL like: `https://audiora.vercel.app`

---

### Part 3: Update Configuration

#### Step 1: Update Backend with Frontend URL
1. Go back to Render dashboard
2. Find your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_BASE_URL` with your Vercel URL: `https://audiora.vercel.app`
5. Save changes (backend will redeploy automatically)

#### Step 2: Update OAuth Redirect URIs

**Spotify Developer Dashboard:**
1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Open your app
3. Click "Edit Settings"
4. Add Redirect URIs:
   - `https://audiora.vercel.app/callback`
   - `https://audiora-backend-xxxx.onrender.com/login/oauth2/code/spotify`
5. Save

**Google Cloud Console:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client
4. Add Authorized redirect URIs:
   - `https://audiora.vercel.app/callback`
   - `https://audiora-backend-xxxx.onrender.com/login/oauth2/code/google`
5. Save

---

### Part 4: Test Your Deployment

1. Visit your Vercel URL: `https://audiora.vercel.app`
2. Try logging in with Spotify/YouTube
3. Check browser console for errors
4. Test API calls

---

## 🔧 Troubleshooting

### Backend Issues:
- **Build fails**: Check Maven logs in Render dashboard
- **Database connection**: Verify PostgreSQL database is created
- **Environment variables**: Make sure all required vars are set

### Frontend Issues:
- **CORS errors**: Check FRONTEND_BASE_URL matches your Vercel URL
- **API connection fails**: Verify backend URL in environment.prod.ts
- **404 on refresh**: Vercel should handle this with vercel.json rewrites

### OAuth Issues:
- **Redirect mismatch**: Double-check redirect URIs in Spotify/Google dashboards
- **CSRF errors**: Make sure credentials are correct

---

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Render: Backend sleeps after 15 min of inactivity (first request takes ~30 seconds)
   - PostgreSQL: 90-day free trial, then needs upgrade

2. **Costs (if exceeded):**
   - Render: $7/month for always-on instance
   - Vercel: Free for hobby projects

3. **Database Migration:**
   - Your app uses H2 (in-memory) locally but PostgreSQL on Render
   - JPA will auto-create tables on first run

4. **Security:**
   - Never commit secrets to Git
   - Use Render's environment variables
   - Enable HTTPS (automatic on both platforms)

---

## 🎯 Quick Commands Reference

```bash
# Backend (from backend directory)
mvn clean package -DskipTests    # Build locally
mvn spring-boot:run              # Run locally

# Frontend (from frontend directory)
npm install                      # Install dependencies
npm start                        # Run locally (dev)
npm run build                    # Build for production
vercel --prod                    # Deploy to Vercel

# Git
git add .
git commit -m "Your message"
git push origin main
```

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL obtained
- [ ] Frontend environment.prod.ts updated with backend URL
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL obtained
- [ ] Backend FRONTEND_BASE_URL updated with Vercel URL
- [ ] Spotify redirect URIs updated
- [ ] Google redirect URIs updated
- [ ] Test login with Spotify
- [ ] Test login with YouTube
- [ ] Verify API calls work
- [ ] Check browser console for errors

---

Good luck with your deployment! 🚀

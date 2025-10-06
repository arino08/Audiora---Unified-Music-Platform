# 🚨 SECURITY INCIDENT RESPONSE - EXPOSED CREDENTIALS

**Date:** October 6, 2025
**Severity:** CRITICAL
**Status:** ACTION REQUIRED

---

## ⚠️ IMMEDIATE ACTIONS REQUIRED

Your `.env` file containing real credentials has been exposed in the git repository. Follow these steps **immediately**:

---

## Step 1: Rotate Gmail App Password (URGENT)

### Current Exposed Credentials:
- **Email:** arinopc22@gmail.com
- **App Password:** roxztwenzzwjnojq

### Actions:
1. **Revoke the exposed app password:**
   ```
   1. Go to https://myaccount.google.com/apppasswords
   2. Sign in to arinopc22@gmail.com
   3. Find "Audiora" or the app password created around the project start date
   4. Click "Remove" or "Delete"
   ```

2. **Generate a new app password:**
   ```
   1. Visit https://myaccount.google.com/apppasswords
   2. Select "Mail" and "Other (Custom name)"
   3. Enter "Audiora Backend"
   4. Click "Generate"
   5. Copy the 16-character password
   6. Update backend/.env with new password
   ```

3. **Verify 2-Step Verification is enabled:**
   - App passwords require 2FA to be enabled
   - Visit https://myaccount.google.com/security

---

## Step 2: Rotate Spotify API Credentials (URGENT)

### Current Exposed Credentials:
- **Client ID:** 74bfad057bd843b997e415d69aa2ffb4
- **Client Secret:** 3eb0e42aff824fc8aaf28b9f9755904f

### Actions:
1. **Revoke and regenerate credentials:**
   ```
   1. Go to https://developer.spotify.com/dashboard
   2. Sign in to your Spotify Developer account
   3. Find your Audiora application
   4. Click on the app to open settings
   5. Go to "Settings" tab
   6. Scroll to "Client Secret" section
   7. Click "View client secret" → "Reset client secret"
   8. Confirm the reset
   9. Copy the new Client Secret
   10. Update backend/.env with new secret
   ```

2. **Update redirect URIs (if needed):**
   ```
   Ensure these are registered:
   - http://127.0.0.1:8080/api/auth/spotify/callback
   ```

3. **Review app access:**
   - Check if any unauthorized users have access
   - Remove any suspicious app users

---

## Step 3: Rotate YouTube/Google OAuth Credentials (URGENT)

### Current Exposed Credentials:
- **Client ID:** 582548666839-7c14ec04u7dv5r22dhoqhffio73se9e5.apps.googleusercontent.com
- **Client Secret:** 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

### Actions:
1. **Delete and recreate OAuth 2.0 credentials:**
   ```
   1. Go to https://console.cloud.google.com/apis/credentials
   2. Select your project (or create new if compromised)
   3. Find the OAuth 2.0 Client ID: "582548666839-..."
   4. Click the trash icon to DELETE the client ID
   5. Click "CREATE CREDENTIALS" → "OAuth client ID"
   6. Choose "Web application"
   7. Name: "Audiora Backend"
   8. Add Authorized redirect URIs:
      - http://127.0.0.1:8080/api/auth/youtube/callback
      - http://127.0.0.1:8080/api/auth/google/callback
   9. Click "CREATE"
   10. Copy Client ID and Client Secret
   11. Update backend/.env with new credentials
   ```

2. **Review OAuth consent screen:**
   ```
   1. Go to OAuth consent screen
   2. Review authorized domains
   3. Remove any suspicious entries
   ```

3. **Enable YouTube Data API v3:**
   ```
   1. Go to "Library" section
   2. Search for "YouTube Data API v3"
   3. Ensure it's enabled for your project
   ```

---

## Step 4: Secure the Repository

### Remove .env from Git Tracking:
```bash
# Navigate to project root
cd /home/ariz/DEV/Audiora

# Stop tracking .env file (but keep local copy)
git rm --cached backend/.env

# Verify it's in .gitignore
grep -E "^\.env$|^\*\.env$" .gitignore

# Commit the removal
git add .gitignore
git commit -m "security: Stop tracking .env file with sensitive credentials"

# Push to remote
git push origin main
```

### Remove from Git History (IMPORTANT):

**Option 1: Using BFG Repo-Cleaner (Recommended):**
```bash
# Install BFG (if not already installed)
# On Fedora/RHEL:
sudo dnf install bfg-repo-cleaner
# Or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Backup your repo first
cp -r /home/ariz/DEV/Audiora /home/ariz/DEV/Audiora-backup

# Clone a fresh bare repository
cd /home/ariz/DEV
git clone --mirror https://github.com/arino08/Audiora---Unified-Music-Platform.git

# Run BFG to remove .env from history
bfg --delete-files .env Audiora---Unified-Music-Platform.git

# Clean up
cd Audiora---Unified-Music-Platform.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push changes (THIS WILL REWRITE HISTORY)
git push --force
```

**Option 2: Using git filter-repo (Alternative):**
```bash
# Install git-filter-repo
pip3 install git-filter-repo

# Backup your repo
cp -r /home/ariz/DEV/Audiora /home/ariz/DEV/Audiora-backup

# Navigate to repo
cd /home/ariz/DEV/Audiora

# Remove .env from history
git filter-repo --path backend/.env --invert-paths --force

# Push with force (THIS WILL REWRITE HISTORY)
git push origin --force --all
git push origin --force --tags
```

**⚠️ WARNING:** Force pushing rewrites history. Notify any collaborators!

---

## Step 5: Update Configuration Files

### Update backend/.env with NEW credentials:
```bash
# Edit the file
nano backend/.env
# Or
code backend/.env
```

```properties
# NEW CREDENTIALS (paste your newly generated ones)
EMAIL_USERNAME=arinopc22@gmail.com
EMAIL_PASSWORD=<NEW_APP_PASSWORD_HERE>
EMAIL_FROM=arinopc22@gmail.com

BACKEND_BASE_URL=http://127.0.0.1:8080
FRONTEND_BASE_URL=http://localhost:4200

SPOTIFY_CLIENT_ID=<NEW_CLIENT_ID_HERE>
SPOTIFY_CLIENT_SECRET=<NEW_CLIENT_SECRET_HERE>

YOUTUBE_CLIENT_ID=<NEW_CLIENT_ID_HERE>
YOUTUBE_CLIENT_SECRET=<NEW_CLIENT_SECRET_HERE>
```

### Verify .env is not tracked:
```bash
git status
# Should NOT show backend/.env as modified

git check-ignore backend/.env
# Should output: backend/.env
```

---

## Step 6: Test New Credentials

```bash
# Start backend
cd backend
mvn spring-boot:run

# In another terminal, test health endpoint
curl http://localhost:8080/api/health

# Test email (check logs for success)
# Test Spotify auth flow
# Test YouTube auth flow
```

---

## Step 7: Prevent Future Incidents

### Add pre-commit hook:
```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Check for .env files
if git diff --cached --name-only | grep -E '\.env$|\.env\..*$'; then
    echo "❌ ERROR: Attempting to commit .env file!"
    echo "Please remove sensitive files from staging:"
    echo "  git reset HEAD <file>"
    exit 1
fi

# Check for potential secrets in staged files
if git diff --cached | grep -iE 'password|secret|api_key|token'; then
    echo "⚠️  WARNING: Potential secrets detected in commit!"
    echo "Review your changes carefully before committing."
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
EOF

chmod +x .git/hooks/pre-commit
```

### Install git-secrets (optional but recommended):
```bash
# Install git-secrets
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
sudo make install

# Configure for your repo
cd /home/ariz/DEV/Audiora
git secrets --install
git secrets --register-aws
```

### Use environment-specific files:
```
✅ .env.example (commit this - no real values)
❌ .env (never commit - real values)
❌ .env.local (never commit - local overrides)
❌ .env.production (never commit - prod values)
```

---

## Step 8: Monitor for Abuse

### Check for unauthorized access:

1. **Gmail:**
   - https://myaccount.google.com/device-activity
   - Look for suspicious sign-ins

2. **Spotify:**
   - https://www.spotify.com/account/apps/
   - Check connected apps
   - Review recent activity

3. **Google Cloud:**
   - https://console.cloud.google.com/apis/credentials
   - Check API quotas and usage
   - Review audit logs

### Set up alerts:
- Enable email notifications for new device sign-ins
- Monitor API usage spikes
- Set up budget alerts in Google Cloud (if applicable)

---

## Estimated Time to Complete:
- **Step 1-3 (Credential Rotation):** 15-20 minutes
- **Step 4 (Git Cleanup):** 10-15 minutes
- **Step 5-6 (Update & Test):** 10 minutes
- **Step 7-8 (Prevention & Monitoring):** 15-20 minutes

**Total:** ~50-65 minutes

---

## Checklist

- [ ] Revoked Gmail app password
- [ ] Generated new Gmail app password
- [ ] Reset Spotify client secret
- [ ] Deleted and recreated Google OAuth credentials
- [ ] Stopped tracking .env file (`git rm --cached`)
- [ ] Removed .env from git history (BFG or filter-repo)
- [ ] Force pushed to remote
- [ ] Updated backend/.env with new credentials
- [ ] Verified .env is in .gitignore
- [ ] Tested backend with new credentials
- [ ] Added pre-commit hook
- [ ] Monitored for suspicious activity
- [ ] Documented incident (this file)

---

## Resources

- [Google App Passwords](https://myaccount.google.com/apppasswords)
- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [OWASP Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## After Completion

Once all steps are complete:
1. ✅ Mark this incident as RESOLVED in your security log
2. ✅ Schedule a review of all secrets in 30 days
3. ✅ Consider using a secrets manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
4. ✅ Update team on best practices

**Status:** [ ] RESOLVED - Date: ___________

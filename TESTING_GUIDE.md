# Quick Testing Guide

## 🚀 How to Test the New Features

### Starting the Application

1. **Start Backend:**
   ```bash
   cd /home/ariz/DEV/Audiora/backend
   mvn spring-boot:run
   ```
   Wait for: `Started AudioraApplication in X seconds`

2. **Start Frontend (in new terminal):**
   ```bash
   cd /home/ariz/DEV/Audiora/frontend
   npm start
   ```
   Opens browser at: `http://localhost:4200`

---

## 🎨 Testing Theme System

### Test Preset Themes
1. Sign in with YouTube (top-right)
2. Click your profile avatar → **Settings**
3. Settings panel slides in from right
4. Click on different theme cards:
   - **Dark Mode** (default blue accent)
   - **Light Mode** (white background, dark text)
   - **Neon Dreams** (magenta/cyan cyberpunk)
   - **Minimal** (clean, simple)
   - **Retro Wave** (80s aesthetic)
   - **Ocean Breeze** (turquoise)
   - **Sunset Vibes** (orange/warm)
   - **Forest Night** (green)
5. **Verify:** Theme changes instantly across entire UI

### Test Dynamic Mode
1. In Settings panel, toggle **Dynamic** button
2. Play any song with album artwork
3. **Verify:** Colors extract from album art
4. Switch songs with different artwork
5. **Verify:** Theme adapts to each song's colors
6. Toggle Dynamic off
7. **Verify:** Returns to last selected preset theme

### Test Persistence
1. Select a theme (e.g., Neon Dreams)
2. Refresh the page (F5)
3. **Verify:** Theme is still Neon Dreams
4. Enable Dynamic mode
5. Refresh page
6. **Verify:** Dynamic mode is still enabled

---

## 🤖 Testing Radio Mode

### Prerequisites
- Must be signed in with YouTube (and optionally Spotify)
- Must have at least one song playing

### Test Spotify Radio Mode
1. Connect Spotify account (sidebar → Link Spotify)
2. Play any Spotify playlist or search for a song
3. Click **Radio** button in bottom player (right side)
4. **Verify:** Button turns accent color (active state)
5. **Verify:** 3 similar songs auto-queue
6. Let current song finish
7. **Verify:** Next song plays automatically
8. **Verify:** More songs continue to queue as queue depletes
9. Check queue (should always have 2-3 songs ahead)

### Test YouTube Radio Mode
1. Play any YouTube video from playlists or search
2. Enable **Radio** button in bottom player
3. **Verify:** 3 related videos auto-queue
4. Let video finish
5. **Verify:** Next video plays automatically
6. **Verify:** Endless playback continues

### Test Radio Mode Toggle
1. Enable Radio mode → **Verify:** Button glows
2. Disable Radio mode → **Verify:** Button returns to normal
3. **Verify:** No more tracks auto-queue
4. Enable again → **Verify:** Resumes auto-queueing
5. Refresh page → **Verify:** Radio mode state persists

### Test Mixed Providers
1. Enable Radio mode
2. Play Spotify track → **Verify:** Spotify tracks queue
3. Manually switch to YouTube video → **Verify:** YouTube videos queue
4. **Note:** Recommendations are provider-specific (no cross-provider mixing yet)

### Test Edge Cases
1. **Low Queue:** Play song, skip to last queued song
   - **Verify:** New recommendations fetch immediately
2. **Network Errors:** Disconnect internet briefly
   - **Verify:** Loading spinner shows, graceful error handling
3. **No Recommendations:** Use obscure/new track
   - **Verify:** Handles empty results gracefully
4. **Rapid Toggling:** Toggle Radio mode on/off quickly
   - **Verify:** No duplicate API calls

---

## 🔍 Visual Verification Checklist

### Theme System
- [ ] All 8 themes render correctly
- [ ] Text is readable in both light and dark themes
- [ ] Accent colors apply to buttons, links, progress bars
- [ ] Gradients and shadows look smooth
- [ ] Dynamic mode extracts appropriate colors (vibrant, not dull)
- [ ] Theme picker previews match actual theme
- [ ] Settings panel opens/closes smoothly
- [ ] Close button and backdrop click both work

### Radio Mode
- [ ] Radio button shows clear active/inactive states
- [ ] Loading spinner appears during API calls
- [ ] Radio icon pulses when active
- [ ] Button is accessible (not hidden on small screens)
- [ ] Tooltip explains feature clearly
- [ ] Queue indicator shows growing list

---

## 🐛 Debugging Tips

### If themes don't change:
1. Open browser DevTools (F12) → Console
2. Look for errors
3. Check localStorage: `audiora_theme` and `audiora_dynamic_theme`
4. Clear localStorage: `localStorage.clear()` in console, refresh

### If Radio mode doesn't queue tracks:
1. Open DevTools → Console
2. Look for "AutoQueue:" logs
3. Check Network tab for API calls:
   - `/api/spotify/recommendations`
   - `/api/youtube/related`
4. Verify session ID exists: Check `X-Session-Id` header
5. Check backend logs for errors

### If colors look wrong:
1. Inspect element (right-click → Inspect)
2. Check CSS variables in `:root`:
   - `--color-accent`
   - `--color-background`
   - `--color-surface`
   - `--color-text`
3. Toggle Dynamic mode off/on to reset

### Common Issues
- **"Missing session" error:** Sign out and sign in again
- **"Token expired" error:** Refresh page or reconnect provider
- **No recommendations:** Track might be too new or obscure
- **Slow loading:** Check network speed, API rate limits

---

## 📊 Expected Behavior Summary

### Theme System
✅ **Instant theme changes** (no page reload)
✅ **Smooth color transitions** (CSS animations)
✅ **Dynamic colors match album artwork**
✅ **Persistent across sessions**

### Radio Mode
✅ **Auto-queues 3 tracks when queue ≤ 2**
✅ **Infinite playback** (never runs out of songs)
✅ **Provider-specific recommendations** (Spotify → Spotify, YouTube → YouTube)
✅ **No duplicate tracks** (tracks from last 50 recommendations)
✅ **Toggleable** (can turn on/off anytime)

---

## 🎯 Success Criteria

### You know it's working when:
1. **Themes:** Can switch between 8 themes, see instant UI changes
2. **Dynamic Mode:** Album art colors flow into UI background/accents
3. **Radio Mode:** Can listen to one song and get endless similar tracks
4. **Persistence:** Settings survive page refresh
5. **No Errors:** Console is clean (no red errors)

---

## 📝 Testing Report Template

After testing, note:

**Theme System:**
- [ ] All themes tested
- [ ] Dynamic mode works
- [ ] Persistence verified
- [ ] Issues found: _________

**Radio Mode:**
- [ ] Spotify recommendations work
- [ ] YouTube recommendations work
- [ ] Auto-queueing functional
- [ ] Toggle state persists
- [ ] Issues found: _________

**Overall:**
- Browser: _________
- OS: Linux
- Any crashes? _________
- Performance notes: _________

---

## 🚦 Next Steps After Testing

If everything works:
1. ✅ Mark features as production-ready
2. 📝 Update user documentation
3. 🎉 Deploy to production

If issues found:
1. 🐛 Document bugs in detail
2. 🔧 Fix critical issues
3. 🧪 Re-test
4. ✅ Verify fixes

---

**Happy Testing! 🎵🎨**

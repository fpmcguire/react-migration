# React Migration - InMotion Deployment Checklist

## Pre-Deployment Status ✅

**Build Status:** All systems ready

- ✅ Type checking: Passed
- ✅ Unit tests: 10/10 passing
- ✅ Production build: Success (268.94 kB main, 85.81 kB gzipped)
- ✅ InMotion build: Success (189.91 kB main, 60.10 kB gzipped)
- ✅ GA integration: Fixed and tested
- ✅ Subdirectory routing: Configured and working

**Critical Fixes Applied:**

- ✅ Subdirectory routing with React Router `basename` config
- ✅ Google Analytics follows official gtag.js pattern with script load callbacks
- ✅ .htaccess configured for `/react-migration/` subdirectory
- ✅ Cookie consent integration with GA activation
- ✅ Environment variables properly set (.env vs .env.production)

---

## Deployment Steps

### Step 1: Backup Existing Deployment

```bash
# SSH into fraank-mcguire.com
# Backup current files
cp -r public_html/react-migration public_html/react-migration.backup.$(date +%s)
```

### Step 2: Copy Distribution Files

```bash
# From your local machine, use SCP or FTP to upload:
# Source: c:\Users\User\Documents\_projects-react\react-migration\dist\*
# Destination: fraank-mcguire.com/public_html/react-migration/

# All files to upload:
# - dist/index.html
# - dist/.htaccess
# - dist/assets/index-*.js (main bundle)
# - dist/assets/index-*.css (main styles)
# - dist/assets/router-*.js (React Router chunk)
# - dist/assets/HomePage-*.js and .css
# - dist/assets/PatternsListPage-*.js and .css
# - dist/assets/PatternDetailPage-*.js and .css
# - dist/assets/error-boundary-*.js
# - dist/assets/lessonPromiseCache-*.js
# - dist/assets/react-vendor-*.js
```

### Step 3: Verify Permissions

```bash
# SSH into server
# Ensure proper directory permissions
chmod 755 /home/shared/public_html/react-migration
chmod 644 /home/shared/public_html/react-migration/*
chmod 755 /home/shared/public_html/react-migration/assets
chmod 644 /home/shared/public_html/react-migration/assets/*
```

### Step 4: Clear Browser Cache

- Clear your browser cache or use incognito mode
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)

---

## Post-Deployment Verification

### Immediate Checks (5-10 minutes)

#### 1. Home Page Loading ✅

```bash
# Visit: https://fraank-mcguire.com/react-migration/
# Expected:
# - Page loads without 404
# - Title shows "React Migration"
# - Header shows "React Migration" branding
# - "Explore Patterns" button is visible
# - No console errors (check DevTools)
```

#### 2. Navigation ✅

```bash
# Click "Explore Patterns" button
# Expected:
# - Routes to /react-migration/patterns
# - PatternsListPage loads with pattern list
# - No 404 errors
# - All patterns display with categories
```

#### 3. Pattern Filtering ✅

```bash
# On PatternsListPage:
# - Click category filter buttons
# - Expected: List filters immediately
# - Pattern count updates correctly
```

#### 4. Pattern Detail View ✅

```bash
# Click on any pattern
# Expected:
# - Routes to /react-migration/patterns/{id}
# - Detail page loads correctly
# - No 404 or routing errors
```

### Google Analytics Verification

#### Before Cookie Acceptance ✅

```javascript
// Open DevTools Console and run:
typeof window.gtag;
// Expected output: "undefined"
```

#### Accept Cookies ✅

```bash
# Click "I Accept All" on cookie banner
# Expected in console:
# [GA] Google Analytics script loaded
# [GA] Google Analytics configured successfully
```

#### After Cookie Acceptance ✅

```javascript
// In DevTools Console:
typeof window.gtag;
// Expected output: "function"

// Check that GA script loaded:
// DevTools > Network tab
// Look for: POST https://www.google-analytics.com/g/collect?...
// Status should be: 200 or 204
```

#### GA Dashboard Check (30 minutes after deployment)

```bash
# Visit Google Analytics dashboard
# https://analytics.google.com/
# Measurement ID: G-MD06T4XGJJ
#
# Expected in Real-time report:
# - 1 active user (yourself)
# - Page view for /react-migration/ (home page)
# - Page view for /react-migration/patterns (patterns page)
#
# After accepting cookies:
# - Additional pageview should appear
```

### Network and Performance

#### Asset Loading ✅

```bash
# DevTools > Network tab
# Expected status codes: 200 for all assets
# Expected gzip compression: All JS/CSS files should be gzipped
# Expected response times: < 1 second for most assets
```

#### Console for Warnings ✅

```bash
# Open DevTools Console
# Expected: Only React Router future flag warnings (can ignore)
# Not expected:
#   - 404 errors
#   - CORS errors
#   - Script blocking errors
```

---

## Rollback Plan

If something goes wrong:

```bash
# SSH into server
# Restore from backup
rm -rf /home/shared/public_html/react-migration
cp -r /home/shared/public_html/react-migration.backup.TIMESTAMP /home/shared/public_html/react-migration
```

---

## Common Issues & Solutions

### Issue: 404 on /react-migration/patterns

**Solution:** Check .htaccess RewriteBase is `/react-migration/` (3 places in file)

### Issue: GA not tracking even after accepting cookies

**Solution:**

1. Check browser DevTools Network tab for gtag.js script (200 status)
2. Verify console shows `[GA] Google Analytics script loaded`
3. Wait 30 minutes for GA dashboard to show data
4. Check if cookies are actually being saved (DevTools > Application > Cookies)

### Issue: Patterns page shows blank

**Solution:** Check browser console for errors, verify API data loads, check cache

### Issue: Styling looks broken

**Solution:**

1. Hard refresh (Ctrl+F5)
2. Clear browser cache completely
3. Check DevTools Network tab for CSS files (should be 200)

### Issue: Home page shows but routing fails

**Solution:**

1. Verify React Router basename matches: `/react-migration/`
2. Check vite.config.inmotion.ts has correct base path
3. Verify .htaccess RewriteRule is correct

---

## Monitoring

### Daily for First Week

- Check Google Analytics for user traffic
- Monitor browser dev tools for any new errors
- Test functionality from different devices
- Test all major user flows (navigation, filtering, etc.)

### Ongoing

- Monitor GA for trends
- Check InMotion hosting dashboard for bandwidth/errors
- Test periodically from different networks/devices

---

## Support Resources

- **Router Config:** [src/router.tsx](../src/router.tsx) - Line 7: `basename` config
- **GA Config:** [src/contexts/CookieConsentContext.tsx](../src/contexts/CookieConsentContext.tsx) - `loadGoogleAnalytics()` function
- **Build Config:** [vite.config.inmotion.ts](../vite.config.inmotion.ts)
- **Server Config:** [dist/.htaccess](dist/.htaccess)
- **Deployment Guide:** [docs/GA-DEPLOYMENT.md](GA-DEPLOYMENT.md)
- **Testing Guide:** [docs/TESTING-GUIDE.md](TESTING-GUIDE.md)

---

## Key Deployment Facts

| Property              | Value                                       |
| --------------------- | ------------------------------------------- |
| Deployment URL        | https://fraank-mcguire.com/react-migration/ |
| Site Base Path        | /react-migration/                           |
| React Router Basename | /react-migration/ (from BASE_URL env var)   |
| .htaccess RewriteBase | /react-migration/                           |
| .htaccess RewriteRule | /react-migration/index.html                 |
| GA Measurement ID     | G-MD06T4XGJJ                                |
| Main Bundle Size      | 189.91 kB (60.10 kB gzipped)                |
| Test Status           | 10/10 passing ✅                            |
| Type Check            | Passing ✅                                  |
| Build Status          | Success ✅                                  |

---

**Status:** Ready for production deployment ✅
**Last Updated:** 2024
**Built With:** React 19, Vite 5.4, TypeScript 5.5

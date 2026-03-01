# Google Analytics Deployment Guide

## Production Deployment Setup

### Issue Fixed

Google Analytics was not being activated when cookies were accepted in production because:

1. The GA script initialization was not following Google's official gtag.js pattern
2. The environment variable `VITE_ANALYTICS_ENABLED` needed to be set in production builds

### Current Implementation

**File:** `src/contexts/CookieConsentContext.tsx`

The GA loading now follows Google's official pattern:

1. Initialize `window.dataLayer = []`
2. Create temporary `gtag()` function
3. Load the GA script
4. Script loads and Googl Analytics defines the real `gtag()` function
5. Call GA config once the script loads (via `onload` callback)

### Deployment Steps

#### Step 1: Build for InMotion

```bash
npm run build:inmotion
```

This command:

- Uses `vite.config.inmotion.ts` configuration
- Sets `base: "/react-migration/"`
- Reads from `.env.production` (which has `VITE_ANALYTICS_ENABLED=true`)
- Creates optimized production build in `dist/` folder

#### Step 2: Copy Files to Server

Copy the `dist/` folder contents to:

```
fraank-mcguire.com/react-migration/
```

Files should include:

- `index.html` - Entry point (served by .htaccess)
- `assets/` - JavaScript bundles with GA initialization code
- All CSS and font files

#### Step 3: Verify Deployment

\*\*In production at https://fraank-mcguire.com/react-migration/:

1. **Before accepting cookies:**
   - Open Browser DevTools → Console
   - Type: `typeof window.gtag`
   - Should return: `undefined`

2. **Accept cookies:**
   - Click "Accept All" on cookie banner
   - Wait 1-2 seconds for GA script to load

3. **After accepting cookies:**
   - Type: `typeof window.gtag`
   - Should return: `function`
   - Check Network tab for `gtag.js` script (Status 200)
   - Check Console for: `[GA] Google Analytics script loaded`
   - Check Console for: `[GA] Google Analytics configured successfully`

### Environment Configuration

**Development (.env.local or .env):**

```dotenv
VITE_ANALYTICS_ENABLED=false
```

- GA script **never loads**
- Cookie banner still appears for testing
- Safe for local development

**Production (.env.production):**

```dotenv
VITE_ANALYTICS_ENABLED=true
```

- GA script loads **only when cookies accepted**
- Embedded in production build at build time

### Flow Diagram

```
User visits site
    ↓
Loading page with GA disabled (VITE_ANALYTICS_ENABLED compiled as false in dev build)
    ↓
Cookie banner appears
    ↓
User accepts cookies
    ↓
setPreferences({ analytics: true })
    ↓
loadGoogleAnalytics() called
    ↓
Check: VITE_ANALYTICS_ENABLED === 'true' ✓
    ↓
Initialize dataLayer and temporary gtag()
    ↓
Load https://www.googletagmanager.com/gtag/js?id=G-MD06T4XGJJ
    ↓
Script loads, Google's gtag() takes over
    ↓
gtag.onload callback fires
    ↓
gtag('js', new Date())
gtag('config', 'G-MD06T4XGJJ', {...})
    ↓
GA page views tracked
```

### Troubleshooting

#### GA Not Loading After Cookie Accept

**Check 1:** Verify build used `.env.production`

```bash
# Ensure .env.production exists with VITE_ANALYTICS_ENABLED=true
cat .env.production
```

**Check 2:** Rebuild with production config

```bash
npm run build:inmotion
```

**Check 3:** Clear browser cache on production site

- Browser DevTools → Application → Clear all

**Check 4:** Verify GA ID is correct

- Should be: `G-MD06T4XGJJ`
- Check in: `src/contexts/CookieConsentContext.tsx`

#### GA Script Not Found

**In DevTools Console:**

- `[GA] Loading Google Analytics...` appears
- `[GA] Google Analytics script loaded` appears
- But GA is not tracking anything

**Solution:**

- Check DNS/CORS - ensure GTM script can be requested from your domain
- Check firewall - ensure outbound traffic to `googletagmanager.com` is allowed

### Security & Privacy Notes

✅ **Privacy-First Approach:**

- GA only loads when users explicitly consent
- No tracking before consent
- Uses `anonymize_ip: true` for privacy
- Uses `SameSite=None;Secure` for cookie flags

✅ **User Rights:**

- Users can reject analytics in cookie preferences
- GA respects "Do Not Track" browser settings
- Users can revoke consent by rejecting in banner

### Monitoring

**Google Analytics Dashboard:**

1. Go to: https://analytics.google.com
2. Property: React Migration
3. View: Real Time → Active Users
4. Should see events when users interact with site (after cookie consent)

### References

- [Google Analytics Setup Guide](./GOOGLE-ANALYTICS-SETUP.md)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode)
- [Google Analytics gtag.js](https://support.google.com/analytics/answer/9310895)

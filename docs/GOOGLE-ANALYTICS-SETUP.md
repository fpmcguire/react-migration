# Google Analytics Implementation Guide

## Overview

Google Analytics is implemented in the React Migration app with **environment-aware loading**:

- ✅ **Development**: Analytics DISABLED (won't load or track)
- ✅ **Production**: Analytics ENABLED (only when user consents)
- ✅ **Privacy-first**: Only loads when user accepts analytics cookies

**Google Analytics ID:** `G-MD06T4XGJJ`

---

## How It Works

### 1. Environment-Based Control

**Development (.env or .env.development):**

```bash
VITE_ANALYTICS_ENABLED=false
```

Analytics script **never loads** in development.

**Production (.env.production):**

```bash
VITE_ANALYTICS_ENABLED=true
```

Analytics script loads **only when user accepts cookies**.

---

### 2. Cookie Consent Integration

**File:** `src/contexts/CookieConsentContext.tsx`

**Flow:**

1. User visits site → Cookie banner appears
2. User clicks "Accept All" → `analytics: true` stored in localStorage
3. `loadGoogleAnalytics()` function called
4. Checks `VITE_ANALYTICS_ENABLED === 'true'`
5. If true, loads GA script and initializes tracking

**Code:**

```typescript
// Only loads when:
// 1. User consented to analytics
// 2. Environment allows analytics
if (preferences?.analytics && isAnalyticsEnabled) {
  loadGoogleAnalytics();
}
```

---

### 3. Page View Tracking

**File:** `src/components/AppShell.tsx`

**Implementation:**

```typescript
useEffect(() => {
  // Track page views only if gtag loaded (user consented)
  if (typeof window.gtag === "function") {
    window.gtag("config", "G-MD06T4XGJJ", {
      page_path: location.pathname + location.search,
    });
  }
}, [location]);
```

Tracks:

- Route changes (/, /patterns, /patterns/use-state, etc.)
- Only if user accepted analytics cookies
- Only if environment allows analytics

---

## Configuration Files

### .env.production (Committed)

```bash
VITE_ANALYTICS_ENABLED=true
VITE_ENABLE_ERROR_REPORTING=false
VITE_DEBUG=false
```

Used when building for production (`npm run build:inmotion`).

### .env (Development - Not Committed)

```bash
VITE_ANALYTICS_ENABLED=false
VITE_ENABLE_ERROR_REPORTING=false
VITE_DEBUG=true
```

Create this file locally for development.

### .env.local (Optional - Not Committed)

Override environment variables locally without affecting committed files.

---

## Privacy & Compliance

### GDPR Compliance

✅ **Opt-in required** - GA only loads after user consent  
✅ **IP anonymization** - Configured in GA setup  
✅ **Cookie notice** - Banner shown on first visit  
✅ **Preference storage** - Saved in localStorage

### Cookie Configuration

```typescript
gtag("config", "G-MD06T4XGJJ", {
  anonymize_ip: true, // Anonymize user IPs
  cookie_flags: "SameSite=None;Secure", // Secure cookie settings
});
```

---

## Testing Analytics

### Development (Should NOT Track)

```bash
# 1. Run dev server
npm run dev

# 2. Open browser console
# 3. Accept cookies
# 4. Check console logs:
[GA] Analytics disabled in environment (development mode)

# 5. Verify gtag NOT loaded:
typeof window.gtag  // undefined
```

### Production Build (Should Track)

```bash
# 1. Build for production
npm run build:inmotion

# 2. Preview production build
npm run preview

# 3. Open browser console
# 4. Accept cookies
# 5. Check console logs:
[GA] Loading Google Analytics...
[GA] Google Analytics loaded successfully

# 6. Verify gtag loaded:
typeof window.gtag  // function
```

---

## Verifying in Google Analytics

### Real-time Reports

1. Go to Google Analytics dashboard
2. Navigate to **Reports → Real-time**
3. Open your deployed site
4. Accept cookies
5. Navigate to different pages
6. Should see page views in real-time

### Debug Mode (Optional)

Enable debug mode in production:

```typescript
gtag("config", "G-MD06T4XGJJ", {
  anonymize_ip: true,
  cookie_flags: "SameSite=None;Secure",
  debug_mode: true, // ← Add this
});
```

Then check browser console for detailed GA events.

---

## Troubleshooting

### Issue: Analytics Not Tracking in Production

**Check 1: Environment Variable**

```bash
# Verify .env.production has:
VITE_ANALYTICS_ENABLED=true
```

**Check 2: Build Command**

```bash
# Use correct build command:
npm run build:inmotion
```

**Check 3: Cookie Consent**

- Open browser console
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Accept cookies
- Look for: `[GA] Loading Google Analytics...`

**Check 4: Script Loaded**

```javascript
// In browser console:
typeof window.gtag; // Should be: function
window.dataLayer; // Should be: Array
```

---

### Issue: Analytics Tracking in Development

**Problem:** GA loads during development

**Fix:**

1. Check `.env` file:
   ```bash
   VITE_ANALYTICS_ENABLED=false
   ```
2. Restart dev server: `npm run dev`
3. Hard refresh browser: `Ctrl + Shift + R`

---

### Issue: Cookie Banner Not Appearing

**Check 1: LocalStorage**

```javascript
// In browser console:
localStorage.getItem("cookie-preferences");
// If not null, banner won't show
```

**Fix:**

```javascript
localStorage.removeItem("cookie-preferences");
// Refresh page
```

---

## Event Tracking (Optional Enhancement)

To track custom events (button clicks, form submissions, etc.):

```typescript
// Example: Track pattern view
function trackPatternView(patternId: string) {
  if (typeof window.gtag === "function") {
    window.gtag("event", "view_pattern", {
      pattern_id: patternId,
    });
  }
}

// Usage in component:
useEffect(() => {
  trackPatternView(id);
}, [id]);
```

---

## Migrating to GA4 (Already Using GA4)

You're already using GA4 (ID starts with `G-`).

**GA4 Benefits:**

- Event-based tracking (not session-based)
- Better privacy controls
- Cross-platform tracking
- Machine learning insights

---

## Best Practices

### ✅ DO:

- Keep analytics disabled in development
- Only load GA after user consent
- Use environment variables for control
- Anonymize IP addresses
- Log GA loading status in development

### ❌ DON'T:

- Load GA before user consent
- Enable analytics in development
- Track personally identifiable information (PII)
- Forget to test in production build

---

## Comparison with Angular Implementation

### Similarities

✅ Same GA ID: `G-MD06T4XGJJ`  
✅ Cookie consent required  
✅ Environment-based enabling  
✅ Dynamic script loading  
✅ Page view tracking

### Differences

| Angular                        | React                    |
| ------------------------------ | ------------------------ |
| `environment.analyticsEnabled` | `VITE_ANALYTICS_ENABLED` |
| Service injection              | Context hook             |
| RxJS takeUntilDestroyed        | useEffect cleanup        |
| NavigationEnd events           | useLocation hook         |

---

## Files Modified

1. **`src/contexts/CookieConsentContext.tsx`**
   - Added `loadGoogleAnalytics()` function
   - Added environment check
   - Added window.gtag type definitions
   - Loads GA when user accepts cookies

2. **`src/components/AppShell.tsx`**
   - Added page view tracking
   - Tracks route changes via useLocation

3. **`.env.production`**
   - Created with `VITE_ANALYTICS_ENABLED=true`

4. **`.env.example`**
   - Updated with analytics flag documentation

5. **`.gitignore`**
   - Added `.env.*.local` exclusions

---

## Summary

**Google Analytics is now:**

- ✅ Disabled in development (no tracking during coding)
- ✅ Enabled in production (after user consent)
- ✅ Privacy-compliant (GDPR opt-in)
- ✅ Automatically tracks page views
- ✅ Ready for custom event tracking

**To enable in production:**

1. Build with `npm run build:inmotion`
2. Deploy to InMotion
3. User accepts cookies
4. Analytics automatically loads and tracks

**No code changes needed!** 🎉

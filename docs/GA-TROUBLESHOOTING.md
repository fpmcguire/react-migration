# Google Analytics Troubleshooting Guide

This guide helps diagnose and resolve common Google Analytics (GA) deployment issues on the React Migration site.

## Quick Diagnosis

### Step 1: Open DevTools and Accept Cookies

1. Visit: https://fraank-mcguire.com/react-migration/
2. Open DevTools: Press `F12`
3. Go to **Console** tab
4. Click "I Accept All" on the cookie banner
5. Check console for GA initialization messages

### Step 2: Look for GA Console Logs

You should see these messages in order:

```
[GA] Environment Check: {VITE_ANALYTICS_ENABLED: "true", DEV: false, isAnalyticsEnabled: true}
[GA] Loading Google Analytics...
[GA] GA ID: G-MD06T4XGJJ
[GA] Temporary gtag function created
[GA] Script element appended to document head
[GA] Google Analytics script loaded successfully
[GA] Google Analytics configured successfully
```

If you don't see these, go to **Diagnosis Section** below.

---

## Issue: GA Console Logs Show But No Data in GA Dashboard

### Symptoms

- Console shows: `[GA] Google Analytics configured successfully` ✅
- But GA dashboard shows no real-time users (after 30+ minutes)
- Or pageviews not appearing

### Possible Causes

#### 1. **Cookies Not Actually Being Saved**

**Check:** DevTools → Application → Cookies

Look for cookie: `cookie-preferences`

**If missing:**

- LocalStorage may be disabled or blocked
- Try clearing all site data and reload
- Check browser privacy settings

**Fix:**

```javascript
// In DevTools Console, verify cookie is saved:
localStorage.getItem("cookie-preferences");
// Should return: {"necessary":true,"analytics":true,"marketing":true}
```

#### 2. **GA Dashboard Not Updated Yet**

Google Analytics has a delay showing data:

- Real-time: 0-5 minutes ⚡
- Reports: 24-48 hours 📊

**Fix:** Wait longer and check:

1. GA Dashboard → Real-time → Location (should show your country)
2. Look for any user activity
3. If nothing after 30 min, move to next issue

#### 3. **GA Configuration Mismatch**

**Check:** Make sure GA ID is correct

```javascript
// In DevTools Console, run:
window.gtag("config", "G-MD06T4XGJJ", {
  page_path: window.location.pathname,
});
```

**Expected:** Command executed without error

#### 4. **GA Script Loaded But Data Not Sent**

**Check:** DevTools → Network tab

After accepting cookies:

1. Filter by "collect" or "www.google"
2. Look for POST requests to:
   - `https://www.google-analytics.com/g/collect?...`
   - `https://www.googletagmanager.com/gtag/js?...`

**Expected status:** 200 or 204

**If status is 4xx or 5xx:**

- Go to Issue: "GA Script Load Fails"

---

## Issue: GA Script Load Fails

### Symptoms

- Console shows: `[GA] Failed to load Google Analytics script` ❌
- OR console shows error about CORS / blocked request
- Network shows gtag/js request with status 4xx/5xx

### Possible Causes

#### 1. **Content Security Policy (CSP) Blocking**

**Check:** DevTools → Console for CSP errors

Error will look like:

```
Refused to load the script because it violates the Content-Security-Policy directive
```

**Fix:** Contact InMotion hosting or check `.htaccess` for CSP headers

```bash
# SSH into server and check:
grep -i "Content-Security-Policy" .htaccess
```

**If present, add Google domains:**

```
Content-Security-Policy: script-src 'self' https://www.googletagmanager.com;
```

#### 2. **Firewall or Network Blocking**

**Symptoms:**

- Script never loads (no network request appears)
- Console shows no error, just timeout

**Check:** Can you reach Google from the server?

```bash
# SSH into InMotion server:
curl -I https://www.googletagmanager.com/gtag/js?id=G-MD06T4XGJJ

# Should return 200 status
```

**If fails:** Contact InMotion support to whitelist Google domains

#### 3. **CORS Headers Issue**

**Check:** Network tab → gtag.js request → Response Headers

Look for: `Access-Control-Allow-Origin: *`

**If missing:** May need to configure server headers

#### 4. **GA Measurement ID Invalid or Revoked**

**Check:** Is GA ID correct?

Current GA ID: `G-MD06T4XGJJ`

Verify in:

1. [CookieConsentContext.tsx](../src/contexts/CookieConsentContext.tsx) line 38
2. Google Analytics dashboard: Admin → Property Settings

**If mismatched:** Update the GA ID in code

```typescript
// src/contexts/CookieConsentContext.tsx
const GA_MEASUREMENT_ID = "G-MD06T4XGJJ"; // ← Verify this matches GA dashboard
```

---

## Issue: Console Shows GA Loaded But No `typeof window.gtag === 'function'`

### Symptoms

- Logs show: `[GA] Google Analytics script loaded successfully`
- BUT when you run `typeof window.gtag` in console → `"undefined"`
- OR `typeof window.gtag === "function"` returns `false`

### Possible Causes

#### 1. **Script Loaded But Not Executed**

GA script may have loaded but didn't run initialization code.

**Check:** DevTools → Sources → Top-level

Look for active script loading errors

**Fix:** Reload page (Ctrl+F5) and re-accept cookies

#### 2. **Google's gtag Function Overwritten**

If another script also uses gtag, could cause conflicts.

**Check:** Search page source for other gtag references

```bash
# SSH and grep page source:
grep -c "gtag" /path/to/index.html
```

**If > 1:** Remove duplicate GA initialization

#### 3. **Script Context Issue**

gtag might be loaded in wrong scope (iframe, different window).

**Check:** Is the app in an iframe or special container?

If yes, script needs to load in parent window context.

---

## Issue: GA Sends Data Inconsistently (Random pageviews missing)

### Symptoms

- Some pageviews tracked, others not
- Real-time shows 1 user sometimes, 0 sometimes
- Data seems sporadic

### Possible Causes

#### 1. **User Navigating Away Too Fast**

GA sends data asynchronously. If user leaves before send completes:

**Fix:** Page view should send even on SPA navigation

```typescript
// Already implemented in router.tsx - check:
window.gtag?.("event", "page_view", {
  page_path: location.pathname,
  page_title: document.title,
});
```

#### 2. **Cookie Being Cleared on Navigation**

Cookies might reset on certain routes.

**Check:** Do cookies persist during navigation?

```javascript
// In DevTools Console:
// 1. Accept cookies
// 2. Navigate to /react-migration/patterns
// 3. Check: localStorage.getItem('cookie-preferences')
// Should still exist
```

**If cleared:** Check [CookieConsentContext.tsx](../src/contexts/CookieConsentContext.tsx) persistence logic

#### 3. **GA Session Expiring**

GA has session timeout (30 min default). New session = new pageview chain.

This is normal behavior. Each session shows in GA separately.

---

## Issue: Cookie Banner Not Showing

### Symptoms

- Cookie banner never appears
- GA loads automatically without asking
- `[GA] Analytics disabled` message (development mode)

### Possible Causes

#### 1. **Development Mode Enabled**

GA is intentionally disabled in development.

**Check:** `.env` file

```bash
# Should be:
VITE_ANALYTICS_ENABLED=false  # Development

# NOT:
VITE_ANALYTICS_ENABLED=true   # Should only be true in .env.production
```

**Fix:** Build with InMotion config for production

```bash
npm run build:inmotion
# Uses .env.production with VITE_ANALYTICS_ENABLED=true
```

#### 2. **Cookie Banner Component Not Rendering**

CookieBanner might have rendering error.

**Check:** DevTools Console for errors

Look for React errors near CookieBanner component.

**Fix:** Check [CookieBanner.tsx](../src/components/CookieBanner.tsx) for errors

#### 3. **User Already Accepted Previously**

If cookie-preferences exists in localStorage, banner won't show.

**Fix:** Clear cookies to reset

```javascript
// In DevTools Console:
localStorage.clear();
// Reload page - banner should appear
```

---

## Verification Checklist

After deploying GA fix, verify each step:

- [ ] Visit https://fraank-mcguire.com/react-migration/
- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Banner appears: "We use cookies..."
- [ ] Click "I Accept All" button
- [ ] Console shows: `[GA] Loading Google Analytics...`
- [ ] Console shows: `[GA] Google Analytics script loaded successfully`
- [ ] Console shows: `[GA] Google Analytics configured successfully`
- [ ] Network tab shows `gtag/js` request with status 200
- [ ] Network tab shows POST to `google-analytics.com/g/collect`
- [ ] Navigate to /react-migration/patterns
- [ ] Check GA Real-time dashboard: should see 1 active user
- [ ] Wait 30+ minutes
- [ ] Check GA dashboard: pageviews should appear in reports

---

## Network Requests to Expect

After accepting cookies, you should see these network requests:

### 1. **Load GA Script**

```
URL: https://www.googletagmanager.com/gtag/js?id=G-MD06T4XGJJ
Method: GET
Status: 200
Response: JavaScript code
```

### 2. **Initialize GA**

```
URL: https://www.google-analytics.com/g/collect
Method: POST
Status: 204 (no content - expected)
Body: measurement_id=... page_path=... etc
```

### 3. **Track Pageviews**

```
URL: https://www.google-analytics.com/g/collect
Method: POST
Status: 204
Body: event=page_view&...
```

**If any of these fail (4xx/5xx status):** Go to "GA Script Load Fails" section

---

## Environment Variables

### Development Environment

**File: `.env`**

```
VITE_ANALYTICS_ENABLED=false
```

**Result:** GA disabled, cookie banner shows, but GA doesn't load

### Production Environment

**File: `.env.production`**

```
VITE_ANALYTICS_ENABLED=true
```

**Result:** GA enabled, loads when user accepts cookies

**When used:** `npm run build:inmotion` command

---

## Debug Commands (DevTools Console)

Copy and run these in DevTools Console for debugging:

### Check GA Status

```javascript
// What is window.gtag?
console.log("gtag type:", typeof window.gtag);
console.log("gtag function:", window.gtag);

// What's in dataLayer?
console.log("dataLayer:", window.dataLayer);

// Are cookies saved?
console.log("cookies:", localStorage.getItem("cookie-preferences"));
```

### Manually Trigger Pageview

```javascript
// If GA is loaded but not tracking:
if (typeof window.gtag === "function") {
  window.gtag("event", "page_view", {
    page_path: window.location.pathname,
    page_title: document.title,
  });
  console.log("Manual pageview sent");
}
```

### Clear Cookie Preferences

```javascript
// Reset to force banner to show again:
localStorage.removeItem("cookie-preferences");
location.reload();
```

---

## GA Dashboard Checks

### Real-time Report

- **URL:** https://analytics.google.com/→ Property → Real-time
- **Expected:** Shows current active users
- **After accepting cookies:** Should appear within 5 minutes

### Pageviews Report

- **URL:** https://analytics.google.com/→ Reports → Pages and screens
- **Expected:** Shows all visited pages
- **Update frequency:** 24-48 hours delay

### Events Report

- **URL:** https://analytics.google.com/→ Events → Event name
- **Expected:** Shows page_view events
- **Update frequency:** 24-48 hours delay

---

## Performance Impact

GA adds:

- **Script size:** ~80 KB (external, cached)
- **Load time:** ~200-500ms asynchronous
- **Bundle impact:** None (external script)

Our implementation:

- ✅ Loads asynchronously (doesn't block page)
- ✅ Only loads when user consents
- ✅ Minimal performance impact

---

## Contact Support

If none of these solutions work:

1. **Check network connectivity:**

   ```bash
   curl -I https://www.googletagmanager.com
   ```

2. **Check GA property settings:**
   - https://analytics.google.com → Admin → Property
   - Verify: Data streams configured
   - Verify: Web stream includes your domain

3. **Contact InMotion Hosting:**
   - Ask about: CSP headers, firewall rules, Google domain whitelist

4. **Update GA ID if needed:**
   - If GA property was replaced, update in [CookieConsentContext.tsx](../src/contexts/CookieConsentContext.tsx)

---

## Related Files

- **GA Implementation:** [src/contexts/CookieConsentContext.tsx](../src/contexts/CookieConsentContext.tsx)
- **Cookie Banner UI:** [src/components/CookieBanner.tsx](../src/components/CookieBanner.tsx)
- **Build Config:** [vite.config.inmotion.ts](../vite.config.inmotion.ts)
- **Environment:** [.env.production](.env.production)
- **Deployment Guide:** [DEPLOYMENT-CHECKLIST-INMOTION.md](DEPLOYMENT-CHECKLIST-INMOTION.md)

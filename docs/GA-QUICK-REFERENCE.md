# GA Deployment Quick Reference

**TL;DR - GA Not Working? Check this first:**

| Issue                              | Check                                        | Fix                                   |
| ---------------------------------- | -------------------------------------------- | ------------------------------------- |
| 🔴 No GA script loading            | DevTools → Network → search "gtag"           | Reload page, accept cookies           |
| 🔴 Script loads but gtag undefined | `typeof window.gtag` in console              | Wait 5 sec, check errors              |
| 🟡 No data in GA dashboard         | GA Real-time report                          | Wait 30+ minutes, data updates slowly |
| 🔴 CORS/Blocked error              | DevTools Console → look for warnings         | Check server CSP headers              |
| 🟡 Banner not showing              | DevTools → check localStorage                | Clear cookies: `localStorage.clear()` |
| 🔴 Cookie not persisting           | `localStorage.getItem('cookie-preferences')` | Check browser privacy settings        |

---

## One-Minute Setup Check

```bash
# 1. Visit site
https://fraank-mcguire.com/react-migration/

# 2. Press F12 → Console tab

# 3. Accept cookies

# 4. Look in console for all these messages (in order):
[GA] Environment Check: {...}
[GA] Loading Google Analytics...
[GA] Temporary gtag function created
[GA] Script element appended to document head
[GA] Google Analytics script loaded successfully
[GA] Google Analytics configured successfully

# ✅ If you see all 6 messages: GA IS WORKING
# ❌ If messages stop early: GA IS BROKEN (see full guide)
```

---

## Network Tab Checklist

After accepting cookies, check Network tab for:

✅ **Request 1:** GET `https://www.googletagmanager.com/gtag/js?id=G-MD06T4XGJJ`

- Status: **200**
- Type: **script**

✅ **Request 2:** POST `https://www.google-analytics.com/g/collect`

- Status: **204** (no content = normal)
- Type: **fetch** or **xhr**
- Body contains: `measurement_id` and `page_path`

❌ **If either request missing or fails:** See full troubleshooting guide

---

## Console Debug Commands

```javascript
// Check if GA loaded
typeof window.gtag;
// Expected: "function" (if loaded) or "undefined" (if not)

// Check cookies saved
JSON.parse(localStorage.getItem("cookie-preferences"));
// Expected: {necessary: true, analytics: true, marketing: true}

// Check environment
import.meta.env.VITE_ANALYTICS_ENABLED;
// Expected: "true" in production

// Reset everything
localStorage.clear();
location.reload();
```

---

## GA Measurement ID

```
G-MD06T4XGJJ
```

Verify this matches:

- Browser console after GA loads
- [CookieConsentContext.tsx](../src/contexts/CookieConsentContext.tsx) line 38
- Google Analytics property settings

---

## Expected Timeline

| Time            | Status                                         |
| --------------- | ---------------------------------------------- |
| **0-5 min**     | Real-time dashboard shows user → ✅ GA working |
| **5-30 min**    | Pageviews may not appear yet (normal delay)    |
| **30+ min**     | Data should appear in reports                  |
| **24-48 hours** | Full data visible in Analytics dashboard       |

---

## Common Quick Fixes

### GA Loads But No Data in Dashboard

**Action:** Wait 30+ minutes. GA has reporting delay.

### Console Shows `[GA] Analytics disabled`

**Action:** You're in development mode. Production uses `.env.production`

```bash
npm run build:inmotion  # Uses production env
```

### Banner Never Shows

**Action:** Cookies already accepted. Reset:

```javascript
localStorage.clear();
// Reload page - banner appears again
```

### Script Failed to Load

**Action:** Check CSP headers or firewall. SSH into server:

```bash
grep "Content-Security-Policy" .htaccess
# Should allow https://www.googletagmanager.com
```

---

## Deployment Checklist

- [ ] Ran `npm run build:inmotion`
- [ ] Copied `dist/` to `fraank-mcguire.com/react-migration/`
- [ ] Visited site and accepted cookies
- [ ] Saw all 6 GA console messages
- [ ] Network tab shows gtag.js with status 200
- [ ] Network tab shows POST to google-analytics.com with status 204
- [ ] Waited 5-30 minutes
- [ ] Checked GA Real-time: should show 1 active user
- [ ] Waited 24-48 hours
- [ ] Checked GA Reports: pageviews appeared ✅

---

## Escalation Path

**Still broken after checks above?**

1. **Verify from different network** (mobile hotspot, different location)
2. **Try different browser** (Chrome, Firefox, Safari)
3. **Check InMotion** for CSP headers or firewall blocks
4. **Check GA property** is configured correctly in dashboard
5. **Review full guide:** [GA-TROUBLESHOOTING.md](GA-TROUBLESHOOTING.md)

---

## Quick Links

- **Full Troubleshooting:** [GA-TROUBLESHOOTING.md](GA-TROUBLESHOOTING.md)
- **Deployment Guide:** [DEPLOYMENT-CHECKLIST-INMOTION.md](DEPLOYMENT-CHECKLIST-INMOTION.md)
- **Implementation Code:** [src/contexts/CookieConsentContext.tsx](../src/contexts/CookieConsentContext.tsx)
- **Build Config:** [vite.config.inmotion.ts](../vite.config.inmotion.ts)

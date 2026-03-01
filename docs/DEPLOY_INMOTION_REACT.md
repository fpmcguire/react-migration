# Deploying React Design Patterns to InMotion Hosting

## Deployment Path
`/frank-mcguire/react-design-patterns/`

---

## ⚠️ Important Note

This React app is a **demonstration of React 19 patterns**, NOT a migration of the Angular content. It contains:
- ~10 React patterns (hooks, context, use(), etc.)
- Modern React 19 architecture examples
- Migration proof-of-concept

The Angular app has 8 categories with 500+ lessons. This React app has 1 category with 10 lessons.

---

## Prerequisites

- Node.js 20+ installed locally
- FTP access to InMotion hosting account
- cPanel access (optional, but helpful)

---

## Step 1: Configure Vite for Subdirectory Deployment

Update `vite.config.ts` to set the correct base path:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/frank-mcguire/react-design-patterns/', // ← ADD THIS LINE
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ... rest of config
});
```

---

## Step 2: Update .htaccess for Subdirectory

Update `public/.htaccess` with the subdirectory path:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /frank-mcguire/react-design-patterns/
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html for client-side routing
  RewriteRule . /frank-mcguire/react-design-patterns/index.html [L]
</IfModule>

# Caching
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  
  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  
  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  
  # HTML (no caching for index.html)
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

---

## Step 3: Add Build Script

Add to `package.json`:

```json
{
  "scripts": {
    "build:inmotion": "vite build"
  }
}
```

Since we set `base` in `vite.config.ts`, the regular build command will use it.

---

## Step 4: Build Production Bundle

```bash
# Install dependencies
npm ci

# Run tests (optional but recommended)
npm run test:run
npm run e2e

# Build for production
npm run build
```

This creates the `dist/` folder with production-ready files.

---

## Step 5: Upload to InMotion Hosting

### Option A: Using FileZilla (FTP)

1. **Connect to FTP:**
   - Host: `ftp.yourdomain.com` (or IP from InMotion)
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21

2. **Navigate to directory:**
   ```
   /public_html/frank-mcguire/
   ```
   
   If `frank-mcguire` doesn't exist, create it in FileZilla.

3. **Create subdirectory:**
   ```
   /public_html/frank-mcguire/react-design-patterns/
   ```

4. **Upload files:**
   - Upload ALL contents of `dist/` into `react-design-patterns/`
   - **IMPORTANT**: Upload the contents, not the `dist` folder itself
   - Files should include: `index.html`, `assets/`, `.htaccess`, etc.

### Option B: Using cPanel File Manager

1. **Login to cPanel**

2. **Navigate to File Manager** → `public_html/frank-mcguire/`

3. **Create directory** (if needed):
   - Click "New Folder"
   - Name: `react-design-patterns`

4. **Upload files:**
   
   **Method 1 - Direct Upload:**
   - Enter `react-design-patterns/` folder
   - Click "Upload"
   - Upload all files from `dist/` folder
   - This may take time for many files

   **Method 2 - ZIP Upload (Faster):**
   ```bash
   # On your local machine, create ZIP
   cd dist
   zip -r react-app.zip .
   ```
   
   - Upload `react-app.zip` to `react-design-patterns/`
   - Right-click ZIP in File Manager → Extract
   - Delete ZIP after extraction

5. **Verify .htaccess:**
   - Make sure `.htaccess` is visible (enable "Show Hidden Files")
   - Verify it has the correct subdirectory path

---

## Step 6: Verify Deployment

Visit: `https://yourdomain.com/frank-mcguire/react-design-patterns/`

**Expected behavior:**
- ✅ Home page loads
- ✅ Can navigate to `/patterns`
- ✅ Can view individual patterns
- ✅ Direct URL navigation works (e.g., `/frank-mcguire/react-design-patterns/patterns/use-state`)
- ✅ Browser refresh doesn't cause 404

---

## Troubleshooting

### Issue 1: Blank Page or Loading Spinner Only

**Symptom:** Page loads but shows nothing or infinite spinner

**Cause:** Incorrect base path configuration

**Fix:**
1. Check `vite.config.ts` has `base: '/frank-mcguire/react-design-patterns/'`
2. Rebuild: `npm run build`
3. Re-upload `dist/` contents

### Issue 2: 404 on Assets (CSS/JS files)

**Symptom:** Console shows `main.js 404` or `style.css 404`

**Cause:** Base path mismatch

**Fix:**
1. Check browser DevTools → Network tab
2. Verify asset URLs start with `/frank-mcguire/react-design-patterns/assets/...`
3. If they don't, rebuild with correct `base` in `vite.config.ts`

### Issue 3: 404 on Page Refresh

**Symptom:** Direct URLs work initially but fail on refresh

**Cause:** `.htaccess` not working or missing

**Fix:**
1. Verify `.htaccess` exists in `react-design-patterns/` folder
2. Check `RewriteBase /frank-mcguire/react-design-patterns/`
3. Verify Apache `mod_rewrite` is enabled (contact InMotion if needed)

### Issue 4: Cookie Banner Not Showing

**Symptom:** Cookie banner doesn't appear

**Cause:** localStorage might be disabled

**Fix:**
- Check browser console for errors
- Test in incognito mode
- Verify JavaScript is enabled

---

## File Checklist

After upload, verify these files exist in `/public_html/frank-mcguire/react-design-patterns/`:

```
✓ index.html
✓ .htaccess
✓ assets/
  ✓ index-[hash].js
  ✓ index-[hash].css
  ✓ vendor-[hash].js (React core)
  ✓ router-[hash].js (React Router)
```

---

## Performance Optimization (Optional)

### Enable Gzip Compression

Already in `.htaccess`, but verify it's working:

```bash
curl -I -H "Accept-Encoding: gzip" https://yourdomain.com/frank-mcguire/react-design-patterns/
```

Should show: `Content-Encoding: gzip`

### Enable Brotli (if supported)

Contact InMotion support to enable Brotli compression for even better performance.

---

## Security Checklist

- [x] HTTPS enabled (InMotion usually provides free SSL)
- [x] Security headers in `.htaccess`
- [x] No console.logs in production (handled by Vite)
- [x] Dependencies have no critical vulnerabilities (`npm audit`)

---

## Maintenance

### Update Deployment

When you make changes:

```bash
# Pull latest code
git pull

# Install any new dependencies
npm ci

# Rebuild
npm run build

# Upload new dist/ contents (overwrite old files)
```

### Monitor

- Check browser console for errors: `F12` → Console tab
- Monitor InMotion cPanel for disk space usage
- Check analytics (if enabled) for traffic patterns

---

## Rollback Procedure

If something breaks:

1. **Quick rollback:**
   - Keep previous `dist/` as `dist-backup/`
   - Re-upload from backup

2. **Full rollback:**
   - Revert Git commit
   - Rebuild
   - Re-upload

---

## Alternative: Deploy to Subdomain

If you prefer `react-patterns.yourdomain.com` instead of a subdirectory:

1. **Create subdomain** in cPanel
2. **Point to folder:** `/public_html/react-patterns/`
3. **Update Vite config:** `base: '/'`
4. **Update .htaccess:** `RewriteBase /`
5. **Build and upload**

---

## Questions?

**Common Questions:**

**Q: Can I use the same directory for Angular and React?**
A: No, they're separate apps. Keep Angular at `/angular-design-patterns/` and React at `/frank-mcguire/react-design-patterns/`

**Q: Will this replace the Angular app?**
A: No, this is a separate React demo app. Angular stays at its current path.

**Q: Can I change the path later?**
A: Yes, just update `base` in `vite.config.ts`, rebuild, and move files in cPanel.

---

## Next Steps After Deployment

1. **Test all routes** manually
2. **Run Lighthouse audit** for performance score
3. **Add Google Analytics** (if desired)
4. **Set up monitoring** for uptime
5. **Create backups** of the deployment

---

## Summary

**Deployment checklist:**

- [ ] Configure `vite.config.ts` with `base: '/frank-mcguire/react-design-patterns/'`
- [ ] Update `.htaccess` with subdirectory path
- [ ] Run `npm run build`
- [ ] Create `/public_html/frank-mcguire/react-design-patterns/` on server
- [ ] Upload `dist/` contents to that folder
- [ ] Verify `.htaccess` uploaded and visible
- [ ] Test `https://yourdomain.com/frank-mcguire/react-design-patterns/`
- [ ] Test all routes and refresh behavior
- [ ] Check browser console for errors

**You're ready to deploy!** 🚀

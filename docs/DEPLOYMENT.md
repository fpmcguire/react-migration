# Deployment Guide

This guide covers deploying the React Design Patterns app to various platforms.

---

## 🎯 InMotion Hosting (Recommended for this project)

**Deployment URL:** `https://frank-mcguire.com/react-design-patterns/`

InMotion Hosting provides shared hosting with cPanel, perfect for static React applications. This section provides complete step-by-step instructions.

### Important Notes

✅ **Static-only deployment** - No SSR configured (InMotion doesn't support Node.js SSR on shared hosting)  
✅ **Subdirectory deployment** - App deploys to `/react-design-patterns/`  
✅ **SPA routing** - Client-side routing handled via `.htaccess`  

### Prerequisites

- Node.js 20+ installed locally
- InMotion cPanel access
- FTP credentials (optional, for FileZilla)

---

### Step 1: Pre-Deployment Validation

Run all checks before building:

```bash
# Type check
npm run type-check

# Run unit tests
npm run test:run

# Run E2E tests (optional but recommended)
npm run e2e

# Full validation
npm run validate
```

All tests should pass with no TypeScript errors.

---

### Step 2: Build for Production

Use the InMotion-specific build script:

```bash
npm run build:inmotion
```

This command:
- ✅ Compiles TypeScript
- ✅ Sets base path to `/react-design-patterns/`
- ✅ Bundles and minifies code
- ✅ Removes console.logs
- ✅ Optimizes assets
- ✅ Generates `dist/` folder

**Verify build:**
```bash
# Check dist folder exists
ls dist/

# Should contain: index.html, assets/, .htaccess
```

---

### Step 3: Deploy via cPanel File Manager (Recommended)

#### 3.1: Login to cPanel

Visit: `https://frank-mcguire.com/cpanel` (or your cPanel URL)

#### 3.2: Navigate to File Manager

- Click **File Manager** icon
- Navigate to: `public_html/`
- Create folder (if it doesn't exist): `react-design-patterns`

#### 3.3: Upload Files

**Method A - Direct Upload (slower, many files):**

1. Enter `react-design-patterns/` folder
2. Click **Upload** button
3. Upload ALL files from `dist/` folder:
   - `index.html`
   - `assets/` folder (with all contents)
   - `.htaccess`
   - Any other generated files

**Method B - ZIP Upload (faster, recommended):**

```bash
# On your local machine
cd dist
zip -r react-app.zip .
```

1. Upload `react-app.zip` to `react-design-patterns/` folder
2. Right-click ZIP file → **Extract**
3. Extract to current directory
4. Delete `react-app.zip` after extraction

#### 3.4: Verify .htaccess

1. Enable **Show Hidden Files** (checkbox in File Manager)
2. Verify `.htaccess` exists in `react-design-patterns/` folder
3. Right-click `.htaccess` → **Edit**
4. Confirm it contains:
   ```apache
   RewriteBase /react-design-patterns/
   RewriteRule . /react-design-patterns/index.html [L]
   ```

---

### Step 4: Deploy via FTP (Alternative)

If you prefer FileZilla or another FTP client:

#### 4.1: FTP Connection Details

- **Host:** `ftp.frank-mcguire.com` (or IP from InMotion)
- **Username:** Your FTP username (from cPanel)
- **Password:** Your FTP password
- **Port:** 21 (standard FTP)

#### 4.2: Upload Files

1. Connect to FTP
2. Navigate to: `public_html/react-design-patterns/`
3. Upload ALL contents of `dist/` folder
4. **IMPORTANT:** Upload the contents, not the `dist` folder itself

**Expected structure on server:**
```
public_html/
└── react-design-patterns/
    ├── index.html
    ├── .htaccess
    ├── assets/
    │   ├── index-[hash].js
    │   ├── index-[hash].css
    │   ├── react-vendor-[hash].js
    │   └── router-[hash].js
    └── (other generated files)
```

---

### Step 5: Verify Deployment

#### 5.1: Visit Your Site

Open: `https://frank-mcguire.com/react-design-patterns/`

#### 5.2: Test Core Functionality

- [ ] Home page loads
- [ ] Navigation works (Home ↔ Patterns)
- [ ] Can click individual patterns
- [ ] Pattern detail pages load
- [ ] Cookie banner appears on first visit
- [ ] Browser refresh doesn't cause 404
- [ ] Direct URL access works (e.g., `/react-design-patterns/patterns/use-state`)

#### 5.3: Check Browser Console

Press `F12` → Console tab
- [ ] No JavaScript errors
- [ ] No 404 errors for assets
- [ ] All CSS/JS files loading correctly

---

### Step 6: Performance Verification

#### 6.1: Lighthouse Audit

1. Open DevTools (`F12`)
2. Navigate to **Lighthouse** tab
3. Run audit (Desktop or Mobile)

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

#### 6.2: Check Loading Speed

Visit: `https://www.webpagetest.org/`
- Test URL: `https://frank-mcguire.com/react-design-patterns/`
- Target: First Contentful Paint < 1.8s

---

### Troubleshooting

#### Issue: Blank Page or Infinite Loading

**Symptom:** Page loads but shows nothing or spinner only

**Cause:** Incorrect base path configuration

**Fix:**
1. Verify you used `npm run build:inmotion` (not `npm run build`)
2. Check browser DevTools → Network tab
3. Assets should load from `/react-design-patterns/assets/...`
4. If assets are trying to load from `/assets/...`, rebuild with correct config

---

#### Issue: 404 on Assets (CSS/JS Not Loading)

**Symptom:** Console shows `main.js 404` or `styles.css 404`

**Cause:** Base path mismatch or incorrect upload

**Fix:**
1. Check `vite.config.inmotion.ts` has `base: '/react-design-patterns/'`
2. Rebuild: `npm run build:inmotion`
3. Re-upload `dist/` contents
4. Verify folder structure on server

---

#### Issue: 404 on Page Refresh

**Symptom:** Direct URLs work initially but fail on refresh

**Cause:** `.htaccess` not working or missing

**Fix:**
1. Verify `.htaccess` exists in `react-design-patterns/` folder
2. Enable "Show Hidden Files" in File Manager
3. Check `.htaccess` content:
   ```apache
   RewriteBase /react-design-patterns/
   RewriteRule . /react-design-patterns/index.html [L]
   ```
4. If still not working, contact InMotion support to verify `mod_rewrite` is enabled

---

#### Issue: Styles Not Applied

**Symptom:** Page loads but no styling

**Cause:** CSS files not uploading or incorrect paths

**Fix:**
1. Check `assets/` folder uploaded completely
2. Verify CSS files exist: `assets/index-[hash].css`
3. Check browser Network tab for 404s
4. Clear browser cache and retry

---

#### Issue: Cookie Banner Not Working

**Symptom:** Cookie banner doesn't appear

**Cause:** localStorage disabled or JavaScript error

**Fix:**
1. Check browser console for errors
2. Test in incognito mode
3. Verify JavaScript is enabled
4. Check if browser blocks third-party cookies

---

### Maintenance & Updates

#### Deploying Updates

When you make changes:

```bash
# Pull latest code
git pull

# Install any new dependencies
npm ci

# Validate
npm run validate

# Build for production
npm run build:inmotion

# Upload new dist/ contents (overwrite existing files)
```

#### Rollback Procedure

If something breaks:

1. **Quick rollback:**
   - Keep previous `dist/` as `dist-backup/`
   - Re-upload from backup via cPanel

2. **Full rollback:**
   - Revert Git commit: `git revert HEAD`
   - Rebuild: `npm run build:inmotion`
   - Re-upload

---

### Performance Optimization

#### Enable Compression (Already in .htaccess)

Verify gzip is working:

```bash
curl -I -H "Accept-Encoding: gzip" https://frank-mcguire.com/react-design-patterns/
```

Should show: `Content-Encoding: gzip`

#### Long-term Caching

Asset files already have cache headers in `.htaccess`:
- Images: 1 year
- CSS/JS: 1 month
- HTML: No cache (always fresh)

---

### Security Checklist

- [x] HTTPS enabled (InMotion provides free SSL)
- [x] Security headers in `.htaccess`
- [x] No console.logs in production (removed by build)
- [x] Dependencies have no critical vulnerabilities (`npm audit`)
- [x] XSS protection enabled
- [x] Content-Type sniffing prevented

---

### Monitoring (Optional)

#### Add Google Analytics

Edit `index.html` before building to add:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Monitor: `https://frank-mcguire.com/react-design-patterns/`

---

### Support

**InMotion Support:**
- Live Chat: Available 24/7
- Phone: Check your InMotion account
- Tickets: Via cPanel

**Common InMotion Questions:**

**Q: Does InMotion support Node.js?**  
A: Shared hosting doesn't support SSR, but static React apps work perfectly (what we're deploying).

**Q: Is mod_rewrite enabled?**  
A: Yes, on all InMotion shared hosting plans.

**Q: Can I use a custom domain?**  
A: Yes, you can point a subdomain to this folder via cPanel.

**Q: What's the file size limit?**  
A: Varies by plan, but our build (~2-5MB) is well within limits.

---

### Quick Reference

**Build Command:**
```bash
npm run build:inmotion
```

**Upload Location:**
```
public_html/react-design-patterns/
```

**Live URL:**
```
https://frank-mcguire.com/react-design-patterns/
```

**Critical Files:**
- `vite.config.inmotion.ts` - Sets base path
- `public/.htaccess` - SPA routing
- `package.json` - Build script

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (`npm run test` and `npm run e2e`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Build completes successfully (`npm run build`)
- [ ] Environment variables configured
- [ ] Bundle size is acceptable (< 500KB initial)
- [ ] Performance tested (Lighthouse score ≥ 90)
- [ ] Accessibility checked (no WCAG violations)
- [ ] Browser testing complete (Chrome, Firefox, Safari)
- [ ] Mobile responsive verified

---

## Build Optimization

### Analyze Bundle Size

```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Build and analyze
npm run build
# Opens stats.html in browser showing bundle composition
```

### Performance Tips

1. **Lazy load routes** ✓ (Already implemented)
2. **Code splitting** ✓ (Vendor chunks configured)
3. **Image optimization** - Use WebP format, compress images
4. **Remove console.logs** ✓ (Removed in production build)
5. **Enable compression** - Configure on hosting platform

---

## Deployment Options

### Option 1: Netlify (Recommended - Easiest)

**Automatic Deployment:**

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect to GitHub repo
5. Configure build:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. Deploy!

**Manual Configuration:**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Deploy via CLI:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

### Option 2: Vercel

**Automatic Deployment:**

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project
4. Vercel auto-detects Vite
5. Deploy!

**Configuration:**

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Deploy via CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

### Option 3: GitHub Pages

**Setup:**

1. Install gh-pages:
   ```bash
   npm install -D gh-pages
   ```

2. Update `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/react-design-patterns",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.ts` for correct base path:
   ```typescript
   export default defineConfig({
     base: '/react-design-patterns/',
     // ... rest of config
   });
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages in repo settings (gh-pages branch)

---

### Option 4: AWS S3 + CloudFront

**Setup S3 Bucket:**

```bash
# Create bucket
aws s3 mb s3://react-design-patterns

# Configure for static hosting
aws s3 website s3://react-design-patterns \
  --index-document index.html \
  --error-document index.html

# Upload build
npm run build
aws s3 sync dist/ s3://react-design-patterns --delete
```

**CloudFront Configuration:**

1. Create CloudFront distribution
2. Origin: S3 bucket
3. Default root object: `index.html`
4. Custom error pages: 403 → /index.html (for SPA routing)
5. Enable HTTPS
6. Set caching headers

**Automated deployment script:**

```bash
#!/bin/bash
# deploy-aws.sh

npm run build
aws s3 sync dist/ s3://react-design-patterns --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

### Option 5: Traditional Apache/Nginx

**Apache (.htaccess)** - Already included in `public/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx config:**

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/react-design-patterns/dist;
  index index.html;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

  # Cache static assets
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Security headers
  add_header X-Frame-Options "DENY";
  add_header X-Content-Type-Options "nosniff";
  add_header X-XSS-Protection "1; mode=block";
}
```

**Deploy:**

```bash
npm run build
rsync -avz dist/ user@server:/var/www/react-design-patterns/
```

---

## Environment Variables

### Development (`.env.local`)

```bash
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
```

### Production

Configure in hosting platform:
- **Netlify**: Site settings → Environment variables
- **Vercel**: Project settings → Environment Variables
- **GitHub Pages**: Use GitHub Secrets + Actions

**Access in code:**

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const isDebug = import.meta.env.VITE_DEBUG === 'true';
```

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test -- --run
      
      - name: Build
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Performance Optimization

### 1. Image Optimization

```bash
# Install image optimization tool
npm install -D vite-plugin-imagemin

# Add to vite.config.ts
import viteImagemin from 'vite-plugin-imagemin';

plugins: [
  viteImagemin({
    gifsicle: { optimizationLevel: 7 },
    mozjpeg: { quality: 80 },
    pngquant: { quality: [0.8, 0.9] },
    svgo: { plugins: [{ name: 'removeViewBox', active: false }] },
  }),
]
```

### 2. Preload Critical Assets

Add to `index.html`:

```html
<link rel="preload" as="style" href="/src/styles/global.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
```

### 3. Enable Brotli Compression

Most modern CDNs (Netlify, Vercel) automatically enable this.

For custom servers, configure compression middleware.

---

## Monitoring & Analytics

### Add Analytics (Optional)

```typescript
// src/utils/analytics.ts
export function initAnalytics() {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    // Initialize analytics (e.g., Google Analytics, Plausible)
  }
}

// In main.tsx
initAnalytics();
```

### Error Monitoring (Optional)

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: 'production',
  });
}
```

---

## Post-Deployment Checklist

After deployment:

- [ ] Visit live URL and test all routes
- [ ] Test cookie consent flow
- [ ] Verify mobile responsiveness
- [ ] Run Lighthouse audit (aim for 90+ in all categories)
- [ ] Test in multiple browsers
- [ ] Verify error pages (404, etc.)
- [ ] Check analytics/monitoring setup
- [ ] Test from different geographic locations
- [ ] Verify HTTPS is enabled
- [ ] Check security headers
- [ ] Test performance (< 3s load time)

---

## Rollback Strategy

### Netlify/Vercel
- Both platforms keep deployment history
- Click "Rollback" in dashboard to previous version

### GitHub Pages
```bash
git revert HEAD
git push
npm run deploy
```

### AWS S3
- Keep previous build in separate folder
- Restore from S3 versioning or backup

---

## Domain Configuration

### Custom Domain on Netlify

1. Domains tab → Add custom domain
2. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```
3. Netlify auto-provisions SSL

### Custom Domain on Vercel

1. Project settings → Domains
2. Add domain
3. Configure DNS as instructed
4. SSL auto-enabled

---

## Troubleshooting

### Build fails on hosting platform

- Check Node version matches local (20.x)
- Verify all dependencies in package.json
- Check build logs for errors

### 404 on page refresh

- Ensure SPA routing configured (see platform-specific configs above)
- Verify `.htaccess` or server config is deployed

### Slow load times

- Run bundle analyzer
- Check image sizes
- Enable compression
- Use CDN for static assets

### Environment variables not working

- Ensure they're prefixed with `VITE_`
- Check they're set in hosting platform
- Rebuild after changing env vars

---

## Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Web Performance Best Practices](https://web.dev/fast/)

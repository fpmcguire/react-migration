# Production Deployment Checklist

Use this checklist before deploying to production.

---

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] Code follows conventions and best practices
- [ ] No debugging code (console.log, debugger) in production code
- [ ] Sensitive data removed (API keys, secrets)
- [ ] Comments are clear and up-to-date

### Testing
- [ ] All unit tests pass (`npm run test:run`)
- [ ] Test coverage ≥ 80% (`npm run test:coverage`)
- [ ] All E2E tests pass (`npm run e2e`)
- [ ] Manual testing complete (critical user flows)
- [ ] Edge cases tested (error states, empty states)

### Performance
- [ ] Build completes successfully (`npm run build`)
- [ ] Bundle size analyzed (`npm run build:analyze`)
- [ ] Initial bundle < 500KB
- [ ] Images optimized (compressed, WebP format)
- [ ] Lazy loading implemented for routes
- [ ] Unnecessary dependencies removed

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible
- [ ] ARIA labels present where needed
- [ ] Forms have proper labels

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Responsive Design
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large mobile (414x896)

### Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] XSS protection in place
- [ ] CSRF protection (if forms present)
- [ ] Input validation implemented
- [ ] Dependencies updated (no critical vulnerabilities)

---

## Deployment Configuration

### Environment Variables
- [ ] Production env vars configured on hosting platform
- [ ] API URLs point to production
- [ ] Analytics/monitoring keys set
- [ ] Debug mode disabled in production
- [ ] Feature flags configured

### Build Settings
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Node version: 20.x
- [ ] Environment: production

### Hosting Configuration
- [ ] SPA routing configured (redirects to index.html)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] CDN enabled
- [ ] Compression enabled (gzip/brotli)
- [ ] Cache headers configured

---

## During Deployment

### Monitoring
- [ ] Watch deployment logs for errors
- [ ] Verify build completes successfully
- [ ] Check deployment time (should be < 5 minutes)

### Smoke Testing
- [ ] Home page loads
- [ ] All routes accessible
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] Images load
- [ ] Styles applied correctly

---

## Post-Deployment

### Functional Testing
- [ ] Critical user flows work
- [ ] Cookie consent flow
- [ ] Pattern filtering
- [ ] Navigation between pages
- [ ] Error pages display (404, etc.)
- [ ] Mobile experience verified

### Performance Testing
- [ ] Lighthouse audit (aim for 90+ in all categories)
  - [ ] Performance ≥ 90
  - [ ] Accessibility ≥ 90
  - [ ] Best Practices ≥ 90
  - [ ] SEO ≥ 90
- [ ] Page load time < 3 seconds (3G connection)
- [ ] Time to Interactive < 5 seconds
- [ ] No layout shifts (CLS < 0.1)

### Security Testing
- [ ] Security headers present (check via securityheaders.com)
- [ ] HTTPS working correctly
- [ ] No mixed content warnings
- [ ] CSP headers configured (if applicable)

### Cross-Region Testing
- [ ] Test from different geographic locations
- [ ] Verify CDN serving content correctly
- [ ] Check latency from different regions

### Monitoring Setup
- [ ] Analytics tracking (if enabled)
- [ ] Error monitoring active (if enabled)
- [ ] Uptime monitoring configured
- [ ] Alerts set up for critical issues

### Documentation
- [ ] Deployment documented
- [ ] Rollback procedure documented
- [ ] Environment variables documented
- [ ] Known issues documented (if any)

---

## Rollback Plan

In case of issues:

### Immediate Actions
- [ ] Identify the issue
- [ ] Assess impact (critical/non-critical)
- [ ] Decide: fix forward or rollback

### Rollback Steps (Netlify/Vercel)
1. Go to hosting dashboard
2. Navigate to deployments
3. Find previous stable deployment
4. Click "Publish" or "Rollback"
5. Verify site is restored

### Fix Forward
If issue is minor:
1. Fix in new branch
2. Test locally
3. Create PR
4. Merge after review
5. Auto-deploy via CI/CD

---

## Success Metrics

After deployment, monitor:

- **Uptime**: Should be 99.9%+
- **Performance**: 
  - TTFB < 600ms
  - FCP < 1.8s
  - LCP < 2.5s
- **Error Rate**: < 0.1%
- **User Engagement**: Track via analytics

---

## Maintenance Schedule

### Daily
- [ ] Monitor error logs
- [ ] Check uptime status

### Weekly
- [ ] Review analytics
- [ ] Check for dependency updates
- [ ] Review performance metrics

### Monthly
- [ ] Security audit
- [ ] Lighthouse audit
- [ ] Update dependencies
- [ ] Review and optimize bundle size

---

## Sign-off

**Deployment Date**: _______________

**Deployed By**: _______________

**Version/Commit**: _______________

**Checklist Completed By**: _______________

**Issues Found**: _______________

**Notes**: 
```





```

**Approval**: _______________

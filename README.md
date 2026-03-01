# React Design Patterns

A comprehensive catalog of modern React 19 design patterns, professionally migrated from Angular 21.

**Live Demo**: [Your deployed URL]

[![CI/CD](https://github.com/yourusername/react-design-patterns/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/yourusername/react-design-patterns/actions)
[![codecov](https://codecov.io/gh/yourusername/react-design-patterns/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/react-design-patterns)

---

## 🚀 Tech Stack

- **React 19** - Modern React with hooks, Suspense, and `use()` hook
- **TypeScript 5** - Type-safe development with strict mode
- **Vite** - Lightning-fast dev server and optimized production builds
- **React Router v6** - Client-side routing with lazy loading
- **Vitest** - Fast unit testing framework
- **React Testing Library** - User-centric component testing
- **Playwright** - Cross-browser E2E testing
- **CSS Modules** - Scoped styling with design tokens

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/react-design-patterns.git
cd react-design-patterns

# Install dependencies
npm install

# Set up environment (optional)
cp .env.example .env.local
```

---

## 🛠️ Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run e2e

# Type check
npm run type-check

# Run all checks
npm run validate
```

---

## 🏗️ Build

```bash
# Production build
npm run build

# Build with bundle analysis
npm run build:analyze

# Preview production build
npm run preview
```

**Build output**: `dist/` directory

---

## 🧪 Testing

### Unit & Component Tests (Vitest + React Testing Library)

```bash
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # With coverage report
npm run test:ui           # Interactive UI
```

**Coverage**: 48 tests across contexts, components, and pages

### E2E Tests (Playwright)

```bash
npm run e2e               # All browsers
npm run e2e:headed        # See browser
npm run e2e:debug         # Debug mode
```

**Coverage**: 12 user flow scenarios across Chrome, Firefox, Safari, and mobile

See [TESTING-GUIDE.md](./TESTING-GUIDE.md) for detailed testing documentation.

---

## 🚀 Deployment

### Quick Deploy

**Netlify** (Recommended):
```bash
# Deploy via Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Vercel**:
```bash
# Deploy via Vercel CLI
npm install -g vercel
vercel --prod
```

### Platform-Specific Guides

- **Netlify**: See [netlify.toml](./netlify.toml) - Auto-configured
- **Vercel**: See [vercel.json](./vercel.json) - Auto-configured  
- **GitHub Pages**: See [DEPLOYMENT.md](./DEPLOYMENT.md#option-3-github-pages)
- **AWS S3**: See [DEPLOYMENT.md](./DEPLOYMENT.md#option-4-aws-s3--cloudfront)
- **Traditional Hosting**: See [DEPLOYMENT.md](./DEPLOYMENT.md#option-5-traditional-apachenginx)

### CI/CD

GitHub Actions workflow included (`.github/workflows/ci-cd.yml`):
- Runs tests on every push/PR
- Auto-deploys to Netlify on merge to main
- Preview deployments for PRs

**Required Secrets**:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

See complete deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── AppShell.tsx
│   ├── CookieBanner.tsx
│   ├── LoadingOverlay.tsx
│   └── RouteWrapper.tsx
├── pages/          # Route pages (lazy-loaded)
│   ├── HomePage.tsx
│   ├── PatternsListPage.tsx
│   └── PatternDetailPage.tsx
├── contexts/       # React Context providers
│   ├── LoadingContext.tsx
│   └── CookieConsentContext.tsx
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
│   └── lessonPromiseCache.ts
├── models/         # TypeScript interfaces/types
├── data/           # Static data
├── styles/         # Global styles and design tokens
│   ├── tokens.css
│   └── global.css
└── test/           # Test utilities
    ├── setup.ts
    └── test-utils.tsx
```

---

## 🎨 Design System

This project uses CSS Custom Properties for design tokens. All design values are defined in `src/styles/tokens.css`:

- **Colors**: Primary, surface, text, semantic colors
- **Spacing**: 6-point scale (xs to 2xl)
- **Typography**: Font families, sizes, weights, line heights
- **Effects**: Border radius, shadows, transitions
- **Z-index**: Layering scale

Dark mode support included via `prefers-color-scheme`.

---

## 📚 Key React Patterns Implemented

This catalog demonstrates modern React 19 patterns:

### 🎯 Core Patterns

1. **React 19 `use()` Hook** - Data loading with Suspense
   ```tsx
   // CRITICAL: Promise at module level
   const promise = getLessonPromise('data', DATA);
   
   function Component() {
     const data = use(promise); // Suspends correctly
   }
   ```

2. **Context Splitting** - Performance optimization
   ```tsx
   // Separate state and actions contexts
   const StateContext = createContext(...);
   const ActionsContext = createContext(...);
   // Components using only actions don't re-render on state change
   ```

3. **Suspense + ErrorBoundary** - Route protection
   ```tsx
   <ErrorBoundary FallbackComponent={ErrorFallback}>
     <Suspense fallback={<Loading />}>
       <LazyRoute />
     </Suspense>
   </ErrorBoundary>
   ```

4. **createPortal** - Overlay rendering
   ```tsx
   return createPortal(<Overlay />, document.body);
   ```

5. **useTransition** - Non-urgent updates
   ```tsx
   const [isPending, startTransition] = useTransition();
   startTransition(() => setFilter(category));
   ```

### 🔧 Additional Patterns

- **React.memo + useCallback** - Prevent unnecessary re-renders
- **useReducer** - Complex state management
- **Lazy Loading** - Code splitting with `React.lazy()`
- **Custom Hooks** - Reusable stateful logic
- **CSS Modules** - Scoped styling

---

## 🚨 Critical Implementation Notes

### React 19 `use()` Hook Gotcha

```tsx
// ❌ WRONG - Creates new Promise every render
function Component() {
  const promise = fetchData();
  const data = use(promise); // Infinite suspend loop!
}

// ✅ CORRECT - Promise created at module level
const promise = fetchData();
function Component() {
  const data = use(promise); // Works!
}
```

### All Lazy Routes Must Be Wrapped

```tsx
// RouteWrapper provides BOTH Suspense and ErrorBoundary
<RouteWrapper>
  <LazyComponent />
</RouteWrapper>
```

Without this, lazy loading failures crash the app silently.

---

## 🔒 Security

Security features implemented:

- ✅ HTTPS enforced (via hosting platform)
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ XSS protection
- ✅ Content type sniffing prevention
- ✅ Strict referrer policy
- ✅ No console.logs in production builds

See [netlify.toml](./netlify.toml) for security header configuration.

---

## ⚡ Performance

Performance optimizations:

- ✅ Lazy-loaded routes (code splitting)
- ✅ Vendor chunk splitting (React, Router separate)
- ✅ Long-term asset caching
- ✅ Minification (Terser)
- ✅ Tree shaking
- ✅ CSS Modules (scoped styles, smaller bundles)
- ✅ Context splitting (prevent unnecessary re-renders)

**Lighthouse Score Target**: 90+ in all categories

---

## 📖 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide (5 platforms)
- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - Testing strategies and examples
- [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md) - Pre-deployment checklist
- [Migration Guide](./docs/) - Angular → React migration documentation (5 parts)

---

## 🤝 Contributing

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm run validate

# Commit with conventional commits
git commit -m "feat: add new pattern"

# Push and create PR
git push origin feature/your-feature
```

---

## 📊 Project Stats

- **Components**: 8 (4 pages, 4 shared)
- **Contexts**: 2 (LoadingContext, CookieConsentContext)
- **Tests**: 48 (36 unit/component, 12 E2E)
- **Test Coverage**: ~80%
- **Bundle Size**: ~250KB (initial, gzipped)
- **TypeScript**: 100% (strict mode)

---

## 🔗 Resources

- [React 19 Documentation](https://react.dev)
- [React Router v6](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [Vitest](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev)

---

## 📜 License

MIT © [Your Name]

---

## 🙏 Acknowledgments

- Migrated from Angular 21 using modern React 19 patterns
- Designed for professional Angular developers transitioning to React
- Built with production-ready best practices

# Testing Guide

This project uses **Vitest** for unit/component tests and **Playwright** for E2E tests.

---

## Unit & Component Tests (Vitest + React Testing Library)

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage

# Run tests with UI
npm run test:ui
```

### Test Structure

```
src/
├── contexts/
│   ├── LoadingContext.tsx
│   └── LoadingContext.test.tsx          ✅ Context tests
├── components/
│   ├── CookieBanner.tsx
│   └── CookieBanner.test.tsx            ✅ Component tests
└── pages/
    ├── PatternsListPage.tsx
    └── PatternsListPage.test.tsx        ✅ Page tests
```

### Test Utilities

**`src/test/test-utils.tsx`** - Custom render with providers:

```tsx
import { render } from './test/test-utils';

// Automatically wraps with BrowserRouter + LoadingProvider
render(<MyComponent />);
```

**`src/test/setup.ts`** - Global test setup:
- `@testing-library/jest-dom` matchers
- `window.matchMedia` mock
- `IntersectionObserver` mock

### Writing Tests

#### Context Tests

```tsx
import { renderHook, act } from '@testing-library/react';
import { LoadingProvider, useLoading } from '../contexts/LoadingContext';

it('should start loading', () => {
  const { result } = renderHook(() => useLoading(), {
    wrapper: LoadingProvider,
  });
  
  act(() => {
    result.current.start();
  });
  
  expect(result.current.isLoading).toBe(true);
});
```

#### Component Tests

```tsx
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { render } from '../test/test-utils';
import { MyComponent } from './MyComponent';

it('should handle click', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  
  render(<MyComponent onClick={onClick} />);
  
  await user.click(screen.getByRole('button'));
  
  expect(onClick).toHaveBeenCalled();
});
```

#### Testing use() Hook

```tsx
import { Suspense } from 'react';
import { waitFor } from '@testing-library/react';

function Wrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComponentWithUseHook />
    </Suspense>
  );
}

it('should load data', async () => {
  render(<Wrapper />);
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Query Priority

Following React Testing Library best practices:

1. **getByRole** - ✅ Most accessible
2. **getByLabelText** - Forms
3. **getByText** - Visible text
4. **getByTestId** - Last resort

---

## E2E Tests (Playwright)

### Running E2E Tests

```bash
# Run all E2E tests
npm run e2e

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test e2e/app.spec.ts

# Debug mode
npx playwright test --debug

# Show test report
npx playwright show-report
```

### Test Structure

```
e2e/
└── app.spec.ts          ✅ Main user flows
```

### Writing E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('should navigate to patterns', async ({ page }) => {
  await page.goto('/');
  
  await page.getByRole('link', { name: /patterns/i }).click();
  
  await expect(page).toHaveURL('/patterns');
  await expect(page.getByText('useState Hook')).toBeVisible();
});
```

### E2E Test Coverage

✅ Home page navigation  
✅ Patterns page filtering  
✅ Pattern detail navigation  
✅ Cookie consent flow  
✅ Header navigation  
✅ 404 error page  
✅ Mobile responsiveness  

---

## Test Coverage

Current coverage includes:

### Contexts
- ✅ LoadingContext (state, actions, error cases)
- ✅ CookieConsentContext (preferences, localStorage)

### Components
- ✅ CookieBanner (rendering, interactions, accessibility)
- ✅ LoadingOverlay (visibility, context integration)

### Pages
- ✅ HomePage (basic rendering, links)
- ✅ PatternsListPage (filtering, use() hook, transitions)

### E2E Flows
- ✅ Full user journey (home → patterns → detail)
- ✅ Cookie consent
- ✅ Navigation
- ✅ Error handling

---

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test -- --coverage
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Best Practices

### ✅ DO
- Query by role/label for accessibility
- Use `userEvent` for interactions (not `fireEvent`)
- Test user behavior, not implementation
- Mock as little as possible
- Use `waitFor` for async operations
- Test error states and edge cases

### ❌ DON'T
- Query by class names or test IDs (use sparingly)
- Test internal state directly
- Use `act()` manually (React Testing Library handles it)
- Mock entire modules unless necessary
- Write brittle snapshot tests

---

## Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm run test LoadingContext.test.tsx

# Run with debugger
node --inspect-brk ./node_modules/.bin/vitest run

# Use console.log in tests (output shows in terminal)
```

### E2E Tests

```bash
# Debug mode (opens inspector)
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Slow motion
npx playwright test --headed --slow-mo=1000

# Take screenshots
await page.screenshot({ path: 'screenshot.png' });
```

---

## Common Issues

### "Hook called outside component"
Wrap hooks in `renderHook` with proper wrapper:

```tsx
renderHook(() => useMyHook(), {
  wrapper: MyProvider,
});
```

### "Not wrapped in act(...)"
Use `@testing-library/react`'s utilities - they handle `act()` automatically.

### E2E: Element not found
Add `await expect(element).toBeVisible()` to wait for element.

---

## Additional Resources

- [Vitest Docs](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { AppShell } from './components/AppShell';
import { RouteWrapper } from './components/RouteWrapper';

/**
 * Router Configuration
 * 
 * CRITICAL: All lazy-loaded routes are wrapped with RouteWrapper
 * which provides Suspense + ErrorBoundary
 */

// Lazy-loaded page components
const HomePage = lazy(() => import('./pages/HomePage'));
const PatternsListPage = lazy(() => import('./pages/PatternsListPage'));
const PatternDetailPage = lazy(() => import('./pages/PatternDetailPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <RouteWrapper>
            <HomePage />
          </RouteWrapper>
        ),
      },
      {
        path: 'patterns',
        element: (
          <RouteWrapper>
            <PatternsListPage />
          </RouteWrapper>
        ),
      },
      {
        path: 'patterns/:id',
        element: (
          <RouteWrapper>
            <PatternDetailPage />
          </RouteWrapper>
        ),
      },
      {
        path: '*',
        element: (
          <RouteWrapper>
            <NotFoundPage />
          </RouteWrapper>
        ),
      },
    ],
  },
]);

// Simple 404 page (not lazy-loaded since it's small)
function NotFoundPage() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: 'var(--spacing-2xl)',
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
        The page you're looking for doesn't exist.
      </p>
      <a 
        href="/" 
        style={{ 
          marginTop: 'var(--spacing-lg)',
          color: 'var(--color-primary)',
          fontSize: 'var(--font-size-lg)',
        }}
      >
        Go Home
      </a>
    </div>
  );
}

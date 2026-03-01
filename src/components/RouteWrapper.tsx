import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingOverlay } from './LoadingOverlay';
import { RouteErrorFallback } from './RouteErrorFallback';

interface RouteWrapperProps {
  children: ReactNode;
}

/**
 * RouteWrapper - Wraps all lazy-loaded routes
 * 
 * CRITICAL: ALL lazy routes MUST be wrapped with BOTH:
 * 1. ErrorBoundary (catches component errors + lazy load failures)
 * 2. Suspense (catches React.lazy() loading state)
 * 
 * Order matters: ErrorBoundary must be outer wrapper
 * 
 * Why both?
 * - Suspense: Handles loading state when React.lazy() is resolving
 * - ErrorBoundary: Handles errors during lazy load OR component render
 * 
 * Without this wrapper:
 * - Lazy load failures crash the app silently
 * - Component errors propagate to root
 * - No loading UI during route transitions
 */
export function RouteWrapper({ children }: RouteWrapperProps) {
  return (
    <ErrorBoundary 
      FallbackComponent={RouteErrorFallback}
      onReset={() => window.location.href = '/'}
    >
      <Suspense fallback={<LoadingOverlay open />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

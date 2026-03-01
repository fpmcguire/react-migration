import { FallbackProps } from 'react-error-boundary';
import styles from './RouteErrorFallback.module.css';

/**
 * RouteErrorFallback - Error UI for route-level errors
 * 
 * Handles two types of errors:
 * 1. Lazy load failures (network issues, chunk load errors)
 * 2. Component render errors (bugs in code)
 */
export function RouteErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const isChunkError = error.message?.includes('Failed to fetch dynamically imported module') ||
                       error.message?.includes('error loading dynamically imported module');
  
  return (
    <div className={styles.container} role="alert">
      <div className={styles.content}>
        <h1 className={styles.title}>
          {isChunkError ? 'Failed to Load Page' : 'Something Went Wrong'}
        </h1>
        
        <p className={styles.message}>
          {isChunkError 
            ? 'The page failed to load. This might be due to a network issue or a new version of the app being deployed.'
            : 'An unexpected error occurred while displaying this page.'
          }
        </p>
        
        {import.meta.env.MODE === 'development' && (
          <details className={styles.details}>
            <summary className={styles.detailsSummary}>Error Details</summary>
            <pre className={styles.errorStack}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className={styles.actions}>
          <button 
            onClick={resetErrorBoundary}
            className={styles.button}
          >
            Try Again
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className={styles.buttonSecondary}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

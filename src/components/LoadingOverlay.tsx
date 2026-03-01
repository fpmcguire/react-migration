import { createPortal } from 'react-dom';
import { useLoadingState } from '../contexts/LoadingContext';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
  open?: boolean;
}

/**
 * LoadingOverlay - Global loading indicator
 * 
 * CRITICAL: Uses createPortal to render outside AppShell's DOM hierarchy
 * This ensures the overlay appears above all other content, even fixed/sticky elements
 * 
 * Two usage modes:
 * 1. Controlled (open prop): For Suspense fallback
 * 2. Connected (no props): Auto-shows when LoadingContext.isLoading is true
 */
export function LoadingOverlay({ open }: LoadingOverlayProps) {
  const contextLoading = useLoadingState();
  const isOpen = open !== undefined ? open : contextLoading;
  
  if (!isOpen) return null;
  
  // Render to document.body to escape stacking context
  return createPortal(
    <div 
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.spinner}>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
      </div>
      <p className={styles.text}>Loading...</p>
    </div>,
    document.body
  );
}

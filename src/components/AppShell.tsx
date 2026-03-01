import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LoadingProvider } from '../contexts/LoadingContext';
import { CookieConsentProvider } from '../contexts/CookieConsentContext';
import { LoadingOverlay } from './LoadingOverlay';
import { CookieBanner } from './CookieBanner';
import styles from './AppShell.module.css';

/**
 * AppShell - Main application layout
 * 
 * Provides:
 * - LoadingProvider for global loading state
 * - CookieConsentProvider for cookie preferences
 * - Navigation header
 * - Main content area (Outlet for routes)
 * - LoadingOverlay component
 * - CookieBanner component
 * - Google Analytics page tracking (when user consents)
 */
export function AppShell() {
  const location = useLocation();
  
  // Track page views with Google Analytics (if loaded)
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-MD06T4XGJJ', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
  
  return (
    <LoadingProvider>
      <CookieConsentProvider>
        <div className={styles.appShell}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}>⚛️</span>
              <span className={styles.logoText}>React Design Patterns</span>
            </Link>
            
            <nav className={styles.nav} data-testid="app-navigation">
              <Link 
                to="/" 
                className={location.pathname === '/' ? styles.navLinkActive : styles.navLink}
                data-testid="nav-link-home"
              >
                Home
              </Link>
              <Link 
                to="/patterns" 
                className={location.pathname.startsWith('/patterns') ? styles.navLinkActive : styles.navLink}
                data-testid="nav-link-patterns"
              >
                Patterns
              </Link>
            </nav>
          </div>
        </header>
        
        <main className={styles.main}>
          <div className={styles.mainContent}>
            {/* Outlet renders the matched child route */}
            <Outlet />
          </div>
        </main>
        
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              Built with React 19 • Migrated from Angular 21
            </p>
            <p className={styles.footerText}>
              A comprehensive catalog of modern React patterns
            </p>
          </div>
        </footer>
        
        {/* Global loading overlay - automatically shows when LoadingContext.isLoading is true */}
        <LoadingOverlay />
        
        {/* Cookie consent banner - shows on first visit */}
        <CookieBanner />
      </div>
    </CookieConsentProvider>
    </LoadingProvider>
  );
}

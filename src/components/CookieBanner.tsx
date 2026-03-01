import { createPortal } from 'react-dom';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import styles from './CookieBanner.module.css';

/**
 * Cookie Consent Banner
 * Migrated from Angular's CookieBannerComponent
 * 
 * IMPORTANT: Uses createPortal to render outside AppShell's DOM hierarchy
 * This ensures the banner appears on top of all content
 * 
 * Testing: Uses data-testid for stable test selectors
 */
export function CookieBanner() {
  const { showBanner, acceptAll, acceptNecessary } = useCookieConsent();
  
  if (!showBanner) return null;
  
  return createPortal(
    <div 
      className={styles.overlay} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="cookie-banner-title"
      data-testid="cookie-banner"
    >
      <div className={styles.banner}>
        <div className={styles.content}>
          <h2 
            id="cookie-banner-title" 
            className={styles.title}
            data-testid="cookie-banner-title"
          >
            We use cookies
          </h2>
          <p 
            className={styles.description}
            data-testid="cookie-banner-description"
          >
            We use cookies to enhance your browsing experience, serve personalized content, 
            and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className={styles.actions}>
          <button 
            onClick={acceptNecessary}
            className={styles.buttonSecondary}
            data-testid="cookie-banner-necessary-button"
          >
            Necessary Only
          </button>
          <button 
            onClick={acceptAll}
            className={styles.buttonPrimary}
            data-testid="cookie-banner-accept-button"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

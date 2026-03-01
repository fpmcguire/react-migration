import { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useEffect,
  type ReactNode 
} from 'react';

/**
 * Cookie Consent Context
 * Migrated from Angular's CookieConsentService
 * 
 * INCLUDES: Google Analytics integration (only loads when user consents)
 * Environment-aware: GA disabled in development (VITE_ANALYTICS_ENABLED)
 */

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  preferences: CookiePreferences | null;
  showBanner: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  savePreferences: (prefs: CookiePreferences) => void;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = 'cookie-preferences';
const GA_MEASUREMENT_ID = 'G-MD06T4XGJJ'; // Your Google Analytics ID

// Check if analytics is enabled (from environment variable)
// Default to true in production, false in development
const isAnalyticsEnabled = 
  import.meta.env.VITE_ANALYTICS_ENABLED === 'true' || 
  (!import.meta.env.DEV && !import.meta.env.VITE_ANALYTICS_ENABLED);

console.log('[GA] Environment Check:', {
  VITE_ANALYTICS_ENABLED: import.meta.env.VITE_ANALYTICS_ENABLED,
  DEV: import.meta.env.DEV,
  isAnalyticsEnabled: isAnalyticsEnabled,
});

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

function loadFromStorage(): CookiePreferences | null {
  if (typeof window === 'undefined') return null; // SSR safety
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveToStorage(prefs: CookiePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save cookie preferences:', error);
  }
}

/**
 * Load Google Analytics script dynamically
 * Only called when user consents AND analytics is enabled
 * 
 * Follows Google's official gtag.js initialization pattern:
 * https://support.google.com/analytics/answer/9310895
 */
function loadGoogleAnalytics(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('[GA] Window or Document not available');
    return;
  }

  // Don't load if analytics is disabled in environment
  if (!isAnalyticsEnabled) {
    console.log('[GA] Analytics disabled in environment (development mode)');
    return;
  }

  // Don't load if already loaded (check for gtag function, not just script)
  if (typeof window.gtag === 'function') {
    console.log('[GA] Already loaded');
    return;
  }

  console.log('[GA] Loading Google Analytics...');
  console.log('[GA] GA ID:', GA_MEASUREMENT_ID);

  // Initialize dataLayer and gtag function BEFORE loading script
  // (Google Analytics script will use this)
  window.dataLayer = window.dataLayer || [];
  
  // Create temporary gtag function that queues commands
  // Real gtag from Google will override this after script loads
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  }
  
  window.gtag = gtag;
  console.log('[GA] Temporary gtag function created');

  // NOW load the GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  
  script.onload = () => {
    console.log('[GA] Google Analytics script loaded successfully');
    // Now that script is loaded, window.gtag will be the real one from Google
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID, {
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure',
        });
        console.log('[GA] Google Analytics configured successfully');
      } catch (error) {
        console.error('[GA] Error configuring Google Analytics:', error);
      }
    } else {
      console.warn('[GA] window.gtag is not a function after script load');
    }
  };
  
  script.onerror = (error) => {
    console.error('[GA] Failed to load Google Analytics script:', error);
    // Provide troubleshooting info
    console.error('[GA] Check: 1) Network connectivity 2) CSP headers 3) Firewall rules 4) GA ID is valid');
  };
  
  document.head.appendChild(script);
  console.log('[GA] Script element appended to document head');
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(
    () => loadFromStorage()
  );
  const [showBanner, setShowBanner] = useState(() => !loadFromStorage());
  
  // Initialize GA if user already consented
  useEffect(() => {
    if (preferences?.analytics) {
      loadGoogleAnalytics();
    }
  }, [preferences?.analytics]);
  
  const acceptAll = useCallback(() => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveToStorage(prefs);
    setPreferences(prefs);
    setShowBanner(false);
    
    // Load GA when user accepts analytics
    loadGoogleAnalytics();
  }, []);
  
  const acceptNecessary = useCallback(() => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveToStorage(prefs);
    setPreferences(prefs);
    setShowBanner(false);
  }, []);
  
  const savePreferences = useCallback((prefs: CookiePreferences) => {
    saveToStorage(prefs);
    setPreferences(prefs);
    setShowBanner(false);
    
    // Load GA if analytics is enabled in preferences
    if (prefs.analytics) {
      loadGoogleAnalytics();
    }
  }, []);
  
  const value: CookieConsentContextType = {
    preferences,
    showBanner,
    acceptAll,
    acceptNecessary,
    savePreferences,
  };
  
  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextType {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
}

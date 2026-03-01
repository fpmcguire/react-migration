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
const isAnalyticsEnabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';

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
 */
function loadGoogleAnalytics(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Don't load if analytics is disabled in environment
  if (!isAnalyticsEnabled) {
    console.log('[GA] Analytics disabled in environment (development mode)');
    return;
  }

  // Don't load if already loaded
  if (window.gtag) {
    console.log('[GA] Already loaded');
    return;
  }

  console.log('[GA] Loading Google Analytics...');

  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  window.gtag = gtag;
  console.log('[GA] Google Analytics loaded successfully');
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

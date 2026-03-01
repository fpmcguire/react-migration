import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { render } from '../test/test-utils';
import { CookieBanner } from '../components/CookieBanner';
import { CookieConsentProvider } from '../contexts/CookieConsentContext';

/**
 * CookieBanner Tests
 * 
 * Following Pragmatic Testing Standards:
 * - Focus on critical user interactions (button clicks)
 * - Use data-testid selectors for stability
 * - Integration test (component + context)
 * - Skip testing ARIA attributes (accessibility review is better)
 */

function CookieBannerWithProvider() {
  return (
    <CookieConsentProvider>
      <CookieBanner />
    </CookieConsentProvider>
  );
}

describe('CookieBanner - User Interactions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show banner on first visit and hide when user accepts all', async () => {
    const user = userEvent.setup();
    render(<CookieBannerWithProvider />);
    
    // Banner should be visible on first visit
    expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
    
    // User accepts all cookies
    await user.click(screen.getByTestId('cookie-banner-accept-button'));
    
    // Banner should disappear
    expect(screen.queryByTestId('cookie-banner')).not.toBeInTheDocument();
    
    // Verify preferences saved correctly
    const stored = JSON.parse(localStorage.getItem('cookie-preferences')!);
    expect(stored.analytics).toBe(true);
  });
  
  it('should accept necessary only and save preferences', async () => {
    const user = userEvent.setup();
    render(<CookieBannerWithProvider />);
    
    // User clicks necessary only
    await user.click(screen.getByTestId('cookie-banner-necessary-button'));
    
    // Banner should disappear
    expect(screen.queryByTestId('cookie-banner')).not.toBeInTheDocument();
    
    // Should save necessary-only preferences
    const stored = JSON.parse(localStorage.getItem('cookie-preferences')!);
    expect(stored.necessary).toBe(true);
    expect(stored.analytics).toBe(false);
  });
  
  it('should not show banner if user has already set preferences', () => {
    // Set preferences before rendering
    localStorage.setItem('cookie-preferences', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
    }));
    
    render(<CookieBannerWithProvider />);
    
    // Banner should not appear
    expect(screen.queryByTestId('cookie-banner')).not.toBeInTheDocument();
  });
});

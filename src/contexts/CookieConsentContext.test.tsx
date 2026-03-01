import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CookieConsentProvider, useCookieConsent } from '../contexts/CookieConsentContext';

/**
 * CookieConsentContext Tests
 * 
 * Following Pragmatic Testing Standards:
 * - Focus on critical logic (preference saving)
 * - Skip simple behavior tests
 * - Integration with localStorage
 */

describe('CookieConsentContext - Critical Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  it('should save and persist cookie preferences', () => {
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: CookieConsentProvider,
    });
    
    // Accept all cookies
    act(() => {
      result.current.acceptAll();
    });
    
    // Should hide banner and save preferences
    expect(result.current.showBanner).toBe(false);
    expect(result.current.preferences?.analytics).toBe(true);
    
    // Should persist to localStorage
    const stored = JSON.parse(localStorage.getItem('cookie-preferences')!);
    expect(stored.analytics).toBe(true);
  });
  
  it('should handle corrupted localStorage gracefully', () => {
    // Corrupt localStorage
    localStorage.setItem('cookie-preferences', 'invalid-json{');
    
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: CookieConsentProvider,
    });
    
    // Should treat as no preferences
    expect(result.current.showBanner).toBe(true);
    expect(result.current.preferences).toBe(null);
  });
});

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { 
  LoadingProvider, 
  useLoading 
} from '../contexts/LoadingContext';

/**
 * LoadingContext Tests
 * 
 * Following Pragmatic Testing Standards:
 * - Focus on critical logic (counter behavior)
 * - Integration test (don't test state/actions separately)
 * - Skip testing simple behavior (initial state)
 */

describe('LoadingContext - Critical Logic', () => {
  it('should handle multiple concurrent loading operations correctly', () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: LoadingProvider,
    });
    
    // Start multiple loading operations
    act(() => {
      result.current.start();
      result.current.start();
      result.current.start();
    });
    
    expect(result.current.isLoading).toBe(true);
    
    // Stopping once shouldn't clear loading (still 2 pending)
    act(() => {
      result.current.stop();
    });
    
    expect(result.current.isLoading).toBe(true);
    
    // Stop remaining operations
    act(() => {
      result.current.stop();
      result.current.stop();
    });
    
    expect(result.current.isLoading).toBe(false);
  });
  
  it('should not go below zero when stop called more than start', () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: LoadingProvider,
    });
    
    // Call stop without start
    act(() => {
      result.current.start();
      result.current.stop();
      result.current.stop(); // Extra stop
      result.current.stop(); // Extra stop
    });
    
    // Should not go negative
    expect(result.current.isLoading).toBe(false);
  });
});

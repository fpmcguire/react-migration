import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { render } from '../test/test-utils';
import PatternsListPage from '../pages/PatternsListPage';
import { Suspense } from 'react';
import { clearLessonCache } from '../utils/lessonPromiseCache';

/**
 * PatternsListPage Tests
 * 
 * Following Pragmatic Testing Standards:
 * - Focus on critical user flows (filtering patterns)
 * - Use data-testid selectors
 * - Integration test (page + data + routing)
 * - Test user interactions, not rendering details
 */

describe('PatternsListPage - Critical User Flows', () => {
  beforeEach(() => {
    // Clear cache before each test to ensure fresh promises
    clearLessonCache();
  });

  it('should display all patterns and allow filtering by category', async () => {
    const user = userEvent.setup();
    
    // Render with Suspense from test-utils wrapper already providing Router
    // PatternsListPage creates promise at module level, so it should resolve immediately
    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <PatternsListPage />
        </Suspense>
      );
    });
    
    // Wait for patterns to load
    await waitFor(
      () => {
        const element = screen.queryByTestId('patterns-page');
        expect(element).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    
    // All patterns should be visible initially
    const allCards = screen.getAllByTestId('patterns-card');
    expect(allCards.length).toBeGreaterThan(0);
    const initialCount = allCards.length;
    
    // Filter by first category (hooks)
    await user.click(screen.getByTestId('patterns-filter-hooks-button'));
    
    // Should show fewer patterns
    await waitFor(() => {
      const filteredCards = screen.getAllByTestId('patterns-card');
      expect(filteredCards.length).toBeLessThan(initialCount);
    });
    
    // Click "All" to show all patterns again
    await user.click(screen.getByTestId('patterns-filter-all-button'));
    
    // Should show all patterns again
    await waitFor(() => {
      const allCardsAgain = screen.getAllByTestId('patterns-card');
      expect(allCardsAgain.length).toBe(initialCount);
    });
  });
  
  it('should navigate to pattern detail when clicked', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <PatternsListPage />
      </Suspense>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('patterns-page')).toBeInTheDocument();
    });
    
    // Pattern cards should be links
    const cards = screen.getAllByTestId('patterns-card');
    expect(cards[0]).toHaveAttribute('href');
    expect(cards[0].getAttribute('href')).toMatch(/^\/patterns\//);
  });
});

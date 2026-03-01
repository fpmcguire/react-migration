import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import HomePage from '../pages/HomePage';

/**
 * HomePage Tests
 * 
 * Following Pragmatic Testing Standards:
 * - Focus on critical navigation flow
 * - Use data-testid selectors
 * - Skip testing static content rendering (visual review is better)
 */

describe('HomePage - Critical Navigation', () => {
  it('should navigate to patterns page when explore link is clicked', () => {
    render(<HomePage />);
    
    // Main CTA should link to patterns
    const exploreLink = screen.getByTestId('home-page-explore-link');
    expect(exploreLink).toHaveAttribute('href', '/patterns');
  });
});

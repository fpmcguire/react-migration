import { test, expect } from "@playwright/test";

/**
 * E2E Tests - Critical User Flows Only
 *
 * Following Pragmatic Testing Standards:
 * - Focus on happy path through main features
 * - Use data-testid selectors for stability
 * - 3-5 key flows maximum
 * - Skip edge cases (handle in integration tests)
 */

test.describe("React Design Patterns App - Critical Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("User can navigate from home to patterns and view pattern details", async ({
    page,
  }) => {
    // Home page loads
    await expect(page.getByTestId("home-page")).toBeVisible();

    // Dismiss cookie banner if visible (it may be blocking clicks)
    const cookieBanner = page.getByTestId("cookie-banner");
    if (await cookieBanner.isVisible()) {
      await page.getByTestId("cookie-banner-accept-button").click();
      await expect(cookieBanner).not.toBeVisible();
    }

    // Click explore patterns link
    await page.getByTestId("home-page-explore-link").click();

    // Patterns page loads
    await expect(page.getByTestId("patterns-page")).toBeVisible();

    // Click on first pattern
    const firstCard = page.getByTestId("patterns-card").first();
    await firstCard.click();

    // Pattern detail page loads
    await expect(page).toHaveURL(/\/patterns\/.+/);
  });

  test("User can filter patterns by category", async ({ page }) => {
    await page.goto("/patterns");

    // Wait for patterns to load
    await expect(page.getByTestId("patterns-page")).toBeVisible();

    // Get initial count
    const initialCards = await page.getByTestId("patterns-card").count();
    expect(initialCards).toBe(10);

    // Filter by hooks category
    await page.getByTestId("patterns-filter-hooks-button").click();

    // Wait for the card count to actually change (should have 2 hooks patterns)
    await page.waitForFunction(
      () =>
        document.querySelectorAll('[data-testid="patterns-card"]').length === 2,
      { timeout: 5000 },
    );

    // Verify filtered results are fewer
    const filteredCards = await page.getByTestId("patterns-card").count();
    expect(filteredCards).toBe(2);
    expect(filteredCards).toBeLessThan(initialCards);

    // Click "All" filter to show all patterns again
    await page.getByTestId("patterns-filter-all-button").click();

    // Wait for all card count to be restored
    await page.waitForFunction(
      () =>
        document.querySelectorAll('[data-testid="patterns-card"]').length ===
        10,
      { timeout: 5000 },
    );

    // Should show all patterns again
    const allCards = await page.getByTestId("patterns-card").count();
    expect(allCards).toBe(initialCards);
    expect(allCards).toBe(10);
  });

  test("Cookie banner appears on first visit and user can accept cookies", async ({
    page,
    context,
  }) => {
    // Clear cookies to simulate first visit
    await context.clearCookies();
    await page.goto("/");

    // Cookie banner should be visible
    await expect(page.getByTestId("cookie-banner")).toBeVisible();

    // Accept cookies
    await page.getByTestId("cookie-banner-accept-button").click();

    // Banner should disappear
    await expect(page.getByTestId("cookie-banner")).not.toBeVisible();

    // Refresh page - banner should stay hidden
    await page.reload();
    await expect(page.getByTestId("cookie-banner")).not.toBeVisible();
  });

  test("Navigation links work correctly", async ({ page }) => {
    // Start on patterns page
    await page.goto("/patterns");
    await expect(page).toHaveURL("/patterns");

    // Click Home link in header
    await page.getByTestId("nav-link-home").click();
    await expect(page).toHaveURL("/");

    // Click Patterns link in header
    await page.getByTestId("nav-link-patterns").click();
    await expect(page).toHaveURL("/patterns");
  });
});

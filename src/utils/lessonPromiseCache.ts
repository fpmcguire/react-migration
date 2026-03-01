import type { PatternItem } from '../models/PatternItem';

/**
 * Module-level Promise cache for React 19 use() hook
 * 
 * CRITICAL: Promises MUST be created at module level, NOT inside components
 * 
 * Why?
 * - Component re-renders create new function scopes
 * - New Promise every render = React suspends infinitely
 * - Module-level Promise = created once, reused forever
 * 
 * This is THE most common React 19 use() hook gotcha!
 * 
 * Example of WRONG usage:
 * ```tsx
 * function Component() {
 *   const promise = getLessonPromise('patterns', PATTERNS); // NEW PROMISE EVERY RENDER!
 *   const data = use(promise); // INFINITE SUSPEND LOOP
 * }
 * ```
 * 
 * Example of CORRECT usage:
 * ```tsx
 * // Module level - runs once
 * const promise = getLessonPromise('patterns', PATTERNS);
 * 
 * function Component() {
 *   const data = use(promise); // Works correctly
 * }
 * ```
 */

const cache = new Map<string, Promise<PatternItem[]>>();

/**
 * Get a cached Promise for static data
 * Use this when data is imported directly (like PATTERNS constant)
 */
export function getLessonPromise(
  feature: string,
  data: PatternItem[]
): Promise<PatternItem[]> {
  if (!cache.has(feature)) {
    // For static data, wrap in resolved Promise
    cache.set(feature, Promise.resolve(data));
  }
  return cache.get(feature)!;
}

/**
 * Get a cached Promise for dynamic imports
 * Use this when data needs to be fetched or dynamically imported
 */
export function getLessonPromiseDynamic(
  feature: string
): Promise<PatternItem[]> {
  if (!cache.has(feature)) {
    // For dynamic imports
    const promise = import(`../data/${feature}.data.ts`)
      .then(module => module.default);
    cache.set(feature, promise);
  }
  return cache.get(feature)!;
}

/**
 * Clear cache (useful for testing or when data needs refresh)
 */
export function clearLessonCache(feature?: string) {
  if (feature) {
    cache.delete(feature);
  } else {
    cache.clear();
  }
}

import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

/**
 * HomePage - Landing page
 * 
 * NOTE: This is a basic implementation.
 * Will be enhanced in Phase 3 with full content.
 * 
 * Testing: Uses data-testid for stable test selectors
 */
export default function HomePage() {
  return (
    <div className={styles.container} data-testid="home-page">
      <section className={styles.hero}>
        <h1 className={styles.title} data-testid="home-page-title">
          React Migration
        </h1>
        <p className={styles.subtitle} data-testid="home-page-subtitle">
          A comprehensive catalog of modern React 19 patterns and best practices
        </p>
        <p className={styles.description} data-testid="home-page-description">
          Migrated from Angular 21 to showcase equivalent patterns in React, 
          including hooks, Context API, Suspense, Error Boundaries, and more.
        </p>
        <Link to="/patterns" className={styles.cta} data-testid="home-page-explore-link">
          Explore Patterns →
        </Link>
      </section>
      
      <section className={styles.features} data-testid="home-page-features">
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>🎣 Modern Hooks</h3>
          <p className={styles.featureText}>
            useState, useEffect, useMemo, useCallback, and React 19's new use() hook
          </p>
        </div>
        
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>🎯 Context API</h3>
          <p className={styles.featureText}>
            State management with context splitting for optimal performance
          </p>
        </div>
        
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>⚡ Performance</h3>
          <p className={styles.featureText}>
            React.memo, useTransition, useDeferredValue, and optimization patterns
          </p>
        </div>
        
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>🚨 Error Handling</h3>
          <p className={styles.featureText}>
            Error Boundaries with Suspense for robust error handling
          </p>
        </div>
        
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>🧪 Testing</h3>
          <p className={styles.featureText}>
            React Testing Library with user-centric testing approaches
          </p>
        </div>
        
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>♿ Accessibility</h3>
          <p className={styles.featureText}>
            useId, ARIA patterns, and keyboard navigation support
          </p>
        </div>
      </section>
    </div>
  );
}

import { use, useState, useCallback, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { PATTERNS } from '../data/patterns.data';
import { getLessonPromise } from '../utils/lessonPromiseCache';
import styles from './PatternsListPage.module.css';

/**
 * PatternsListPage - List of all patterns with filtering
 * 
 * CRITICAL: Promise created at MODULE level for use() hook
 * This is THE most common React 19 gotcha - Promise inside component = infinite loop
 * 
 * Testing: Uses data-testid for stable test selectors
 */
const patternsPromise = getLessonPromise('patterns', PATTERNS);

export default function PatternsListPage() {
  // React 19 use() hook - suspends until Promise resolves
  const patterns = use(patternsPromise);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // Filter patterns by category
  const filteredPatterns = selectedCategory
    ? patterns.filter(p => p.category === selectedCategory)
    : patterns;
  
  // Get unique categories
  const categories = [...new Set(patterns.map(p => p.category))];
  
  const handleCategoryChange = useCallback((category: string | null) => {
    // Mark as non-urgent update for better UX
    startTransition(() => {
      setSelectedCategory(category);
    });
  }, []);
  
  return (
    <div className={styles.container} data-testid="patterns-page">
      <header className={styles.header}>
        <h1 className={styles.title} data-testid="patterns-page-title">
          React Design Patterns
        </h1>
        <p className={styles.subtitle} data-testid="patterns-page-subtitle">
          Explore {patterns.length} modern React patterns
        </p>
      </header>
      
      <div className={styles.filters} data-testid="patterns-filters">
        <button
          onClick={() => handleCategoryChange(null)}
          className={selectedCategory === null ? styles.filterButtonActive : styles.filterButton}
          data-testid="patterns-filter-all-button"
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={selectedCategory === category ? styles.filterButtonActive : styles.filterButton}
            data-testid={`patterns-filter-${category.toLowerCase().replace(/\s+/g, '-')}-button`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {isPending && (
        <div className={styles.updating} data-testid="patterns-updating-indicator">
          Filtering...
        </div>
      )}
      
      <div className={styles.grid} data-testid="patterns-grid">
        {filteredPatterns.length > 0 ? (
          filteredPatterns.map(pattern => (
            <Link
              key={pattern.id}
              to={`/patterns/${pattern.id}`}
              className={styles.card}
              data-testid="patterns-card"
            >
              <h3 className={styles.cardTitle} data-testid="patterns-card-title">
                {pattern.title}
              </h3>
              <p className={styles.cardCategory} data-testid="patterns-card-category">
                {pattern.category}
              </p>
              <p className={styles.cardDescription} data-testid="patterns-card-description">
                {pattern.description}
              </p>
            </Link>
          ))
        ) : (
          <div className={styles.empty} data-testid="patterns-empty">
            No patterns found
          </div>
        )}
      </div>
    </div>
  );
}

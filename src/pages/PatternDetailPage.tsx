import { use } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PATTERNS } from '../data/patterns.data';
import { getLessonPromise } from '../utils/lessonPromiseCache';
import styles from './PatternDetailPage.module.css';

/**
 * PatternDetailPage - Detail view for a single pattern
 * 
 * CRITICAL: Promise created at MODULE level for use() hook
 */
const patternsPromise = getLessonPromise('patterns', PATTERNS);

export default function PatternDetailPage() {
  const { id } = useParams<{ id: string }>();
  const patterns = use(patternsPromise);
  
  const pattern = patterns.find(p => p.id === id);
  
  if (!pattern) {
    return (
      <div className={styles.notFound}>
        <h1>Pattern Not Found</h1>
        <p>The pattern you're looking for doesn't exist.</p>
        <Link to="/patterns">← Back to Patterns</Link>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <Link to="/patterns" className={styles.back}>
        ← Back to Patterns
      </Link>
      
      <header className={styles.header}>
        <div className={styles.category}>{pattern.category}</div>
        <h1 className={styles.title}>{pattern.title}</h1>
        <p className={styles.description}>{pattern.description}</p>
      </header>
      
      {pattern.codeExample && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Code Example</h2>
          <pre className={styles.code}>
            <code>{pattern.codeExample}</code>
          </pre>
        </section>
      )}
      
      {pattern.documentation && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Documentation</h2>
          <p className={styles.text}>{pattern.documentation}</p>
        </section>
      )}
      
      {pattern.relatedPatterns && pattern.relatedPatterns.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Related Patterns</h2>
          <ul className={styles.relatedList}>
            {pattern.relatedPatterns.map(relatedId => {
              const related = patterns.find(p => p.id === relatedId);
              return related ? (
                <li key={relatedId}>
                  <Link to={`/patterns/${relatedId}`} className={styles.relatedLink}>
                    {related.title}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

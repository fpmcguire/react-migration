// Migrated from Angular's pattern-item.model.ts
export interface PatternItem {
  id: string;
  title: string;
  category: string;
  description: string;
  codeExample?: string;
  documentation?: string;
  relatedPatterns?: string[];
}

export type PatternCategory = 
  | 'hooks'
  | 'context'
  | 'performance'
  | 'composition'
  | 'data-fetching'
  | 'error-handling'
  | 'accessibility'
  | 'testing';

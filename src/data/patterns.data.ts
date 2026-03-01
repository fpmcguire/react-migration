import type { PatternItem } from '../models/PatternItem';

// Migrated from Angular's PATTERNS.data.ts
export const PATTERNS: PatternItem[] = [
  {
    id: 'use-state',
    title: 'useState Hook',
    category: 'hooks',
    description: 'Manage component-local state with the useState hook',
    codeExample: `const [count, setCount] = useState(0);
const increment = () => setCount(prev => prev + 1);`,
    relatedPatterns: ['use-reducer', 'use-context']
  },
  {
    id: 'use-effect',
    title: 'useEffect Hook',
    category: 'hooks',
    description: 'Synchronize component with external systems',
    codeExample: `useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, [dependency]);`,
    relatedPatterns: ['use-layout-effect', 'use-memo']
  },
  {
    id: 'context-splitting',
    title: 'Context Performance Splitting',
    category: 'performance',
    description: 'Split state and actions into separate contexts to prevent unnecessary re-renders',
    codeExample: `const StateContext = createContext(null);
const ActionsContext = createContext(null);

// Components only using actions won't re-render on state change`,
    relatedPatterns: ['use-context', 'react-memo']
  },
  {
    id: 'use-callback',
    title: 'useCallback Memoization',
    category: 'performance',
    description: 'Memoize function references to prevent child re-renders',
    codeExample: `const handleClick = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);`,
    relatedPatterns: ['react-memo', 'use-memo']
  },
  {
    id: 'use-transition',
    title: 'useTransition for Non-Urgent Updates',
    category: 'performance',
    description: 'Mark state updates as non-urgent to keep UI responsive',
    codeExample: `const [isPending, startTransition] = useTransition();
startTransition(() => {
  setSearchResults(expensiveFilter(query));
});`,
    relatedPatterns: ['use-deferred-value']
  },
  {
    id: 'react-lazy',
    title: 'React.lazy + Suspense',
    category: 'data-fetching',
    description: 'Code-split routes and components with lazy loading',
    codeExample: `const PatternDetail = lazy(() => import('./PatternDetail'));

<Suspense fallback={<Loading />}>
  <PatternDetail id={id} />
</Suspense>`,
    relatedPatterns: ['error-boundary', 'use-hook']
  },
  {
    id: 'use-hook',
    title: 'React 19 use() Hook',
    category: 'data-fetching',
    description: 'Unwrap Promises and Context with the use() hook. CRITICAL: Promise must be created at module level.',
    codeExample: `// Module-level Promise cache
const promise = fetchData();

function Component() {
  const data = use(promise); // suspends
  return <div>{data}</div>;
}`,
    relatedPatterns: ['react-lazy', 'suspense']
  },
  {
    id: 'error-boundary',
    title: 'Error Boundaries',
    category: 'error-handling',
    description: 'Catch errors in component tree with declarative error boundaries',
    codeExample: `<ErrorBoundary fallback={<ErrorFallback />}>
  <Suspense fallback={<Loading />}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>`,
    relatedPatterns: ['react-lazy', 'suspense']
  },
  {
    id: 'create-portal',
    title: 'createPortal for Modals',
    category: 'composition',
    description: 'Render components outside parent DOM hierarchy',
    codeExample: `return createPortal(
  <div className="modal">{children}</div>,
  document.body
);`,
    relatedPatterns: ['use-id']
  },
  {
    id: 'use-id',
    title: 'useId for Accessibility',
    category: 'accessibility',
    description: 'Generate stable unique IDs for accessible form controls',
    codeExample: `const id = useId();
return (
  <>
    <label htmlFor={id}>Name</label>
    <input id={id} />
  </>
);`,
    relatedPatterns: []
  }
];

export const CATEGORIES = [
  'hooks',
  'context',
  'performance',
  'composition',
  'data-fetching',
  'error-handling',
  'accessibility',
  'testing'
] as const;

import { 
  createContext, 
  useReducer, 
  useContext, 
  useMemo,
  type ReactNode 
} from 'react';

/**
 * LoadingContext - Migrated from Angular's LoadingStateService
 * 
 * CRITICAL PATTERN: Context Splitting
 * - State and actions are in SEPARATE contexts
 * - Components using only actions won't re-render on state changes
 * - This is a performance optimization for frequently-changing state
 */

interface LoadingState {
  pendingCount: number;
}

interface LoadingActions {
  start: () => void;
  stop: () => void;
}

type LoadingAction = { type: 'START' } | { type: 'STOP' };

// Separate contexts prevent unnecessary re-renders
const LoadingStateContext = createContext<LoadingState | null>(null);
const LoadingActionsContext = createContext<LoadingActions | null>(null);

function loadingReducer(state: LoadingState, action: LoadingAction): LoadingState {
  switch (action.type) {
    case 'START':
      return { pendingCount: state.pendingCount + 1 };
    case 'STOP':
      // Ensure count never goes below zero
      return { pendingCount: Math.max(0, state.pendingCount - 1) };
    default:
      return state;
  }
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(loadingReducer, { pendingCount: 0 });
  
  // Actions object is stable (doesn't change between renders)
  // useMemo ensures actions have stable reference
  const actions = useMemo<LoadingActions>(
    () => ({
      start: () => dispatch({ type: 'START' }),
      stop: () => dispatch({ type: 'STOP' }),
    }),
    []
  );
  
  return (
    <LoadingStateContext.Provider value={state}>
      <LoadingActionsContext.Provider value={actions}>
        {children}
      </LoadingActionsContext.Provider>
    </LoadingStateContext.Provider>
  );
}

/**
 * Hook to access loading state
 * Use this in components that need to DISPLAY loading status
 */
export function useLoadingState(): boolean {
  const state = useContext(LoadingStateContext);
  if (!state) {
    throw new Error('useLoadingState must be used within LoadingProvider');
  }
  return state.pendingCount > 0;
}

/**
 * Hook to access loading actions
 * Use this in components that need to TRIGGER loading
 * (These components won't re-render when loading state changes)
 */
export function useLoadingActions(): LoadingActions {
  const actions = useContext(LoadingActionsContext);
  if (!actions) {
    throw new Error('useLoadingActions must be used within LoadingProvider');
  }
  return actions;
}

/**
 * Convenience hook for components that need both state and actions
 */
export function useLoading() {
  return {
    isLoading: useLoadingState(),
    ...useLoadingActions(),
  };
}

import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LoadingProvider } from '../contexts/LoadingContext';

/**
 * Custom render function that wraps components with common providers
 * 
 * Usage:
 * renderWithProviders(<MyComponent />)
 */
interface AllTheProvidersProps {
  children: React.ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
  return (
    <BrowserRouter>
      <LoadingProvider>
        {children}
      </LoadingProvider>
    </BrowserRouter>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render with our custom version
export { renderWithProviders as render };

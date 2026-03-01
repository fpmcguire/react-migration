# Prismatic - Testing Standards Guide

## Testing Philosophy

### Pragmatic, Functional Testing Over Exhaustive Coverage

**Our Approach:**
- ✅ **Test what matters** - Focus on critical user flows and business logic
- ✅ **Functional over comprehensive** - Test that features work, not every edge case
- ✅ **Quality over quantity** - A few good tests beat many pointless ones
- ✅ **Coverage is secondary** - We don't chase 80%+ coverage metrics
- ✅ **Test to prevent regressions** - Focus on areas that are likely to break
- ✅ **Document with tests** - Tests should explain how features work

**What We Test:**
- ✅ Critical user flows (login, create data source, run quality check)
- ✅ Complex business logic (quality score calculations, KPI formulas)
- ✅ Integration points (API calls, database operations)
- ✅ User interactions (button clicks, form submissions)
- ✅ State management (signals updating correctly)

**What We Don't Over-Test:**
- ❌ Simple getters/setters
- ❌ Pure utility functions with obvious behavior
- ❌ Third-party library behavior (assume D3, Supabase work)
- ❌ Every possible validation scenario (test main cases, not all edge cases)
- ❌ UI styling/layout (use visual review, not tests)

**Guidelines:**
1. **Write tests when they provide value** - If a test doesn't give you confidence or document behavior, skip it
2. **Prefer integration tests** - Test multiple units working together rather than isolating everything
3. **E2E for critical paths** - Use Playwright for the most important user journeys only
4. **No test for test's sake** - If you're not sure what you're testing, don't write it

---

## Test Selection Strategy

### Unit Tests (Vitest) - 30% of effort

**Write unit tests for:**
- Complex business logic functions
- Services with non-trivial logic
- Domain models with behavior (not just data)
- Utilities with complex logic

**Example - Worth testing:**
```typescript
// ✅ Complex logic - test this
calculateQualityScore(checks: QualityCheck[]): number {
  const weights = { critical: 3, warning: 2, info: 1 };
  const weighted = checks.reduce((sum, check) => 
    sum + (check.score * weights[check.severity]), 0
  );
  return weighted / checks.length;
}
```

**Example - Not worth testing:**
```typescript
// ❌ Simple getter - skip this
get isActive(): boolean {
  return this.status === 'active';
}
```

---

### Integration Tests (Vitest) - 50% of effort

**Write integration tests for:**
- User interactions (button clicks, form submissions)
- Component state changes
- Facade/service interactions
- Real user scenarios

**Focus on:** Does it work when a user actually uses it?

---

### E2E Tests (Playwright) - 20% of effort

**Write E2E tests for:**
- Critical user journeys only (3-5 key flows)
- Authentication flow
- Main CRUD operations (create data source, run quality check)
- Happy path through main features

**Skip E2E for:**
- Edge cases (handle in integration tests)
- Error scenarios (unless critical to UX)
- Every variation of every feature

---

## Selector Strategy

We use `data-testid` attributes as the **primary selector strategy** for both Vitest (unit/component tests) and Playwright (E2E tests). This approach provides:

✅ **Stability** - Tests don't break when CSS classes or DOM structure changes
✅ **Clarity** - Test intentions are explicit and self-documenting
✅ **Consistency** - Same selectors work across unit and E2E tests
✅ **Maintainability** - Easy to find elements in tests and templates

---

## Naming Convention for data-testid

### Pattern: `{feature}-{component}-{element}-{action?}`

```
data-testid="dashboard-kpi-card-title"
data-testid="data-sources-list-item"
data-testid="quality-rules-form-submit-button"
data-testid="alerts-notification-dismiss-button"
```

### Structure Breakdown:

1. **feature** - The feature/domain (dashboard, data-sources, quality-rules, kpis, alerts)
2. **component** - The component name (kpi-card, list, form, modal)
3. **element** - The specific element (title, value, button, input, status)
4. **action** (optional) - The action (submit, cancel, delete, edit)

---

## Naming Rules

### ✅ DO:

```html
<!-- Use kebab-case -->
<button data-testid="data-sources-create-button">Create</button>

<!-- Be specific about the element -->
<h2 data-testid="dashboard-page-title">Dashboard</h2>

<!-- Include action for interactive elements -->
<button data-testid="quality-rule-delete-button">Delete</button>

<!-- Use consistent prefixes per feature -->
<div data-testid="kpi-card-container">
  <h3 data-testid="kpi-card-title">Revenue</h3>
  <p data-testid="kpi-card-value">$1,000,000</p>
  <span data-testid="kpi-card-status">healthy</span>
</div>

<!-- Add index for list items when needed -->
<div data-testid="data-source-item-0">First source</div>
<div data-testid="data-source-item-1">Second source</div>
```

### ❌ DON'T:

```html
<!-- Don't use camelCase -->
<button data-testid="dataSourcesCreateButton">Create</button>

<!-- Don't be vague -->
<button data-testid="button">Click</button>

<!-- Don't use implementation details -->
<div data-testid="component-wrapper-div">

<!-- Don't duplicate CSS classes -->
<button data-testid="btn-primary">Create</button>
```

---

## Standard Patterns by Component Type

### Buttons

```html
<!-- Primary actions -->
<button data-testid="{feature}-{action}-button">
  Create Data Source
</button>

<!-- Example: -->
<button data-testid="data-sources-create-button">Create</button>
<button data-testid="quality-rule-save-button">Save</button>
<button data-testid="kpi-delete-button">Delete</button>
<button data-testid="alert-acknowledge-button">Acknowledge</button>
```

### Forms

```html
<!-- Form container -->
<form data-testid="{feature}-form">
  <!-- Form fields -->
  <input 
    type="text" 
    data-testid="{feature}-form-{field}-input"
    placeholder="Name"
  />
  
  <select data-testid="{feature}-form-{field}-select">
    <option>Type</option>
  </select>
  
  <!-- Form actions -->
  <button data-testid="{feature}-form-submit-button">Submit</button>
  <button data-testid="{feature}-form-cancel-button">Cancel</button>
</form>

<!-- Example: Data Source Form -->
<form data-testid="data-source-form">
  <input 
    type="text" 
    data-testid="data-source-form-name-input"
    placeholder="Data Source Name"
  />
  <select data-testid="data-source-form-type-select">
    <option>API</option>
    <option>Database</option>
  </select>
  <button data-testid="data-source-form-submit-button">Create</button>
  <button data-testid="data-source-form-cancel-button">Cancel</button>
</form>
```

### Lists & Tables

```html
<!-- List container -->
<div data-testid="{feature}-list">
  <!-- List items -->
  <div data-testid="{feature}-list-item">
    <h3 data-testid="{feature}-list-item-title">Title</h3>
    <p data-testid="{feature}-list-item-description">Description</p>
    <button data-testid="{feature}-list-item-action-button">Action</button>
  </div>
</div>

<!-- Example: Data Sources List -->
<div data-testid="data-sources-list">
  @for (source of dataSources(); track source.id) {
    <div data-testid="data-sources-list-item">
      <h3 data-testid="data-sources-list-item-title">{{ source.name }}</h3>
      <span data-testid="data-sources-list-item-status">{{ source.status }}</span>
      <button data-testid="data-sources-list-item-sync-button">Sync</button>
      <button data-testid="data-sources-list-item-delete-button">Delete</button>
    </div>
  }
</div>

<!-- Empty state -->
<div data-testid="data-sources-list-empty">
  No data sources found
</div>

<!-- Loading state -->
<div data-testid="data-sources-list-loading">
  Loading...
</div>
```

### Tables

```html
<table data-testid="{feature}-table">
  <thead data-testid="{feature}-table-header">
    <tr>
      <th data-testid="{feature}-table-header-{column}">Column</th>
    </tr>
  </thead>
  <tbody data-testid="{feature}-table-body">
    <tr data-testid="{feature}-table-row">
      <td data-testid="{feature}-table-cell-{column}">Value</td>
    </tr>
  </tbody>
</table>

<!-- Example: Quality Checks Table -->
<table data-testid="quality-checks-table">
  <thead data-testid="quality-checks-table-header">
    <tr>
      <th data-testid="quality-checks-table-header-rule">Rule</th>
      <th data-testid="quality-checks-table-header-score">Score</th>
      <th data-testid="quality-checks-table-header-status">Status</th>
    </tr>
  </thead>
  <tbody data-testid="quality-checks-table-body">
    @for (check of checks(); track check.id) {
      <tr data-testid="quality-checks-table-row">
        <td data-testid="quality-checks-table-cell-rule">{{ check.ruleName }}</td>
        <td data-testid="quality-checks-table-cell-score">{{ check.score }}</td>
        <td data-testid="quality-checks-table-cell-status">{{ check.passed }}</td>
      </tr>
    }
  </tbody>
</table>
```

### Modals/Dialogs

```html
<!-- Modal container -->
<div data-testid="{feature}-modal">
  <div data-testid="{feature}-modal-header">
    <h2 data-testid="{feature}-modal-title">Title</h2>
    <button data-testid="{feature}-modal-close-button">×</button>
  </div>
  <div data-testid="{feature}-modal-body">
    Content
  </div>
  <div data-testid="{feature}-modal-footer">
    <button data-testid="{feature}-modal-confirm-button">Confirm</button>
    <button data-testid="{feature}-modal-cancel-button">Cancel</button>
  </div>
</div>

<!-- Example: Delete Confirmation Modal -->
<div data-testid="delete-confirmation-modal">
  <div data-testid="delete-confirmation-modal-header">
    <h2 data-testid="delete-confirmation-modal-title">Delete Data Source?</h2>
    <button data-testid="delete-confirmation-modal-close-button">×</button>
  </div>
  <div data-testid="delete-confirmation-modal-body">
    Are you sure you want to delete this data source?
  </div>
  <div data-testid="delete-confirmation-modal-footer">
    <button data-testid="delete-confirmation-modal-confirm-button">Delete</button>
    <button data-testid="delete-confirmation-modal-cancel-button">Cancel</button>
  </div>
</div>
```

### Cards

```html
<!-- Card container -->
<div data-testid="{feature}-card">
  <h3 data-testid="{feature}-card-title">Title</h3>
  <p data-testid="{feature}-card-value">Value</p>
  <span data-testid="{feature}-card-status">Status</span>
  <button data-testid="{feature}-card-action-button">Action</button>
</div>

<!-- Example: KPI Card -->
<div data-testid="kpi-card">
  <h3 data-testid="kpi-card-title">{{ kpi().name }}</h3>
  <p data-testid="kpi-card-value">{{ kpi().value }}</p>
  <span data-testid="kpi-card-unit">{{ kpi().unit }}</span>
  <span data-testid="kpi-card-status">{{ kpi().status }}</span>
  <button data-testid="kpi-card-details-button">View Details</button>
</div>
```

### Status/Loading States

```html
<!-- Loading -->
<div data-testid="{feature}-loading">
  <span data-testid="{feature}-loading-spinner"></span>
  <span data-testid="{feature}-loading-message">Loading...</span>
</div>

<!-- Error -->
<div data-testid="{feature}-error">
  <span data-testid="{feature}-error-icon">⚠️</span>
  <p data-testid="{feature}-error-message">{{ error() }}</p>
  <button data-testid="{feature}-error-retry-button">Retry</button>
</div>

<!-- Empty state -->
<div data-testid="{feature}-empty">
  <p data-testid="{feature}-empty-message">No items found</p>
  <button data-testid="{feature}-empty-create-button">Create First Item</button>
</div>

<!-- Success -->
<div data-testid="{feature}-success">
  <span data-testid="{feature}-success-icon">✓</span>
  <p data-testid="{feature}-success-message">Success!</p>
</div>
```

### Charts/Visualizations (D3)

```html
<!-- Chart container -->
<div data-testid="{chart-type}-chart">
  <svg data-testid="{chart-type}-chart-svg">
    <!-- D3 will populate this -->
  </svg>
  <div data-testid="{chart-type}-chart-legend">
    <!-- Legend items -->
  </div>
  <div data-testid="{chart-type}-chart-tooltip">
    <!-- Tooltip content -->
  </div>
</div>

<!-- Example: Line Chart for KPI Trends -->
<div data-testid="kpi-trend-chart">
  <svg data-testid="kpi-trend-chart-svg"></svg>
  <div data-testid="kpi-trend-chart-legend"></div>
  <div data-testid="kpi-trend-chart-tooltip"></div>
</div>

<!-- Example: Quality Score Gauge -->
<div data-testid="quality-score-gauge">
  <svg data-testid="quality-score-gauge-svg"></svg>
  <span data-testid="quality-score-gauge-value">85%</span>
</div>
```

---

## Vitest Component Testing Examples

### Example 1: Testing a Button Click

```typescript
// data-sources-list.component.spec.ts
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/angular';
import { DataSourcesListComponent } from './data-sources-list.component';

describe('DataSourcesListComponent', () => {
  it('should call createNew when create button clicked', async () => {
    const { fixture } = await render(DataSourcesListComponent);
    const component = fixture.componentInstance;
    
    const createButton = screen.getByTestId('data-sources-create-button');
    await fireEvent.click(createButton);
    
    // Assertions...
  });
  
  it('should display data sources list', async () => {
    const { fixture } = await render(DataSourcesListComponent);
    
    const list = screen.getByTestId('data-sources-list');
    expect(list).toBeDefined();
    
    const items = screen.getAllByTestId('data-sources-list-item');
    expect(items.length).toBeGreaterThan(0);
  });
  
  it('should show loading state', async () => {
    const { fixture } = await render(DataSourcesListComponent, {
      componentProperties: {
        loading: true
      }
    });
    
    const loading = screen.getByTestId('data-sources-list-loading');
    expect(loading).toBeDefined();
  });
  
  it('should show empty state when no data', async () => {
    const { fixture } = await render(DataSourcesListComponent, {
      componentProperties: {
        dataSources: []
      }
    });
    
    const empty = screen.getByTestId('data-sources-list-empty');
    expect(empty).toBeDefined();
  });
});
```

### Example 2: Testing Form Inputs

```typescript
// data-source-form.component.spec.ts
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/angular';
import { DataSourceFormComponent } from './data-source-form.component';

describe('DataSourceFormComponent', () => {
  it('should update name when input changes', async () => {
    const { fixture } = await render(DataSourceFormComponent);
    const component = fixture.componentInstance;
    
    const nameInput = screen.getByTestId('data-source-form-name-input');
    await fireEvent.input(nameInput, { target: { value: 'My Data Source' } });
    
    expect(component.name()).toBe('My Data Source');
  });
  
  it('should submit form with correct data', async () => {
    const { fixture } = await render(DataSourceFormComponent);
    const component = fixture.componentInstance;
    
    const nameInput = screen.getByTestId('data-source-form-name-input');
    const typeSelect = screen.getByTestId('data-source-form-type-select');
    const submitButton = screen.getByTestId('data-source-form-submit-button');
    
    await fireEvent.input(nameInput, { target: { value: 'Test Source' } });
    await fireEvent.change(typeSelect, { target: { value: 'api' } });
    await fireEvent.click(submitButton);
    
    // Verify form submission
    expect(component.submitted()).toBe(true);
  });
});
```

### Example 3: Testing Conditional Rendering

```typescript
// kpi-card.component.spec.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { KpiCardComponent } from './kpi-card.component';

describe('KpiCardComponent', () => {
  it('should show healthy status for good KPIs', async () => {
    await render(KpiCardComponent, {
      componentProperties: {
        kpi: { name: 'Revenue', value: 1000000, status: 'healthy' }
      }
    });
    
    const status = screen.getByTestId('kpi-card-status');
    expect(status.textContent).toBe('healthy');
    expect(status.classList.contains('text-green-500')).toBe(true);
  });
  
  it('should show critical status for bad KPIs', async () => {
    await render(KpiCardComponent, {
      componentProperties: {
        kpi: { name: 'Error Rate', value: 15, status: 'critical' }
      }
    });
    
    const status = screen.getByTestId('kpi-card-status');
    expect(status.textContent).toBe('critical');
    expect(status.classList.contains('text-red-500')).toBe(true);
  });
});
```

---

## Playwright E2E Testing Examples

### Example 1: Navigation Flow

```typescript
// e2e/data-sources.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Data Sources Flow', () => {
  test('should create a new data source', async ({ page }) => {
    await page.goto('/data-sources');
    
    // Click create button
    await page.getByTestId('data-sources-create-button').click();
    
    // Fill in form
    await page.getByTestId('data-source-form-name-input').fill('Test API Source');
    await page.getByTestId('data-source-form-type-select').selectOption('api');
    await page.getByTestId('data-source-form-submit-button').click();
    
    // Verify success
    await expect(page.getByTestId('data-sources-success')).toBeVisible();
    
    // Verify new item appears in list
    const newItem = page.getByTestId('data-sources-list-item').filter({
      hasText: 'Test API Source'
    });
    await expect(newItem).toBeVisible();
  });
  
  test('should show validation errors for invalid form', async ({ page }) => {
    await page.goto('/data-sources');
    
    await page.getByTestId('data-sources-create-button').click();
    await page.getByTestId('data-source-form-submit-button').click();
    
    // Should show error for required name field
    const nameError = page.getByTestId('data-source-form-name-error');
    await expect(nameError).toBeVisible();
    await expect(nameError).toHaveText('Name is required');
  });
});
```

### Example 2: Testing Interactive Lists

```typescript
// e2e/quality-rules.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Quality Rules', () => {
  test('should delete a quality rule', async ({ page }) => {
    await page.goto('/quality-rules');
    
    // Get first rule
    const firstRule = page.getByTestId('quality-rules-list-item').first();
    const ruleName = await firstRule.getByTestId('quality-rules-list-item-title').textContent();
    
    // Click delete
    await firstRule.getByTestId('quality-rules-list-item-delete-button').click();
    
    // Confirm deletion
    await page.getByTestId('delete-confirmation-modal-confirm-button').click();
    
    // Verify rule is removed
    await expect(page.getByText(ruleName!)).not.toBeVisible();
  });
  
  test('should toggle rule active/inactive', async ({ page }) => {
    await page.goto('/quality-rules');
    
    const firstRule = page.getByTestId('quality-rules-list-item').first();
    const toggleButton = firstRule.getByTestId('quality-rules-list-item-toggle-button');
    
    // Click toggle
    await toggleButton.click();
    
    // Verify status changed
    const status = firstRule.getByTestId('quality-rules-list-item-status');
    await expect(status).toHaveText('inactive');
  });
});
```

### Example 3: Testing Charts/Visualizations

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Charts', () => {
  test('should render KPI trend chart', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for chart to load
    await page.waitForLoadState('networkidle');
    
    const chart = page.getByTestId('kpi-trend-chart');
    await expect(chart).toBeVisible();
    
    // Verify SVG is rendered
    const svg = page.getByTestId('kpi-trend-chart-svg');
    await expect(svg).toBeVisible();
    
    // Verify chart has data (check for path elements)
    const paths = await svg.locator('path').count();
    expect(paths).toBeGreaterThan(0);
  });
  
  test('should show tooltip on chart hover', async ({ page }) => {
    await page.goto('/dashboard');
    
    const svg = page.getByTestId('kpi-trend-chart-svg');
    
    // Hover over chart
    await svg.hover({ position: { x: 100, y: 100 } });
    
    // Tooltip should appear
    const tooltip = page.getByTestId('kpi-trend-chart-tooltip');
    await expect(tooltip).toBeVisible();
  });
});
```

---

## Best Practices

### 1. Keep testids Flat and Readable

```html
✅ GOOD:
<div data-testid="data-source-card-title">

❌ BAD:
<div data-testid="app-feature-data-sources-component-card-title-text">
```

### 2. Use testids for User-Facing Elements Only

```html
✅ GOOD (interactive/visible):
<button data-testid="save-button">
<h1 data-testid="page-title">
<input data-testid="name-input">

❌ BAD (wrapper/structural):
<div class="flex gap-4"> <!-- No testid needed -->
  <button data-testid="save-button">
</div>
```

### 3. Don't Add testids to Every Element

Only add to elements you'll actually test:
- Interactive elements (buttons, inputs, links)
- Content you assert on (titles, values, status)
- Containers for finding child elements
- Key structural elements (modals, lists, cards)

### 4. Use Descriptive Suffixes

```html
<!-- Buttons -->
data-testid="*-button"
data-testid="*-submit-button"
data-testid="*-cancel-button"

<!-- Inputs -->
data-testid="*-input"
data-testid="*-select"
data-testid="*-checkbox"

<!-- Display -->
data-testid="*-title"
data-testid="*-value"
data-testid="*-status"
data-testid="*-message"
```

### 5. Combine with Other Selectors When Needed

```typescript
// Find specific item in list
const item = page
  .getByTestId('data-sources-list-item')
  .filter({ hasText: 'My Data Source' });

// Find button within a card
const deleteButton = page
  .getByTestId('kpi-card')
  .getByTestId('kpi-card-delete-button');
```

---

## Component Template Example (Full)

```typescript
// data-sources-list.component.ts
@Component({
  selector: 'app-data-sources-list',
  standalone: true,
  template: `
    <div class="data-sources-page">
      <header data-testid="data-sources-header">
        <h1 data-testid="data-sources-page-title">Data Sources</h1>
        <button 
          data-testid="data-sources-create-button"
          (click)="createNew()"
          class="btn-primary"
        >
          + New Data Source
        </button>
      </header>
      
      @if (loading()) {
        <div data-testid="data-sources-list-loading">
          <span data-testid="data-sources-list-loading-spinner"></span>
          <span data-testid="data-sources-list-loading-message">
            Loading data sources...
          </span>
        </div>
      } @else if (error()) {
        <div data-testid="data-sources-list-error">
          <span data-testid="data-sources-list-error-icon">⚠️</span>
          <p data-testid="data-sources-list-error-message">{{ error() }}</p>
          <button 
            data-testid="data-sources-list-error-retry-button"
            (click)="retry()"
          >
            Retry
          </button>
        </div>
      } @else if (dataSources().length === 0) {
        <div data-testid="data-sources-list-empty">
          <p data-testid="data-sources-list-empty-message">
            No data sources found
          </p>
          <button 
            data-testid="data-sources-list-empty-create-button"
            (click)="createNew()"
          >
            Create your first data source
          </button>
        </div>
      } @else {
        <div data-testid="data-sources-list">
          @for (source of dataSources(); track source.id) {
            <div data-testid="data-sources-list-item">
              <h3 data-testid="data-sources-list-item-title">
                {{ source.name }}
              </h3>
              <p data-testid="data-sources-list-item-description">
                {{ source.description }}
              </p>
              <span data-testid="data-sources-list-item-type">
                {{ source.type }}
              </span>
              <span data-testid="data-sources-list-item-status">
                {{ source.status }}
              </span>
              <div class="actions">
                <button 
                  data-testid="data-sources-list-item-sync-button"
                  (click)="sync(source.id)"
                >
                  Sync
                </button>
                <button 
                  data-testid="data-sources-list-item-edit-button"
                  (click)="edit(source.id)"
                >
                  Edit
                </button>
                <button 
                  data-testid="data-sources-list-item-delete-button"
                  (click)="delete(source.id)"
                >
                  Delete
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class DataSourcesListComponent {
  // Component implementation...
}
```

---

## Quick Reference Cheat Sheet

| Element Type | Pattern | Example |
|--------------|---------|---------|
| **Page Title** | `{feature}-page-title` | `data-testid="dashboard-page-title"` |
| **Button** | `{feature}-{action}-button` | `data-testid="data-sources-create-button"` |
| **Input** | `{feature}-form-{field}-input` | `data-testid="data-source-form-name-input"` |
| **Select** | `{feature}-form-{field}-select` | `data-testid="data-source-form-type-select"` |
| **List** | `{feature}-list` | `data-testid="quality-rules-list"` |
| **List Item** | `{feature}-list-item` | `data-testid="quality-rules-list-item"` |
| **Card** | `{feature}-card` | `data-testid="kpi-card"` |
| **Modal** | `{feature}-modal` | `data-testid="delete-confirmation-modal"` |
| **Loading** | `{feature}-loading` | `data-testid="data-sources-list-loading"` |
| **Error** | `{feature}-error` | `data-testid="data-sources-list-error"` |
| **Empty** | `{feature}-empty` | `data-testid="data-sources-list-empty"` |
| **Chart** | `{chart-type}-chart` | `data-testid="kpi-trend-chart"` |

---

---

## Pragmatic Testing Examples

### Example 1: Don't Test Simple Components

```typescript
// simple-button.component.ts
@Component({
  selector: 'app-button',
  template: `<button [disabled]="disabled()">{{ label() }}</button>`
})
export class ButtonComponent {
  label = input<string>('Click me');
  disabled = input<boolean>(false);
}

// ❌ DON'T write a test for this - it's too simple
// The component just passes inputs to the template
// Trust Angular to render correctly
```

---

### Example 2: Do Test Business Logic

```typescript
// quality-assessment.service.ts
export class QualityAssessmentService {
  // ✅ DO test this - complex logic with multiple paths
  assessDataQuality(data: DataPoint[], rules: QualityRule[]): QualityScore {
    const scores = rules.map(rule => {
      switch (rule.type) {
        case 'completeness':
          return this.checkCompleteness(data, rule);
        case 'accuracy':
          return this.checkAccuracy(data, rule);
        case 'consistency':
          return this.checkConsistency(data, rule);
        default:
          return 0;
      }
    });
    
    return {
      overall: this.calculateWeightedAverage(scores),
      byRule: scores,
      passed: scores.every(s => s >= rule.threshold)
    };
  }
}

// quality-assessment.service.spec.ts
describe('QualityAssessmentService', () => {
  it('should calculate correct quality score', () => {
    // Test the main logic path
    const data = [{ value: 10 }, { value: 20 }, { value: null }];
    const rules = [
      { type: 'completeness', threshold: 90 },
      { type: 'accuracy', threshold: 95 }
    ];
    
    const result = service.assessDataQuality(data, rules);
    
    expect(result.overall).toBeCloseTo(66.67); // 2/3 complete
    expect(result.passed).toBe(false); // Below threshold
  });
  
  // Don't test every edge case - just the critical ones
  it('should handle empty data', () => {
    const result = service.assessDataQuality([], []);
    expect(result.overall).toBe(0);
  });
});
```

---

### Example 3: Test User Interactions, Not Rendering

```typescript
// data-source-form.component.spec.ts
describe('DataSourceFormComponent', () => {
  // ✅ DO test user interactions
  it('should submit form with valid data', async () => {
    const { fixture } = await render(DataSourceFormComponent);
    const component = fixture.componentInstance;
    
    // Simulate user filling form
    const nameInput = screen.getByTestId('data-source-form-name-input');
    const typeSelect = screen.getByTestId('data-source-form-type-select');
    
    await fireEvent.input(nameInput, { target: { value: 'My Source' } });
    await fireEvent.change(typeSelect, { target: { value: 'api' } });
    
    const submitButton = screen.getByTestId('data-source-form-submit-button');
    await fireEvent.click(submitButton);
    
    // Test the outcome
    expect(component.submitted()).toBe(true);
  });
  
  // ❌ DON'T test every validation rule
  // Pick one or two critical ones only
  
  // ❌ DON'T test CSS classes or styling
  // Visual review is better for this
});
```

---

### Example 4: Integration Test Over Unit Tests

```typescript
// ✅ DO write integration tests
// data-source.facade.spec.ts
describe('DataSourceFacade (Integration)', () => {
  let facade: DataSourceFacade;
  let mockRepository: MockDataSourceRepository;
  let mockDatabase: MockDatabaseClient;
  
  it('should create data source and update state', async () => {
    // Test the whole flow: facade -> repository -> database
    const input = {
      name: 'Test Source',
      type: 'api',
      connectionConfig: { url: 'https://api.example.com' }
    };
    
    const created = await facade.create(input);
    
    // Verify the whole chain worked
    expect(created.id).toBeDefined();
    expect(facade.dataSources().length).toBe(1);
    expect(facade.dataSources()[0]).toEqual(created);
  });
});

// ❌ DON'T write separate unit tests for:
// - Repository.create()
// - DatabaseClient.insert()
// - DataSource.toDTO()
// The integration test covers all of these
```

---

### Example 5: Critical E2E Paths Only

```typescript
// e2e/critical-flows.spec.ts
import { test, expect } from '@playwright/test';

// ✅ DO test critical user journey
test('User can create and monitor data source', async ({ page }) => {
  await page.goto('/login');
  
  // Login
  await page.getByTestId('auth-email-input').fill('user@example.com');
  await page.getByTestId('auth-password-input').fill('password');
  await page.getByTestId('auth-login-button').click();
  
  // Create data source
  await page.goto('/data-sources');
  await page.getByTestId('data-sources-create-button').click();
  await page.getByTestId('data-source-form-name-input').fill('My API');
  await page.getByTestId('data-source-form-submit-button').click();
  
  // Verify it appears in dashboard
  await page.goto('/dashboard');
  await expect(page.getByText('My API')).toBeVisible();
});

// ❌ DON'T test every possible variation
// ❌ DON'T test error states in E2E (use integration tests)
// ❌ DON'T test every button click (test workflows)
```

---

## When to Write Tests - Decision Tree

```
Is it critical to the business?
├─ YES → Is it complex logic?
│   ├─ YES → Write unit/integration test ✅
│   └─ NO → Is it a key user flow?
│       ├─ YES → Write E2E test ✅
│       └─ NO → Skip test, do code review ✅
│
└─ NO → Is it likely to break often?
    ├─ YES → Write integration test ✅
    └─ NO → Skip test ✅
```

---

## Test Metrics We Care About

**We DO care about:**
- ✅ Critical flows tested (Can users complete key tasks?)
- ✅ Business logic tested (Do calculations work correctly?)
- ✅ Test reliability (Do tests catch real bugs?)
- ✅ Test speed (Can we run tests quickly?)

**We DON'T care about:**
- ❌ Code coverage % (80% coverage ≠ good tests)
- ❌ Number of tests (100 bad tests < 10 good ones)
- ❌ Testing every component (some don't need tests)
- ❌ 100% branch coverage (diminishing returns)

---

## Summary

### Testing Principles for Prismatic

**1. Pragmatic over Perfect**
- Write tests that provide value
- Skip tests that don't give confidence
- Focus on what's likely to break

**2. Integration over Isolation**
- Test features working together
- Don't mock everything
- Test real user scenarios

**3. Critical Flows over Coverage**
- 5 solid E2E tests > 50 mediocre unit tests
- Test the happy path thoroughly
- Test critical error scenarios only

**4. Fast Feedback over Completeness**
- Tests should run in seconds
- Skip slow tests unless critical
- Use mocks sparingly (they can lie)

**5. Document with Tests**
- Tests should explain how features work
- Good test names = good documentation
- Tests are for developers, not metrics

---

### Practical Testing Checklist

For each feature, ask:

- [ ] **Is this critical?** → E2E test
- [ ] **Is this complex?** → Unit/integration test
- [ ] **Will this break often?** → Integration test
- [ ] **Is this simple?** → Code review only
- [ ] **Is this a facade/service?** → Integration test
- [ ] **Is this a utility?** → Unit test only if complex

---

### Test Distribution Goal

- **70%** Integration tests (components + services working together)
- **20%** E2E tests (critical user flows)
- **10%** Unit tests (complex business logic only)

**Not:**
- ~~80%~~ ~~Unit tests (too isolated)~~
- ~~15%~~ ~~Integration tests~~
- ~~5%~~ ~~E2E tests~~

---

✅ **Always use `data-testid`** for test selectors
✅ **Follow kebab-case** naming convention
✅ **Be specific** but concise
✅ **Use consistent** prefixes per feature
✅ **Test what matters** - skip the rest
✅ **Integration over isolation** - test real scenarios
✅ **Document** with meaningful test names

This standard will make our tests:
- More maintainable
- More valuable
- Less brittle
- Faster to write
- Focused on what matters

---

**Remember:** The goal is working software, not test coverage metrics. Write tests that give you confidence to ship, not tests to hit a number. 🚀

---
name: Testing Strategy
description: Comprehensive testing patterns for React, TypeScript, and Vite applications
---

# Testing Strategy Skill

## Testing Pyramid

```
        /\
       /E2E\         ← 10% (Critical user flows)
      /______\
     /        \
    / Integration\ ← 30% (Component integration)
   /______________\
  /                \
 /   Unit Tests     \ ← 60% (Functions, utils, hooks)
/____________________\
```

## Unit Testing

### 1. **Utility Functions**

```typescript
// src/utils/fitness.ts
export function calculateBMI(weight: number, height: number): number {
  return weight / (height * height);
}

// src/utils/fitness.test.ts
import { calculateBMI } from './fitness';

describe('calculateBMI', () => {
  it('should calculate BMI correctly', () => {
    expect(calculateBMI(70, 1.75)).toBeCloseTo(22.86, 2);
  });
  
  it('should handle edge cases', () => {
    expect(calculateBMI(0, 1.75)).toBe(0);
    expect(() => calculateBMI(70, 0)).toThrow();
  });
});
```

### 2. **Custom Hooks**

```typescript
// src/hooks/useMembers.test.ts
import { renderHook, act } from '@testing-library/react';
import { useMembers } from './useMembers';

describe('useMembers', () => {
  it('should fetch and return members', async () => {
    const { result } = renderHook(() => useMembers());
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.members).toHaveLength(5);
  });
});
```

## Component Testing

### 1. **React Testing Library**

```typescript
// MemberCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemberCard } from './MemberCard';

const mockMember = {
  id: '1',
  name: 'John Doe',
  status: 'Active',
  membershipType: '1 Month'
};

describe('MemberCard', () => {
  it('should render member info', () => {
    render(<MemberCard member={mockMember} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
  
  it('should call onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    render(<MemberCard member={mockMember} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(onEdit).toHaveBeenCalledWith(mockMember.id);
  });
});
```

### 2. **Snapshot Testing**

```typescript
it('should match snapshot', () => {
  const { container } = render(<MemberCard member={mockMember} />);
  expect(container).toMatchSnapshot();
});
```

## Integration Testing

### 1. **Store + Component**

```typescript
// Dashboard.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { useGymStore } from '../store/useGymStore';
import { Dashboard } from './Dashboard';

describe('Dashboard Integration', () => {
  beforeEach(() => {
    // Reset store
    useGymStore.setState({ members: [], workouts: [] });
  });
  
  it('should display member count', async () => {
    // Add test data
    act(() => {
      useGymStore.getState().addMember(mockMember);
    });
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/1 member/i)).toBeInTheDocument();
    });
  });
});
```

### 2. **API Mocking**

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/members', (req, res, ctx) => {
    return res(ctx.json([mockMember1, mockMember2]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('should fetch and display members', async () => {
  render(<MemberList />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## E2E Testing (Playwright)

### 1. **Critical User Flow**

```typescript
// e2e/member-management.spec.ts
import { test, expect } from '@playwright/test';

test('should add a new member', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Navigate to members page
  await page.click('text=Hội Viên');
  
  // Click "Add Member" button
  await page.click('button:has-text("Thêm Hội Viên")');
  
  // Fill form
  await page.fill('input[name="name"]', 'Jane Smith');
  await page.fill('input[name="email"]', 'jane@example.com');
  await page.selectOption('select[name="membershipType"]', '1 Month');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify success
  await expect(page.locator('text=Jane Smith')).toBeVisible();
});
```

### 2. **Visual Regression**

```typescript
test('should match dashboard screenshot', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

## Test Coverage

### 1. **Configuration**

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
```

### 2. **Run Coverage**

```bash
npm run test:coverage
```

## Best Practices

### ✅ Do's

1. **Test behavior, not implementation**
2. **Use meaningful test descriptions**
3. **Mock external dependencies**
4. **Test edge cases and errors**
5. **Keep tests isolated** (no shared state)
6. **Use setup/teardown hooks** (beforeEach, afterEach)

### ❌ Don'ts

1. **Don't test framework code** (React, Zustand internals)
2. **Don't test third-party libraries**
3. **Don't test styling** (use visual regression instead)
4. **Don't create brittle tests** (avoid implementation details)

## Mocking Patterns

### 1. **Zustand Store Mock**

```typescript
vi.mock('../store/useGymStore', () => ({
  useGymStore: vi.fn(() => ({
    members: [mockMember],
    addMember: vi.fn(),
  }))
}));
```

### 2. **Date Mocking**

```typescript
import MockDate from 'mockdate';

beforeAll(() => {
  MockDate.set('2026-02-02');
});

afterAll(() => {
  MockDate.reset();
});
```

### 3. **LocalStorage Mock**

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as any;
```

## Testing Checklist

- [ ] Unit tests for utilities
- [ ] Unit tests for custom hooks
- [ ] Component rendering tests
- [ ] User interaction tests
- [ ] Integration tests (store + components)
- [ ] API mocking setup
- [ ] E2E critical paths
- [ ] Visual regression tests
- [ ] Coverage > 80%
- [ ] All tests pass in CI/CD

## Tools

- **Vitest**: Unit & integration testing
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright**: E2E testing
- **@testing-library/user-event**: User interactions

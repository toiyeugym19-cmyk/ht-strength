---
name: Error Handling & Resilience
description: Robust error handling patterns, retry strategies, and resilience patterns
---

# Error Handling

## Try-Catch Patterns

```typescript
// Basic
try {
  const result = await fetchData();
} catch (error) {
  console.error('Error:', error);
  showErrorToast(error.message);
}

// Type-safe error handling
class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

try {
  const response = await fetch('/api/members');
  if (!response.ok) {
    throw new APIError(response.status, 'Failed to fetch');
  }
} catch (error) {
  if (error instanceof APIError) {
    console.log('API Error:', error.statusCode);
  }
}
```

## Retry with Exponential Backoff

```typescript
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
}
```

## Error Boundaries (React)

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true};
  }
  
  componentDidCatch(error, info) {
    logError(error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Global Error Handler

```typescript
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  logToSentry(event.reason);
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  logToSentry(event.error);
});
```

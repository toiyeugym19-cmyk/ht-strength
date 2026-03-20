---
name: Monitoring & Logging
description: Application monitoring, logging, and observability patterns
---

# Monitoring & Logging

## Logging Levels

```typescript
const logger = {
  error: (msg, meta?) => console.error(msg, meta),
  warn: (msg, meta?) => console.warn(msg, meta),
  info: (msg, meta?) => console.info(msg, meta),
  debug: (msg, meta?) => console.debug(msg, meta)
};

// Usage
logger.error('Failed to fetch members', { userId: '123' });
logger.info('Member created', { memberId: 'abc' });
```

## Error Tracking (Sentry)

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production'
});

try {
  // code
} catch (error) {
  Sentry.captureException(error);
}
```

## Performance Monitoring

```typescript
// Custom metrics
const start = performance.now();
await fetchMembers();
const duration = performance.now() - start;
console.log(`Fetch took ${duration}ms`);

// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

## Health Checks

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

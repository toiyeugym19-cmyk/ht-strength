---
name: Performance Optimization
description: Expert system for optimizing React, Vite, and Tailwind applications for maximum performance
---

# Performance Optimization Skill

## React Performance

### 1. **Memoization**

```typescript
// Expensive computations
const totalVolume = useMemo(() => 
  logs.reduce((sum, log) => sum + log.totalVolume, 0),
  [logs]
);

// Component memoization
const MemberCard = memo(({ member }: { member: Member }) => {
  return <div>{member.name}</div>;
});

// Callback memoization
const handleClick = useCallback(() => {
  updateMember(id, data);
}, [id, data]);
```

### 2. **Code Splitting**

```typescript
// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Members = lazy(() => import('./pages/MembersPage'));

// Component-based splitting
const HeavyChart = lazy(() => import('./components/Chart'));

// Usage with Suspense
<Suspense fallback={<Skeleton />}>
  <HeavyChart data={chartData} />
</Suspense>
```

### 3. **Virtualization**

```typescript
// For long lists (100+ items)
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: members.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 80,
});
```

## Vite Optimization

### 1. **Build Configuration**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand']
  }
});
```

### 2. **Asset Optimization**

```javascript
// Image optimization
export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // 4kb
  }
});
```

## Tailwind Optimization

### 1. **PurgeCSS Configuration**

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Remove unused styles in production
};
```

### 2. **JIT Mode Benefits**

- On-demand CSS generation
- Faster build times
- Smaller bundle sizes

## Bundle Analysis

### 1. **Analyze Bundle**

```bash
npm run build
npx vite-bundle-visualizer
```

### 2. **Target Metrics**

- Initial JS: < 200kb gzipped
- Total CSS: < 50kb gzipped
- Largest chunk: < 500kb
- Time to Interactive: < 3s

## Image Optimization

### 1. **Format Selection**

- **WebP**: Modern format (80% smaller than PNG)
- **AVIF**: Next-gen (50% smaller than WebP)
- **SVG**: Icons and logos

### 2. **Lazy Loading**

```typescript
<img 
  src={avatar} 
  loading="lazy" 
  decoding="async"
  alt="Member avatar"
/>
```

## Network Optimization

### 1. **Caching Strategy**

```typescript
// Service Worker caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 2. **Prefetching**

```typescript
// Prefetch route data
<link rel="prefetch" href="/api/members" />

// React Router prefetch
const navigate = useNavigate();
const prefetchMembers = () => {
  queryClient.prefetchQuery(['members'], fetchMembers);
};
```

## Key Metrics

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Custom Metrics

- Time to First Render: < 1s
- Store Hydration Time: < 100ms
- Route Transition: < 300ms

## Quick Wins

1. ✅ Enable Vite build cache
2. ✅ Use `React.memo` for list items
3. ✅ Implement virtual scrolling for 100+ items
4. ✅ Code-split routes with `lazy()`
5. ✅ Optimize images (WebP, lazy loading)
6. ✅ Remove unused Tailwind classes (JIT)
7. ✅ Use `useMemo` for computed values
8. ✅ Debounce search inputs

## Tools

- **Lighthouse**: Performance audit
- **Bundle Analyzer**: Visualize bundle size
- **React DevTools Profiler**: Component performance
- **Chrome Performance Tab**: Runtime analysis

---
name: CSS Animation & Micro-interactions
description: Advanced CSS animations, transitions, and micro-interactions for premium UX
---

# CSS Animation & Micro-interactions

## Transitions

```css
/* Smooth transitions */
.button {
  background: #FF6B35;
  transform: scale(1);
  transition: all 250ms ease-in-out;
}

.button:hover {
  background: #FF8555;
  transform: scale(1.05);
  box-shadow: 0 0 24px rgba(255, 107, 53, 0.4);
}

/* Transition timing functions */
transition-timing-function: ease;           /* Default */
transition-timing-function: ease-in-out;    /* Smooth */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* Custom */
```

## Keyframe Animations

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-element {
  animation: float 3s ease-in-out infinite;
}

@keyframes glow {
  0% {
    filter: brightness(1) drop-shadow(0 0 8px rgba(255,107,53,0.4));
  }
  100% {
    filter: brightness(1.2) drop-shadow(0 0 16px rgba(255,107,53,0.6));
  }
}

.glowing-button {
  animation: glow 2s ease-in-out infinite alternate;
}
```

## Micro-interactions

### Button Press

```css
.button {
  transform: scale(1);
  transition: transform 150ms ease-out;
}

.button:active {
  transform: scale(0.95);
}
```

### Card Hover Lift

```css
.card {
  transform: translateY(0);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: all 250ms ease-out;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.2);
}
```

### Shine Effect

```css
.button {
  position: relative;
  overflow: hidden;
}

.button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.3),
    transparent
  );
  transition: left 400ms ease-out;
}

.button:hover::before {
  left: 100%;
}
```

## Framer Motion Patterns

```typescript
import { motion } from 'framer-motion';

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Slide in from bottom
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>

// Stagger children
<motion.ul
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
      }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>

// Hover scale
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

## Loading Animations

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulsing {
  animation: pulse 2s ease-in-out infinite;
}
```

## Page Transitions

```typescript
import { AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Routes>...</Routes>
  </motion.div>
</AnimatePresence>
```

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Best Practices

✅ **Do's**:
- Keep animations under 400ms
- Use `transform` and `opacity` (GPU accelerated)
- Provide reduced-motion alternative
- Test on low-end devices
- Use easing functions
- Animate meaningful interactions

❌ **Don'ts**:
- Animate `width`, `height`, `top`, `left` (causes reflow)
- Too many simultaneous animations
- Long animation durations (> 500ms)
- Ignore accessibility
- Animations without purpose

# 🎨 UI/UX Pro Max - Design System Documentation

## Athletic Energy Theme for Gym Management Platform

This document describes the professional design system implemented for the HT-STRENGTH Gym Management application, following UI/UX Pro Max best practices.

---

## 🎯 Design Philosophy

**Theme**: **Athletic Energy** - A high-performance design language that combines athletic intensity with tech-forward aesthetics.

**Core Principles**:
- ⚡ **Energy & Motion**: Dynamic gradients, smooth animations, glow effects
- 💪 **Strength & Power**: Bold typography, high contrast, confident colors
- 🎯 **Precision & Clarity**: Data-driven UI with tabular numbers, clear hierarchy
- 🌟 **Premium Feel**: Professional depth system, sophisticated color palette

---

## 🎨 Color Palette

### Primary Colors

```css
/* Primary: Energetic Orange (Main CTAs, Highlights) */
--primary: #FF6B35;
--primary-hover: #FF8555;
--primary-light: #FFAB88;
--primary-dark: #E65525;
--primary-glow: rgba(255, 107, 53, 0.4);
```

```css
/* Secondary: Electric Cyan (Accents, Secondary Actions) */
--secondary: #00D9FF;
--secondary-hover: #33E3FF;
--secondary-light: #66EDFF;
--secondary-dark: #00B8D9;
--secondary-glow: rgba(0, 217, 255, 0.6);
```

```css
/* Tertiary: Power Purple (Premium Features) */
--tertiary: #9D4EDD;
--tertiary-hover: #B066E7;
--tertiary-light: #C38AEF;
--tertiary-dark: #7B3DB3;
```

### Status Colors

```css
/* Success: Neon Green */
--success: #06FFA5;

/* Warning: Amber Gold */
--warning: #FFB627;

/* Error: Hot Pink */
--error: #FF3B5C;
```

### Background System (Dark Mode Optimized)

```css
--bg-dark: #0A0E27;       /* Deep Navy - Main background */
--bg-card: #1A1F3A;       /* Dark Slate - Card backgrounds */
--bg-elevated: #252B4A;   /* Elevated elements */
```

### Text System

```css
--text-primary: #FFFFFF;    /* Pure White - Main text */
--text-secondary: #8B92B2;  /* Muted Blue-Gray - Secondary text */
--text-muted: #5A5F7D;      /* Very muted - Hints, placeholders */
```

### Border & Dividers

```css
--border-default: rgba(255, 255, 255, 0.08);
--border-hover: rgba(255, 255, 255, 0.16);
```

---

## ✍️ Typography System

### Font Families

```css
/* Display: Bold, Athletic, Tech-inspired (for headings) */
font-family: 'Rajdhani', system-ui, sans-serif;

/* Body: Clean, Modern, Highly legible (for content) */
font-family: 'Inter', system-ui, sans-serif;

/* Mono: For stats, numbers, data (tabular-nums) */
font-family: 'JetBrains Mono', monospace;
```

### Usage Examples

```tsx
// Headings
<h1 className="font-black font-display text-6xl italic tracking-tighter">
  GYM DASHBOARD
</h1>

// Body Text
<p className="font-sans font-medium text-base text-text-secondary">
  Your daily performance summary
</p>

// Stats/Numbers
<span className="font-mono font-bold text-4xl tabular-nums">
  12,450
</span>
```

### Font Weights

- **400**: Regular (body text)
- **500**: Medium (emphasized body)
- **600**: Semibold (labels, small headings)
- **700**: Bold (buttons, important text)
- **800**: Extrabold (major headings)
- **900**: Black (hero titles, maximum impact)

---

## 📐 Spacing System (8px Base)

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

**Tailwind Classes**:
- `gap-xs`, `p-xs`, `m-xs` → 4px
- `gap-sm` → 8px
- `gap-md` → 16px
- `gap-lg` → 24px
- etc.

---

## 🔲 Border Radius System

```css
--radius-sm: 8px;    /* Small elements */
--radius-md: 16px;   /* Buttons, inputs */
--radius-lg: 24px;   /* Cards */
--radius-xl: 32px;   /* Hero sections */
--radius-xxl: 40px;  /* Special containers */
--radius-full: 9999px; /* Pills, avatars */
```

---

## 🎭 Shadow System

```css
/* Standard Depth Layers */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.12);
--shadow-md: 0 4px 16px rgba(0,0,0,0.16);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.24);
--shadow-xl: 0 12px 48px rgba(0,0,0,0.32);

/* Special Effects */
--shadow-glow: 0 0 24px rgba(255,107,53,0.4);        /* Primary glow */
--shadow-glow-lg: 0 0 40px rgba(255,107,53,0.5);     /* Strong glow */
--shadow-neon: 0 0 20px rgba(0,217,255,0.6);         /* Cyan neon */
--shadow-neon-lg: 0 0 32px rgba(0,217,255,0.7);      /* Strong neon */
```

---

## ⏱️ Transition System

**Standard Durations** (200-300ms sweet spot):

```css
--transition-fast: 150ms ease-in-out;   /* Quick feedback */
--transition-base: 250ms ease-in-out;   /* Standard (RECOMMENDED) */
--transition-slow: 400ms ease-in-out;   /* Dramatic effects */
```

**Tailwind Classes**:
- `duration-fast` → 150ms
- `duration-base` → 250ms
- `duration-slow` → 400ms

---

## 🎬 Animations

### Available Keyframes

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0% { filter: brightness(1) drop-shadow(0 0 8px rgba(255,107,53,0.4)); }
  100% { filter: brightness(1.2) drop-shadow(0 0 16px rgba(255,107,53,0.6)); }
}
```

**Usage**:
```tsx
<div className="animate-float">Floating element</div>
<div className="animate-glow">Glowing CTA</div>
<div className="animate-pulse-slow">Subtle pulse</div>
```

---

## 🧩 Component Patterns

### Primary CTA Button

```tsx
<button className="
  px-12 py-6
  bg-gradient-to-r from-primary via-[#FF8555] to-[#FF8B5C]
  text-white font-black font-display
  rounded-[2rem]
  shadow-glow hover:shadow-glow-lg
  hover:scale-105
  transition-all duration-base
  flex items-center gap-4
">
  <span className="text-sm uppercase tracking-[0.3em]">
    GET STARTED
  </span>
  <ArrowRight size={20} strokeWidth={3} />
</button>
```

### Card Component

```tsx
<div className="
  bg-bg-card/60 backdrop-blur-xl
  border border-white/8
  rounded-3xl p-8
  hover:border-white/16 hover:shadow-glow
  transform hover:-translate-y-1
  transition-all duration-base
">
  {/* Card content */}
</div>
```

### KPI/Stat Display

```tsx
<div className="space-y-2">
  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted font-sans">
    TOTAL VOLUME
  </div>
  <div className="flex items-baseline gap-3">
    <span className="text-5xl font-bold font-mono tabular-nums text-white">
      12,450
    </span>
    <span className="text-xl text-text-secondary font-sans">kg</span>
  </div>
  <div className="flex items-center gap-2 text-sm text-success">
    <TrendingUp size={16} />
    <span className="font-semibold">+12.5% vs last week</span>
  </div>
</div>
```

### Input Field

```tsx
<input 
  type="text"
  className="
    w-full px-4 py-3
    bg-black/30 
    border border-white/10 
    focus:border-primary focus:ring-2 focus:ring-primary/20
    rounded-xl
    text-white placeholder-text-muted
    transition-all duration-base
    outline-none
  "
  placeholder="Enter value..."
/>
```

---

## 🚫 Anti-Patterns (Things to Avoid)

### ❌ Don't Use:

1. **Generic AI colors**: `#a855f7`, `#7000ff` (old purple)
2. **Plain backgrounds**: Pure white or pure black
3. **Emoji icons**: Use Lucide React SVG icons instead
4. **Default blue links**: Style all links with brand colors
5. **Too fast transitions**: < 150ms feels jarring
6. **Too slow transitions**: > 500ms feels sluggish
7. **Comic Sans or Papyrus**: Use professional fonts only
8. **Center-aligned long text**: Use left-align for readability

### ✅ Do Use:

1. **Athletic Energy palette**: Orange, Cyan, Purple
2. **Gradient backgrounds**: Subtle from-to gradients
3. **SVG icons**: Lucide React (already installed)
4. **Brand-colored links**: `text-primary hover:text-primary-hover`
5. **250ms transitions**: Sweet spot for most interactions
6. **Professional fonts**: Rajdhani + Inter + JetBrains Mono
7. **Left-aligned text**: For paragraphs and long content

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 375px)  { /* Small phones */ }
@media (min-width: 768px)  { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large desktop */ }
```

**Tailwind Prefixes**: `sm:`, `md:`, `lg:`, `xl:`

---

## ♿ Accessibility

### WCAG AA Compliance

- **Text contrast**: Minimum 4.5:1 for normal text
- **Focus states**: Visible outline or ring on all interactive elements
- **Keyboard navigation**: Tab-accessible all elements
- **Motion safety**: Respect `prefers-reduced-motion`

```tsx
// Example: Motion-safe animation
<div className="motion-safe:animate-float">
  Content
</div>
```

---

## 🎯 Quick Reference

### Most Common Classes

```tsx
// Backgrounds
className="bg-bg-dark"          // Main app bg
className="bg-bg-card/60"       // Card backgrounds
className="bg-primary"          // Primary color bg

// Text
className="text-white"          // Primary text
className="text-text-secondary" // Secondary text
className="text-text-muted"     // Muted text

// Gradients (CTAs)
className="bg-gradient-to-r from-primary via-[#FF8555] to-secondary"

// Shadows
className="shadow-glow"         // Primary glow
className="shadow-neon"         // Cyan neon

// Typography
className="font-display"        // Rajdhani
className="font-sans"           // Inter
className="font-mono"           // JetBrains Mono

// Transitions
className="transition-all duration-base"  // 250ms smooth
```

---

## 🔧 Installation

Fonts are already loaded via `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

All design tokens are in:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - CSS variables
- `.agent/skills/SKILL.md` - Full design system spec

---

## 📚 Resources

- **Icons**: Lucide React (`lucide-react`)
- **Animations**: Framer Motion (`framer-motion`)
- **Charts**: Recharts (`recharts`)
- **Toasts**: Sonner (`sonner`)

---

## 🎖️ Credits

Design System: **UI/UX Pro Max v2.0**  
Theme: **Athletic Energy**  
Application: **HT-STRENGTH Gym Management**  
Updated: **February 2026**

---

**Remember**: This design system prioritizes **premium feel**, **athletic energy**, and **performance aesthetics**. Every interaction should feel powerful, smooth, and professional. 💪🔥

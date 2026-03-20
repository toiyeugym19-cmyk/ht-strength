---
name: UI UX Pro Max (Gym Edition)
description: Professional design system generator customized for fitness/gym applications
---

# UI UX Pro Max - Gym & Fitness Design System

## 🎯 RECOMMENDED DESIGN SYSTEM FOR: Fitness/Gym Management Platform

```
+----------------------------------------------------------------------------------------+
| TARGET: Antigravity Gym OS - RECOMMENDED DESIGN SYSTEM                                 |
+----------------------------------------------------------------------------------------+
| 
| PATTERN: Dashboard-Centric + Data Visualization
| Conversion: Performance-driven with gamification elements
| CTA: Contextual CTAs in each section
| Sections:
|   1. Hero Dashboard (Real-time stats)
|   2. Analytics Charts
|   3. Member Management
|   4. Workout Tracking
|   5. Calendar/Schedule
|
| STYLE: Cyberpunk Fitness Evolution
| Keywords: Bold gradients, neon accents, athletic energy, premium tech feel
| Best For: Fitness apps, gym management, sports tech, performance tracking
| Performance: Excellent | Accessibility: WCAG AA
|
| COLORS (Athletic Energy Palette):
|   Primary: #FF6B35 (Energetic Orange) - Main CTAs, highlights
|   Secondary: #00D9FF (Electric Cyan) - Secondary actions, accents
|   Tertiary: #9D4EDD (Power Purple) - Premium features
|   Success: #06FFA5 (Neon Green) - Achievements, progress
|   Background Dark: #0A0E27 (Deep Navy) - Main bg
|   Background Card: #1A1F3A (Dark Slate) - Card backgrounds
|   Text Primary: #FFFFFF (Pure White) - Main text
|   Text Secondary: #8B92B2 (Muted Blue-Gray) - Secondary text
|   Border: rgba(255,255,255,0.08) - Subtle borders
|   Notes: High-energy palette with sports tech vibes, avoids cliché purple
|
| TYPOGRAPHY: 
|   Display: 'Rajdhani' or 'Audiowide' (Bold, Athletic, Tech-inspired)
|   Body: 'Inter' (Clean, Modern, Highly legible)
|   Mono: 'JetBrains Mono' (For stats, numbers, data)
|   Mood: Powerful, energetic, professional, tech-forward
|   Best For: Sports apps, fitness tech, performance dashboards
|   Google Fonts: https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap
|
| SPACING SYSTEM (8px base):
|   xs: 4px   sm: 8px   md: 16px   lg: 24px   xl: 32px   2xl: 48px   3xl: 64px
|
| BORDER RADIUS:
|   sm: 8px   md: 16px   lg: 24px   xl: 32px   full: 9999px
|
| SHADOWS:
|   sm: 0 2px 8px rgba(0,0,0,0.12)
|   md: 0 4px 16px rgba(0,0,0,0.16)
|   lg: 0 8px 32px rgba(0,0,0,0.24)
|   glow: 0 0 24px rgba(255,107,53,0.4)
|   neon: 0 0 20px rgba(0,217,255,0.6)
|
| KEY EFFECTS:
|   Smooth transitions (200-300ms ease-in-out)
|   Glow effects on hover for CTAs
|   Subtle scale transforms (1.02-1.05)
|   Progress bar animations
|   Skeleton loading states
|
| COMPONENTS STYLE GUIDE:
|   Buttons:
|     - Primary: Gradient (orange to pink), white text, glow shadow
|     - Secondary: Outline with hover fill
|     - Ghost: Transparent with hover bg
|     - All: Rounded-2xl (16px), font-bold, uppercase, tracking-wide
|   
|   Cards:
|     - Background: Dark slate with subtle gradient overlay
|     - Border: 1px solid white/8%
|     - Rounded: 2xl-3xl (24-32px)
|     - Padding: 24-32px
|     - Hover: Slight lift + glow
|   
|   Inputs:
|     - Background: Black/30%
|     - Border: White/10%, focus: Primary color
|     - Rounded: xl (16px)
|     - Placeholder: Muted gray
|   
|   Stats/KPIs:
|     - Number: JetBrains Mono, 3xl-6xl, tabular-nums
|     - Label: Uppercase, tracking-widest, text-xs, muted
|     - Icon: Neon glow, size 24-32px
|
| AVOID (Anti-patterns):
|   ❌ Generic purple/pink AI gradients (#a855f7)
|   ❌ Plain white backgrounds
|   ❌ Emoji icons (use Lucide/Heroicons SVG)
|   ❌ Default blue links
|   ❌ Harsh transitions (<150ms or >500ms)
|   ❌ Comic Sans / Papyrus fonts
|   ❌ Centers alignment for long text
|
| PRE-DELIVERY CHECKLIST:
|   [ ] Custom color palette applied (no default Tailwind primary)
|   [ ] Google Fonts imported (Rajdhani + Inter)
|   [ ] All icons are SVG (Lucide React)
|   [ ] cursor-pointer on all clickable elements
|   [ ] Hover states with 200-300ms transitions
|   [ ] Focus states visible (outline or ring)
|   [ ] Dark mode optimized (no light mode for gym dashboard)
|   [ ] Text contrast 4.5:1 minimum (WCAG AA)
|   [ ] Responsive breakpoints: 375px, 768px, 1024px, 1440px
|   [ ] prefers-reduced-motion respected
|   [ ] Loading states (skeletons, not spinners)
|   [ ] Success feedback (toast notifications + micro-animations)
|
+----------------------------------------------------------------------------------------+
```

## 🎨 CSS DESIGN TOKENS

```css
:root {
  /* Colors - Athletic Energy Palette */
  --color-primary: #FF6B35;
  --color-primary-hover: #FF8555;
  --color-secondary: #00D9FF;
  --color-tertiary: #9D4EDD;
  --color-success: #06FFA5;
  --color-warning: #FFB627;
  --color-error: #FF3B5C;
  
  --color-bg-dark: #0A0E27;
  --color-bg-card: #1A1F3A;
  --color-bg-elevated: #252B4A;
  
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #8B92B2;
  --color-text-muted: #5A5F7D;
  
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-hover: rgba(255, 255, 255, 0.16);
  
  /* Typography */
  --font-display: 'Rajdhani', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing (8px base) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.16);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.24);
  --shadow-glow: 0 0 24px rgba(255,107,53,0.4);
  --shadow-neon: 0 0 20px rgba(0,217,255,0.6);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 400ms ease-in-out;
}
```

## 🚀 IMPLEMENTATION GUIDELINES

### Button Component Pattern
```tsx
// Primary CTA
<button className="
  px-8 py-4 
  bg-gradient-to-r from-primary to-[#FF8B5C]
  text-white font-bold uppercase tracking-wider
  rounded-2xl
  shadow-glow hover:shadow-glow-lg
  transform hover:scale-105
  transition-all duration-250
  cursor-pointer
">
  Start Workout
</button>

// Secondary
<button className="
  px-6 py-3
  border-2 border-secondary/50
  text-secondary font-semibold
  rounded-xl
  hover:bg-secondary/10 hover:border-secondary
  transition-all duration-250
  cursor-pointer
">
  View Stats
</button>
```

### Card Component Pattern
```tsx
<div className="
  bg-[#1A1F3A]/60 backdrop-blur-xl
  border border-white/8
  rounded-3xl p-8
  hover:border-white/16 hover:shadow-lg
  transform hover:-translate-y-1
  transition-all duration-250
">
  {/* Content */}
</div>
```

### Stat/KPI Display Pattern
```tsx
<div className="space-y-2">
  <div className="text-xs font-black uppercase tracking-widest text-[#8B92B2]">
    Total Volume
  </div>
  <div className="flex items-baseline gap-3">
    <span className="text-5xl font-bold font-mono tabular-nums text-white">
      12,450
    </span>
    <span className="text-xl text-[#8B92B2]">kg</span>
  </div>
  <div className="flex items-center gap-2 text-sm text-[#06FFA5]">
    <TrendingUp size={16} />
    <span className="font-semibold">+12.5% vs last week</span>
  </div>
</div>
```

## ✅ QUICK WINS TO IMPLEMENT NOW:

1. **Update tailwind.config.js** with new color palette
2. **Import Google Fonts** (Rajdhani + Inter) in index.html
3. **Replace all `bg-primary`** with new gradient patterns
4. **Update button components** with new styling
5. **Add glow effects** to CTAs
6. **Standardize transitions** to 250ms
7. **Remove emoji icons**, use Lucide React only

## 📚 RESOURCES

- Color Palette: Custom Athletic Energy system
- Fonts: Google Fonts (Rajdhani, Inter, JetBrains Mono)
- Icons: Lucide React (already installed)
- Animations: Framer Motion (already installed)
- Charts: Recharts with custom theming

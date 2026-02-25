---
name: Accessibility (A11y)
description: WCAG AA compliance patterns and best practices for inclusive web applications
---

# Accessibility (A11y) Skill

## WCAG 2.1 AA Compliance

### Four Principles: POUR

1. **Perceivable**: Users can perceive the content
2. **Operable**: Users can operate the interface
3. **Understandable**: Users can understand the content
4. **Robust**: Content works across technologies

## Color Contrast

### 1. **Contrast Ratios**

**WCAG AA Requirements**:
- Normal text: **4.5:1** minimum
- Large text (18pt+): **3:1** minimum
- UI components: **3:1** minimum

```css
/* ✅ Good: White on Deep Navy */
color: #FFFFFF;           /* Text */
background: #0A0E27;      /* Background */
/* Ratio: 16.2:1 - PASS */

/* ❌ Bad: Light gray on white */
color: #CCCCCC;
background: #FFFFFF;
/* Ratio: 2.1:1 - FAIL */
```

### 2. **Tools**

- Chrome DevTools Accessibility Inspector
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Contrast Ratio](https://contrast-ratio.com/)

## Semantic HTML

### 1. **Proper Structure**

```tsx
// ✅ Good: Semantic elements
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2026 HT Strength</p>
</footer>

// ❌ Bad: Div soup
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
```

### 2. **Heading Hierarchy**

```tsx
<h1>Dashboard</h1>          {/* Only ONE h1 per page */}
  <h2>Member Stats</h2>
    <h3>Active Members</h3>
    <h3>Expired Members</h3>
  <h2>Workout Logs</h2>
    <h3>This Week</h3>

{/* ❌ Don't skip levels: h1 → h3 */}
```

## ARIA (Accessible Rich Internet Applications)

### 1. **ARIA Roles**

```tsx
// Navigation
<nav role="navigation" aria-label="Main Navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// Search
<div role="search">
  <input type="text" aria-label="Search members" />
  <button aria-label="Submit search">
    <SearchIcon />
  </button>
</div>

// Alert/Status
<div role="alert" aria-live="polite">
  Member added successfully!
</div>
```

### 2. **ARIA Labels**

```tsx
// Button with only icon
<button aria-label="Close modal">
  <XIcon />
</button>

// Input with no visible label
<input 
  type="text" 
  aria-label="Member name"
  placeholder="Enter name..."
/>

// Descriptive link
<a href="/members/123" aria-label="View John Doe's profile">
  View Profile
</a>
```

### 3. **ARIA States**

```tsx
// Expanded/Collapsed
<button 
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
>
  Menu
</button>

// Selected tab
<div role="tablist">
  <button 
    role="tab" 
    aria-selected={activeTab === 'profile'}
  >
    Profile
  </button>
</div>

// Disabled
<button aria-disabled="true" disabled>
  Submit
</button>
```

## Keyboard Navigation

### 1. **Focus Management**

```tsx
// Visible focus indicator
button:focus-visible {
  outline: 2px solid #FF6B35;
  outline-offset: 2px;
}

// Skip link (for screen readers)
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Focus trap (for modals)
import { FocusTrap } from '@headlessui/react';

<FocusTrap>
  <div className="modal">
    {/* Modal content */}
  </div>
</FocusTrap>
```

### 2. **Tab Order**

```tsx
// Natural tab order (no tabindex needed)
<input type="text" />
<button>Submit</button>

// Custom tab order (use sparingly)
<div tabIndex={0}>Focusable div</div>

// Remove from tab order
<div tabIndex={-1}>Not focusable</div>
```

### 3. **Keyboard Shortcuts**

```tsx
function handleKeyDown(e: KeyboardEvent) {
  // Escape to close modal
  if (e.key === 'Escape') {
    closeModal();
  }
  
  // Enter/Space to activate button
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
  
  // Arrow keys for navigation
  if (e.key === 'ArrowDown') {
    focusNextItem();
  }
}
```

## Screen Reader Support

### 1. **Announcements**

```tsx
// Live region for dynamic updates
<div aria-live="polite" aria-atomic="true">
  {memberCount} members active
</div>

// Alert for errors
<div role="alert" aria-live="assertive">
  Error: Failed to save member
</div>
```

### 2. **Hidden Content**

```tsx
// Visually hidden but readable by screen readers
<span className="sr-only">
  Total members
</span>

// CSS for sr-only
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Hide from screen readers
<div aria-hidden="true">
  Decorative icon
</div>
```

## Forms

### 1. **Labels**

```tsx
// ✅ Good: Explicit label
<label htmlFor="member-name">
  Member Name
</label>
<input id="member-name" type="text" />

// ✅ Good: Implicit label
<label>
  Member Name
  <input type="text" />
</label>
```

### 2. **Error Messages**

```tsx
<input 
  type="email"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email
  </span>
)}
```

### 3. **Required Fields**

```tsx
<label>
  Email <span aria-label="required">*</span>
</label>
<input 
  type="email" 
  required 
  aria-required="true"
/>
```

## Images

```tsx
// Informative image
<img 
  src="/member.jpg" 
  alt="John Doe, senior member since 2020"
/>

// Decorative image
<img src="/pattern.svg" alt="" role="presentation" />

// Icon with text
<button>
  <PlusIcon aria-hidden="true" />
  <span>Add Member</span>
</button>
```

## Motion & Animation

```tsx
// Respect prefers-reduced-motion
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-float {
    animation: none;
  }
}

// React implementation
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<motion.div
  animate={prefersReducedMotion ? {} : { y: -10 }}
>
  Content
</motion.div>
```

## Testing Tools

1. **Chrome Lighthouse**: Automated audit
2. **axe DevTools**: Accessibility testing
3. **WAVE**: Visual feedback
4. **Screen Reader**: NVDA (Windows), VoiceOver (Mac)
5. **Keyboard-only navigation**: Unplug mouse!

## Quick Checklist

- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Semantic HTML structure
- [ ] One H1 per page, proper heading hierarchy
- [ ] Form labels properly associated
- [ ] Images have alt text
- [ ] ARIA labels for icon-only buttons
- [ ] Error messages linked with aria-describedby
- [ ] Respects prefers-reduced-motion
- [ ] Tested with screen reader
- [ ] Tested keyboard-only navigation
- [ ] No color-only information

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

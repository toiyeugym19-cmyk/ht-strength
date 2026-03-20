# 📱 MOBILE & TABLET UI MASTERPLAN
## Brite Thor Pro - Native App Experience

> **Mục tiêu**: Thiết kế lại hoàn toàn giao diện Mobile và Tablet để đạt chuẩn App Native iOS/Android, không còn là "web thu nhỏ"

---

## 🎯 PHASE 1: FOUNDATION - Hệ thống nền tảng

### 1.1 Device Detection & Context
- [ ] **Task 1.1.1**: Tạo `useDeviceContext` hook để detect device type chính xác
- [ ] **Task 1.1.2**: Implement responsive breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- [ ] **Task 1.1.3**: Tạo `DeviceProvider` context để share device info toàn app
- [ ] **Task 1.1.4**: Detect orientation (portrait/landscape) cho tablet
- [ ] **Task 1.1.5**: Detect safe-area-insets cho iPhone notch

### 1.2 Design Tokens - Mobile First
- [ ] **Task 1.2.1**: Tạo file `tokens/mobile.css` với spacing riêng cho mobile (4, 8, 12, 16, 20, 24, 32px)
- [ ] **Task 1.2.2**: Tạo file `tokens/tablet.css` với spacing cho tablet (6, 12, 18, 24, 32, 48px)
- [ ] **Task 1.2.3**: Define touch target sizes: minimum 44x44px (iOS), 48x48px (Material)
- [ ] **Task 1.2.4**: Typography scale riêng cho mobile (14px base, 1.4 line-height)
- [ ] **Task 1.2.5**: Typography scale riêng cho tablet (16px base, 1.5 line-height)
- [ ] **Task 1.2.6**: Border radius tokens: 8, 12, 16, 20, 24, 28, 32px
- [ ] **Task 1.2.7**: Shadow tokens cho elevated components

### 1.3 Animation System
- [ ] **Task 1.3.1**: Tạo `animations/mobile.ts` với các preset animations
- [ ] **Task 1.3.2**: Page transition animations (slide, fade, scale)
- [ ] **Task 1.3.3**: List item stagger animations
- [ ] **Task 1.3.4**: Pull-to-refresh animation
- [ ] **Task 1.3.5**: Bottom sheet slide-up animation
- [ ] **Task 1.3.6**: Tab switching animations
- [ ] **Task 1.3.7**: Skeleton loading animations
- [ ] **Task 1.3.8**: Haptic feedback CSS animations (scale bounce)

---

## 📱 PHASE 2: MOBILE COMPONENTS - iPhone-like Experience

### 2.1 Navigation Components
- [ ] **Task 2.1.1**: `MobileTabBar` - iOS-style bottom tab với glow effects
- [ ] **Task 2.1.2**: `MobileHeader` - Large title header với collapse on scroll
- [ ] **Task 2.1.3**: `MobileBackButton` - Swipe back gesture support
- [ ] **Task 2.1.4**: `MobileSearchBar` - iOS search với cancel button
- [ ] **Task 2.1.5**: `MobileSegmentedControl` - iOS-style tabs
- [ ] **Task 2.1.6**: `MobilePageIndicator` - Dot pagination
- [ ] **Task 2.1.7**: `MobileFloatingButton` - FAB với badge support

### 2.2 List & Card Components
- [ ] **Task 2.2.1**: `MobileListItem` - iOS list row với chevron, swipe actions
- [ ] **Task 2.2.2**: `MobileCard` - Glass card với touch feedback
- [ ] **Task 2.2.3**: `MobileProfileCard` - Avatar + info layout
- [ ] **Task 2.2.4**: `MobileStatCard` - KPI card với icon + value
- [ ] **Task 2.2.5**: `MobileActionSheet` - Bottom action menu
- [ ] **Task 2.2.6**: `MobileSwipeableRow` - Swipe to delete/edit
- [ ] **Task 2.2.7**: `MobileExpandableCard` - Tap to expand details

### 2.3 Form Components
- [ ] **Task 2.3.1**: `MobileInput` - iOS-style input với floating label
- [ ] **Task 2.3.2**: `MobileTextArea` - Auto-resize textarea
- [ ] **Task 2.3.3**: `MobileSelect` - Native picker wheel style
- [ ] **Task 2.3.4**: `MobileDatePicker` - iOS date picker
- [ ] **Task 2.3.5**: `MobileSwitch` - iOS toggle switch
- [ ] **Task 2.3.6**: `MobileSlider` - Touch-friendly slider
- [ ] **Task 2.3.7**: `MobileCheckbox` - Animated checkbox
- [ ] **Task 2.3.8**: `MobileRadioGroup` - iOS radio buttons

### 2.4 Feedback Components
- [ ] **Task 2.4.1**: `MobileToast` - Top notification toast
- [ ] **Task 2.4.2**: `MobileAlert` - iOS alert dialog
- [ ] **Task 2.4.3**: `MobileBottomSheet` - Draggable bottom modal
- [ ] **Task 2.4.4**: `MobileLoadingSpinner` - iOS activity indicator
- [ ] **Task 2.4.5**: `MobileSkeleton` - Shimmer loading placeholder
- [ ] **Task 2.4.6**: `MobileEmptyState` - Empty list illustration
- [ ] **Task 2.4.7**: `MobileErrorState` - Error with retry button
- [ ] **Task 2.4.8**: `MobilePullToRefresh` - Pull down refresh

### 2.5 Specialized Components
- [ ] **Task 2.5.1**: `MobileAvatarStack` - Overlapping avatars
- [ ] **Task 2.5.2**: `MobileBadge` - Notification badge
- [ ] **Task 2.5.3**: `MobileProgressRing` - Circular progress
- [ ] **Task 2.5.4**: `MobileChip` - Tag/filter chips
- [ ] **Task 2.5.5**: `MobileCalendarDay` - Day picker cell
- [ ] **Task 2.5.6**: `MobileTimeSlot` - Time picker slot
- [ ] **Task 2.5.7**: `MobileStatusIndicator` - Online/offline dot

---

## 📲 PHASE 3: TABLET COMPONENTS - iPad-like Experience

### 3.1 Layout Components
- [ ] **Task 3.1.1**: `TabletSplitView` - Master-detail layout
- [ ] **Task 3.1.2**: `TabletSidebar` - Collapsible icon sidebar (80px/240px)
- [ ] **Task 3.1.3**: `TabletToolbar` - Top action bar
- [ ] **Task 3.1.4**: `TabletGrid` - Responsive grid (2-3-4 columns)
- [ ] **Task 3.1.5**: `TabletPanel` - Floating panel overlay
- [ ] **Task 3.1.6**: `TabletPopover` - Dropdown popover menu

### 3.2 Content Components
- [ ] **Task 3.2.1**: `TabletCard` - Larger card với hover effects
- [ ] **Task 3.2.2**: `TabletTable` - Touch-friendly data table
- [ ] **Task 3.2.3**: `TabletGallery` - Grid image gallery
- [ ] **Task 3.2.4**: `TabletCarousel` - Swipe carousel
- [ ] **Task 3.2.5**: `TabletAccordion` - Expandable sections
- [ ] **Task 3.2.6**: `TabletTimeline` - Vertical timeline

### 3.3 Navigation Components
- [ ] **Task 3.3.1**: `TabletNavRail` - Vertical nav rail
- [ ] **Task 3.3.2**: `TabletBreadcrumb` - Navigation breadcrumbs
- [ ] **Task 3.3.3**: `TabletTabBar` - Horizontal tabs với icons
- [ ] **Task 3.3.4**: `TabletSearchExpanded` - Full search experience

---

## 🎨 PHASE 4: PAGE REDESIGN - Mobile

### 4.1 Home/Dashboard
- [ ] **Task 4.1.1**: Redesign mobile Dashboard với vertical card stack
- [ ] **Task 4.1.2**: Quick stats row (3 mini cards)
- [ ] **Task 4.1.3**: Today's schedule horizontal scroll
- [ ] **Task 4.1.4**: Recent activity feed
- [ ] **Task 4.1.5**: Quick actions grid (2x2)
- [ ] **Task 4.1.6**: Greeting header với avatar + date

### 4.2 Members Page
- [ ] **Task 4.2.1**: Member list với swipe actions (edit/delete/message)
- [ ] **Task 4.2.2**: Quick filter chips (Active, Expired, New)
- [ ] **Task 4.2.3**: Member profile bottom sheet
- [ ] **Task 4.2.4**: Add member full-screen modal
- [ ] **Task 4.2.5**: Check-in scanner full screen
- [ ] **Task 4.2.6**: Member search với recent/suggested

### 4.3 Health AI Page
- [ ] **Task 4.3.1**: Health score hero card
- [ ] **Task 4.3.2**: Tab pills navigation
- [ ] **Task 4.3.3**: Nutrition cards horizontal scroll
- [ ] **Task 4.3.4**: 1RM calculator với large buttons
- [ ] **Task 4.3.5**: Body map touch interaction
- [ ] **Task 4.3.6**: Protection toggles list
- [ ] **Task 4.3.7**: AI insights carousel

### 4.4 Gym Page
- [ ] **Task 4.4.1**: Live occupancy hero
- [ ] **Task 4.4.2**: Peak hours timeline
- [ ] **Task 4.4.3**: Equipment status grid
- [ ] **Task 4.4.4**: Class schedule cards
- [ ] **Task 4.4.5**: Trainer availability list

### 4.5 Calendar Page
- [ ] **Task 4.5.1**: Month view với swipe navigation
- [ ] **Task 4.5.2**: Week view horizontal scroll
- [ ] **Task 4.5.3**: Day detail bottom sheet
- [ ] **Task 4.5.4**: Event creation modal
- [ ] **Task 4.5.5**: Time slot picker

### 4.6 Nutrition Page
- [ ] **Task 4.6.1**: Meal plan cards
- [ ] **Task 4.6.2**: Macro rings display
- [ ] **Task 4.6.3**: Food search với camera
- [ ] **Task 4.6.4**: Recipe detail modal
- [ ] **Task 4.6.5**: Water intake tracker

### 4.7 Messages Page
- [ ] **Task 4.7.1**: Conversation list với last message preview
- [ ] **Task 4.7.2**: Chat view full screen
- [ ] **Task 4.7.3**: Quick reply templates
- [ ] **Task 4.7.4**: Notification settings

---

## 🎨 PHASE 5: PAGE REDESIGN - Tablet

### 5.1 Dashboard
- [ ] **Task 5.1.1**: 3-column grid layout
- [ ] **Task 5.1.2**: Side-by-side charts
- [ ] **Task 5.1.3**: Quick stats row (4 cards)
- [ ] **Task 5.1.4**: Activity feed sidebar

### 5.2 Members Page
- [ ] **Task 5.2.1**: Split view: list + detail panel
- [ ] **Task 5.2.2**: Member grid (2 columns)
- [ ] **Task 5.2.3**: Inline edit modal
- [ ] **Task 5.2.4**: Bulk actions toolbar

### 5.3 Health AI
- [ ] **Task 5.3.1**: 2-panel layout
- [ ] **Task 5.3.2**: Side-by-side calculators
- [ ] **Task 5.3.3**: Larger body map
- [ ] **Task 5.3.4**: Tabbed insights panel

### 5.4 Calendar
- [ ] **Task 5.4.1**: Week view with sidebar
- [ ] **Task 5.4.2**: Event detail panel
- [ ] **Task 5.4.3**: Drag-to-create events

---

## ⚡ PHASE 6: INTERACTIONS & GESTURES

### 6.1 Touch Gestures
- [ ] **Task 6.1.1**: Swipe left/right on list items
- [ ] **Task 6.1.2**: Pull-to-refresh on all lists
- [ ] **Task 6.1.3**: Long-press context menu
- [ ] **Task 6.1.4**: Pinch-to-zoom on images
- [ ] **Task 6.1.5**: Swipe between tabs
- [ ] **Task 6.1.6**: Edge swipe back navigation

### 6.2 Micro-interactions
- [ ] **Task 6.2.1**: Button press scale (0.95)
- [ ] **Task 6.2.2**: Card tap highlight
- [ ] **Task 6.2.3**: Toggle switch spring animation
- [ ] **Task 6.2.4**: Success checkmark animation
- [ ] **Task 6.2.5**: Error shake animation
- [ ] **Task 6.2.6**: Loading skeleton shimmer

### 6.3 Transitions
- [ ] **Task 6.3.1**: Page slide transitions
- [ ] **Task 6.3.2**: Modal scale-in animation
- [ ] **Task 6.3.3**: Bottom sheet slide-up
- [ ] **Task 6.3.4**: Tab content crossfade
- [ ] **Task 6.3.5**: List item stagger entrance

---

## 🔧 PHASE 7: PERFORMANCE & POLISH

### 7.1 Performance
- [ ] **Task 7.1.1**: Lazy load off-screen components
- [ ] **Task 7.1.2**: Virtual scrolling cho long lists
- [ ] **Task 7.1.3**: Image lazy loading với blur placeholder
- [ ] **Task 7.1.4**: Reduce re-renders với memo
- [ ] **Task 7.1.5**: Bundle splitting cho mobile/tablet

### 7.2 Polish
- [ ] **Task 7.2.1**: Empty states cho tất cả lists
- [ ] **Task 7.2.2**: Error boundaries với retry
- [ ] **Task 7.2.3**: Loading states cho mọi action
- [ ] **Task 7.2.4**: Keyboard accessibility
- [ ] **Task 7.2.5**: Screen reader support

### 7.3 Testing
- [ ] **Task 7.3.1**: Test trên iPhone (Safari)
- [ ] **Task 7.3.2**: Test trên Android (Chrome)
- [ ] **Task 7.3.3**: Test trên iPad
- [ ] **Task 7.3.4**: Test trên Android Tablet
- [ ] **Task 7.3.5**: Test landscape orientation

---

## 📁 FILE STRUCTURE

```
src/
├── components/
│   ├── mobile/
│   │   ├── navigation/
│   │   │   ├── MobileTabBar.tsx
│   │   │   ├── MobileHeader.tsx
│   │   │   ├── MobileSearchBar.tsx
│   │   │   └── MobileBackButton.tsx
│   │   ├── cards/
│   │   │   ├── MobileCard.tsx
│   │   │   ├── MobileStatCard.tsx
│   │   │   ├── MobileProfileCard.tsx
│   │   │   └── MobileListItem.tsx
│   │   ├── forms/
│   │   │   ├── MobileInput.tsx
│   │   │   ├── MobileSelect.tsx
│   │   │   └── MobileSwitch.tsx
│   │   ├── feedback/
│   │   │   ├── MobileToast.tsx
│   │   │   ├── MobileBottomSheet.tsx
│   │   │   └── MobileAlert.tsx
│   │   └── index.ts
│   │
│   ├── tablet/
│   │   ├── layout/
│   │   │   ├── TabletSplitView.tsx
│   │   │   ├── TabletSidebar.tsx
│   │   │   └── TabletGrid.tsx
│   │   ├── content/
│   │   │   ├── TabletCard.tsx
│   │   │   └── TabletTable.tsx
│   │   └── index.ts
│   │
│   └── shared/
│       └── ... (shared components)
│
├── pages/
│   ├── mobile/
│   │   ├── MobileDashboard.tsx
│   │   ├── MobileMembersPage.tsx
│   │   ├── MobileHealthAI.tsx
│   │   └── ...
│   │
│   └── tablet/
│       ├── TabletDashboard.tsx
│       ├── TabletMembersPage.tsx
│       └── ...
│
├── hooks/
│   ├── useDeviceType.ts
│   ├── useSwipeGesture.ts
│   └── usePullToRefresh.ts
│
├── styles/
│   ├── mobile.css
│   ├── tablet.css
│   └── animations.css
│
└── context/
    └── DeviceContext.tsx
```

---

## 🚀 IMPLEMENTATION ORDER

### Week 1: Foundation
1. Device context & hooks
2. Design tokens
3. Base mobile components (5 core)

### Week 2: Mobile Components
1. Navigation components
2. Card components
3. Form components
4. Feedback components

### Week 3: Mobile Pages
1. Dashboard redesign
2. Members page redesign
3. Health AI redesign

### Week 4: Tablet
1. Split view layout
2. Tablet components
3. Tablet pages

### Week 5: Polish
1. Animations & transitions
2. Gestures
3. Testing & fixes

---

## 📊 TOTAL TASKS: 147

| Phase | Task Count |
|-------|------------|
| Phase 1: Foundation | 20 |
| Phase 2: Mobile Components | 31 |
| Phase 3: Tablet Components | 16 |
| Phase 4: Mobile Pages | 32 |
| Phase 5: Tablet Pages | 14 |
| Phase 6: Interactions | 17 |
| Phase 7: Performance | 17 |
| **TOTAL** | **147** |

---

*Document created: 2026-01-31*
*Last updated: 2026-01-31*

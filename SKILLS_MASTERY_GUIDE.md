# 🎓 SKILLS MASTERY GUIDE

## Tổng Quan

Tôi đã cài đặt **6 AI Skills chuyên nghiệp** vào thư mục `.agent/skills` để hỗ trợ phát triển ứng dụng Gym Management này. Mỗi skill là một hệ thống chuyên gia (expert system) về một lĩnh vực cụ thể.

---

## 📚 Danh Sách Skills Đã Cài Đặt

### 1. **UI/UX Pro Max** (`SKILL.md`)
**Mục đích**: Thiết kế giao diện chuyên nghiệp cho ứng dụng Gym/Fitness

**Nội dung chính**:
- ✅ Athletic Energy Color Palette (Orange, Cyan, Purple)
- ✅ Typography System (Rajdhani + Inter + JetBrains Mono)
- ✅ Component Patterns (Buttons, Cards, Stats)
- ✅ Design Tokens (Spacing, Shadows, Transitions)
- ✅ Anti-patterns (Những gì nên tránh)

**Khi nào sử dụng**:
- Khi cần thiết kế UI mới
- Khi muốn đảm bảo tính đồng nhất về màu sắc/typography
- Khi cần tạo component mới với style chuẩn

**Tham khảo**: `.agent/skills/SKILL.md`

---

### 2. **Database Schema Design** (`database-schema.md`)
**Mục đích**: Thiết kế cấu trúc dữ liệu hiệu quả cho hệ thống gym

**Nội dung chính**:
- ✅ Member Management Schema
- ✅ Workout Tracking Structure
- ✅ Indexing Strategies
- ✅ Zustand Store Patterns
- ✅ Data Normalization vs Denormalization

**Khi nào sử dụng**:
- Khi thêm model/entity mới (VD: Class Schedule, Equipment)
- Khi cần tối ưu query performance
- Khi thiết kế API response structure
- Khi refactor store structure

**Ví dụ thực tế**:
```typescript
// Cần thêm "Class Schedule" feature
// → Tham khảo Member schema pattern
interface ClassSchedule {
  id: string;
  className: string;
  instructor: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  enrolledMembers: string[]; // Member IDs
}
```

**Tham khảo**: `.agent/skills/database-schema.md`

---

### 3. **Performance Optimization** (`performance-optimization.md`)
**Mục đích**: Tối ưu hiệu suất ứng dụng React/Vite

**Nội dung chính**:
- ✅ React Memoization (useMemo, memo, useCallback)
- ✅ Code Splitting & Lazy Loading
- ✅ Virtualization (100+ items lists)
- ✅ Vite Build Optimization
- ✅ Image Optimization
- ✅ Core Web Vitals Targets

**Khi nào sử dụng**:
- Khi trang load chậm (> 3s)
- Khi danh sách dài (100+ members) render lag
- Khi bundle size quá lớn (> 500kb)
- Khi lighthouse score < 90

**Ví dụ thực tế**:
```typescript
// MemberList chậm với 1000 members
// → Áp dụng virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: members.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 80,
});
```

**Tham khảo**: `.agent/skills/performance-optimization.md`

---

### 4. **State Management Best Practices** (`state-management.md`)
**Mục đích**: Quản lý state hiệu quả với Zustand

**Nội dung chính**:
- ✅ Zustand Store Architecture
- ✅ Selector Patterns (tránh re-render)
- ✅ Async Actions (API calls)
- ✅ Persistence Strategy (localStorage)
- ✅ Store Migrations
- ✅ Testing Stores

**Khi nào sử dụng**:
- Khi tạo store mới
- Khi component re-render không cần thiết
- Khi cần persist data
- Khi upgrade store schema (migrations)

**Ví dụ thực tế**:
```typescript
// Component re-render nhiều
// ❌ Bad
const { members, workouts, selectedId } = useGymStore();

// ✅ Good: Chỉ subscribe cái cần
const members = useGymStore(state => state.members);
```

**Tham khảo**: `.agent/skills/state-management.md`

---

### 5. **Testing Strategy** (`testing-strategy.md`)
**Mục đích**: Viết tests toàn diện cho ứng dụng

**Nội dung chính**:
- ✅ Testing Pyramid (Unit 60%, Integration 30%, E2E 10%)
- ✅ React Testing Library Patterns
- ✅ Zustand Store Testing
- ✅ API Mocking (MSW)
- ✅ E2E with Playwright
- ✅ Coverage Thresholds

**Khi nào sử dụng**:
- Khi viết feature mới
- Khi refactor code (regression testing)
- Khi fix bug (add test case)
- Khi chuẩn bị production

**Ví dụ thực tế**:
```typescript
// Test component với store
import { renderHook, act } from '@testing-library/react';

it('should add member to store', () => {
  const { result } = renderHook(() => useGymStore());
  
  act(() => {
    result.current.addMember(mockMember);
  });
  
  expect(result.current.members).toHaveLength(1);
});
```

**Tham khảo**: `.agent/skills/testing-strategy.md`

---

### 6. **Accessibility (A11y)** (`accessibility.md`)
**Mục đích**: Đảm bảo app accessible cho mọi người dùng

**Nội dung chính**:
- ✅ WCAG AA Compliance
- ✅ Color Contrast Requirements (4.5:1)
- ✅ Semantic HTML
- ✅ ARIA Patterns
- ✅ Keyboard Navigation
- ✅ Screen Reader Support

**Khi nào sử dụng**:
- Khi tạo component mới
- Khi thêm interactive elements
- Khi redesign UI
- Khi chuẩn bị launch (audit)

**Ví dụ thực tế**:
```tsx
// Button chỉ có icon
// ❌ Bad
<button><SearchIcon /></button>

// ✅ Good
<button aria-label="Search members">
  <SearchIcon aria-hidden="true" />
</button>
```

**Tham khảo**: `.agent/skills/accessibility.md`

---

## 🎯 Workflow: Cách Sử Dụng Skills

### Scenario 1: **Thêm Feature Mới**

**Ví dụ**: Thêm "Equipment Inventory" feature

**Bước 1**: Thiết kế Schema
→ Tham khảo `database-schema.md`
```typescript
interface Equipment {
  id: string;
  name: string;
  category: 'Cardio' | 'Strength' | 'Accessories';
  quantity: number;
  maintenanceDate: string;
}
```

**Bước 2**: Tạo Store
→ Tham khảo `state-management.md`
```typescript
const useEquipmentStore = create<EquipmentState>()(
  persist(/* ... */)
);
```

**Bước 3**: Tạo UI Components
→ Tham khảo `SKILL.md` (UI/UX Pro Max)
```tsx
<div className="bg-bg-card/60 border border-white/8 rounded-3xl p-8">
  {/* Equipment List */}
</div>
```

**Bước 4**: Thêm Accessibility
→ Tham khảo `accessibility.md`
```tsx
<button aria-label="Add equipment">
  <PlusIcon aria-hidden="true" />
</button>
```

**Bước 5**: Viết Tests
→ Tham khảo `testing-strategy.md`
```typescript
it('should add equipment', () => {
  // Test logic
});
```

**Bước 6**: Tối ưu Performance
→ Tham khảo `performance-optimization.md`
```typescript
const equipmentList = useMemo(
  () => equipment.filter(e => e.quantity > 0),
  [equipment]
);
```

---

### Scenario 2: **Fix Performance Issue**

**Vấn đề**: Member list chậm với 500 members

**Bước 1**: Identify bottleneck
→ Chrome DevTools Profiler

**Bước 2**: Áp dụng solutions từ `performance-optimization.md`
- ✅ Virtualization cho list
- ✅ Memoize computed values
- ✅ Optimize selectors

**Bước 3**: Verify improvement
→ Lighthouse audit

---

### Scenario 3: **Accessibility Audit**

**Mục tiêu**: Đảm bảo WCAG AA compliance

**Bước 1**: Run automated audit
→ Chrome Lighthouse

**Bước 2**: Fix issues theo `accessibility.md`
- ✅ Add aria-labels
- ✅ Check color contrast
- ✅ Test keyboard navigation

**Bước 3**: Manual testing
→ Screen reader (NVDA/VoiceOver)

---

## 📝 Tài Liệu Tham Khảo Nhanh

### Màu Sắc (từ UI/UX Pro Max)
```css
Primary: #FF6B35 (Orange)
Secondary: #00D9FF (Cyan)
Tertiary: #9D4EDD (Purple)
Background: #0A0E27 (Deep Navy)
```

### Typography
```css
Display: font-display (Rajdhani)
Body: font-sans (Inter)
Mono: font-mono (JetBrains Mono)
```

### Performance Targets
```
LCP: < 2.5s
FID: < 100ms
CLS: < 0.1
Bundle size: < 200kb (gzipped)
```

### Accessibility Standards
```
Color contrast: 4.5:1 (normal text)
Keyboard navigation: ✅ All interactive elements
Screen reader: ✅ Proper ARIA labels
```

---

## 🚀 Next Steps

### Immediate Actions

1. **Review Skills** (30 phút)
   - Đọc qua `.agent/skills/SKILL.md` (UI/UX)
   - Đọc `database-schema.md` nếu làm về data
   - Đọc `performance-optimization.md` nếu app chậm

2. **Apply to Current Project** (1 giờ)
   - Check accessibility với Lighthouse
   - Optimize member list nếu > 100 items
   - Ensure design tokens được dùng đúng

3. **Set Up Testing** (2 giờ)
   - Install Vitest, RTL, Playwright
   - Write first test case
   - Set up coverage threshold

### Long-term Goals

- [ ] 80%+ test coverage
- [ ] Lighthouse score > 90
- [ ] WCAG AA compliant
- [ ] Bundle size < 200kb
- [ ] All skills mastered

---

## 📚 Cấu Trúc Thư Mục Skills

```
.agent/skills/
├── SKILL.md                      ← UI/UX Pro Max
├── database-schema.md            ← Database Design
├── performance-optimization.md   ← Performance
├── state-management.md           ← Zustand Best Practices
├── testing-strategy.md           ← Testing Patterns
└── accessibility.md              ← A11y Compliance
```

---

## 🎓 Mastery Checklist

### Beginner (Hiện tại)
- [x] Skills đã được cài đặt
- [ ] Đọc qua 1 skill (UI/UX)
- [ ] Apply 1 pattern vào code

### Intermediate (Mục tiêu 1 tuần)
- [ ] Đọc hết 6 skills
- [ ] Apply multiple patterns
- [ ] Write first test
- [ ] Run Lighthouse audit

### Advanced (Mục tiêu 1 tháng)
- [ ] Master all 6 skills
- [ ] 80%+ test coverage
- [ ] Lighthouse > 90
- [ ] WCAG AA compliant
- [ ] Can teach others

---

## 💡 Tips

1. **Không cần học hết cùng lúc**: Học theo nhu cầu (just-in-time learning)
2. **Practice by doing**: Apply ngay vào project thực tế
3. **Bookmark skills**: Dùng như reference guide, không cần nhớ hết
4. **Iterate**: Improve dần dần, không cần perfect from day 1

---

## 🎉 Conclusion

Bạn giờ có **6 expert systems** trong `.agent/skills` để hỗ trợ phát triển app. Mỗi khi gặp vấn đề, tham khảo skill tương ứng:

- 🎨 **UI issue** → `SKILL.md`
- 🗄️ **Data structure** → `database-schema.md`
- 🚀 **Performance** → `performance-optimization.md`
- 📦 **State management** → `state-management.md`
- 🧪 **Testing** → `testing-strategy.md`
- ♿ **Accessibility** → `accessibility.md`

**Happy coding!** 💪🔥

---

**Created**: February 2026  
**Version**: 1.0  
**Status**: Ready for mastery

---
name: State Management Best Practices
description: Expert patterns for Zustand, React state, and global state management in TypeScript applications
---

# State Management Best Practices

## Zustand Store Architecture

### 1. **Store Structure**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GymState {
  // Domain data
  members: Member[];
  workouts: WorkoutLog[];
  
  // UI state (separate from domain)
  selectedMemberId: string | null;
  isLoading: boolean;
  
  // Computed values (getters)
  activeMembers: () => Member[];
  totalVolume: () => number;
  
  // Actions
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;
  logWorkout: (workout: WorkoutLog) => void;
}

export const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      members: [],
      workouts: [],
      selectedMemberId: null,
      isLoading: false,
      
      activeMembers: () => 
        get().members.filter(m => m.status === 'Active'),
      
      totalVolume: () =>
        get().workouts.reduce((sum, w) => sum + w.totalVolume, 0),
      
      addMember: (member) => 
        set((state) => ({ 
          members: [...state.members, member] 
        })),
      
      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter(m => m.id !== id)
        })),
      
      logWorkout: (workout) =>
        set((state) => ({
          workouts: [...state.workouts, workout]
        })),
    }),
    {
      name: 'gym-storage-v2',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          // Migration logic
          return {
            ...persistedState,
            newField: 'default'
          };
        }
        return persistedState;
      }
    }
  )
);
```

### 2. **Slice Pattern** (Multiple Stores)

```typescript
// Member Slice
const useMemberSlice = create<MemberSlice>((set) => ({
  members: [],
  addMember: (member) => set((state) => ({
    members: [...state.members, member]
  }))
}));

// Workout Slice
const useWorkoutSlice = create<WorkoutSlice>((set) => ({
  workouts: [],
  logWorkout: (workout) => set((state) => ({
    workouts: [...state.workouts, workout]
  }))
}));

// Combine when needed
function MyComponent() {
  const members = useMemberSlice(state => state.members);
  const workouts = useWorkoutSlice(state => state.workouts);
}
```

### 3. **Selector Pattern** (Performance)

```typescript
// ❌ Bad: Re-renders on any state change
const { members, workouts, selectedId } = useGymStore();

// ✅ Good: Only re-renders when members change
const members = useGymStore(state => state.members);

// ✅ Better: Memoized selector
const activeMembers = useGymStore(
  state => state.members.filter(m => m.status === 'Active')
);

// ✅ Best: Shallow equality check
import { shallow } from 'zustand/shallow';

const { members, addMember } = useGymStore(
  state => ({ members: state.members, addMember: state.addMember }),
  shallow
);
```

## React State (Local)

### 1. **When to Use React State**

✅ **Use `useState` for**:
- Form inputs (controlled components)
- UI-only state (modal open/close, tabs)
- Temporary/ephemeral data

```typescript
function MemberForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
}
```

### 2. **When to Use Zustand/Global**

✅ **Use Zustand for**:
- Persisted data (members, workouts)
- Shared across components
- Complex state logic
- Data from APIs

## Derived State

### 1. **Compute in Component**

```typescript
function Dashboard() {
  const members = useGymStore(state => state.members);
  
  // Compute derived values
  const activeCount = useMemo(
    () => members.filter(m => m.status === 'Active').length,
    [members]
  );
  
  const avgAge = useMemo(
    () => members.reduce((sum, m) => sum + m.age, 0) / members.length,
    [members]
  );
}
```

### 2. **Store Getters**

```typescript
// In store definition
const useGymStore = create<GymState>((set, get) => ({
  members: [],
  
  // Getter function
  getActiveMembers: () => 
    get().members.filter(m => m.status === 'Active'),
  
  // Computed property
  get activeMemberCount() {
    return get().members.filter(m => m.status === 'Active').length;
  }
}));

// Usage
const activeMembers = useGymStore.getState().getActiveMembers();
```

## Async Actions

### 1. **Pattern for API Calls**

```typescript
interface GymState {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  
  fetchMembers: () => Promise<void>;
}

const useGymStore = create<GymState>((set) => ({
  members: [],
  isLoading: false,
  error: null,
  
  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      set({ members: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  }
}));
```

### 2. **Optimistic Updates**

```typescript
addMember: async (member: Member) => {
  // Optimistic update
  set((state) => ({ 
    members: [...state.members, member] 
  }));
  
  try {
    await api.post('/members', member);
  } catch (error) {
    // Rollback on error
    set((state) => ({
      members: state.members.filter(m => m.id !== member.id)
    }));
    toast.error('Failed to add member');
  }
}
```

## State Persistence

### 1. **localStorage Strategy**

```typescript
const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      // state and actions
    }),
    {
      name: 'gym-storage',
      
      // Partial persistence
      partialize: (state) => ({
        members: state.members,
        workouts: state.workouts,
        // Don't persist UI state
      }),
      
      // Version control
      version: 2,
      migrate: (persistedState, version) => {
        // Handle migrations
        return newState;
      }
    }
  )
);
```

### 2. **Hydration**

```typescript
function App() {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    useGymStore.persist.rehydrate();
    setHydrated(true);
  }, []);
  
  if (!hydrated) return <LoadingScreen />;
  
  return <Router />;
}
```

## Best Practices

### ✅ Do's

1. **Separate concerns**: Domain state vs UI state
2. **Use selectors**: Avoid unnecessary re-renders
3. **Memoize computations**: `useMemo` for derived values
4. **Type everything**: Use TypeScript interfaces
5. **Version stores**: Enable migrations for schema changes
6. **Normalize data**: Avoid deep nesting

### ❌ Don'ts

1. **Don't store derived data**: Compute on the fly
2. **Don't mix UI and domain**: Separate stores
3. **Don't over-subscribe**: Use specific selectors
4. **Don't mutate state**: Always create new objects
5. **Don't persist everything**: Exclude temporary UI state

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useGymStore } from './useGymStore';

describe('GymStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useGymStore.setState({ members: [] });
  });
  
  it('should add a member', () => {
    const { result } = renderHook(() => useGymStore());
    
    act(() => {
      result.current.addMember(mockMember);
    });
    
    expect(result.current.members).toHaveLength(1);
  });
});
```

## Resources

- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React State Management](https://react.dev/learn/managing-state)
- [TypeScript + Zustand](https://github.com/pmndrs/zustand#typescript)

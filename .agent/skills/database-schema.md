---
name: Database Schema Design
description: Expert system for designing and optimizing database schemas for fitness/gym applications
---

# Database Schema Design Skill

## Purpose
This skill provides expertise in designing robust, scalable database schemas specifically for fitness and gym management applications.

## Core Principles

### 1. **Normalization vs. Denormalization**
- Normalize for data integrity
- Denormalize for read performance
- Use computed fields for aggregations

### 2. **Relationship Patterns**

#### Member Management
```typescript
interface Member {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  membership: {
    type: string;
    startDate: string;
    expiryDate: string;
    status: 'Active' | 'Expired' | 'Pending';
  };
  metrics: {
    height: number;
    weight: number;
    bodyFat?: number;
    muscleMass?: number;
  };
  checkIns: CheckIn[];
}
```

#### Workout Tracking
```typescript
interface WorkoutLog {
  id: string;
  memberId: string;
  date: string;
  exercises: Exercise[];
  totalVolume: number;      // Computed
  totalDuration: number;    // Computed
  caloriesBurned?: number;
}

interface Exercise {
  name: string;
  sets: Set[];
  category: 'Push' | 'Pull' | 'Legs' | 'Cardio';
}

interface Set {
  reps: number;
  weight: number;
  rpe?: number; // Rate of Perceived Exertion
}
```

### 3. **Indexing Strategy**

**High-frequency queries**:
```sql
-- Index on member status (frequent filtering)
CREATE INDEX idx_member_status ON members(status);

-- Index on check-in date (date range queries)
CREATE INDEX idx_checkin_date ON check_ins(date);

-- Composite index for member + date queries
CREATE INDEX idx_member_date ON workout_logs(member_id, date);
```

### 4. **Data Retention**

- **Hot data**: Last 90 days (fast access)
- **Warm data**: 90 days - 1 year (medium access)
- **Cold data**: > 1 year (archival)

### 5. **Zustand Store Pattern**

```typescript
interface GymStore {
  // State
  members: Member[];
  workouts: WorkoutLog[];
  
  // Computed values (memoized)
  activeMemberCount: number;
  totalVolume: number;
  
  // Actions
  addMember: (member: Member) => void;
  logWorkout: (workout: WorkoutLog) => void;
  
  // Persistence
  persist: {
    name: 'gym-store-v2';
    version: 2;
    migrate: (persistedState, version) => State;
  }
}
```

## Best Practices

1. **Use TypeScript interfaces** for type safety
2. **Compute aggregations client-side** (totalVolume, etc.)
3. **Implement optimistic UI updates**
4. **Use localStorage for persistence** (Zustand persist)
5. **Version your store schema** for migrations

## Anti-patterns

❌ Storing computed values that can be derived  
❌ Deeply nested objects (hard to update)  
❌ Mixing UI state with domain state  
❌ No data validation before storage  

## Recommended Tools

- **Zustand**: Lightweight state management
- **Zod**: Runtime schema validation
- **date-fns**: Date manipulation
- **lodash**: Data transformation utilities

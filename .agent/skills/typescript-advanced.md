---
name: TypeScript Advanced Patterns
description: Advanced TypeScript techniques, generics, utility types, and type safety patterns
---

# TypeScript Advanced Patterns

## Generics

### Basic Generic Function

```typescript
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);
const str = identity<string>("hello");
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <>{items.map(renderItem)}</>;
}

// Usage
<List<Member>
  items={members}
  renderItem={(member) => <MemberCard member={member} />}
/>
```

### Generic Constraints

```typescript
interface HasId {
  id: string;
}

function getById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
```

## Utility Types

### Built-in Utilities

```typescript
interface Member {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Partial - all properties optional
type PartialMember = Partial<Member>;

// Pick - select specific properties
type MemberPreview = Pick<Member, 'id' | 'name'>;

// Omit - exclude properties
type MemberWithoutId = Omit<Member, 'id'>;

// Required - all properties required
type RequiredMember = Required<Partial<Member>>;

// Readonly - immutable
type ReadonlyMember = Readonly<Member>;

// Record - key-value pairs
type MemberMap = Record<string, Member>;
```

### Custom Utility Types

```typescript
// DeepPartial
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>
    : T[K];
};

// NonNullableFields
type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

// AsyncReturnType
type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
```

## Discriminated Unions

```typescript
type APIResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

function handleResponse<T>(response: APIResponse<T>) {
  switch (response.status) {
    case 'success':
      console.log(response.data); // Type: T
      break;
    case 'error':
      console.error(response.error); // Type: string
      break;
    case 'loading':
      console.log('Loading...');
      break;
  }
}
```

## Type Guards

```typescript
// typeof guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// instanceof guard
function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

// Custom guard
interface Member {
  id: string;
  type: 'member';
}

interface Trainer {
  id: string;
  type: 'trainer';
}

function isMember(user: Member | Trainer): user is Member {
  return user.type === 'member';
}

// Usage
if (isMember(user)) {
  // user is Member
}
```

## Template Literal Types

```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type APIPath = '/members' | '/workouts' | '/settings';

type APIEndpoint = `${HTTPMethod} ${APIPath}`;
// Result: 'GET /members' | 'GET /workouts' | ... (12 combinations)

// Route builder
type RouteParams<T extends string> = 
  T extends `${infer Start}/:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof RouteParams<Rest>]: string }
    : T extends `${infer Start}/:${infer Param}`
    ? { [K in Param]: string }
    : {};

type MemberRoute = RouteParams<'/members/:id/workouts/:workoutId'>;
// Result: { id: string; workoutId: string }
```

## Mapped Types

```typescript
// Make all properties optional except ID
type OptionalExceptId<T> = {
  [K in keyof T]: K extends 'id' ? T[K] : T[K] | undefined;
};

// Add prefix to all keys
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${Capitalize<string & K>}`]: T[K];
};

type Member = { id: string; name: string; };
type PrefixedMember = Prefixed<Member, 'member'>;
// Result: { memberId: string; memberName: string; }
```

## Conditional Types

```typescript
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<string[]>; // true
type B = IsArray<string>;   // false

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Func = () => Member;
type R = ReturnType<Func>; // Member
```

## Type Inference

```typescript
// Infer from const
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;

type Config = typeof config;
// Result: { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; }

// Parameters and ReturnType
function createMember(name: string, age: number): Member {
  return { id: '1', name, email: '', age };
}

type Params = Parameters<typeof createMember>; // [string, number]
type Return = ReturnType<typeof createMember>;  // Member
```

## Branded Types (Nominal Typing)

```typescript
type MemberId = string & { __brand: 'MemberId' };
type TrainerId = string & { __brand: 'TrainerId' };

function getMember(id: MemberId): Member {
  // ...
}

const memberId = '123' as MemberId;
const trainerId = '456' as TrainerId;

getMember(memberId);   // ✅ OK
getMember(trainerId);  // ❌ Error
```

## Strict Null Checks

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}

// Before: any type can be null/undefined
let name: string = null; // Allowed without strictNullChecks

// After: must explicitly allow null
let name: string | null = null; // OK
let age: number | undefined;    // OK

// Non-null assertion (use sparingly!)
const element = document.getElementById('root')!; // Tell TS it's not null
```

## Best Practices

✅ **Do's**:
- Enable `strict` mode in tsconfig
- Use `unknown` instead of `any`
- Leverage type inference
- Create reusable utility types
- Use discriminated unions for state
- Write type guards for runtime checks

❌ **Don'ts**:
- Overuse `any`
- Ignore type errors with `@ts-ignore`
- Create overly complex types
- Duplicate type definitions

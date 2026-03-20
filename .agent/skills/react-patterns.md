---
name: React Patterns & Best Practices
description: Advanced React patterns including compound components, render props, HOCs, and hooks patterns
---

# React Patterns

## Compound Components

```typescript
// Flexible, composable API
const Tabs = ({ children, defaultValue }) => {
  const [active, setActive] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.List = ({ children }) => <div className="tabs-list">{children}</div>;
Tabs.Tab = ({ value, children }) => {
  const { active, setActive } = useTabsContext();
  return (
    <button
      className={active === value ? 'active' : ''}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
};
Tabs.Panel = ({ value, children }) => {
  const { active } = useTabsContext();
  return active === value ? <div>{children}</div> : null;
};

// Usage
<Tabs defaultValue="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile">Profile content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content</Tabs.Panel>
</Tabs>
```

## Custom Hooks

```typescript
// Reusable logic
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'dark');
```

## Container/Presentational Pattern

```typescript
// Container (logic)
function MemberListContainer() {
  const { members, isLoading } = useMembers();
  const handleDelete = (id: string) => deleteMember(id);
  
  if (isLoading) return <Spinner />;
  
  return (
    <MemberListPresentation
      members={members}
      onDelete={handleDelete}
    />
  );
}

// Presentational (UI only)
interface Props {
  members: Member[];
  onDelete: (id: string) => void;
}

function MemberListPresentation({ members, onDelete }: Props) {
  return (
    <ul>
      {members.map(member => (
        <MemberCard key={member.id} member={member} onDelete={onDelete} />
      ))}
    </ul>
  );
}
```

## Render Props

```typescript
interface MousePosition {
  x: number;
  y: number;
}

function MouseTracker({ render }: { render: (pos: MousePosition) => React.ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return <>{render(position)}</>;
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <div>Mouse at {x}, {y}</div>
  )}
/>
```

## Higher-Order Components (HOC)

```typescript
// HOC for authentication
function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthComponent(props: P) {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

## Error Boundaries

```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Controlled vs Uncontrolled

```typescript
// Controlled (recommended)
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// Uncontrolled (use for simple forms)
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };
  
  return <input ref={inputRef} />;
}
```

## Context Optimization

```typescript
// Split contexts to avoid unnecessary re-renders
const MemberDataContext = createContext<Member[]>([]);
const MemberActionsContext = createContext<{
  addMember: (member: Member) => void;
}>({} as any);

function MemberProvider({ children }) {
  const [members, setMembers] = useState<Member[]>([]);
  
  const actions = useMemo(
    () => ({
      addMember: (member: Member) => setMembers(prev => [...prev, member])
    }),
    []
  );
  
  return (
    <MemberDataContext.Provider value={members}>
      <MemberActionsContext.Provider value={actions}>
        {children}
      </MemberActionsContext.Provider>
    </MemberDataContext.Provider>
  );
}
```

## Lazy Loading

```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Members = lazy(() => import('./pages/MembersPage'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </Suspense>
  );
}
```

## Best Practices

✅ **Do's**:
- Extract reusable logic into custom hooks
- Keep components small and focused
- Use TypeScript for props
- Memoize expensive computations
- Split large components
- Use Error Boundaries
- Implement code splitting

❌ **Don'ts**:
- Mutate state directly
- Use index as key in lists
- Forget cleanup in useEffect
- Over-optimize prematurely
- Create "god components"
- Pass too many props (use context)

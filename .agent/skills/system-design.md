---
name: System Design
description: Software architecture patterns, scalability, and system design principles
---

# System Design

## Design Principles

### SOLID
- **S**: Single Responsibility
- **O**: Open/Closed
- **L**: Liskov Substitution
- **I**: Interface Segregation
- **D**: Dependency Inversion

### CAP Theorem
- **C**: Consistency
- **A**: Availability
- **P**: Partition Tolerance

*(Pick 2 out of 3)*

## Architecture Patterns

### Monolith
```
[Client] → [Single App] → [Database]
```
**Pros**: Simple, easy to deploy  
**Cons**: Hard to scale, single point of failure

### Microservices
```
[Client] → [API Gateway] → [Service A]
                        → [Service B]
                        → [Service C]
```
**Pros**: Independent scaling, tech flexibility  
**Cons**: Complex, distributed systems challenges

### Layered Architecture
```
Presentation Layer (UI)
    ↓
Business Logic Layer (Services)
    ↓
Data Access Layer (Repositories)
    ↓
Database
```

## Scalability Patterns

### Horizontal Scaling
Add more servers

### Vertical Scaling
Upgrade server resources

### Load Balancing
Distribute traffic across servers

### Caching (Redis)
```typescript
// Check cache first
const cached = await redis.get('members');
if (cached) return JSON.parse(cached);

// Fetch from DB
const members = await db.query('SELECT * FROM members');

// Cache result
await redis.set('members', JSON.stringify(members), 'EX', 3600);
```

### Database Sharding
Split database by key (e.g., user ID)

## Best Practices

✅ Design for failure  
✅ Use caching strategically  
✅ Implement monitoring  
✅ Document architecture  
✅ Consider trade-offs  
✅ Plan for scalability

---
name: API Design & Best Practices
description: RESTful API design patterns, versioning, and best practices
---

# API Design Skill

## REST Principles

### 1. **Resource Naming**

```
✅ Good:
GET    /api/members
GET    /api/members/:id
POST   /api/members
PUT    /api/members/:id
DELETE /api/members/:id

❌ Bad:
GET    /api/getMember
POST   /api/createMember
```

### 2. **HTTP Methods**

- **GET**: Retrieve data (idempotent)
- **POST**: Create resource
- **PUT**: Update/replace entire resource
- **PATCH**: Partial update
- **DELETE**: Remove resource

### 3. **Status Codes**

```typescript
// Success
200 OK              // GET, PUT, PATCH
201 Created         // POST
204 No Content      // DELETE

// Client Errors
400 Bad Request     // Invalid data
401 Unauthorized    // Not authenticated
403 Forbidden       // Not authorized
404 Not Found       // Resource doesn't exist
422 Unprocessable   // Validation error

// Server Errors
500 Internal Error  // Server fault
503 Service Unavailable
```

## API Response Format

### Standard Response

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Success
{
  "success": true,
  "data": { "id": "123", "name": "John" }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": { "field": "email" }
  }
}
```

## Pagination

```typescript
GET /api/members?page=1&limit=20&sort=name&order=asc

{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25
  }
}
```

## Filtering & Searching

```
GET /api/members?status=active&search=john&minAge=18
```

## Versioning

### URL Versioning
```
/api/v1/members
/api/v2/members
```

### Header Versioning
```
Accept: application/vnd.myapi.v1+json
```

## Authentication

```typescript
// JWT in header
Authorization: Bearer <token>

// API Key
X-API-Key: <key>
```

## Rate Limiting

```typescript
// Response headers
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643723400

// 429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests"
  }
}
```

## Documentation

Use OpenAPI/Swagger:

```yaml
openapi: 3.0.0
info:
  title: Gym API
  version: 1.0.0
paths:
  /members:
    get:
      summary: List members
      parameters:
        - name: page
          in: query
          schema:
            type: integer
```

## Best Practices

✅ **Do's**:
- Use nouns for resources
- Use plural names
- Return appropriate status codes
- Implement pagination
- Version your API
- Document with OpenAPI
- Use HTTPS
- Implement rate limiting

❌ **Don'ts**:
- Use verbs in URLs
- Return 200 for errors
- Expose internal IDs
- Skip validation
- Ignore security

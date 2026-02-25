---
name: Security Best Practices
description: Web application security, authentication, authorization, and common vulnerabilities
---

# Security Best Practices

## OWASP Top 10

### 1. **Injection (SQL, XSS)**

```typescript
// ❌ SQL Injection vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [email]);

// ❌ XSS vulnerable
div.innerHTML = userInput;

// ✅ Sanitize or use textContent
div.textContent = userInput;
// Or use libraries like DOMPurify
```

### 2. **Broken Authentication**

```typescript
// ✅ Password hashing
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);

// ✅ JWT with expiration
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

### 3. **Sensitive Data Exposure**

```typescript
// ✅ Environment variables
const apiKey = process.env.API_KEY;

// ✅ Don't log sensitive data
console.log('User logged in:', user.email); // OK
console.log('Password:', password); // ❌ NEVER

// ✅ HTTPS only
app.use((req, res, next) => {
  if (req.protocol !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

## Authentication Patterns

### JWT Best Practices

```typescript
// ✅ Short-lived access token
const accessToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// ✅ Long-lived refresh token
const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Store refresh token in httpOnly cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

## Authorization

### Role-Based Access Control (RBAC)

```typescript
enum Role {
  USER = 'user',
  ADMIN = 'admin',
  TRAINER = 'trainer'
}

function requireRole(role: Role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.delete('/members/:id', requireRole(Role.ADMIN), deleteMember);
```

## Input Validation

```typescript
// Use Zod for runtime validation
import { z } from 'zod';

const memberSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().min(16).max(120),
});

app.post('/members', (req, res) => {
  try {
    const member = memberSchema.parse(req.body);
    // Process valid data
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
});
```

## CSRF Protection

```typescript
// Use CSRF tokens
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/form', csrfProtection, (req, res) => {
  // Process form
});
```

## CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

## Content Security Policy

```typescript
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});
```

## Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));
```

## Secrets Management

```bash
# .env (never commit!)
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
API_KEY=your-api-key

# .gitignore
.env
.env.local
```

## Security Checklist

- [ ] All passwords hashed (bcrypt)
- [ ] JWT tokens expire
- [ ] HTTPS enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Security headers
- [ ] Secrets in env variables
- [ ] Regular dependency updates
- [ ] No sensitive data in logs

## Tools

- **OWASP ZAP**: Security testing
- **Snyk**: Dependency scanning
- **npm audit**: Vulnerability check
- **ESLint security plugins**: Static analysis

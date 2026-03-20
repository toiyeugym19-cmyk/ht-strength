---
name: CI/CD Pipelines
description: Continuous Integration and Deployment with GitHub Actions
---

# CI/CD

## GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          npm run deploy
```

## Pipeline Stages

1. **Lint**: Code quality check
2. **Test**: Run unit/integration tests
3. **Build**: Create production bundle
4. **Deploy**: Push to production
5. **Verify**: Smoke tests

## Best Practices

✅ Fail fast (lint first)  
✅ Cache dependencies  
✅ Run tests in parallel  
✅ Deploy only from main  
✅ Use secrets for credentials

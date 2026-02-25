---
name: Code Quality & Standards
description: Code quality tools, linting, formatting, and best practices for maintainable code
---

# Code Quality

## ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

## Prettier

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

## Husky Pre-commit Hooks

```bash
# .husky/pre-commit
npm run lint
npm run test
npm run type-check
```

## Code Metrics

- **Cyclomatic Complexity**: < 10 per function
- **Function Length**: < 50 lines
- **File Length**: < 300 lines
- **Code Coverage**: > 80%

## SonarQube Rules

- No code duplication
- No cognitive complexity > 15
- All security hotspots reviewed
- Maintainability rating A

## Best Practices

✅ Single Responsibility Principle  
✅ DRY (Don't Repeat Yourself)  
✅ KISS (Keep It Simple)  
✅ Meaningful variable names  
✅ Consistent formatting  
✅ Code comments for complex logic

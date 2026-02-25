---
name: Git Workflows & Best Practices
description: Professional Git workflows, commit conventions, and collaboration patterns
---

# Git Workflows

## Branch Strategy

### Git Flow

```
main (production)
  ↓
develop (integration)
  ↓
feature/user-authentication
feature/member-dashboard
  ↓
release/v1.2.0
  ↓
hotfix/critical-bug
```

### GitHub Flow (Simpler)

```
main (production)
  ↓
feature/add-member-list
feature/fix-login-bug
```

## Commit Message Convention

### Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Adding tests
- `chore`: Build/deps updates

**Examples**:
```bash
feat(members): add member search functionality

- Add search input to member list
- Implement debounced search
- Add search icon

Closes #123

fix(auth): prevent login with empty password

refactor(dashboard): extract KPICard component

docs(readme): update installation instructions

test(members): add tests for member store

chore(deps): upgrade React to v18.2
```

## Branch Naming

```bash
# Features
feature/member-analytics
feature/workout-tracker

# Bugs
fix/login-validation
fix/chart-rendering

# Hotfixes
hotfix/critical-security-issue

# Releases
release/v1.2.0
```

## Common Git Commands

### Daily Workflow

```bash
# Start new feature
git checkout -b feature/member-list

# Save work
git add .
git commit -m "feat(members): add member list page"

# Push to remote
git push origin feature/member-list

# Pull latest changes
git pull origin develop

# Merge feature to develop
git checkout develop
git merge feature/member-list
```

### Rebase vs Merge

```bash
# Merge (preserves history)
git merge feature/member-list

# Rebase (linear history)
git rebase develop
```

### Fixing Mistakes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- file.ts

# Amend last commit
git commit --amend -m "New message"

# Revert commit (create new commit)
git revert <commit-hash>

# Stash changes temporarily
git stash
git stash pop
```

## Pull Request Best Practices

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests added
- [ ] Documentation updated
- [ ] No lint errors
- [ ] Self-reviewed code

## Screenshots (if applicable)
```

### PR Size

✅ **Good**: 200-400 lines  
⚠️ **Large**: 400-800 lines  
❌ **Too Large**: > 800 lines (split into multiple PRs)

## Code Review

### Reviewer Checklist

- [ ] Code follows project conventions
- [ ] No obvious bugs
- [ ] Tests are comprehensive
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance considered

### Giving Feedback

```
✅ Good:
"Consider using useMemo here to avoid recalculating on every render"

❌ Bad:
"This is wrong, change it"
```

## Git Ignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/
*.log

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

## Git Hooks (Husky)

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
npm run lint
npm run test
```

## Semantic Versioning

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1 (patch: bug fix)
1.0.1 → 1.1.0 (minor: new feature)
1.1.0 → 2.0.0 (major: breaking change)
```

## Best Practices

✅ **Do's**:
- Commit often (small commits)
- Write descriptive commit messages
- Pull before push
- Review your own PR first
- Keep PRs focused (one feature)
- Delete merged branches

❌ **Don'ts**:
- Commit directly to main
- Force push to shared branches
- Commit secrets/API keys
- Large monolithic commits
- Vague commit messages ("fix bug")

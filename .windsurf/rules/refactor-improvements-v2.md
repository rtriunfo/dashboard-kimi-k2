---
trigger: manual
---

# 🧠 React Component Refactor Rules
A set of clear, actionable rules for safe and scalable component refactoring during agent-assisted development.

---

## 🚀 Pre-Flight Check
**Before starting ANY refactor:**
- [ ] Ensure all existing tests are passing
- [ ] Examine `components/` directory for reusable components
- [ ] Identify the component's dependencies and consumers
- [ ] Create a backup branch: `git checkout -b refactor-backup`

---

## 🔁 1. Micro-Iteration Cycle (Test-First Approach)

### Phase 1: Setup Component Structure
**FIRST**: Create the component subfolder with ALL required files:
```
components/ComponentName/
├── index.ts                    # Export barrel
├── ComponentName.tsx           # Main component
├── ComponentName.test.tsx      # Unit tests
├── ComponentName.stories.tsx   # Storybook stories
└── ComponentName.module.css    # (Optional) Custom styles
```

### Phase 2: Migration & Validation
1. Move component to new location
2. Update all import statements
3. Run component tests: `npx jest ComponentName`
4. Run E2E tests: `npx playwright test hardcoded.spec.ts --project=chromium`
5. **Only proceed if both pass**

### Phase 3: Iterative Improvements
- Make **one atomic change per iteration**
- **Always test component first** (faster feedback loop):
  ```bash
  npx jest ComponentName --watch
  ```
- If component tests pass, run relevant E2E tests
- **If any test fails**: immediately revert with `git checkout -- .`

---

## 💾 2. Commit Strategy
- Commit after each successful iteration:
  ```bash
  git add . && git commit -m "refactor(ComponentName): <specific change> - tests passing"
  ```
- Use conventional commit format for better tracking
- Each commit should represent a stable, working state

---

## 📁 3. Component Organization Standards

### 3.1 Required File Structure
```
components/ComponentName/
├── index.ts                    # REQUIRED: Export barrel
├── ComponentName.tsx           # REQUIRED: Main component
├── ComponentName.test.tsx      # REQUIRED: Comprehensive tests
├── ComponentName.stories.tsx   # REQUIRED: Storybook documentation
└── ComponentName.module.css    # OPTIONAL: Component-scoped styles
```

### 3.2 index.ts Pattern
```typescript
export { default } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

### 3.3 Component Testing Requirements
- **Unit tests must cover**:
  - All props and their variants
  - User interactions (clicks, form inputs, etc.)
  - Conditional rendering logic
  - Error states and edge cases
- **Test file naming**: `ComponentName.test.tsx`
- **Minimum test coverage**: 80% lines/branches

### 3.4 Storybook Requirements
- **Primary story**: Default props
- **Variant stories**: All meaningful prop combinations
- **Interactive stories**: Forms, buttons, complex states
- **Edge case stories**: Loading, error, empty states

---

## 🔍 4. Pre-Refactor Analysis

### 4.1 Component Reuse Assessment
**Before creating any component:**
1. Search existing `components/` directory
2. Check for similar functionality patterns
3. Consider composition over duplication
4. If reusable component exists but lacks proper structure, refactor it first

### 4.2 Dependency Impact Analysis
- Identify all files importing the component
- Plan import path updates
- Consider backward compatibility needs
- Document breaking changes

---

## 🎨 5. Styling Standards

### 5.1 Styling Hierarchy (in order of preference)
1. **Tailwind utility classes** (primary approach)
2. **CSS Modules** (`ComponentName.module.css`) for complex styles
3. **CSS-in-JS** only for dynamic styles requiring props
4. **Inline styles** as last resort

### 5.2 CSS Module Guidelines
```typescript
// ComponentName.tsx
import styles from './ComponentName.module.css';

export default function ComponentName() {
  return <div className={styles.container}>...</div>;
}
```

---

## 🧪 6. Testing Strategy

### 6.1 Test Execution Order
```bash
# 1. Component tests (fast feedback)
npx jest ComponentName --watchAll=false

# 2. Related E2E tests (integration validation)
npx playwright test --grep="ComponentName|feature-using-component"

# 3. Full test suite (before final commit)
npm test && npx playwright test
```

### 6.2 Test Failure Protocol
1. **Component test fails**: Fix immediately, don't proceed to E2E
2. **E2E test fails**: Revert last change, analyze integration impact
3. **Multiple failures**: Revert to last known good commit

---

## ⚠️ 7. Common Pitfalls to Avoid

- ❌ Making multiple changes before testing
- ❌ Skipping intermediate commits
- ❌ Ignoring component test failures
- ❌ Creating components without proper file structure
- ❌ Using global styles for component-specific needs
- ❌ Forgetting to update import paths
- ❌ Missing TypeScript prop definitions

---

## ✅ 8. Pre-Completion Validation

### 8.1 Structure Verification
```bash
# Verify complete file structure
ls -la components/ComponentName/
# Should show: index.ts, ComponentName.tsx, ComponentName.test.tsx, ComponentName.stories.tsx
```

### 8.2 Quality Gates
- [ ] All 4 required files present and functional
- [ ] TypeScript compilation succeeds
- [ ] Component tests achieve >80% coverage
- [ ] Storybook renders without errors
- [ ] E2E tests pass
- [ ] No console errors or warnings
- [ ] Import paths updated throughout codebase

### 8.3 Final Test Suite
```bash
# Complete validation before marking done
npm run type-check
npm test
npx playwright test
npm run storybook:build
```

---

## 🎯 9. Success Metrics

A refactor is complete when:
- ✅ Component follows organization standards
- ✅ All tests pass consistently
- ✅ No regression in functionality
- ✅ Import paths are clean and consistent
- ✅ Documentation (stories) is comprehensive
- ✅ Git history is clean and atomic

---

## 🔀 10. Merge to Main (Solo Dev Workflow)

### 10.1 When to Merge
**After successful completion of Section 8 validation:**
- All 4 required files present and functional
- Complete test suite passes
- No console errors or warnings
- You're confident in the changes

### 10.2 Merge Process
```bash
# Ensure you're on your refactor branch with latest changes
git add . && git commit -m "refactor: finalize ComponentName - all tests passing"

# Switch to main and merge
git checkout main
git merge refactor-branch

# Final verification on main branch
npm test && npx playwright test

# If everything passes, you're done!
# Optional: Clean up the feature branch
git branch -d refactor-branch
```

### 10.3 Alternative: Direct Work on Main
**For very small, confident changes:**
- Skip feature branches entirely
- Work directly on main with frequent commits
- Each commit should still be a stable, tested state
- Use this only for minor refactors you're 100% sure about

---

## 🆘 11. Emergency Procedures

### When Things Go Wrong
1. **Immediate rollback**: `git reset --hard HEAD~1`
2. **Return to stable state**: `git checkout main && git pull`
3. **Restart with smaller changes**: Break down the refactor further
4. **Seek help**: Document the specific failure and ask for assistance

### Prevention
- Always work on feature branches
- Keep commits atomic and well-described
- Test frequently and thoroughly
- Don't rush the process
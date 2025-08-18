---
trigger: manual
---

# 🧠 React Component Refactor Rules

A set of clear, actionable rules for safe and scalable component refactoring during agent-assisted development.

---

## 🔁 1. Micro-Iteration Cycle

- Ensure all tests are passing before you start to make changes
- For playwright tests don't worry about starting the server just run the test.
- Only make **one small change per iteration**
- After each change, **run the component test first**:
  ```bash
  npx jest
  ```
- If component tests pass, **then run the E2E test**:
  ```bash
  npx playwright test hardcoded.spec.ts --project=chromium
  ```
- Proceed only if **both tests pass**
- If either fails, **revert the last commit**

---

## 💾 2. Commit After Each Passing Step

- After each successful iteration (both component and E2E tests passing):
  - Run: `git add . && git commit -m "<describe change + test results>"`
  - This provides a stable rollback point

---

## 📁 3. Component Organization

- All new components must go into the `components/` directory
- Each component must reside in its **own subfolder**:
  ```
  components/
    Card/
      index.ts
      Card.tsx
      Card.test.tsx
      Card.stories.tsx
  ```

---

## 🔍 4. Component Reuse & Deduplication

- Before creating a component:
  - **Scan existing folders in `components/`**
  - Reuse if a suitable component already exists
- If existing components are **not in their own subfolder**, create one and move them

---

## 🎨 5. Styling Rules (Tailwind + CSS)

- Use **Tailwind CSS utility classes** by default
- Do **not** use inline styles (`style={{}}`) unless necessary
- If custom CSS is needed:
  - Create a `ComponentName.module.css` file in the same folder
  - Import using:
    ```tsx
    import styles from './ComponentName.module.css'
    ```
- Avoid global or shared unscoped styles

---

## ❌ 6. Avoid

- Multiple changes in one go
- Direct modification of global styles
- Inline style bloat
- Scattered component locations
- Skipping component tests before E2E tests

---

## ✅ 7. Best Practices

- Maintain **clean Git history** to enable easy rollbacks
- Keep refactors **isolated and test-backed**
- **Test components first, then integration** - component tests are faster and catch issues earlier
- Continuously scan for reuse opportunities
- Ensure all components have proper structure and styling discipline
# Test Coverage Improvements

**Current Overall Coverage: 47.36% statements | 56.88% branches | 55% functions | 47.07% lines**

## 🚨 Critical Priority

### [✅] 1. App.tsx - Main Application Entry Point
- **Current Coverage**: 0% → **Expected 90%+** (Lines 1-133)
- **Impact**: Core application logic, routing, and state management completely untested
- **Tasks**:
  - [✅] Create `App.test.tsx` with integration tests
  - [✅] Test tab navigation functionality
  - [✅] Test data loading states and error handling
  - [✅] Test component mounting/unmounting
  - [✅] Test scenario selection and data updates
  - [✅] Test responsive behavior

### [ ] 2. Config Files - Data Layer
- **testReportAdapter.ts**: 0% coverage (Lines 11-79)
- **testScenarios.ts**: 0% coverage (Lines 10-407)
- **Tasks**:
  - [ ] Create `testReportAdapter.test.ts`
  - [ ] Test data transformation functions
  - [ ] Test edge cases in JSON parsing
  - [ ] Test error handling for malformed data
  - [ ] Create `testScenarios.test.ts` if still in use

## 🔶 High Priority

### [ ] 3. Custom Hooks - Interactive Logic
#### useChartInteractions.ts (7.57% branch coverage)
- **Uncovered Lines**: 43-61, 76-90, 100-113, 127-129, 160-197, 204-214, 238, 258-262, 289-291
- **Tasks**:
  - [ ] Test chart zoom functionality
  - [ ] Test pan interactions
  - [ ] Test tooltip positioning
  - [ ] Test event handlers
  - [ ] Test edge cases with invalid data

#### useAccessibility.ts (10% branch coverage)
- **Uncovered Lines**: 60, 64, 78-86, 113-145, 151-161, 167-175
- **Tasks**:
  - [ ] Test keyboard navigation
  - [ ] Test screen reader announcements
  - [ ] Test focus management
  - [ ] Test ARIA attributes
  - [ ] Test accessibility shortcuts

### [ ] 4. UI Components - Error Handling
#### ErrorBoundary.tsx (10% branch coverage)
- **Uncovered Lines**: 16, 100-105, 109, 114-115
- **Tasks**:
  - [ ] Test error catching and display
  - [ ] Test error recovery mechanisms
  - [ ] Test fallback UI rendering
  - [ ] Test error reporting

#### Tooltip.tsx (28.57% branch coverage)
- **Uncovered Lines**: 18-28, 32, 36-44, 61-66, 78-85, 91-114
- **Tasks**:
  - [ ] Test tooltip positioning logic
  - [ ] Test show/hide interactions
  - [ ] Test edge positioning (viewport boundaries)
  - [ ] Test accessibility features

## 🔵 Medium Priority

### [ ] 5. RequestsTable Complex Logic (48.48% branch coverage)
- **Uncovered Lines**: 35, 48, 82, 86-93, 123, 133, 168, 173-176, 183-194, 214-217, 241-242, 266-275
- **Tasks**:
  - [ ] Test expand/collapse functionality edge cases
  - [ ] Test sorting with edge data
  - [ ] Test filtering combinations
  - [ ] Test error states in table rendering
  - [ ] Test pagination edge cases

### [ ] 6. RequestTableRow Interactive Features (67.91% branch coverage)
- **Uncovered Lines**: 183, 189-190, 195, 241, 256-257, 353, 359-360, 365
- **Tasks**:
  - [ ] Test row expansion with invalid data
  - [ ] Test chart rendering error states
  - [ ] Test interaction edge cases

### [ ] 7. Other Hook Improvements
#### useTheme.ts (43.75% branch coverage)
- **Tasks**:
  - [ ] Test theme switching
  - [ ] Test system theme detection
  - [ ] Test theme persistence

## 🟢 Low Priority (Storybook Files)

### [ ] 8. Storybook Coverage (Currently 0%)
- **Note**: Storybook files typically don't need unit tests, but consider:
  - [ ] Remove from coverage collection if not needed
  - [ ] Or create interaction tests for complex stories

## Progress Tracking

**Completed Tasks**: 6 / 35
**Critical Priority**: 1 / 2 ✅
**High Priority**: 0 / 4 ✅  
**Medium Priority**: 0 / 3 ✅

---

## Coverage Goals
- **Target Overall Coverage**: 80%+ statements, 75%+ branches
- **Critical Files**: 90%+ coverage for App.tsx and config files
- **Hooks**: 80%+ branch coverage for interactive logic

## Commands
```bash
# Run tests with coverage
npx jest --coverage

# Run specific test file
npx jest App.test.tsx --coverage

# Watch mode for development
npx jest --watch --coverage
```

---
*Last Updated: 2025-08-23*

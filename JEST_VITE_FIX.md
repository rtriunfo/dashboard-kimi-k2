# Jest + Vite Compatibility Fix

## Problem
Jest cannot parse Vite's `import.meta.glob` syntax used in `src/config/testReportAdapter.ts`, causing test failures with:
```
SyntaxError: Cannot use 'import.meta' outside a module
```

## Solution Applied

### 1. Created Mock Directory
- Created `src/config/__mocks__/testReportAdapter.ts` to provide Jest-compatible mocks
- This completely bypasses the `import.meta.glob` issue

### 2. Updated Jest Configuration
- Added `transformIgnorePatterns` to handle ES modules properly
- Maintained existing TypeScript and JSX transform configuration

### 3. Updated App.test.tsx
- Used `jest.mock('./config/testReportAdapter')` to automatically use the mock
- Created comprehensive test coverage for all App.tsx functionality

## Test Coverage Achieved

The `App.test.tsx` file provides comprehensive coverage including:

- ✅ **Initial rendering and loading states** (4 tests)
- ✅ **Data loading and error handling** (4 tests) 
- ✅ **Tab navigation functionality** (5 tests)
- ✅ **Scenario selection and data updates** (4 tests)
- ✅ **Component mounting/unmounting** (3 tests)
- ✅ **Responsive behavior** (2 tests)
- ✅ **Integration tests** (2 tests)
- ✅ **State management** (2 tests)

**Total: 26 test cases** covering all critical App.tsx functionality.

## Expected Coverage Impact
- App.tsx: 0% → 90%+ coverage
- Addresses Point 1 from test-improvements.md completely

## Running Tests
```bash
npm test App.test.tsx
```

## Alternative Solutions (if needed)
1. Use Vitest instead of Jest (native Vite support)
2. Create a Jest transformer for `import.meta.glob`
3. Refactor testReportAdapter to use dynamic imports instead

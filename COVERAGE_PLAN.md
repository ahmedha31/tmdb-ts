# Test Coverage Improvement Plan

## Current Coverage (as of now)
- Statements: 61.09%
- Branches: 65.1%
- Functions: 44.68%
- Lines: 62.68%

## Target Coverage
- Statements: 80%
- Branches: 70%
- Functions: 80%
- Lines: 80%

## High Priority Areas

### Authentication
- `src/authentication/auth-manager.ts` (8.69%)
  - Add tests for all authentication methods
  - Mock API responses

### Resources
- `src/resources/tv-resource.ts` (7.5%)
- `src/resources/people-resource.ts` (25%)
- `src/resources/base-resource.ts` (24%)

### Utils
- `src/utils/url-helper.ts` (12.5%)
  - Add unit tests for all helper functions

## Implementation Plan

1. Week 1: Focus on utils and helper functions
2. Week 2: Add tests for authentication
3. Week 3: Add tests for base resource
4. Week 4: Add tests for remaining resources

## Notes for Improvement

- Use mock data for API responses
- Consider creating a factory for test data generation
- Isolate network requests with proper mocking
- For each resource, ensure at least basic CRUD operations are tested

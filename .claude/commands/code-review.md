# Code Review

Perform a structured code review on the specified files or recent changes.

## Input

Review target: $ARGUMENTS (file path, directory, or "recent" for uncommitted changes)

## Checklist

Work through each category. For each, give a PASS/WARN/FAIL rating with specifics.

### 1. Logic Correctness
- Does the code do what it claims to do?
- Are there edge cases not handled?
- Are there off-by-one errors or incorrect conditions?

### 2. Security (OWASP Top 10)
- Input validation on all user-provided data
- No SQL injection (parameterized queries)
- No XSS (sanitized output)
- Auth checks on protected routes
- No exposed secrets or credentials

### 3. Performance
- No N+1 queries (fetching in loops)
- No unnecessary re-renders (missing memoization on expensive components)
- No blocking operations on the main thread
- Appropriate use of caching for repeated computations

### 4. Readability
- Clear naming (functions, variables, files)
- Reasonable function length (under ~50 lines)
- No deeply nested conditionals (>3 levels)
- Self-documenting code (comments only where needed)

### 5. Test Coverage
- Are critical paths tested?
- Do tests cover the happy path AND error cases?
- Are test names descriptive?

### 6. RULES.md Compliance
- Read the relevant RULES.md section
- Does the implementation match the specified behavior?
- Is the logic enforced in the correct single location? (see Quick Reference table)

### 7. Single Source of Truth
- Is any logic duplicated across files?
- Check the Quick Reference table in CLAUDE.md — is the behavior enforced where it should be?
- Search for function names in other files to find accidental duplication

## Output Format

```
CODE REVIEW: [target]
OVERALL: PASS / NEEDS CHANGES / BLOCK

| Category | Rating | Notes |
|----------|--------|-------|
| Logic | PASS/WARN/FAIL | ... |
| Security | PASS/WARN/FAIL | ... |
| Performance | PASS/WARN/FAIL | ... |
| Readability | PASS/WARN/FAIL | ... |
| Tests | PASS/WARN/FAIL | ... |
| RULES.md | PASS/WARN/FAIL | ... |
| Single Source | PASS/WARN/FAIL | ... |

ISSUES:
1. [severity] [file:line] [description]

SUGGESTIONS:
- [optional improvements, not blocking]
```

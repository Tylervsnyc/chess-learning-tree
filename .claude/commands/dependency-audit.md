# Dependency Audit

Check package health, security, and update readiness.

## Input

Scope: $ARGUMENTS (or "all" for full audit)

## Steps

### 1. Check for Outdated Packages
Run `npm outdated` and categorize results:

| Package | Current | Latest | Type | Risk |
|---------|---------|--------|------|------|
| [name] | [ver] | [ver] | patch/minor/major | Low/Med/High |

### 2. Check for Vulnerabilities
Run `npm audit` and list findings:

| Severity | Package | Issue | Fix Available |
|----------|---------|-------|---------------|
| [level] | [name] | [CVE/description] | Yes/No |

### 3. Evaluate Each Update

For each outdated package:
- **Patch** (0.0.x): Safe to update, bug fixes only
- **Minor** (0.x.0): Usually safe, may add features
- **Major** (x.0.0): Breaking changes — read changelog first

Key packages to be careful with:
- `next` — Major versions change APIs significantly
- `react` / `react-dom` — Major versions require migration
- `@supabase/*` — Auth API may change
- `stripe` — Payment API changes are high-risk
- `chess.js` / `react-chessboard` — Core functionality

### 4. Recommend Update Sequence

Order matters — update in this sequence:
1. Security fixes first (any severity)
2. Patch updates (low risk, batch together)
3. Minor updates (test each)
4. Major updates (one at a time, with full testing)

### 5. Flag Breaking Changes

For each major update, note:
- What API changes
- What code needs updating
- Whether types change
- Whether build config changes

## Output Format

```
DEPENDENCY AUDIT
DATE: [date]

SUMMARY:
- Outdated: [N] packages
- Vulnerabilities: [N] ([critical/high/moderate/low])
- Recommended updates: [N]

SECURITY FIXES (do now):
- [package]: [current] → [fixed] — [issue]

SAFE UPDATES (batch):
- [package]: [current] → [latest] — patch/minor

MAJOR UPDATES (careful):
- [package]: [current] → [latest] — [breaking changes]

NOT RECOMMENDED:
- [package]: [reason to skip]

UPDATE SEQUENCE:
1. [step]
2. [step]
```

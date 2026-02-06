# Bug Triage

Systematically investigate and classify a bug report.

## Input

Bug description: $ARGUMENTS

## Investigation Steps

### 1. Reproduce
- Restate the bug in one sentence
- Identify the expected behavior vs actual behavior
- Determine the trigger (what user action causes it?)

### 2. Isolate
Trace the data flow to find where things go wrong:
```
Database → API Route → Sync Layer → Hook → Component → UI
```
Read each file in the chain. Find where the expected value diverges from the actual value.

### 3. Check Lessons Learned
Read `.claude/lessons-learned.md` — has this pattern been seen before?

Common repeat patterns:
- Race condition between POST sync and GET fetch
- Fields dropped in mergeProgress
- Schema drift between schema.sql and live DB
- Multiple places controlling the same behavior
- Early returns skipping side effects
- CSS transition-all on dynamic backgrounds

### 4. Classify Severity

| Level | Criteria | Examples |
|-------|----------|---------|
| **P0** | Data loss or security issue | User data deleted, auth bypass |
| **P1** | Feature completely broken | Can't complete a lesson, can't log in |
| **P2** | Feature degraded but usable | Wrong visual indicator, slow load |
| **P3** | Cosmetic or minor | Misaligned text, wrong color |

### 5. Propose Fix

Show blast radius before suggesting changes:
```
ROOT CAUSE: [one sentence]

FIX:
- [file]: [what changes]

BLAST RADIUS:
- [what else is affected]

RISK:
- [what could go wrong with this fix]
```

## Output Format

```
BUG TRIAGE: [title]
SEVERITY: P0 / P1 / P2 / P3

SYMPTOM: [what the user sees]
ROOT CAUSE: [why it happens]
DATA FLOW BREAK: [which layer fails]

PATTERN MATCH: [lesson learned reference, or "new pattern"]

PROPOSED FIX:
- [file]: [change]

BLAST RADIUS:
- [affected files and features]

AGENT NEEDED: [Frontend / Backend / Database / Content]
```

# Feature Scaffold

Set up the structure for a new feature with consistent patterns.

## Input

Feature description: $ARGUMENTS

## Steps

### 1. Read RULES.md
Find the section relevant to this feature area. If no section exists, note that RULES.md needs updating.

### 2. Search for Existing Code
Look for existing implementations to reuse or extend:
- Similar features already built
- Patterns used in comparable components
- Hooks or utilities that already handle part of the logic

### 3. Plan the Files

List every file that needs to be created or modified:

```
NEW FILES:
- [path] — [purpose]

MODIFIED FILES:
- [path] — [what changes]

RULES.MD UPDATE:
- [section] — [what to add/change]
```

### 4. Show Blast Radius

```
BLAST RADIUS:
- [file]: [what changes]
- User impact: [what the user sees]
- Risk: [what could go wrong]
```

### 5. Scaffold

Create the file structure with:
- Route file (`page.tsx`) with basic layout
- Component files with props interfaces
- Test file stubs
- RULES.md update (if needed)

### 6. Assign to Agents

Recommend which agents should implement each part:

```
AGENT ASSIGNMENTS:
- Frontend: [components, pages]
- Backend: [API routes, hooks]
- Database: [schema changes]
- Content: [curriculum data]
- QA: [test writing]
```

## Output Format

```
FEATURE SCAFFOLD: [name]

FILES TO CREATE:
- [path]: [purpose]

FILES TO MODIFY:
- [path]: [what changes]

DATA FLOW:
User → [component] → [hook] → [API] → [DB table]

AGENT ASSIGNMENTS:
- [agent]: [files and tasks]

OPEN QUESTIONS:
- [anything that needs user input before proceeding]
```

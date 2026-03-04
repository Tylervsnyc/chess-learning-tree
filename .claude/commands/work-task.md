# Work Task

Pick up a Linear issue and work it through to completion with structured checkpoints.

## Input

Task identifier: $ARGUMENTS (Linear issue ID like "CHE-67", or "next" to pick the highest priority unstarted issue)

## Workflow

### 1. Load Context
- Read `PROGRESS.md` for current project state and key context
- Fetch the Linear issue details (title, description, scope, references, acceptance criteria)
- Move the issue to **In Progress** in Linear

### 2. Read References
If the issue has a **References** section, read those files first.
If not, identify the 2-3 most relevant files based on the issue description and read those.
Read the relevant RULES.md section if one is referenced (use the section index in CLAUDE.md — offset/limit, never the full file).

### 3. Plan
Present a short implementation plan to Tyler:

```
TASK: [CHE-XX] [title]

PLAN:
1. [step — which file, what changes]
2. [step]
3. [step]

BLAST RADIUS:
- [what else is affected]

AGENT(S): [which agent(s) to dispatch, or "inline" for simple changes]

QUESTIONS: [anything unclear — ask before coding]
```

**⏸ STOP — Wait for Tyler's approval before proceeding.**

### 4. Execute
- Dispatch to the appropriate agent(s) per AGENTS.md, or do it inline for simple changes
- Follow the approved plan
- Run `./scripts/ensure-dev.sh && open http://localhost:3000/{page}` to test

### 5. Verify
- Check each acceptance criterion from the issue
- Run `npm run check` (lint + type-check)
- If anything fails, fix it before reporting back

### 6. Report & Update
Show Tyler the results:

```
DONE: [CHE-XX] [title]

COMPLETED:
- [what was done]

VERIFIED:
- [which acceptance criteria pass]

ISSUES:
- [anything that didn't work or needs follow-up]
```

Then:
- Update the Linear issue status (move to **In Review** or **Done**)
- Add a comment to the Linear issue summarizing what was done
- Update `PROGRESS.md` with what changed

## Rules

- **Never skip the plan step.** Tyler approves before code is written.
- **Never skip verification.** Every acceptance criterion gets checked.
- **Update PROGRESS.md every time.** Future sessions depend on it.
- **Keep it focused.** If you discover a new bug or improvement during the work, create a new Linear issue for it — don't scope-creep the current task.

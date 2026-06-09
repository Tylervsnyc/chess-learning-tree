# Ship

Commit, push, and verify the change is ACTUALLY live on production. "I pushed it" and "it's live" are separate facts — verify both. (The auto-deploy once failed silently for 76 days; untracked files have broken the build 3+ times.)

## Instructions

Run every step. Do not skip a step because the previous one "looked fine."

### 1. Pre-flight: catch the known build-breakers

- `git status --porcelain` — look for untracked files that committed code imports (new components, generated assets, exported files). If a file being committed imports something untracked or gitignored, STOP and fix before committing.
- `git diff HEAD --stat` on the files being committed — check for dependent uncommitted changes (feature flags, config) that the change needs. A local build passes with unstaged files present; Vercel's won't.
- Confirm current branch is `main` (Tyler works on main).

### 2. Build locally

- `npm run build` — the full build, not just `tsc`. If it fails, fix before committing.

### 3. Commit + push

- Commit with a clear message (prefix with the Linear issue ID, e.g. `CHE-123: ...`).
- `git push`

### 4. Verify the deploy (REST API, never CLI output)

The Vercel CLI lies (silently stores empty env values, "Added" means nothing). Use the REST API:

- Token: `~/Library/Application Support/com.vercel.cli/auth.json`
- Project: `chess-path` (NOT chess-learning-tree — that duplicate was deleted)
- `curl -s -H "Authorization: Bearer $TOKEN" "https://api.vercel.com/v6/deployments?app=chess-path&limit=1"` — poll until the latest deployment is `READY`.
- Confirm `meta.githubCommitSha` matches local `git rev-parse HEAD`. A READY deploy of the WRONG commit is not shipped.

### 5. Verify the behavior on prod

- Hit the real page: `curl -s https://chesspath.app/<changed-path>` and grep for the new content/marker, or check the feature's actual behavior (cron endpoint JSON, `cron_heartbeats`, DB row — whatever proves it).
- A green deploy is not confirmation. Confirm by what the feature DOES.

### 6. Close the loop

- Update the Linear issue (Done only after steps 4-5 pass).
- Report to Tyler: commit hash, deploy state, and what was verified live.

## Failure handling

- Deploy stuck/ERROR → fetch the deployment events from the API, diagnose, fix, re-push. Don't just retry.
- Commit SHA mismatch after 5 min → the auto-deploy didn't fire; trigger a manual deploy and flag it to Tyler (the pipeline has silently broken before).

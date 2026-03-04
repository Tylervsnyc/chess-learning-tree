# UX Insights

Pull live PostHog analytics and surface UI/UX issues, drop-off points, and A/B test ideas.

## Input

Focus area (optional): $ARGUMENTS

## Steps

### 1. Pull PostHog Data

Run the insights script:
```bash
npx tsx scripts/posthog-insights.ts --json --days=7
```

Parse the JSON output. It contains:
- `rawData` — event counts, top pages, page leaves, rage clicks, funnels, device breakdown, autocapture hotspots
- `insights` — auto-detected UX issues with severity ratings
- `abTests` — suggested A/B test ideas

### 2. Analyze

If `$ARGUMENTS` specifies a focus area (e.g., "signup", "daily challenge", "mobile"), filter insights to that area.

Otherwise, analyze all insights. Prioritize by severity (high → medium → low).

For each insight, consider:
- **What's the user experiencing?** Translate data into a human story.
- **What's the root cause?** Is it a UI problem, flow problem, or missing feature?
- **What's the fix?** Concrete, actionable suggestion — not vague advice.

### 3. Cross-reference with Code

For high-severity issues, read the relevant component/page to understand the current implementation:
- Rage clicks → check the element's click handler and loading states
- Drop-offs → check the page layout and CTA placement
- High leave rates → check if the page delivers on its promise

### 4. Output

```
UX INSIGHTS REPORT — Last 7 days
═══════════════════════════════════

TRAFFIC: [total pageviews] ([mobile %] mobile)

TOP ISSUES:
1. [severity] [title]
   Data: [numbers]
   Why: [root cause hypothesis]
   Fix: [specific suggestion with file references]

2. ...

FUNNELS:
  Signup:       [viewed] → [started] → [completed] ([conversion %])
  Lessons:      [started] → [completed] ([completion %])
  Subscription: [paywall] → [pricing] → [checkout] → [paid]
  Daily:        [viewed] → [started] → [completed]

RAGE CLICKS: [total]
  [list top 5 with page and element]

A/B TEST IDEAS:
1. [name] — [hypothesis]
   Test: [variants]
   Measure: [metric]

QUICK WINS:
- [actionable items that can be fixed immediately]
```

## Notes

- Requires `POSTHOG_PERSONAL_API_KEY` and `POSTHOG_PROJECT_ID` in `.env.local`
- Use `--days=30` for longer-term trends
- Rage clicks with "(no text)" mean the frustrated element has no text content — check the page visually
- Daily challenge "completed > started" means the started event may not fire correctly

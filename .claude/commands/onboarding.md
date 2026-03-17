# Onboarding Flow Builder

Design and build a satisfying onboarding experience that converts new visitors into engaged users.

## Input

What to onboard: $ARGUMENTS

## Research Phase

### 1. Study Best Practices

Search the web for current onboarding patterns from top apps (Duolingo, Headspace, Calm, Notion, etc.):
- What questions do they ask upfront?
- When do they require signup?
- What's the "aha moment" they drive users toward?
- How do they use progress indicators?

### 2. Analyze Current Flow

- Read the existing entry point for new users (check for redirects, gates, modals)
- Identify where users currently drop off (check PostHog if available)
- Map the current first-5-minutes experience step by step

### 3. Read Design System

Read `.claude/design-system.md` for colors, typography, component patterns, and spacing rules. All onboarding UI must follow these tokens exactly.

## Design Phase

### 4. Define the Onboarding Steps

Every onboarding flow needs these elements:

```
ONBOARDING FLOW:
Step 1: PERSONALIZE — Ask 1-2 quick questions (one tap each)
  - Makes the user feel the app adapts to them
  - Creates psychological investment before any work

Step 2: QUICK WIN — Deliver success in under 30 seconds
  - The simplest possible version of the core experience
  - Must be almost impossible to fail
  - Celebrate the win with animation/sound

Step 3: REVEAL THE PATH — Show what's ahead
  - Animated preview of the full journey
  - Creates anticipation and FOMO
  - Strong CTA to begin

RULES:
- Delay signup until AFTER the quick win (or skip it entirely for anonymous access)
- Progress bar visible on every step
- Skip button always available (never trap users)
- Total flow: under 60 seconds
- Mobile-first, works on smallest phones
```

### 5. Propose to User

Before building, present the plan:

```
ONBOARDING PLAN: [name]

STEPS:
1. [step] — [what user sees] — [why it works]
2. [step] — [what user sees] — [why it works]
3. [step] — [what user sees] — [why it works]

QUICK WIN:
- [what the user does]
- [why it feels good]

ANALYTICS EVENTS:
- onboarding_started
- onboarding_step_completed (step, value)
- onboarding_completed
- onboarding_skipped (step)

GATING:
- [how new users get routed to onboarding]
- [localStorage key that prevents re-showing]
- [what existing users see instead]

FILES:
- [component path] — main flow
- [page path] — route
- [existing file] — redirect logic
```

Wait for user approval before building.

## Build Phase

### 6. Build the Flow Component

Create the onboarding as a single component with internal step state:
- Use design system tokens (bg-chess-page, bg-chess-surface, text-chess-text, etc.)
- Green primary buttons with 3D shadow effect
- BreathingRook mascot where appropriate
- Smooth transitions between steps (fade + slide)
- Progress bar at top showing step N of total

### 7. Wire the Routing

- Create the page route
- Add redirect logic for new users (localStorage gated)
- Ensure returning users and logged-in users are NOT affected
- Respect existing redirect flags

### 8. Add Analytics

Track every step of the funnel:
- Use the `trackEvent` function from `lib/analytics/posthog`
- Name events with `onboarding_` prefix
- Include step name and any user selections as properties

### 9. Verify

- Run `npm run check` to confirm no type errors
- Open the page in the browser with `./scripts/ensure-dev.sh && open http://localhost:3000/[route]`
- Test the full flow end to end

## Principles

- **Friction kills.** Every tap, field, and screen you add loses users. Ruthlessly cut.
- **Show, don't tell.** Let users DO the thing, not read about it.
- **Celebrate everything.** Sounds, animations, confetti. Make success feel amazing.
- **Personalization = investment.** When users tell you about themselves, they've invested.
- **The skip button is your friend.** Power users will skip. Let them. They'll convert anyway.
- **Measure the funnel.** If you can't see where users drop off, you can't fix it.

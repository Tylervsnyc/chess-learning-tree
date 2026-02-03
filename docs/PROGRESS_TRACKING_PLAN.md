# Progress Tracking Plan

## Current State Analysis

**Your intuition is correct:** The database does NOT track the user's "current lesson." This is computed client-side, which causes reliability issues.

### What IS Being Tracked (in Supabase)

| Data | Table | Synced? |
|------|-------|---------|
| Completed lessons | `lesson_progress` | Yes |
| Puzzle attempts | `puzzle_attempts` | Yes |
| Theme performance | `theme_performance` | Yes (auto-trigger) |
| Streaks | `profiles` | Yes |
| Daily challenges | `daily_challenges` | Yes |

### What is NOT Being Tracked (Critical Gaps)

| Data | Current Location | Problem |
|------|------------------|---------|
| **Current lesson** | Computed client-side | No persistence - derived from completedLessons |
| **Starting lesson** (diagnostic placement) | localStorage only | Lost on device switch or cache clear |
| **Unlocked levels** | localStorage + partial server | Inconsistent across devices |
| **Lessons completed today** | localStorage only | Daily limits can be bypassed |
| **In-progress lessons** | Nowhere | Binary complete/incomplete only |

### How "Current Lesson" Works Today

The learn page (`/app/learn/page.tsx:61-70`) calculates it:

```typescript
function getLessonStatus(lessonId, completedLessons, allLessonIds) {
  if (completedLessons.includes(lessonId)) return 'completed';
  const firstIncomplete = allLessonIds.find(id => !completedLessons.includes(id));
  if (lessonId === firstIncomplete) return 'current';
  return 'locked';
}
```

**Problem:** If `completedLessons` gets out of sync (network failure, multi-device), users end up in the wrong place.

---

## Recommended Fixes

### Phase 1: Add Core Fields to `profiles` Table

Add these columns to track user position:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_lesson_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS starting_lesson_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lessons_completed_today INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_lesson_date DATE;
```

**Why profiles table?** Single row per user, always loaded, simple to update.

### Phase 2: Update Progress Sync

Modify `/lib/progress-sync.ts` and `/app/api/progress/sync/route.ts` to:

1. Include `startingLessonId` in sync payload
2. Include `current_lesson_id` in sync payload
3. Include `lessonsCompletedToday` and `lastLessonDate`
4. Update profiles table on sync

### Phase 3: Update Lesson Completion Flow

When a lesson is completed (`completeLesson()` in `useProgress.ts`):

1. Mark lesson complete (existing)
2. **NEW:** Calculate next lesson ID
3. **NEW:** Update `profiles.current_lesson_id`
4. **NEW:** Increment `lessons_completed_today`

### Phase 4: Update Learn Page

Modify `/app/learn/page.tsx` to:

1. Read `current_lesson_id` from profile (server source of truth)
2. Fall back to computed value if null (backwards compatibility)
3. Scroll to current lesson on load

---

## Database Migration Script

Run this in Supabase SQL Editor:

```sql
-- Phase 1: Add progress tracking fields to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS current_lesson_id TEXT,
ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS starting_lesson_id TEXT,
ADD COLUMN IF NOT EXISTS lessons_completed_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_lesson_date DATE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_current_lesson
ON profiles(current_lesson_id);

-- Optional: Add constraint to reset daily count
-- (handled in application logic instead for flexibility)
```

---

## Code Changes Needed

### 1. Update Types (`types/curriculum.ts`)

```typescript
// Add to Profile type
interface Profile {
  // ... existing fields
  current_lesson_id: string | null;
  current_level: number;
  starting_lesson_id: string | null;
  lessons_completed_today: number;
  last_lesson_date: string | null;
}
```

### 2. Update useProgress Hook

In `/hooks/useProgress.ts`, add:

```typescript
const updateCurrentLesson = async (lessonId: string) => {
  // Update localStorage
  setProgress(prev => ({ ...prev, currentLessonId: lessonId }));

  // Update server
  if (user) {
    await supabase
      .from('profiles')
      .update({ current_lesson_id: lessonId })
      .eq('id', user.id);
  }
};
```

### 3. Update completeLesson Function

```typescript
const completeLesson = async (lessonId: string, allLessonIds: string[]) => {
  // Existing completion logic...

  // Calculate next lesson
  const currentIndex = allLessonIds.indexOf(lessonId);
  const nextLessonId = allLessonIds[currentIndex + 1] || null;

  // Update current lesson pointer
  await updateCurrentLesson(nextLessonId);
};
```

### 4. Update Learn Page

```typescript
// In /app/learn/page.tsx
const { profile } = useUser();
const currentLessonId = profile?.current_lesson_id ||
  allLessonIds.find(id => !completedLessons.includes(id));
```

---

## Testing Checklist

After implementing:

- [ ] New user starts at first lesson
- [ ] Completing a lesson advances `current_lesson_id`
- [ ] Diagnostic placement sets `starting_lesson_id` in DB
- [ ] Progress survives localStorage clear
- [ ] Progress syncs across devices
- [ ] Daily lesson count resets at midnight
- [ ] Learn page scrolls to current lesson

---

## Implementation Order

1. **Database migration** (add columns)
2. **Update types** (TypeScript definitions)
3. **Update useProgress hook** (add updateCurrentLesson)
4. **Update completeLesson** (set next lesson)
5. **Update diagnostic flow** (save starting_lesson_id to DB)
6. **Update learn page** (read from profile)
7. **Update sync endpoint** (include new fields)
8. **Test end-to-end**

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/schema.sql` | Add new columns |
| `types/curriculum.ts` | Update Profile type |
| `hooks/useProgress.ts` | Add updateCurrentLesson, modify completeLesson |
| `hooks/useUser.ts` | Ensure new profile fields are fetched |
| `app/learn/page.tsx` | Use profile.current_lesson_id |
| `app/api/progress/sync/route.ts` | Sync new fields |
| `lib/progress-sync.ts` | Include new fields in sync |
| `app/onboarding/diagnostic/page.tsx` | Save starting_lesson_id to DB |

---

## Quick Win (Temporary Fix)

If you need an immediate fix before full implementation:

1. Add `current_lesson_id` column to profiles
2. Update it whenever `completeLesson()` is called
3. Read it on learn page load

This alone will solve most "user in wrong place" issues.

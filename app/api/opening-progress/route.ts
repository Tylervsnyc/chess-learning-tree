import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/opening-progress
 * Fetch all opening progress for the logged-in user.
 * Returns: { progress: { [slug]: { completedLessons: string[], lastPlayedAt: string } } }
 */
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('opening_progress')
    .select('opening_slug, lesson_id, completed_at')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching opening progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }

  // Group by opening_slug
  const progress: Record<string, { completedLessons: string[]; lastPlayedAt: string }> = {}
  for (const row of data || []) {
    if (!progress[row.opening_slug]) {
      progress[row.opening_slug] = { completedLessons: [], lastPlayedAt: row.completed_at }
    }
    progress[row.opening_slug].completedLessons.push(row.lesson_id)
    if (row.completed_at > progress[row.opening_slug].lastPlayedAt) {
      progress[row.opening_slug].lastPlayedAt = row.completed_at
    }
  }

  return NextResponse.json({ progress })
}

/**
 * POST /api/opening-progress
 * Record a lesson completion.
 * Body: { slug: string, lessonId: string }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { slug, lessonId } = body

  if (!slug || !lessonId) {
    return NextResponse.json({ error: 'Missing slug or lessonId' }, { status: 400 })
  }

  // Upsert — if already completed, just update completed_at
  const { error } = await supabase
    .from('opening_progress')
    .upsert(
      {
        user_id: user.id,
        opening_slug: slug,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,opening_slug,lesson_id' }
    )

  if (error) {
    console.error('Error saving opening progress:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

/**
 * DELETE /api/opening-progress
 * Merge localStorage progress into Supabase on login.
 * Actually using PUT for merge — batch insert multiple completions.
 */
export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { progress } = body as {
    progress: Record<string, { completedLessons: string[]; lastPlayedAt: string }>
  }

  if (!progress) {
    return NextResponse.json({ error: 'Missing progress data' }, { status: 400 })
  }

  // Build rows for batch upsert
  const rows: { user_id: string; opening_slug: string; lesson_id: string; completed_at: string }[] = []
  for (const [slug, data] of Object.entries(progress)) {
    for (const lessonId of data.completedLessons) {
      rows.push({
        user_id: user.id,
        opening_slug: slug,
        lesson_id: lessonId,
        completed_at: data.lastPlayedAt,
      })
    }
  }

  if (rows.length === 0) {
    return NextResponse.json({ success: true })
  }

  const { error } = await supabase
    .from('opening_progress')
    .upsert(rows, { onConflict: 'user_id,opening_slug,lesson_id' })

  if (error) {
    console.error('Error merging opening progress:', error)
    return NextResponse.json({ error: 'Failed to merge progress' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

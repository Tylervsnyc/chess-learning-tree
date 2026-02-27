import { NextRequest, NextResponse } from 'next/server'
import type { OpeningBuildItem } from '@/types/build-queue'
import queueData from '@/data/build-queue.json'

/**
 * GET /api/build-queue
 * Returns the build queue with summary stats.
 * Reads from the committed JSON file (static on Vercel, live on local).
 */
export async function GET() {
  try {
    const items = queueData.items as OpeningBuildItem[]

    const stats = {
      total: items.length,
      pending: items.filter(i => i.status === 'pending').length,
      building: items.filter(i => i.status === 'building').length,
      needsReview: items.filter(i => i.status === 'needs-review').length,
      completed: items.filter(i => i.status === 'completed').length,
      failed: items.filter(i => i.status === 'failed').length,
      verified: items.filter(i => i.verified).length,
    }

    return NextResponse.json({ queue: queueData, stats })
  } catch {
    return NextResponse.json({ error: 'Failed to read queue' }, { status: 500 })
  }
}

/**
 * POST /api/build-queue
 * Add a new build item. Local-only (filesystem write).
 */
export async function POST(request: NextRequest) {
  try {
    // Dynamic import — only works locally, not on Vercel
    const { readFileSync, writeFileSync } = await import('fs')
    const { join } = await import('path')
    const QUEUE_PATH = join(process.cwd(), 'data/build-queue.json')

    const body = await request.json()
    const { id, name, slug, type, side, category, mainLine, priority } = body

    if (!id || !name || !slug || !type || !side || !category || !mainLine || !priority) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf-8'))

    if (queue.items.some((i: OpeningBuildItem) => i.id === id)) {
      return NextResponse.json({ error: `Item "${id}" already exists` }, { status: 409 })
    }

    const newItem: OpeningBuildItem = {
      id, name, slug, type, side, category, mainLine, priority,
      level: body.level,
      variationName: body.variationName,
      extendsFrom: body.extendsFrom,
      status: 'pending',
      addedAt: new Date().toISOString(),
      verified: false,
    }

    queue.items.push(newItem)
    writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n')

    return NextResponse.json({ success: true, item: newItem })
  } catch {
    return NextResponse.json({ error: 'Write operations only work locally' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { BuildQueueData, OpeningBuildItem } from '@/types/build-queue'

const QUEUE_PATH = join(process.cwd(), 'data/build-queue.json')

function readQueue(): BuildQueueData {
  return JSON.parse(readFileSync(QUEUE_PATH, 'utf-8'))
}

function writeQueue(data: BuildQueueData) {
  writeFileSync(QUEUE_PATH, JSON.stringify(data, null, 2) + '\n')
}

/**
 * GET /api/build-queue
 * Returns the full build queue with summary stats.
 */
export async function GET() {
  try {
    const queue = readQueue()

    const stats = {
      total: queue.items.length,
      pending: queue.items.filter(i => i.status === 'pending').length,
      building: queue.items.filter(i => i.status === 'building').length,
      needsReview: queue.items.filter(i => i.status === 'needs-review').length,
      completed: queue.items.filter(i => i.status === 'completed').length,
      failed: queue.items.filter(i => i.status === 'failed').length,
      verified: queue.items.filter(i => i.verified).length,
    }

    return NextResponse.json({ queue, stats })
  } catch {
    return NextResponse.json({ error: 'Failed to read queue' }, { status: 500 })
  }
}

/**
 * POST /api/build-queue
 * Add a new build item to the queue.
 * Body: Partial<OpeningBuildItem> with required fields
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, slug, type, side, category, mainLine, priority } = body

    if (!id || !name || !slug || !type || !side || !category || !mainLine || !priority) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const queue = readQueue()

    // Check for duplicate
    if (queue.items.some(i => i.id === id)) {
      return NextResponse.json({ error: `Item "${id}" already exists` }, { status: 409 })
    }

    const newItem: OpeningBuildItem = {
      id,
      name,
      slug,
      type,
      level: body.level,
      variationName: body.variationName,
      side,
      category,
      mainLine,
      extendsFrom: body.extendsFrom,
      priority,
      status: 'pending',
      addedAt: new Date().toISOString(),
      verified: false,
    }

    queue.items.push(newItem)
    writeQueue(queue)

    return NextResponse.json({ success: true, item: newItem })
  } catch {
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}

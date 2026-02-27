import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { BuildQueueData, BuildStatus } from '@/types/build-queue'

const QUEUE_PATH = join(process.cwd(), 'data/build-queue.json')

function readQueue(): BuildQueueData {
  return JSON.parse(readFileSync(QUEUE_PATH, 'utf-8'))
}

function writeQueue(data: BuildQueueData) {
  writeFileSync(QUEUE_PATH, JSON.stringify(data, null, 2) + '\n')
}

/**
 * PATCH /api/build-queue/[id]
 * Update a build item's status or verified flag.
 * Body: { status?, verified?, error? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const queue = readQueue()

    const item = queue.items.find(i => i.id === id)
    if (!item) {
      return NextResponse.json({ error: `Item "${id}" not found` }, { status: 404 })
    }

    // Update allowed fields
    if (body.status !== undefined) {
      const validStatuses: BuildStatus[] = ['pending', 'building', 'needs-review', 'completed', 'failed']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      item.status = body.status

      // If requeueing, clear completion data
      if (body.status === 'pending') {
        item.startedAt = undefined
        item.completedAt = undefined
        item.durationSeconds = undefined
        item.error = undefined
      }
    }

    if (body.verified !== undefined) {
      item.verified = body.verified
    }

    if (body.error !== undefined) {
      item.error = body.error
    }

    writeQueue(queue)

    return NextResponse.json({ success: true, item })
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

/**
 * DELETE /api/build-queue/[id]
 * Remove a build item from the queue.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const queue = readQueue()

    const idx = queue.items.findIndex(i => i.id === id)
    if (idx === -1) {
      return NextResponse.json({ error: `Item "${id}" not found` }, { status: 404 })
    }

    queue.items.splice(idx, 1)
    writeQueue(queue)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}

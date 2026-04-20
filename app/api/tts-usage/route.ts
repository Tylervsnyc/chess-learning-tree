import { NextResponse } from 'next/server';
import { getTtsUsage } from '@/lib/tts-guard';

/**
 * GET /api/tts-usage
 * Returns current ElevenLabs TTS char budget usage for this process.
 * Note: state is in-memory per serverless instance, so numbers are lower-bound.
 */
export async function GET() {
  return NextResponse.json(getTtsUsage());
}

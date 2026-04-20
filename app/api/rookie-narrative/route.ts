import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { aiGuard } from '@/lib/ai-guard';
import { stripLeakedPlaceholders } from '@/lib/speech/sanitize';

const anthropic = new Anthropic();
let callCount = 0;

/**
 * POST /api/rookie-narrative
 *
 * Layer 6 LLM call — fires only at turning points (5-8 times per game).
 * Receives the fully assembled prompt from the 6-layer engine.
 *
 * Body: { system: string, messages: Array<{role, content}>, params: {temperature, top_p, max_tokens} }
 */
export async function POST(req: NextRequest) {
  const guard = await aiGuard(req, {
    route: 'rookie-narrative',
    dailyLimit: 30,
    maxBodyBytes: 30_000,
  });
  if (!guard.ok) return guard.response;

  try {
    const { system, messages, params } = (guard.body ?? {}) as {
      system?: string;
      messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
      params?: { temperature?: number; top_p?: number; max_tokens?: number };
    };

    if (!system || !messages || !params) {
      return NextResponse.json({ error: 'Missing system, messages, or params' }, { status: 400 });
    }

    // Log the trigger for terminal visibility
    const lastUserMsg = messages.filter((m: { role: string }) => m.role === 'user').pop();
    const trigger = lastUserMsg?.content?.slice(0, 120) ?? '?';
    console.log(`\n🎭 NARRATIVE CALL #${++callCount} | ${trigger}`);

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: params.max_tokens ?? 150,
      temperature: params.temperature ?? 0.9,
      top_p: params.top_p ?? 0.9,
      system,
      messages,
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    // Strip any markdown or formatting artifacts
    const cleaned = stripLeakedPlaceholders(
      text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/[()]/g, '')
        .replace(/^["']|["']$/g, ''),
    );

    console.log(`   → "${cleaned.slice(0, 100)}${cleaned.length > 100 ? '...' : ''}"`);
    return NextResponse.json({ text: cleaned });
  } catch (error) {
    console.error('Rookie narrative error:', error);
    return NextResponse.json({ error: 'Failed to generate narrative' }, { status: 500 });
  }
}

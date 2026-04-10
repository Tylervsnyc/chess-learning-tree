import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ROOKIE_GAMEPLAY_PROMPT } from '@/lib/rookie-personality';
import { generateAndCache, lookupVoiceCache } from '@/lib/rookie-voice-cache';
import { aiGuard } from '@/lib/ai-guard';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const guard = await aiGuard(request, {
    route: 'rookie-voice',
    dailyLimit: 100,
    maxBodyBytes: 4000,
  });
  if (!guard.ok) return guard.response;

  try {
    const body = (guard.body ?? {}) as Record<string, unknown> & {
      fen?: string;
      lastMove?: string;
      lastMoveBy?: string;
      moveHistory?: string[];
      playerName?: string;
      playerColor?: string;
      gameStatus?: string;
      isCapture?: boolean;
      isCheck?: boolean;
      isCheckmate?: boolean;
      movedPiece?: string;
      capturedPiece?: string;
      moveNumber?: number;
      generateAudio?: boolean;
      speakOnly?: string;
      honchoPlayerContext?: string;
    };
    const {
      fen,
      lastMove,
      lastMoveBy,
      moveHistory,
      playerName,
      playerColor,
      gameStatus,
      isCapture,
      isCheck,
      isCheckmate,
      movedPiece,
      capturedPiece,
      moveNumber,
      generateAudio = true,
      speakOnly,
    } = body;

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    const canTTS = generateAudio && !!apiKey && !!voiceId;

    // speakOnly: skip Claude, just do TTS (with cache)
    if (speakOnly) {
      if (!canTTS) {
        return NextResponse.json({ text: speakOnly, audio: null });
      }
      try {
        const { audioBase64 } = await generateAndCache(speakOnly, apiKey!, voiceId!);
        return NextResponse.json({ text: speakOnly, audio: audioBase64 });
      } catch (err) {
        console.error('TTS error:', err);
        return NextResponse.json({ text: speakOnly, audio: null });
      }
    }

    // Build context for Rookie
    const context = [
      `Player: ${playerName || 'friend'}`,
      `Player color: ${playerColor}`,
      `Current position (FEN): ${fen}`,
      `Move #${moveNumber}: ${lastMove} by ${lastMoveBy === 'player' ? playerName || 'the player' : 'you (Rookie)'}`,
      isCapture ? `This was a capture${capturedPiece ? ` (took a ${capturedPiece})` : ''}.` : '',
      isCheck ? 'This move gives check.' : '',
      isCheckmate ? 'CHECKMATE! Game over.' : '',
      movedPiece ? `Piece moved: ${movedPiece}` : '',
      gameStatus && gameStatus !== 'playing' ? `Game status: ${gameStatus}` : '',
      moveHistory?.length ? `Recent moves: ${moveHistory.slice(-6).join(' ')}` : '',
    ].filter(Boolean).join('\n');

    const userMessage = lastMoveBy === 'player'
      ? `The player just played ${lastMove}. React to their move (or say "..." if it's not interesting enough to comment on):\n\n${context}`
      : `You (Rookie) just played ${lastMove}. Comment on your own move if you want (or say "..." if you'd rather stay quiet):\n\n${context}`;

    // Inject Honcho player context if provided (CHE-201)
    const honchoContext = body.honchoPlayerContext;
    const systemPrompt = honchoContext
      ? `## What I know about this player\n${honchoContext}\n---\n\n${ROOKIE_GAMEPLAY_PROMPT}`
      : ROOKIE_GAMEPLAY_PROMPT;

    // Call Claude for Rookie's response
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const rookieText = (message.content[0] as { type: string; text: string }).text.trim();

    // If Rookie says "..." she's staying quiet
    if (rookieText === '...' || rookieText === '"..."') {
      return NextResponse.json({ text: null, audio: null });
    }

    // Generate audio with cache — never generate the same recording twice
    let audioBase64: string | null = null;
    if (canTTS) {
      try {
        const result = await generateAndCache(rookieText, apiKey!, voiceId!);
        audioBase64 = result.audioBase64;
      } catch (err) {
        console.error('TTS error:', err);
      }
    }

    return NextResponse.json({
      text: rookieText,
      audio: audioBase64,
    });
  } catch (error) {
    console.error('Rookie voice error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Rookie response' },
      { status: 500 },
    );
  }
}

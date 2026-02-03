import GIF from 'gif.js';
import { toPng } from 'html-to-image';
import { Chess } from 'chess.js';

interface GifOptions {
  fen: string;
  moves: string[]; // Solution moves in UCI format
  playerColor: 'white' | 'black';
  lastMoveFrom?: string;
  lastMoveTo?: string;
  boardElement: HTMLElement;
  onPositionChange: (fen: string, highlights: string[]) => Promise<void>;
}

const BOARD_SIZE = 480;
const HEADER_HEIGHT = 60;
const GIF_WIDTH = BOARD_SIZE;
const GIF_HEIGHT = BOARD_SIZE + HEADER_HEIGHT;
const FRAME_DELAY = 100;

// Funny quips for the end
const QUIPS = [
  "Too easy!",
  "Gottem!",
  "Like a boss!",
  "Crushed it!",
  "GG EZ",
  "Big brain time!",
  "Chess genius!",
];

function parseUciMove(uci: string): { from: string; to: string; promotion?: string } {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined,
  };
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureBoard(element: HTMLElement): Promise<HTMLCanvasElement> {
  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 1,
    cacheBust: true,
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  });

  const img = new Image();
  img.src = dataUrl;
  await new Promise(resolve => { img.onload = resolve; });

  const canvas = document.createElement('canvas');
  canvas.width = BOARD_SIZE;
  canvas.height = BOARD_SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, BOARD_SIZE, BOARD_SIZE);

  return canvas;
}

/**
 * Apply a blur effect to a canvas
 */
function blurCanvas(canvas: HTMLCanvasElement, amount: number): HTMLCanvasElement {
  const blurred = document.createElement('canvas');
  blurred.width = canvas.width;
  blurred.height = canvas.height;
  const ctx = blurred.getContext('2d')!;

  // Use CSS filter for blur
  ctx.filter = `blur(${amount}px)`;
  ctx.drawImage(canvas, 0, 0);
  ctx.filter = 'none';

  return blurred;
}

/**
 * Create a countdown frame with large number overlaid on clear board
 */
function createCountdownFrame(boardCanvas: HTMLCanvasElement, countNumber: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = GIF_WIDTH;
  canvas.height = GIF_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#131F24';
  ctx.fillRect(0, 0, GIF_WIDTH, GIF_HEIGHT);

  // "Get ready..." text in header
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#888888';
  ctx.fillText('Get ready...', GIF_WIDTH / 2, HEADER_HEIGHT / 2);

  // Draw clear board (no blur)
  ctx.drawImage(boardCanvas, 0, HEADER_HEIGHT);

  // Semi-transparent overlay on board area
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, HEADER_HEIGHT, BOARD_SIZE, BOARD_SIZE);

  // Large countdown number centered on board
  ctx.font = 'bold 180px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // White stroke for visibility
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeText(countNumber.toString(), GIF_WIDTH / 2, HEADER_HEIGHT + BOARD_SIZE / 2);

  // Green fill
  ctx.fillStyle = '#58CC02';
  ctx.fillText(countNumber.toString(), GIF_WIDTH / 2, HEADER_HEIGHT + BOARD_SIZE / 2);

  return canvas;
}

/**
 * Create a full frame with header text above the board
 */
function createFrame(boardCanvas: HTMLCanvasElement, headerText: string, headerColor: string = '#ffffff'): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = GIF_WIDTH;
  canvas.height = GIF_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#131F24';
  ctx.fillRect(0, 0, GIF_WIDTH, GIF_HEIGHT);

  // Header text
  ctx.font = 'bold 32px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = headerColor;
  ctx.fillText(headerText, GIF_WIDTH / 2, HEADER_HEIGHT / 2);

  // Draw board below header
  ctx.drawImage(boardCanvas, 0, HEADER_HEIGHT);

  return canvas;
}

/**
 * Draw confetti particles
 */
function drawConfetti(
  ctx: CanvasRenderingContext2D,
  particles: Array<{ x: number; y: number; color: string; size: number; rotation: number }>
): void {
  for (const p of particles) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  }
}

/**
 * Draw checkmate popup (centered on board area)
 */
function drawCheckmatePopup(ctx: CanvasRenderingContext2D): void {
  const popupWidth = 340;
  const popupHeight = 80;
  const popupX = (GIF_WIDTH - popupWidth) / 2;
  const popupY = HEADER_HEIGHT + (BOARD_SIZE - popupHeight) / 2;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(popupX + 6, popupY + 6, popupWidth, popupHeight);

  // Red popup
  ctx.fillStyle = '#FF4B4B';
  ctx.fillRect(popupX, popupY, popupWidth, popupHeight);

  // Border
  ctx.strokeStyle = '#CC3939';
  ctx.lineWidth = 4;
  ctx.strokeRect(popupX, popupY, popupWidth, popupHeight);

  // Text
  ctx.font = 'bold 38px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CHECKMATE!', GIF_WIDTH / 2, popupY + popupHeight / 2);
}

export async function generatePuzzleGif(options: GifOptions): Promise<Blob> {
  const { fen, moves, lastMoveFrom, lastMoveTo, boardElement, onPositionChange } = options;

  return new Promise(async (resolve, reject) => {
    try {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: GIF_WIDTH,
        height: GIF_HEIGHT,
        workerScript: '/gif.worker.js',
      });

      const chess = new Chess(fen);
      const randomQuip = QUIPS[Math.floor(Math.random() * QUIPS.length)];

      // Initial position with highlights
      const initialHighlights = [lastMoveFrom, lastMoveTo].filter(Boolean) as string[];
      await onPositionChange(fen, initialHighlights);
      await wait(400);

      const startBoardCanvas = await captureBoard(boardElement);

      // === PHASE 1: Countdown 3, 2, 1 with blurred board ===
      for (const num of [3, 2, 1]) {
        const countdownFrame = createCountdownFrame(startBoardCanvas, num);
        for (let i = 0; i < 7; i++) { // 0.7 second per number (faster)
          gif.addFrame(countdownFrame, { copy: true, delay: FRAME_DELAY });
        }
      }

      // === PHASE 2: Solution moves with algebraic notation in header ===
      let moveNumber = 1;
      for (let moveIndex = 0; moveIndex < moves.length; moveIndex++) {
        const uciMove = moves[moveIndex];
        const { from, to, promotion } = parseUciMove(uciMove);

        // Make the move
        let san = '';
        try {
          const move = chess.move({ from, to, promotion });
          if (move) {
            san = `${moveNumber}. ${move.san}`;
            if (chess.turn() === 'w') moveNumber++;
          } else {
            console.error(`Move failed (null result): ${uciMove} from ${from} to ${to}`);
            continue;
          }
        } catch (err) {
          console.error(`Move failed with error: ${uciMove} from ${from} to ${to}`, err);
          continue;
        }

        // Update board position instantly (no animation)
        const moveHighlights = [from, to];
        await onPositionChange(chess.fen(), moveHighlights);
        // Wait for DOM to fully paint (flushSync + double rAF)
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        await wait(150);

        const moveBoardCanvas = await captureBoard(boardElement);
        const moveFrame = createFrame(moveBoardCanvas, san, '#58CC02');

        // Hold on this position (15 frames = 1.5 seconds - nice pause between moves)
        for (let i = 0; i < 15; i++) {
          gif.addFrame(moveFrame, { copy: true, delay: FRAME_DELAY });
        }
      }

      // === PHASE 3: Celebration with quip, confetti, and checkmate popup ===
      const isCheckmate = chess.isCheckmate();
      const finalBoardCanvas = await captureBoard(boardElement);

      // Initialize confetti (falls over board area)
      const confettiColors = ['#58CC02', '#1CB0F6', '#FF9600', '#FFC800', '#ffffff'];
      const particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; vr: number }> = [];

      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * GIF_WIDTH,
          y: HEADER_HEIGHT - 30 - Math.random() * 200,
          vx: (Math.random() - 0.5) * 5,
          vy: Math.random() * 2 + 1.5,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          size: Math.random() * 12 + 5,
          rotation: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
        });
      }

      // 30 frames = 3 seconds of celebration (faster)
      for (let frame = 0; frame < 30; frame++) {
        const celebrationCanvas = document.createElement('canvas');
        celebrationCanvas.width = GIF_WIDTH;
        celebrationCanvas.height = GIF_HEIGHT;
        const ctx = celebrationCanvas.getContext('2d')!;

        // Background
        ctx.fillStyle = '#131F24';
        ctx.fillRect(0, 0, GIF_WIDTH, GIF_HEIGHT);

        // Quip in header (gold color)
        ctx.font = 'bold 32px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFC800';
        ctx.fillText(randomQuip, GIF_WIDTH / 2, HEADER_HEIGHT / 2);

        // Draw board
        ctx.drawImage(finalBoardCanvas, 0, HEADER_HEIGHT);

        // Update and draw confetti (over board area)
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.1;
          p.rotation += p.vr;

          // Reset particles that fall off
          if (p.y > GIF_HEIGHT + 30) {
            p.y = HEADER_HEIGHT - 30;
            p.x = Math.random() * GIF_WIDTH;
            p.vy = Math.random() * 2 + 1.5;
          }
        }
        drawConfetti(ctx, particles);

        // Draw checkmate popup if applicable
        if (isCheckmate) {
          drawCheckmatePopup(ctx);
        }

        gif.addFrame(celebrationCanvas, { copy: true, delay: FRAME_DELAY });
      }

      // Final hold frame
      const holdCanvas = document.createElement('canvas');
      holdCanvas.width = GIF_WIDTH;
      holdCanvas.height = GIF_HEIGHT;
      const holdCtx = holdCanvas.getContext('2d')!;

      holdCtx.fillStyle = '#131F24';
      holdCtx.fillRect(0, 0, GIF_WIDTH, GIF_HEIGHT);

      holdCtx.font = 'bold 32px system-ui, sans-serif';
      holdCtx.textAlign = 'center';
      holdCtx.textBaseline = 'middle';
      holdCtx.fillStyle = '#FFC800';
      holdCtx.fillText(randomQuip, GIF_WIDTH / 2, HEADER_HEIGHT / 2);

      holdCtx.drawImage(finalBoardCanvas, 0, HEADER_HEIGHT);

      if (isCheckmate) {
        drawCheckmatePopup(holdCtx);
      }

      gif.addFrame(holdCanvas, { copy: true, delay: 1000 });

      gif.on('finished', (blob: Blob) => resolve(blob));
      gif.on('error', (error: Error) => reject(error));
      gif.render();

    } catch (error) {
      reject(error);
    }
  });
}

export async function generatePuzzleGifFile(options: GifOptions): Promise<File> {
  const blob = await generatePuzzleGif(options);
  return new File([blob], 'chess-puzzle-solution.gif', { type: 'image/gif' });
}

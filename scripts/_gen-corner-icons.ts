import { config as dotenvConfig } from 'dotenv';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
dotenvConfig({ path: '.env.local' });
const STYLE = `Vintage 1940s-1950s boxing gym sign icon. Hand-painted enamel / screen-printed signage look: cream and aged-white paint, bold red and navy accents, slightly worn and chipped edges, subtle halftone grain, thick confident outlines like old sign-painter lettering. Single centered emblem, flat graphic, no background (transparent), no text, no letters, no numbers, no border. Reads clearly at small size (64px). Square composition, subject fills ~85% of frame.`;
const PUZZLE: Record<string, string> = {
  'p2-piece-glove': 'a jigsaw puzzle piece wearing a red boxing glove, thrown as a punch',
  'p2-piece-laurel': 'a single jigsaw puzzle piece inside a laurel wreath',
  'p2-piece-bag': 'a canvas heavy bag shaped like a jigsaw puzzle piece, hanging from a chain',
  'p2-piece-belt': 'a championship title belt whose center gold plate is a jigsaw puzzle piece',
  'p2-piece-fist': 'a clenched boxing-glove fist gripping a jigsaw puzzle piece',
  'p2-piece-star': 'a jigsaw puzzle piece with a five-point star badge, chipped enamel',
  'p2-piece-bell': 'a ringside brass bell with a jigsaw puzzle piece on its front',
  'p2-piece-rook': 'a chess rook made of jigsaw puzzle pieces, one piece popping out',
  'p2-piece-trophy': 'an old loving-cup trophy with a jigsaw puzzle piece emblem on the cup',
  'p2-piece-speedbag': 'a teardrop speed bag with a jigsaw puzzle piece painted on it, on its swivel platform',
};
const PLAY: Record<string, string> = {
  'b2-knight-fist': 'a chess knight head punching forward with a blue boxing glove',
  'b2-ropes-board': 'ring ropes stretched in front of a checkered chessboard square',
  'b2-bell-ring': 'a ringside bell swinging, motion lines, blue and cream enamel',
  'b2-two-kings': 'two chess kings facing off wearing boxing gloves',
  'b2-corner-post': 'a blue boxing ring corner post with turnbuckle pads and ropes',
  'b2-headguard': 'a vintage leather boxing headguard, front view',
  'b2-stool-rook': 'a chess rook sitting on a blue corner stool between rounds',
  'b2-glove-pawn': 'a chess pawn wearing a single oversized blue boxing glove',
  'b2-ring-bird': 'a boxing ring from directly above with a chess knight and rook as the two fighters',
  'b2-handwrap': 'a boxer hand wrapped in cream hand wraps, fist forward',
};
async function gen(openai: OpenAI, name: string, subject: string) {
  try {
    const res = await openai.images.generate({ model: 'gpt-image-1', prompt: STYLE + '\n\nSubject: ' + subject, n: 1, size: '1024x1024', quality: 'medium', background: 'transparent', output_format: 'png' });
    await writeFile(`public/test-assets/corner-icons/${name}.png`, Buffer.from(res.data![0].b64_json!, 'base64'));
    console.log('done', name);
  } catch (e) { console.error('FAIL', name, (e as Error).message); }
}
async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const all = [...Object.entries(PUZZLE), ...Object.entries(PLAY)];
  for (let i = 0; i < all.length; i += 5) {
    await Promise.all(all.slice(i, i + 5).map(([n, s]) => gen(openai, n, s)));
  }
}
main();

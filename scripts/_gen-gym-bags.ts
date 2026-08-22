import { config as dotenvConfig } from 'dotenv';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
dotenvConfig({ path: '.env.local' });
const STYLE = `Vintage 1940s-1950s boxing gym equipment, painted like an old hand-painted enamel sign / screen-printed poster: flat graphic shapes, cream, deep red, navy, warm wood, subtle halftone grain, worn paint edges, thick confident outlines. Single object centered, fills the frame. Transparent background. No text, no letters, no people, no shadows on the ground.`;
const ITEMS: Record<string, string> = {
  'speedbag-drum': 'ONLY the round wooden speed-bag platform (rebound drum) seen from slightly below, with a small metal swivel hook hanging from its center. No bag attached. Wide and flat.',
  'speedbag-bag': 'ONLY a teardrop-shaped red leather speed bag, narrow stem at the TOP (where it attaches to a swivel), fat rounded bottom. Stitched seams. Vertical, upright.',
  'heavybag': 'A tall cylindrical red leather heavy punching bag hanging from a short metal chain at the top with a ring. Stitched vertical panels, a cream tape patch around the middle. Vertical, upright, the chain at the very top of the frame.',
};
async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  await Promise.all(Object.entries(ITEMS).map(async ([name, subject]) => {
    const size = name === 'speedbag-drum' ? '1024x1024' : '1024x1536';
    const res = await openai.images.generate({ model: 'gpt-image-1', prompt: STYLE + '\n\nObject: ' + subject, n: 1, size, quality: 'medium', background: 'transparent', output_format: 'png' });
    await writeFile(`public/test-assets/play-gym/${name}.png`, Buffer.from(res.data![0].b64_json!, 'base64'));
    console.log('done', name);
  }));
}
main();

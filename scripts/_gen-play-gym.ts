import { config as dotenvConfig } from 'dotenv';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
dotenvConfig({ path: '.env.local' });
const STYLE = `Vintage 1940s-1950s boxing gym interior, painted like an old hand-painted enamel sign / screen-printed poster: flat graphic shapes, limited palette of cream, aged white, deep red, navy, warm wood, subtle halftone grain, worn paint edges. Portrait phone wallpaper composition. The CENTER and LOWER-CENTER of the image must be an EMPTY, calm, dimly-lit wall and floor area (a clear stage for a character to be placed later) — keep all props, decor and detail on the upper third and the left/right edges only. Leave the upper-left and upper-right corners clear too. Absolutely NO punching bags, NO speed bags, NO heavy bags of any kind (those will be added separately). Absolutely no text, no letters, no numbers, no signs with writing, no people, no characters, no mascots. Moody, warm, cinematic, slightly dark so bright colors placed on top will pop.`;
const ROOMS: Record<string, string> = {
  'gym-brick': 'Red brick wall, string of warm bulbs across the top, a few framed empty posters high on the wall, wooden plank floor.',
  'gym-plaster': 'Aged cream plaster wall with navy wainscot, old ring ropes strung along the top edge, scuffed hardwood floor, a corner stool at the far edge.',
  'gym-tile': 'Cream subway tile wall with a green stripe, a wooden locker-room bench along the bottom edge, a row of pegs with towels and hand wraps high on the wall, concrete floor.',
  'gym-navy': 'Navy painted wood plank wall, a gold laurel wreath stencil high on the wall (no letters inside), a blue corner post with ring ropes at the right edge, cream canvas floor.',
  'gym-marquee': 'Dark velvet curtain wall, an empty gold bulb marquee frame high on the wall, spotlight beams from above, dark stage floor with a painted ring apron stripe.',
};
async function gen(openai: OpenAI, name: string, subject: string) {
  try {
    const res = await openai.images.generate({ model: 'gpt-image-1', prompt: STYLE + '\n\nScene: ' + subject, n: 1, size: '1024x1536', quality: 'medium', output_format: 'png' });
    await writeFile(`public/test-assets/play-gym/${name}.png`, Buffer.from(res.data![0].b64_json!, 'base64'));
    console.log('done', name);
  } catch (e) { console.error('FAIL', name, (e as Error).message); }
}
async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  await Promise.all(Object.entries(ROOMS).map(([n, s]) => gen(openai, n, s)));
}
main();

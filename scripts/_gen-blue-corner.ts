import { config as dotenvConfig } from 'dotenv';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
dotenvConfig({ path: '.env.local' });
const BASE = `Vintage 1940s-1950s boxing gym interior, painted like an old hand-painted enamel sign / screen-printed poster: flat graphic shapes, subtle halftone grain, worn paint edges. Portrait phone wallpaper. Wall of NAVY BLUE painted wood planks. The HERO element: a SMALL, compact laurel wreath (about one quarter of the image width) rendered in REAL GOLD LEAF — metallic, burnished, with warm highlights and darker antique-gold shadows in the leaf veins, slightly foiled/cracked gilding texture, like real gilded wood — placed EXACTLY in the horizontal center of the image, high up near the TOP of the wall (top 20% of the image), nothing inside the wreath (empty), with plenty of empty wall below it. The CENTER and LOWER-CENTER must be an EMPTY, calm, dimly-lit wall and floor (a clear stage for a character placed later) — all other props on the far left/right edges only. Absolutely NO punching bags, NO speed bags, NO heavy bags. No text, no letters, no numbers, no people, no characters. Moody, warm, slightly dark so bright colors on top will pop.`;
const V: Record<string, string> = {
  'blue-1': 'Cream canvas floor, a blue corner post with ring ropes at the right edge, a wooden stool far left.',
  'blue-2': 'Dark hardwood floor, a pair of hanging red gloves far left, a folded towel on a hook far right, gold leaf wreath extra large.',
  'blue-3': 'Cream canvas floor with a red apron stripe, string of warm bulbs across the very top, corner post far right.',
  'blue-4': 'Weathered navy planks with cream chipped paint, a single warm bulb hanging top center above the wreath, plain concrete floor, corner stool far right.',
  'blue-5': 'Navy planks with a cream horizontal wainscot rail, ring ropes on both far edges, cream canvas floor, wreath framed by two small gold star studs.',
};
async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  await Promise.all(Object.entries(V).map(async ([name, s]) => {
    try {
      const res = await openai.images.generate({ model: 'gpt-image-1', prompt: BASE + '\n\nDetails: ' + s, n: 1, size: '1024x1536', quality: 'high', output_format: 'png' });
      await writeFile(`public/test-assets/play-gym/${name}.png`, Buffer.from(res.data![0].b64_json!, 'base64'));
      console.log('done', name);
    } catch (e) { console.error('FAIL', name, (e as Error).message); }
  }));
}
main();

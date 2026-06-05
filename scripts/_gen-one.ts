import 'dotenv/config';
import { config as dotenvConfig } from 'dotenv';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';

dotenvConfig({ path: '.env.local' });

async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const STYLE = `Beautiful oil-painted classical fantasy illustration in the visual style of vintage 1990s trading-card fantasy art. Single iconic focal subject filling the frame. Deep, moody atmospheres with dramatic chiaroscuro lighting. Painterly oil-brush texture, slight grain, rich classical fantasy palette. Square 1:1 composition. No text, no borders, no UI, no symbols, no logos. No mascots, no characters, no people unless explicitly described. Treat this like a museum-quality fantasy oil painting — bold, minimal, evocative.`;
  const RELIC_STYLE = 'ornate gold filigree relic centered in frame, gem-tipped extensions, dramatic oil-painted highlights catching every facet, bright vivid jewel-tone palette, museum-quality reliquary fantasy oil painting, ornate and breathtaking';
  const subject = 'A magnificent ornate jeweled flintlock-style pistol relic centered in frame, clearly recognizable as a fantasy gun with a long barrel, grip, hammer, and trigger guard, the entire body sculpted from polished silver and platinum filigree with intricate baroque scrollwork covering every surface, the long octagonal barrel made of carved translucent sapphire crystal radiating internal icy-blue glow with frost rime creeping along its length, the muzzle a jagged starburst of carved-diamond icicle shards bristling outward, an enormous faceted pale-cyan diamond set into the side of the barrel like a power-core radiating beams of cold light, the curved pistol grip carved from deep-blue lapis inlaid with seed pearls and tiny aquamarine gems in fleur-de-lis patterns, the trigger guard and hammer dripping with delicate gold filigree curls and tipped with sapphire cabochons, frost-fern patterns etched into the breech, tiny snowflakes drifting from the muzzle, deep painted midnight-indigo velvet background with subtle silver dust shimmer, ' + RELIC_STYLE + '.';
  const res = await openai.images.generate({ model: 'gpt-image-1', prompt: STYLE + '\n\nSubject: ' + subject, n: 1, size: '1024x1024', quality: 'medium' });
  const b64 = res.data?.[0]?.b64_json!;
  await writeFile('/Users/tyler.schwartz/chess-learning-tree/public/abilities/freeze-ray-2.png', Buffer.from(b64, 'base64'));
  console.log('done');
}
main();

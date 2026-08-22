import { config as dotenvConfig } from 'dotenv';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
dotenvConfig({ path: '.env.local' });
const PROMPT = `A vintage 1940s boxing-gym wall sign. A wide rectangular hand-painted enamel / wooden sign with a cream background, a navy-blue border and gold-leaf inner pinstripe, hanging from two small brass chains or screwed to the wall with four brass screws at the corners. Bold red sign-painter block capitals reading exactly: "THERE IS NO TOMORROW" — one line, perfectly legible, correctly spelled, centered. Worn edges, chipped paint, subtle halftone grain, matching a screen-printed poster style. Transparent background. Only the sign, nothing else.`;
async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  await Promise.all([1, 2, 3].map(async (i) => {
    const res = await openai.images.generate({ model: 'gpt-image-1', prompt: PROMPT, n: 1, size: '1536x1024', quality: 'high', background: 'transparent', output_format: 'png' });
    await writeFile(`public/test-assets/play-gym/sign-${i}.png`, Buffer.from(res.data![0].b64_json!, 'base64'));
    console.log('done', i);
  }));
}
main();

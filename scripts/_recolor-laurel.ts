import { config as dotenvConfig } from 'dotenv';
import OpenAI, { toFile } from 'openai';
import { readFile, writeFile } from 'fs/promises';
dotenvConfig({ path: '.env.local' });
async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const src = await readFile('public/test-assets/corner-icons/p-laurel-glove.png');
  const res = await openai.images.edit({
    model: 'gpt-image-1',
    image: await toFile(src, 'laurel.png', { type: 'image/png' }),
    prompt: 'Keep this exact illustration, composition and vintage worn-enamel style. Change ONLY the boxing glove color from red to a bright sky blue (#1CB0F6) with slightly darker navy-blue shading. Keep the cream/gold laurel wreath and everything else identical. Transparent background, no text.',
    size: '1024x1024', quality: 'medium', background: 'transparent',
  });
  await writeFile('public/test-assets/corner-icons/b-laurel-glove-blue.png', Buffer.from(res.data![0].b64_json!, 'base64'));
  console.log('done');
}
main();

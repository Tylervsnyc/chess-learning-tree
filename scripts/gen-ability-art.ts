// Generate Power-9-MTG-style illustrations for Rookie's Run abilities via OpenAI gpt-image-1.
// Run: npx tsx scripts/gen-ability-art.ts [abilityId] [--variants=N]
// Default 5 variants per ability. Omit abilityId to do all.

import 'dotenv/config';
import { config as dotenvConfig } from 'dotenv';
import OpenAI from 'openai';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

dotenvConfig({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OUT_DIR = join(process.cwd(), 'public', 'abilities');

const STYLE = `Beautiful oil-painted classical fantasy illustration in the visual style of vintage 1990s trading-card fantasy art. Single iconic focal subject filling the frame. Deep, moody atmospheres with dramatic chiaroscuro lighting. Painterly oil-brush texture, slight grain, rich classical fantasy palette. Square 1:1 composition. No text, no borders, no UI, no symbols, no logos. No mascots, no characters, no people unless explicitly described. Treat this like a museum-quality fantasy oil painting — bold, minimal, evocative.`;

type Spec = { id: string; variants: string[] };

const RELIC_STYLE = 'ornate gold filigree relic centered in frame, gem-tipped extensions, dramatic oil-painted highlights catching every facet, bright vivid jewel-tone palette, museum-quality reliquary fantasy oil painting, ornate and breathtaking';

const SPECS: Spec[] = [
  {
    id: 'bishop-step',
    variants: [
      'An exquisitely ornate jeweled pendant relic in the shape of a perfect bold letter X (saltire, NOT a plus-sign cross, NOT a Latin cross) — four elegant arms extending diagonally at 45-degree angles toward the four corners of the frame (upper-left, upper-right, lower-left, lower-right). Each diagonal arm is a masterpiece of delicate gold filigree with intricate twisting vines, scrollwork curls, and tiny inset accent gems and seed pearls along its length, tapering to a refined fleur-de-lis or trefoil tip set with a magnificent faceted gemstone (ruby, sapphire, emerald, topaz) glowing with internal radiance. At the crossing center sits an enormous brilliantly-cut diamond in an ornate sunburst gold setting, radiating fine beams of light. Elaborate baroque flourishes and elegant curving lines throughout. Polished mirror-bright gold catching dramatic highlights. Deep painted royal-violet velvet background with subtle gold dust shimmer. ' + RELIC_STYLE + '. The shape is X, not +. Diagonals only. Maximum elegance, maximum ornateness, refined and breathtakingly beautiful.',
    ],
  },
  {
    id: 'knight-hop',
    variants: [
      'A magnificent ornate jeweled medallion relic centered in frame, an enormous faceted emerald gemstone set in an ornate gold filigree mount, a sculpted stylized chess-knight horse-head emblem in raised gold inlay centered prominently on the face of the emerald, ornate scrollwork and small accent gems around the gold mount, deep painted forest-green velvet background, ' + RELIC_STYLE + '.',
    ],
  },
  {
    id: 'queen-pulse',
    variants: [
      'A magnificent ornate jeweled royal crown amulet centered in frame, an elaborate gold filigree crown with five rising points each tipped with a different brilliant gemstone (ruby, sapphire, emerald, diamond, amethyst), an enormous central ruby below the crown radiating beams of warm light, fleur-de-lis scrollwork and gold inlay throughout, deep painted crimson velvet background, ' + RELIC_STYLE + '.',
    ],
  },
  {
    id: 'pawn-charge',
    variants: [
      'A magnificent ornate jeweled golden spearhead relic pointing diagonally upward across the frame, an elaborate gold filigree spear-tip and shaft, three glowing rubies inset along the length of the shaft, an ornate carved emblem of a charging pawn silhouette at the base, scrollwork and gold inlay throughout, deep painted copper-amber velvet background, ' + RELIC_STYLE + '.',
    ],
  },
  {
    id: 'freeze-ray',
    variants: [
      'A magnificent ornate snowflake-shaped crystalline relic centered in frame, six radiating arms of carved sapphire and pale-blue crystal edged with delicate silver and gold filigree, each arm tipped with a faceted diamond, an enormous glowing icy-blue sapphire at the center radiating cold light, frost patterns and shimmer throughout, deep painted midnight-navy velvet background, ' + RELIC_STYLE + '.',
    ],
  },
  {
    id: 'detonate',
    variants: [
      'A magnificent ornate spherical golden grenade relic centered in frame, a sphere of intricate gold filigree latticework wrapped around a fiery glowing molten ruby-orange core barely contained within, the core radiating beams of warm light through the gaps in the filigree, four small fuse-like gold extensions tipped with citrine gems, deep painted ember-black smoky background with floating sparks, ' + RELIC_STYLE + '.',
    ],
  },
  {
    id: 'phase-step',
    variants: [
      'A magnificent ornate translucent ghost-amulet relic centered in frame, a teardrop-shaped pendant of clear smoke-glass set in ornate silver filigree, ghostly violet wisps swirling visibly inside the glass, four pale amethyst gems at the cardinal points of the silver setting, ethereal mist drifting from the edges of the relic, deep painted slate-indigo velvet background, ' + RELIC_STYLE + '.',
    ],
  },
  {
    id: 'leap',
    variants: [
      'A magnificent ornate arc-shaped winged relic centered in frame, a curved bow-like sweep of gold filigree forming an arc across the frame with two stylized feathered wings extending from each end, three faceted gems (emerald, topaz, sapphire) along the arc, an enormous central diamond at the apex radiating beams of light, scrollwork throughout, deep painted twilight-emerald velvet background, ' + RELIC_STYLE + '.',
    ],
  },
  {
    id: 'surge',
    variants: [
      'A magnificent ornate lightning-bolt-shaped golden relic centered in frame, a stylized zigzag jagged lightning bolt of bright gold filigree, three glowing citrine gems inset along the bolt, crackling electric energy and golden sparks radiating outward, ornate scrollwork around the base, deep painted stormy electric-purple velvet background, ' + RELIC_STYLE + '.',
    ],
  },
  {
    id: 'decoy',
    variants: [
      // A — Bullseye Lure relic
      'A magnificent ornate jeweled bullseye-target relic centered in frame, concentric carved rings of gold filigree and inset gemstones (outer ruby ring, sapphire ring, emerald ring, topaz ring) forming a perfect target pattern, an enormous central ruby cabochon glowing with hypnotic crimson light at the bullseye, four crossed ornamental arrows of gold and crystal piercing the rings diagonally at 45 degrees, scrollwork and seed pearls throughout the border, deep painted blood-crimson velvet background with subtle gold dust shimmer, ' + RELIC_STYLE + '.',
      // B — Masked Imposter relic
      'A magnificent ornate jeweled theatrical jester half-mask relic centered in frame, an elaborate gold filigree mask with two empty eye-holes glowing with violet enchantment, ornate scrollwork curling outward like fool\'s-cap points each tipped with a faceted amethyst, a small ruby tear at one eye and a sapphire tear at the other, seed pearls outlining the lips, mischievous magical purple wisps curling around the mask, deep painted twilight-violet velvet background with floating gold sparkles, ' + RELIC_STYLE + '.',
      // C — Glowing Idol relic
      'A magnificent ornate jeweled golden idol relic centered in frame, a tall slender stylized chess-piece-shaped idol of polished mirror-bright gold standing on an ornate filigree pedestal, the idol\'s body inset with vertical bands of ruby and emerald gems, an enormous radiant diamond at the idol\'s crown radiating beams of light outward in all directions, four small kneeling silhouette pieces drawn toward it at the base, scrollwork and gold inlay throughout, deep painted shrine-gold and umber velvet background, ' + RELIC_STYLE + '.',
    ],
  },
  {
    id: 'aegis',
    variants: [
      'A magnificent ornate heraldic kite-shield relic centered in frame, an elaborate gold filigree shield with raised border scrollwork, four faceted gemstones (ruby, sapphire, emerald, diamond) inset at the cardinal points of the shield face, an enormous central rampant-rook-tower emblem rendered in gold inlay with a glowing sapphire core, deep painted midnight-blue velvet background, ' + RELIC_STYLE + '.',
    ],
  },
];

const DELAY_MS = 14000; // gpt-image-1 rate limit is 5/min, so ~12s between calls
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function gen(abilityId: string, variantIndex: number, promptDetails: string) {
  const prompt = `${STYLE}\n\nSubject: ${promptDetails}`;
  console.log(`[${abilityId}] variant ${variantIndex} — generating...`);
  const res = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'medium',
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error(`No image returned for ${abilityId} v${variantIndex}`);
  const buf = Buffer.from(b64, 'base64');
  const path = join(OUT_DIR, `${abilityId}-${variantIndex}.png`);
  await writeFile(path, buf);
  console.log(`  -> ${path}`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const onlyId = process.argv[2];
  const targets = onlyId ? SPECS.filter((s) => s.id === onlyId) : SPECS;
  if (targets.length === 0) {
    console.error(`No spec matches "${onlyId}"`);
    process.exit(1);
  }
  const startArg = process.argv.find((a) => a.startsWith('--start='));
  const startIdx = startArg ? parseInt(startArg.split('=')[1], 10) - 1 : 0;
  let first = true;
  for (const spec of targets) {
    for (let i = startIdx; i < spec.variants.length; i++) {
      if (!first) await sleep(DELAY_MS);
      first = false;
      try {
        await gen(spec.id, i + 1, spec.variants[i]);
      } catch (err) {
        console.error(`Failed ${spec.id} v${i + 1}:`, err);
      }
    }
  }
  console.log('Done.');
}

main();

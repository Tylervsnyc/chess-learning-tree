/**
 * Reconcile the IG puzzle pipeline's records against reality.
 *
 *   npx tsx scripts/ig-reconcile.ts            # report only
 *   npx tsx scripts/ig-reconcile.ts --write    # backfill sidecars + repair the ledger
 *
 * Checks, in order of how much damage they cause:
 *   1. the SAME puzzle queued/posted twice (this is how a reel gets reposted)
 *   2. reels on disk missing from data/video-puzzle-usage.json (broken dedup)
 *   3. reels rendered more than once
 *   4. reels with no metadata sidecar (difficult flag has to be guessed)
 *   5. reels with no caption file (would queue as a bare video)
 *   6. queue items whose `difficult` flag disagrees with the render record
 *
 * --write fixes 2 and 4. Nothing here ever deletes a video or unposts an item;
 * duplicates in the queue are reported for a human call.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { discoverReels, loadUsage, saveUsage, writeSidecar } from '../lib/ig-reels';
import { loadQueue } from '../lib/ig-queue';

const WRITE = process.argv.includes('--write');

async function main() {
  const reels = discoverReels();
  const usage = loadUsage();
  const ledger = new Set(usage.usedPuzzleIds);

  console.log(`Disk: ${reels.length} reels (${new Set(reels.map(r => r.puzzleId)).size} unique puzzles)`);
  console.log(`Ledger: ${usage.usedPuzzleIds.length} used ids, ${usage.renders.length} renders\n`);

  // ---- 1. duplicates in the queue (the reposting bug) ----
  let queueDupes: [string, { date: string; posted: boolean }[]][] = [];
  try {
    const queue = await loadQueue();
    const byPuzzle = new Map<string, { date: string; posted: boolean }[]>();
    for (const item of queue) {
      if (!item.puzzleId) continue;
      const list = byPuzzle.get(item.puzzleId) ?? [];
      list.push({ date: item.date, posted: item.posted });
      byPuzzle.set(item.puzzleId, list);
    }
    queueDupes = [...byPuzzle.entries()].filter(([, v]) => v.length > 1);

    if (queueDupes.length) {
      console.log(`✗ ${queueDupes.length} puzzle(s) appear TWICE in the queue:`);
      for (const [id, items] of queueDupes) {
        const posted = items.filter(i => i.posted).length;
        const tag = posted > 1 ? 'ALREADY POSTED TWICE' : posted === 1 ? 'one posted, one pending' : 'both pending';
        console.log(`   ${id}  ${tag}  [${items.map(i => `${i.date}${i.posted ? '*' : ''}`).join(', ')}]`);
      }
      console.log('   (* = posted. Remove the unposted twin by hand before it fires.)\n');
    } else {
      console.log('✓ No duplicate puzzles in the queue\n');
    }

    // ---- 6. flag disagreement ----
    const renderDifficult = new Map(reels.map(r => [r.puzzleId, r.difficult]));
    const mismatched = queue.filter(
      i => !i.posted && i.puzzleId && renderDifficult.has(i.puzzleId)
        && !!i.difficult !== renderDifficult.get(i.puzzleId),
    );
    if (mismatched.length) {
      console.log(`✗ ${mismatched.length} unposted queue item(s) disagree with the render record on \`difficult\`:`);
      for (const i of mismatched) {
        console.log(`   ${i.date} ${i.puzzleId}: queue=${!!i.difficult} render=${renderDifficult.get(i.puzzleId)}`);
      }
      console.log('   Fix: re-run ig-refill after --write, or edit the manifest.\n');
    } else {
      console.log('✓ Queue difficult-flags match the render record\n');
    }
  } catch (err) {
    console.log(`(queue check skipped — ${(err as Error).message})\n`);
  }

  // ---- 2. disk vs ledger ----
  const missingFromLedger = [...new Set(reels.map(r => r.puzzleId))].filter(id => !ledger.has(id));
  if (missingFromLedger.length) {
    console.log(`✗ ${missingFromLedger.length} rendered puzzle(s) missing from the ledger — dedup was blind to them`);
    console.log(`   ${missingFromLedger.slice(0, 12).join(', ')}${missingFromLedger.length > 12 ? ' …' : ''}`);
  } else {
    console.log('✓ Ledger covers every rendered puzzle');
  }

  // ---- 3. rendered twice ----
  const counts: Record<string, number> = {};
  for (const r of reels) counts[r.puzzleId] = (counts[r.puzzleId] ?? 0) + 1;
  const renderedTwice = Object.entries(counts).filter(([, c]) => c > 1);
  console.log(renderedTwice.length
    ? `✗ ${renderedTwice.length} puzzle(s) rendered more than once: ${renderedTwice.map(([id, c]) => `${id}×${c}`).join(', ')}`
    : '✓ No puzzle rendered twice');

  // ---- 4. sidecars ----
  const noSidecar = reels.filter(r => !r.hasSidecar);
  console.log(noSidecar.length
    ? `✗ ${noSidecar.length} reel(s) have no metadata sidecar`
    : '✓ Every reel has a metadata sidecar');

  // ---- 5. captions ----
  const noCaption = reels.filter(r => r.caption.trim().length < 20);
  console.log(noCaption.length
    ? `✗ ${noCaption.length} reel(s) have no caption: ${noCaption.map(r => `${r.date}/${r.puzzleId}`).join(', ')}`
    : '✓ Every reel has a caption');

  if (!WRITE) {
    console.log('\nReport only. Re-run with --write to backfill sidecars + repair the ledger.');
    return;
  }

  // ---- repairs ----
  for (const r of noSidecar) {
    writeSidecar(r.mp4, {
      puzzleId: r.puzzleId,
      date: r.date,
      difficult: r.difficult,   // best available: ledger, else caption text
      rating: r.rating,
      theme: r.theme,
      quip: r.quip,
    });
  }

  for (const id of missingFromLedger) usage.usedPuzzleIds.push(id);
  for (const r of reels) {
    const known = usage.renders.some(x => x.puzzleId === r.puzzleId && x.date === r.date);
    if (!known) {
      usage.renders.push({
        puzzleId: r.puzzleId,
        date: r.date,
        file: r.mp4.split('/').pop()!,
        difficult: r.difficult,
      });
    }
  }
  saveUsage(usage);

  console.log(`\nWrote ${noSidecar.length} sidecar(s); ledger now holds ${usage.usedPuzzleIds.length} used ids.`);
  if (noCaption.length) console.log('Reels with no caption are skipped by ig-refill — re-render them if you want them posted.');
  if (queueDupes.length) console.log('Duplicate queue items still need a human call — nothing was removed.');
}

main().catch(e => { console.error(e); process.exit(1); });

'use client';

import { useState } from 'react';
import { InteractiveRook, type InteractiveModeId } from '@/components/ui/InteractiveRook';

// ─── Interaction Modes ───
type ModeGroup = 'hover' | 'tap';

const MODES: { id: InteractiveModeId; label: string; description: string; group: ModeGroup }[] = [
  // ─── Hover / Drag (continuous cursor tracking) ───
  { id: 'repel', label: 'Force Field', description: 'Blocks flee from your cursor', group: 'hover' },
  { id: 'attract', label: 'Magnet', description: 'Blocks get pulled toward cursor', group: 'hover' },
  { id: 'spotlight', label: 'Spotlight', description: 'Cursor illuminates nearby blocks', group: 'hover' },
  { id: 'gravity', label: 'Tilt Gravity', description: 'Cursor position controls gravity direction', group: 'hover' },
  { id: 'magnet', label: 'Polar Magnet', description: 'Left side attracts, right side repels', group: 'hover' },
  { id: 'tornado', label: 'Tornado', description: 'Blocks orbit your cursor in a vortex', group: 'hover' },
  { id: 'freeze', label: 'Freeze Ray', description: 'Hover to freeze blocks in ice', group: 'hover' },
  { id: 'grow', label: 'Grow', description: 'Blocks near cursor grow huge, far ones shrink', group: 'hover' },
  { id: 'xray', label: 'X-Ray', description: 'Cursor reveals skeleton structure underneath', group: 'hover' },
  { id: 'wave', label: 'Wave Machine', description: 'Move mouse up/down to create waves', group: 'hover' },
  { id: 'orbit', label: 'Orbit', description: 'Blocks orbit cursor at different speeds', group: 'hover' },
  { id: 'heat', label: 'Heat Finger', description: 'Hover heats blocks from blue to red', group: 'hover' },
  { id: 'bubble', label: 'Bubble Wrap', description: 'Hover over blocks to pop them', group: 'hover' },
  { id: 'pixelate', label: 'Pixelate', description: 'Cursor reveals low-res chunky version', group: 'hover' },
  { id: 'mirror', label: 'Mirror', description: 'One half mirrors cursor movement to the other', group: 'hover' },
  { id: 'revealer', label: 'Revealer', description: 'Blocks are invisible until cursor passes over', group: 'hover' },
  { id: 'colorDrain', label: 'Color Drain', description: 'Cursor drains color, leaving grayscale', group: 'hover' },
  { id: 'puppeteer', label: 'Puppeteer', description: 'Blocks tilt toward cursor like they\'re watching', group: 'hover' },
  { id: 'magnetSnap', label: 'Magnet Snap', description: 'Blocks snap to grid lines near cursor', group: 'hover' },
  { id: 'vaporize', label: 'Vaporize', description: 'Hover dissolves blocks into particles', group: 'hover' },
  { id: 'flick', label: 'Flick', description: 'Flick blocks with fast mouse movement', group: 'hover' },
  { id: 'searchlight', label: 'Search Light', description: 'A cone of light follows cursor rotation', group: 'hover' },
  { id: 'lasso', label: 'Lasso', description: 'Circle blocks with cursor to capture them', group: 'hover' },
  { id: 'timeSlow', label: 'Time Slow', description: 'Blocks breathe normally, cursor creates bullet-time zone', group: 'hover' },
  { id: 'rowing', label: 'Rowing', description: 'Move mouse left/right to row blocks like oars', group: 'hover' },
  { id: 'drumPad', label: 'Drum Pad', description: 'Each block is a drum — hover to hit it', group: 'hover' },
  { id: 'sponge', label: 'Sponge', description: 'Blocks absorb cursor color and squeeze it out', group: 'hover' },
  { id: 'wrecking', label: 'Wrecking Ball', description: 'Cursor is a wrecking ball, smash through blocks', group: 'hover' },
  { id: 'hoverboard', label: 'Hoverboard', description: 'Rook floats and tilts based on cursor position', group: 'hover' },
  // ─── Tap / Click / Hold (works great on mobile) ───
  { id: 'ripple', label: 'Ripple', description: 'Click to send shockwaves through blocks', group: 'tap' },
  { id: 'paint', label: 'Paint', description: 'Drag to paint color trails on blocks', group: 'tap' },
  { id: 'blackhole', label: 'Black Hole', description: 'Click to create gravity wells that suck blocks in', group: 'tap' },
  { id: 'fireworks', label: 'Fireworks', description: 'Click anywhere to launch blocks as fireworks', group: 'tap' },
  { id: 'elastic', label: 'Elastic', description: 'Drag blocks and they snap back like rubber bands', group: 'tap' },
  { id: 'scatter', label: 'Scatter', description: 'Click to explode blocks, they slowly reform', group: 'tap' },
  { id: 'lightning', label: 'Lightning', description: 'Click to zap bolts between blocks', group: 'tap' },
  { id: 'eraser', label: 'Eraser', description: 'Drag to erase blocks, they grow back slowly', group: 'tap' },
  { id: 'trampoline', label: 'Trampoline', description: 'Click and blocks bounce up from impact point', group: 'tap' },
  { id: 'tractor', label: 'Tractor Beam', description: 'Hold click to vacuum blocks toward cursor', group: 'tap' },
  { id: 'smear', label: 'Smear', description: 'Drag to smear blocks in motion direction', group: 'tap' },
  { id: 'whirlpool', label: 'Whirlpool', description: 'Click to create a draining whirlpool', group: 'tap' },
  { id: 'inflate', label: 'Inflate', description: 'Hold to inflate blocks until they pop', group: 'tap' },
  { id: 'dominos', label: 'Dominos', description: 'Click a block to topple a chain reaction', group: 'tap' },
  { id: 'antigravity', label: 'Antigravity', description: 'Hold click to make blocks float upward', group: 'tap' },
  { id: 'shockwave', label: 'Shockwave', description: 'Click for expanding ring that flips blocks', group: 'tap' },
  { id: 'earthquake2', label: 'Tremor', description: 'Click intensity controls earthquake strength', group: 'tap' },
  { id: 'jellyPoke', label: 'Jelly Poke', description: 'Poke the rook and it wobbles like jelly', group: 'tap' },
  { id: 'lavalamp2', label: 'Lava Touch', description: 'Drag to inject heat blobs that rise', group: 'tap' },
  { id: 'glueGun', label: 'Glue Gun', description: 'Click to glue blocks together in clumps', group: 'tap' },
  { id: 'slingshot2', label: 'Slingshot', description: 'Pull blocks back with click, release to launch', group: 'tap' },
  { id: 'stacking', label: 'Stacking', description: 'Click to drop blocks, they stack up from bottom', group: 'tap' },
  { id: 'bowling', label: 'Bowling', description: 'Click to roll a ball through blocks and scatter them', group: 'tap' },
  { id: 'seesaw', label: 'Seesaw', description: 'Click left or right side to tip the whole rook', group: 'tap' },
  { id: 'suction', label: 'Suction Cup', description: 'Click to stick, drag to pull the whole rook', group: 'tap' },
  { id: 'catapult', label: 'Catapult', description: 'Click bottom to launch top blocks skyward', group: 'tap' },
  { id: 'splitMerge', label: 'Split/Merge', description: 'Click to split rook in half, click again to merge', group: 'tap' },
  { id: 'squeegee', label: 'Squeegee', description: 'Drag to wipe blocks clean, revealing bright underneath', group: 'tap' },
  { id: 'claw', label: 'Claw Machine', description: 'Click to drop a claw that grabs and lifts blocks', group: 'tap' },
  { id: 'vacuum', label: 'Vacuum', description: 'Hold to suck blocks into cursor, release to blow out', group: 'tap' },
  { id: 'yoyo', label: 'Yo-Yo', description: 'Click to send blocks down on a string, they snap back', group: 'tap' },
];

// ─── Page ───
const PER_PAGE = 12;
const HOVER_MODES = MODES.filter(m => m.group === 'hover');
const TAP_MODES = MODES.filter(m => m.group === 'tap');

export default function InteractiveSection() {
  const [selected, setSelected] = useState<InteractiveModeId | null>(null);
  const [group, setGroup] = useState<ModeGroup>('tap');
  const [page, setPage] = useState(0);

  const filtered = group === 'hover' ? HOVER_MODES : TAP_MODES;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageModes = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const selectedInGroup = selected ? filtered.findIndex(m => m.id === selected) : -1;

  return (
    <div>
        {selected ? (() => {
          const idx = selectedInGroup >= 0 ? selectedInGroup : filtered.findIndex(m => m.id === selected);
          const prev = idx > 0 ? filtered[idx - 1] : null;
          const next = idx < filtered.length - 1 ? filtered[idx + 1] : null;
          const mode = MODES.find(m => m.id === selected)!;
          return (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition">Back to gallery</button>
              <div className="flex-1" />
              <button onClick={() => prev && setSelected(prev.id)} disabled={!prev} className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition">Prev</button>
              <span className="text-xs text-white/30">{idx + 1}/{filtered.length}</span>
              <button onClick={() => next && setSelected(next.id)} disabled={!next} className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition">Next</button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white/[0.03] rounded-2xl p-4 sm:p-16 border border-white/[0.06]">
                <InteractiveRook mode={selected} blockSize={36} />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-white/80">{mode.label}</p>
                <p className="text-sm text-white/40">{mode.description}</p>
              </div>
            </div>
          </div>);
        })() : (
          <div>
            {/* Group dropdown */}
            <div className="flex items-center gap-3 mb-4">
              <select
                value={group}
                onChange={(e) => { setGroup(e.target.value as ModeGroup); setPage(0); }}
                className="bg-white/5 text-white/80 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '32px' }}
              >
                <option value="tap">Tap Effects ({TAP_MODES.length})</option>
                <option value="hover">Hover Effects ({HOVER_MODES.length})</option>
              </select>
              <span className="text-xs text-white/30">
                {group === 'tap' ? 'Click, hold, drag — works great on mobile' : 'Continuous cursor tracking — drag on mobile'}
              </span>
            </div>

            {/* Page nav */}
            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    page === i
                      ? 'bg-emerald-500/30 text-emerald-300 ring-1 ring-emerald-500/50'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {pageModes.map(({ id, label, description }) => (
                <div
                  key={id}
                  className="flex flex-col items-center gap-2 sm:gap-3 bg-white/[0.03] rounded-xl p-3 sm:p-5 border border-white/[0.06] hover:border-white/[0.12] transition cursor-pointer"
                  onClick={() => setSelected(id)}
                >
                  <InteractiveRook mode={id} blockSize={18} />
                  <div className="text-center">
                    <p className="text-xs font-medium text-white/80">{label}</p>
                    <p className="text-[10px] text-white/35 mt-0.5 line-clamp-2">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <span className="text-xs text-white/30">{page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

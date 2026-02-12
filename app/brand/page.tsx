'use client';

import { useState, useCallback, useRef } from 'react';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { brand } from '@/lib/brand';

// ─── Data ────────────────────────────────────────────────────

const ICON_COLORS = [
  { name: 'Blue', hex: brand.icon.blue },
  { name: 'Cyan', hex: brand.icon.cyan },
  { name: 'Purple', hex: brand.icon.purple },
  { name: 'Green', hex: brand.icon.green },
  { name: 'Yellow', hex: brand.icon.yellow },
  { name: 'Orange', hex: brand.icon.orange },
  { name: 'Coral', hex: brand.icon.coral },
  { name: 'Red', hex: brand.icon.red },
];

const BG_COLORS = [
  { name: 'Dark', hex: brand.backgrounds.dark, label: 'Brand spec dark' },
  { name: 'App Dark', hex: brand.backgrounds.appDark, label: 'Primary background' },
  { name: 'App Secondary', hex: brand.backgrounds.appSecondary, label: 'Card / surface' },
  { name: 'Light', hex: brand.backgrounds.light, label: 'Light backgrounds' },
];

const QUEEN_GRID = [
  { label: 'Crown points', dots: 3, colors: 'Blue, Cyan, Purple' },
  { label: 'Crown rim', dots: 5, colors: 'Green, Yellow, Orange, Coral, Red' },
  { label: 'Head', dots: 3, colors: 'Blue, Cyan, Purple' },
  { label: 'Neck', dots: 3, colors: 'Green, Yellow, Orange' },
  { label: 'Body', dots: 3, colors: 'Coral, Red, Blue' },
  { label: 'Base', dots: 5, colors: 'Cyan, Purple, Green, Yellow, Orange' },
];

// ─── Helpers ─────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-sm font-medium tracking-[0.2em] uppercase mb-6 text-chess-text-muted"
    >
      {children}
    </h2>
  );
}

function SectionDivider() {
  return <hr className="border-0 h-px my-12" style={{ background: 'rgba(148,163,184,0.08)' }} />;
}

function CopyToast({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium pointer-events-none"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(42,60,69,0.15)',
        color: '#58CC02',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, 8px)',
        transition: 'opacity 200ms, transform 200ms',
      }}
    >
      Copied to clipboard
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function BrandPage() {
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);
  const [logoKey, setLogoKey] = useState(0);

  const copyHex = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex);
    setToastVisible(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToastVisible(false), 1400);
  }, []);

  const replayLogo = () => setLogoKey((k) => k + 1);

  const downloadLogoPng = useCallback(async () => {
    const scale = 3; // 3x for crisp retina output
    const w = 1080;  // Instagram-friendly square
    const h = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = brand.backgrounds.dark;
    ctx.fillRect(0, 0, w, h);

    // Load and draw the stacked SVG
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = brand.assets.logoStackedDark;
    });
    const logoH = 440;
    const logoW = (img.naturalWidth / img.naturalHeight) * logoH;
    const logoX = (w - logoW) / 2;
    const logoY = (h - logoH) / 2 - 40;
    ctx.drawImage(img, logoX, logoY, logoW, logoH);

    // "chesspath.app" text
    ctx.textAlign = 'center';
    ctx.font = '500 36px "DM Sans", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    ctx.letterSpacing = '5px';
    ctx.fillText('chesspath.app', w / 2, logoY + logoH + 60);

    // Download
    const link = document.createElement('a');
    link.download = 'chesspath-logo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div className="h-full overflow-auto hide-scrollbar bg-chess-page text-chess-text">
      <div className="max-w-2xl mx-auto px-5 py-10 pb-24">
        {/* ─── Social Media Hero ─── */}
        <div
          className="rounded-2xl flex flex-col items-center justify-center py-16 px-8 mb-4 bg-chess-surface shadow-sm"
          style={{ background: brand.backgrounds.dark }}
        >
          <img
            src={brand.assets.logoStackedDark}
            alt="Chess Path"
            className="h-44"
          />
          <p
            className="mt-6 text-lg tracking-[0.15em] font-medium"
            style={{
              fontFamily: "var(--font-body), 'DM Sans', system-ui",
              color: 'rgba(148,163,184,0.5)',
            }}
          >
            chesspath.app
          </p>
        </div>

        <button
          onClick={downloadLogoPng}
          className="w-full text-xs font-medium py-2.5 rounded-xl mb-10 cursor-pointer bg-chess-surface border border-chess-text-faint/10 text-chess-text-muted hover:text-chess-text hover:bg-chess-surface/80 transition-colors shadow-sm"
        >
          Download as PNG (1080&times;1080)
        </button>

        {/* ─── Header ─── */}
        <div className="mb-2">
          <h1
            className="text-2xl font-bold text-chess-text"
            style={{ fontFamily: "var(--font-body), 'DM Sans', system-ui" }}
          >
            <span className="text-chess-text">chess</span>
            <span
              style={{
                background: brand.gradient.css,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              path
            </span>
            <span className="text-chess-text"> brand</span>
          </h1>
          <p className="text-sm mt-2 text-chess-text-muted">
            Logo assets, colors, and usage guidelines
          </p>
        </div>

        <SectionDivider />

        {/* ─── 1. Animated Logo ─── */}
        <SectionTitle>Animated Logo</SectionTitle>

        <div className="space-y-6">
          {/* Dark theme */}
          <div
            className="rounded-xl p-6 flex items-center justify-center relative overflow-hidden bg-chess-surface shadow-sm"
            style={{ background: brand.backgrounds.dark }}
          >
            <AnimatedLogo key={`dark-${logoKey}`} theme="dark" size="sm" />
          </div>

          {/* Light theme */}
          <div
            className="rounded-xl p-6 flex items-center justify-center bg-chess-surface shadow-sm"
            style={{ background: brand.backgrounds.light }}
          >
            <AnimatedLogo key={`light-${logoKey}`} theme="light" size="sm" />
          </div>

          {/* Icon only */}
          <div className="flex items-center gap-4">
            <div
              className="rounded-xl p-5 flex items-center justify-center bg-chess-surface shadow-sm"
              style={{ background: brand.backgrounds.dark }}
            >
              <AnimatedLogo key={`icon-${logoKey}`} theme="dark" iconOnly size="md" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-chess-text-muted">Icon only</p>
              <p className="text-xs text-chess-text-faint mt-1">22-dot queen shape, no wordmark</p>
            </div>
          </div>

          <button
            onClick={replayLogo}
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-chess-surface border border-chess-text-faint/10 text-chess-text-muted hover:text-chess-text transition-colors shadow-sm"
          >
            Replay animation
          </button>
        </div>

        <SectionDivider />

        {/* ─── 2. Static Lockups ─── */}
        <SectionTitle>Logo Lockups</SectionTitle>

        <div className="space-y-4">
          {/* Horizontal - dark */}
          <div>
            <p className="text-xs text-chess-text-faint mb-2">Horizontal &middot; dark background</p>
            <div
              className="rounded-xl p-6 flex items-center justify-center bg-chess-surface shadow-sm"
              style={{ background: brand.backgrounds.dark }}
            >
              <img
                src={brand.assets.logoHorizontalDark}
                alt="Chess Path horizontal logo (dark)"
                className="h-12"
              />
            </div>
          </div>

          {/* Horizontal - light */}
          <div>
            <p className="text-xs text-chess-text-faint mb-2">Horizontal &middot; light background</p>
            <div
              className="rounded-xl p-6 flex items-center justify-center bg-chess-surface shadow-sm"
              style={{ background: brand.backgrounds.light }}
            >
              <img
                src={brand.assets.logoHorizontalLight}
                alt="Chess Path horizontal logo (light)"
                className="h-12"
              />
            </div>
          </div>

          {/* Stacked - dark & light side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-chess-text-faint mb-2">Stacked &middot; dark</p>
              <div
                className="rounded-xl p-6 flex items-center justify-center aspect-square bg-chess-surface shadow-sm"
                style={{ background: brand.backgrounds.dark }}
              >
                <img
                  src={brand.assets.logoStackedDark}
                  alt="Chess Path stacked logo (dark)"
                  className="h-28"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-chess-text-faint mb-2">Stacked &middot; light</p>
              <div
                className="rounded-xl p-6 flex items-center justify-center aspect-square bg-chess-surface shadow-sm"
                style={{ background: brand.backgrounds.light }}
              >
                <img
                  src={brand.assets.logoStackedLight}
                  alt="Chess Path stacked logo (light)"
                  className="h-28"
                />
              </div>
            </div>
          </div>
        </div>

        <SectionDivider />

        {/* ─── 3. Icon Sizes ─── */}
        <SectionTitle>Icon Sizes</SectionTitle>

        <div className="flex items-end gap-6">
          {[
            { src: brand.assets.icon96, size: 96, label: '96px' },
            { src: brand.assets.icon48, size: 48, label: '48px' },
            { src: brand.assets.icon32, size: 32, label: '32px' },
          ].map((icon) => (
            <div key={icon.label} className="flex flex-col items-center gap-2">
              <div
                className="rounded-lg flex items-center justify-center bg-chess-surface shadow-sm"
                style={{
                  width: icon.size,
                  height: icon.size,
                  background: 'rgba(148,163,184,0.04)',
                  border: '1px dashed rgba(148,163,184,0.12)',
                }}
              >
                <img
                  src={icon.src}
                  alt={`Icon ${icon.label}`}
                  width={icon.size}
                  height={icon.size}
                />
              </div>
              <span className="text-[10px] font-mono text-chess-text-faint">{icon.label}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-chess-text-faint mt-4">
          Minimum size: 24px. The queen shape loses clarity below this threshold.
        </p>

        <SectionDivider />

        {/* ─── 4. Queen Structure ─── */}
        <SectionTitle>Queen Structure</SectionTitle>

        <p className="text-xs text-chess-text-faint mb-4">
          5 columns &times; 6 rows &middot; 22 dots &middot; 14px squares with 4px gap
        </p>

        <div className="space-y-1">
          {QUEEN_GRID.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="text-[10px] font-mono w-20 text-right shrink-0 text-chess-text-faint"
              >
                {row.label}
              </span>
              <span className="text-xs text-chess-text-muted">
                {row.dots} dots &mdash; {row.colors}
              </span>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* ─── 5. Color Palette ─── */}
        <SectionTitle>Color Palette</SectionTitle>

        <div className="grid grid-cols-4 gap-3">
          {ICON_COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => copyHex(color.hex)}
              className="group flex flex-col items-center gap-2 cursor-pointer"
            >
              <div
                className="w-full aspect-square rounded-lg transition-transform duration-150 group-active:scale-90 shadow-sm"
                style={{
                  backgroundColor: color.hex,
                  boxShadow: `0 4px 16px ${color.hex}30`,
                }}
              />
              <span className="text-[10px] font-medium text-chess-text-muted">{color.name}</span>
              <span className="text-[10px] font-mono text-chess-text-faint">{color.hex}</span>
            </button>
          ))}
        </div>

        <SectionDivider />

        {/* ─── 6. Wordmark Gradient ─── */}
        <SectionTitle>Wordmark Gradient</SectionTitle>

        <div className="space-y-4">
          <div
            className="h-3 rounded-full"
            style={{ background: brand.gradient.css }}
          />

          <p className="text-xs font-mono text-chess-text-faint leading-relaxed">
            {brand.gradient.stops.map((stop, i) => (
              <span key={i}>
                {brand.gradient.offsets[i]} → {stop}
                {i < brand.gradient.stops.length - 1 && <br />}
              </span>
            ))}
          </p>

          <div className="flex items-baseline gap-1">
            <span
              className="text-4xl font-bold text-chess-text"
              style={{
                fontFamily: "var(--font-body), 'DM Sans', system-ui",
              }}
            >
              chess
            </span>
            <span
              className="text-4xl font-bold"
              style={{
                fontFamily: "var(--font-body), 'DM Sans', system-ui",
                background: brand.gradient.css,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              path
            </span>
          </div>
        </div>

        <SectionDivider />

        {/* ─── 7. Backgrounds ─── */}
        <SectionTitle>Background Colors</SectionTitle>

        <div className="space-y-3">
          {BG_COLORS.map((bg) => (
            <button
              key={bg.hex}
              onClick={() => copyHex(bg.hex)}
              className="w-full flex items-center gap-4 group cursor-pointer"
            >
              <div
                className="w-14 h-10 rounded-lg shrink-0 transition-transform duration-150 group-active:scale-90 shadow-sm"
                style={{
                  backgroundColor: bg.hex,
                  border:
                    bg.hex === brand.backgrounds.light
                      ? '1px solid rgba(148,163,184,0.15)'
                      : '1px solid rgba(148,163,184,0.06)',
                }}
              />
              <div className="text-left">
                <p className="text-xs font-medium text-chess-text-muted">{bg.name}</p>
                <p className="text-[10px] font-mono text-chess-text-faint">{bg.hex}</p>
              </div>
              <p className="text-[10px] text-chess-text-faint ml-auto">{bg.label}</p>
            </button>
          ))}
        </div>

        <SectionDivider />

        {/* ─── 8. Typography ─── */}
        <SectionTitle>Typography</SectionTitle>

        <div className="space-y-5">
          <div>
            <p className="text-xs text-chess-text-faint mb-2">Wordmark &middot; DM Sans Bold (700)</p>
            <p
              className="text-3xl font-bold text-chess-text"
              style={{ fontFamily: "var(--font-body), 'DM Sans', system-ui" }}
            >
              The quick rook jumps over the lazy bishop
            </p>
          </div>

          <div>
            <p className="text-xs text-chess-text-faint mb-2">Body &middot; DM Sans Regular (400)</p>
            <p
              className="text-sm text-chess-text-muted"
              style={{ fontFamily: "var(--font-body), 'DM Sans', system-ui" }}
            >
              Chess. Made Simple. Learn tactics through
              interactive puzzles organized in a skill tree curriculum.
            </p>
          </div>

          <div
            className="rounded-lg p-3 bg-chess-surface shadow-sm"
            style={{ background: 'rgba(148,163,184,0.04)' }}
          >
            <p className="text-[10px] font-mono text-chess-text-faint leading-relaxed">
              font-family: &apos;DM Sans&apos;, system-ui, sans-serif
              <br />
              Weights: 400 (body), 500 (medium), 600 (semibold), 700 (bold)
              <br />
              Display: &apos;Playfair Display&apos;, Georgia, serif
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* ─── 9. Usage Rules ─── */}
        <SectionTitle>Usage Guidelines</SectionTitle>

        <div className="grid grid-cols-2 gap-4">
          {/* Do */}
          <div
            className="rounded-xl p-4 bg-chess-surface shadow-sm"
            style={{ background: 'rgba(88,204,2,0.04)', border: '1px solid rgba(88,204,2,0.1)' }}
          >
            <p className="text-xs font-medium mb-3 text-chess-green">
              Do
            </p>
            <ul className="space-y-2 text-xs text-chess-text-muted">
              <li>Use dark logo on dark backgrounds</li>
              <li>Use light logo on light backgrounds</li>
              <li>Maintain 1-square clear space</li>
              <li>Keep icon at 24px or larger</li>
            </ul>
          </div>

          {/* Don't */}
          <div
            className="rounded-xl p-4 bg-chess-surface shadow-sm"
            style={{ background: 'rgba(255,75,75,0.04)', border: '1px solid rgba(255,75,75,0.1)' }}
          >
            <p className="text-xs font-medium mb-3 text-chess-red">
              Don&apos;t
            </p>
            <ul className="space-y-2 text-xs text-chess-text-muted">
              <li>Rotate or skew the logo</li>
              <li>Change the icon colors</li>
              <li>Add drop shadows or effects</li>
              <li>Use icon below 24px</li>
            </ul>
          </div>
        </div>

        <SectionDivider />

        {/* ─── 10. Asset Downloads ─── */}
        <SectionTitle>Assets</SectionTitle>

        <div className="space-y-1">
          {Object.entries(brand.assets).map(([key, path]) => (
            <a
              key={key}
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs group text-chess-text-muted hover:text-chess-text transition-colors"
            >
              <span className="font-mono text-chess-text-faint">{path}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-chess-text-faint">
                Open &rarr;
              </span>
            </a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-[10px] text-chess-text-faint">chesspath.app</p>
        </div>
      </div>

      <CopyToast visible={toastVisible} />
    </div>
  );
}

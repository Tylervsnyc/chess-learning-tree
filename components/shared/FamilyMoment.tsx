'use client';

/**
 * FamilyMoment — the moment-based cross-promo lines (One Family plan,
 * "Added decisions"): never a banner, never before the first action. Each is
 * ONE line — the 40px rounded app icon from FamilyStrip, shrunk to 24px, plus
 * text — placed under the thing that earned it (a miss's Rookie line, a
 * finished day). Both render nothing unless FEATURE_FLAGS.FAMILY_STRIP is on.
 *
 *   <LearnWhyMoment />  Chess Boxing miss → "Learn why in Chess Path"
 *   <RevengeMoment />   streak / day-done → Rookie's Revenge has a new run
 */

import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { currentApp, openFamilyApp, type FamilyAppId } from '@/lib/family/apps';
import { lessonPathForThemes } from '@/lib/family/theme-lesson';
import { playButtonClick } from '@/lib/sounds';

type Tone = 'light' | 'dark';

const TEXT: Record<Tone, string> = {
  light: 'text-chess-text-muted hover:text-chess-text',
  dark: 'text-white/60 hover:text-white',
};

function MomentLink({
  app,
  path,
  tone,
  children,
}: {
  app: FamilyAppId;
  path?: string;
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        playButtonClick();
        openFamilyApp(app, path);
      }}
      className={`inline-flex min-h-[44px] max-w-full items-center justify-center gap-2 px-2 text-xs font-bold leading-snug transition-colors tap-highlight ${TEXT[tone]}`}
    >
      {/* Same App Store icon FamilyStrip draws, at line height. Plain <img>:
          the offline bundles are static exports with no image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/family/${app}.webp`}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 rounded-[6px] shadow-sm ring-1 ring-black/10"
      />
      <span className="min-w-0 text-left">{children}</span>
    </button>
  );
}

/**
 * Under a miss's Rookie line in the Chess Boxing report. Deep-links to the
 * lesson that teaches the miss's theme when one maps, else the lesson tree.
 * Hidden inside Chess Path itself (the lesson is a tap away there already).
 */
export function LearnWhyMoment({ themes, tone = 'dark' }: { themes?: readonly string[]; tone?: Tone }) {
  if (!FEATURE_FLAGS.FAMILY_STRIP) return null;
  if (currentApp() === 'chesspath') return null;
  return (
    <div className="flex justify-center">
      <MomentLink app="chesspath" path={lessonPathForThemes(themes)} tone={tone}>
        Learn why in Chess Path
      </MomentLink>
    </div>
  );
}

/** After the day's unit is done — under the primary CTA, never above it. */
export function RevengeMoment({ tone = 'light', className = '' }: { tone?: Tone; className?: string }) {
  if (!FEATURE_FLAGS.FAMILY_STRIP) return null;
  return (
    <div className={`flex justify-center ${className}`}>
      <MomentLink app="revenge" tone={tone}>
        Done for today? Rookie&apos;s Revenge has a new run every day.
      </MomentLink>
    </div>
  );
}

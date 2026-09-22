/**
 * FullBleedShell — drops the site shell's width cap for one screen.
 *
 * The root layout caps <main> at 768px (--shell-max in app/layout.tsx), which
 * is right for chesspath.app reading pages. Chess Boxing screens are built the
 * other way round: a FULL-BLEED background (the arena, the gym, the corner
 * room) with the readable content capped inside it. Capping <main> stopped the
 * background at 768px too, so on any iPad wider than that — landscape, and
 * iPad Pro in both orientations — the light page background showed as bars
 * either side of the dark arena.
 *
 * Render this at the top of a box-shell screen. Every /box route gets it from
 * app/box/layout.tsx and every /workout phase renders it (the workout is dark
 * on the web too); /play only gets it in its box-shell branch, because its
 * web version still wants the 768px reading cap.
 *
 * It is a plain server-rendered <style> — no effect, no hydration flash, and
 * it unmounts with the screen, so leaving the box shell restores the cap.
 */
export function FullBleedShell() {
  return <style>{':root{--shell-max:none}'}</style>;
}

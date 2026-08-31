import Image from 'next/image';
import Link from 'next/link';
import { RookMark } from '@/components/brand/RookMark';

const APP_STORE_CHESS_BOXING =
  'https://apps.apple.com/us/app/chess-boxing-by-chess-path/id6796812770';
const REVENGE_URL = 'https://run.chesspath.app';

/**
 * The chesspath.app front door: the whole product family on one
 * server-rendered page (SUITE_LANDING flag). Zero client JS — this page is
 * also the <2s lightweight landing. Cold-IG traffic never sees it (they get
 * ColdBoardLanding); "Start learning" routes into the classic onboarding
 * funnel via /welcome?start=1.
 */
export function SuiteLanding() {
  return (
    <div className="min-h-full overflow-auto bg-chess-page">
      <div className="mx-auto w-full max-w-lg px-4 pb-12 md:max-w-2xl md:px-6">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <Image
            src="/brand/logo-horizontal-light.svg"
            alt="Chess Path"
            width={140}
            height={32}
            priority
          />
          <Link
            href="/auth/login"
            className="rounded-xl px-4 py-2 text-sm font-bold text-chess-blue hover:text-chess-blue-dark"
          >
            Sign in
          </Link>
        </header>

        {/* Hero */}
        <section className="flex flex-col items-center pt-6 pb-10 text-center md:pt-10">
          <RookMark className="w-16 md:w-20" />
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-chess-text-faint">
            From Tyler Schwartz
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-chess-text md:text-4xl">
            Three ways to fall in love with chess.
          </h1>
          <p className="mt-3 max-w-md text-base text-chess-text-muted md:text-lg">
            A new suite of apps where you learn the game, sweat through
            chess-boxing rounds, and hunt kings with Rookie — the AI rook who
            cares way too much about your chess.
          </p>
          <Link
            href="/welcome?start=1"
            className="mt-6 w-full max-w-xs rounded-2xl bg-chess-green px-8 py-4 text-center text-lg font-bold text-white shadow-[0_4px_0_#46A302] transition hover:bg-chess-green-dark active:translate-y-0.5 active:shadow-none"
          >
            Start learning free
          </Link>
        </section>

        {/* Product cards */}
        <section className="flex flex-col gap-4">
          {/* Chess Path */}
          <article className="rounded-2xl bg-chess-surface p-5 shadow-sm md:flex md:items-center md:gap-6 md:p-6">
            <div className="flex items-center gap-4 md:flex-1">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-chess-correct-bg">
                <RookMark className="w-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-chess-green">
                  Learn
                </p>
                <h2 className="text-lg font-extrabold text-chess-text">
                  Chess Path
                </h2>
                <p className="mt-1 text-sm text-chess-text-muted">
                  Bite-size lessons, puzzles, and games against Rookie. From
                  first move to first checkmate in 5 minutes.
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:w-44 md:shrink-0">
              <Link
                href="/welcome?start=1"
                className="block rounded-xl bg-chess-green px-5 py-3 text-center font-bold text-white hover:bg-chess-green-dark"
              >
                Play free
              </Link>
            </div>
          </article>

          {/* Chess Boxing */}
          <article className="rounded-2xl bg-chess-surface p-5 shadow-sm md:flex md:items-center md:gap-6 md:p-6">
            <div className="flex items-center gap-4 md:flex-1">
              <Image
                src="/social/chessboxing-app-icon.png"
                alt="Chess Boxing app icon"
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 shrink-0 rounded-2xl"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-chess-red">
                  Fight
                </p>
                <h2 className="text-lg font-extrabold text-chess-text">
                  Chess Boxing
                </h2>
                <p className="mt-1 text-sm text-chess-text-muted">
                  Chess rounds and boxing rounds in one workout. Train your
                  brain and your hands, climb the leaderboard.
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:w-44 md:shrink-0">
              <a
                href={APP_STORE_CHESS_BOXING}
                className="flex items-center justify-center gap-2 rounded-xl bg-chess-text px-5 py-3 font-bold text-white hover:opacity-90"
              >
                <svg viewBox="0 0 384 512" className="h-4 w-4" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                  />
                </svg>
                App Store
              </a>
              <Link
                href="/workout"
                className="mt-2 block text-center text-sm font-bold text-chess-blue hover:text-chess-blue-dark"
              >
                Try it on the web
              </Link>
            </div>
          </article>

          {/* Rookie's Revenge */}
          <article className="rounded-2xl bg-chess-surface p-5 shadow-sm md:flex md:items-center md:gap-6 md:p-6">
            <div className="flex items-center gap-4 md:flex-1">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-chess-disabled bg-chess-surface">
                <Image
                  src="/revenge/mark.svg"
                  alt="Rookie's Revenge mark"
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-chess-orange">
                  Play
                </p>
                <h2 className="text-lg font-extrabold text-chess-text">
                  Rookie&apos;s Revenge
                </h2>
                <p className="mt-1 text-sm text-chess-text-muted">
                  A daily chess roguelike. The game ended — and Rookie took
                  that personally. Capture the king.
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:w-44 md:shrink-0">
              <a
                href={REVENGE_URL}
                className="block rounded-xl bg-chess-blue px-5 py-3 text-center font-bold text-white hover:bg-chess-blue-dark"
              >
                Play now
              </a>
            </div>
          </article>
        </section>

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-center gap-6 text-sm text-chess-text-faint">
          <Link href="/about" className="hover:text-chess-text-muted">
            About
          </Link>
          <Link href="/privacy" className="hover:text-chess-text-muted">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-chess-text-muted">
            Terms
          </Link>
        </footer>
      </div>
    </div>
  );
}

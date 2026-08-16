import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-full bg-chess-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">&#9823;</div>
          <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-chess-text-muted">
            Looks like this position isn&apos;t on the board.
          </p>
        </div>

        <div className="bg-chess-bg-light rounded-2xl p-6 space-y-4">
          <p className="text-chess-text-muted text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full py-3 bg-chess-green hover:bg-chess-green-dark text-white font-bold rounded-xl transition-colors text-center shadow-[0_4px_0_var(--color-chess-green-shadow)]"
            >
              Continue Learning
            </Link>

            <Link
              href="/"
              className="w-full py-3 bg-chess-bg hover:bg-chess-bg-deep text-white font-bold rounded-xl transition-colors border border-white/20 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

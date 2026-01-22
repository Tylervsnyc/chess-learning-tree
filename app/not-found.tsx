import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">&#9823;</div>
          <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-gray-400">
            Looks like this position isn&apos;t on the board.
          </p>
        </div>

        <div className="bg-[#1A2C35] rounded-xl p-6 space-y-4">
          <p className="text-gray-400 text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/learn"
              className="w-full py-3 bg-[#58CC02] hover:bg-[#4CAF00] text-white font-semibold rounded-lg transition-colors text-center shadow-[0_4px_0_#3d8c01]"
            >
              Continue Learning
            </Link>

            <Link
              href="/"
              className="w-full py-3 bg-[#131F24] hover:bg-[#0D1A1F] text-white font-semibold rounded-lg transition-colors border border-gray-600 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

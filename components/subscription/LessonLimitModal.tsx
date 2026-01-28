'use client';

import { useRouter } from 'next/navigation';

interface LessonLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonsCompleted: number;
  isLoggedIn: boolean;
}

export function LessonLimitModal({ isOpen, onClose, lessonsCompleted, isLoggedIn }: LessonLimitModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignUpFree = () => {
    router.push('/auth/signup');
  };

  const handleUpgradePremium = () => {
    if (!isLoggedIn) {
      router.push('/auth/signup?redirect=/pricing');
    } else {
      router.push('/pricing');
    }
  };

  const handleMaybeLater = () => {
    onClose();
  };

  // Non-logged in user: Show sign up options
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-[#1A2C35] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-white/10">
          {/* Icon */}
          <div className="text-center mb-5">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#58CC02] to-[#4CAF00] flex items-center justify-center shadow-lg shadow-green-500/30">
              <span className="text-4xl">&#9812;</span>
            </div>

            <h2 className="text-2xl font-black text-white mb-2">
              Nice Work!
            </h2>

            <p className="text-gray-400">
              You&apos;ve completed <span className="text-white font-bold">{lessonsCompleted} lessons</span>
            </p>
          </div>

          {/* Sign up to save progress */}
          <div className="bg-[#0D1A1F] rounded-xl p-4 mb-4">
            <p className="text-white font-bold text-center mb-2">
              Sign up to save your progress
            </p>
            <p className="text-gray-400 text-sm text-center mb-4">
              Create a free account so you don&apos;t lose your learning streak. You&apos;ll get 2 free lessons per day.
            </p>
            <button
              onClick={handleSignUpFree}
              className="w-full py-3 rounded-xl bg-[#58CC02] text-white font-bold text-lg transition-all hover:bg-[#4CAF00]"
            >
              Sign Up Free
            </button>
          </div>

          {/* Or go premium */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">&#128081;</span>
              <p className="text-white font-bold">
                Want unlimited lessons?
              </p>
            </div>
            <p className="text-gray-400 text-sm text-center mb-3">
              Become a Premium member for <span className="text-[#58CC02] font-bold">$4.99/month</span> and practice as much as you want, every day.
            </p>
            <button
              onClick={handleUpgradePremium}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold transition-all hover:opacity-90"
            >
              Sign Up for Premium
            </button>
          </div>

          <button
            onClick={handleMaybeLater}
            className="w-full py-3 mt-4 rounded-xl bg-transparent text-gray-400 font-medium text-sm hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    );
  }

  // Logged in free user: Congratulations + premium upsell
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1A2C35] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-white/10">
        {/* Celebration icon */}
        <div className="text-center mb-5">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#58CC02] to-[#4CAF00] flex items-center justify-center shadow-lg shadow-green-500/30">
            <span className="text-4xl">&#127942;</span>
          </div>

          <h2 className="text-2xl font-black text-white mb-2">
            Congratulations!
          </h2>

          <p className="text-gray-400">
            You&apos;ve completed your chess learning for today
          </p>
        </div>

        {/* Daily completion message */}
        <div className="bg-[#0D1A1F] rounded-xl p-4 mb-5 text-center">
          <p className="text-white font-bold mb-1">
            {lessonsCompleted} lessons done today
          </p>
          <p className="text-gray-400 text-sm">
            Great job staying consistent! Come back tomorrow for more.
          </p>
        </div>

        {/* Premium upsell */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 mb-4 border border-yellow-500/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">&#128081;</span>
            <p className="text-white font-bold">
              Want to keep going?
            </p>
          </div>
          <p className="text-gray-400 text-sm text-center mb-1">
            Upgrade to Premium for unlimited lessons every day.
          </p>
          <div className="flex items-baseline justify-center gap-1 mb-3">
            <span className="text-2xl font-black text-[#58CC02]">$4.99</span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <button
            onClick={handleUpgradePremium}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold transition-all hover:opacity-90"
          >
            Upgrade to Premium
          </button>
        </div>

        <button
          onClick={handleMaybeLater}
          className="w-full py-3 rounded-xl bg-transparent text-gray-400 font-medium text-sm hover:text-white transition-colors"
        >
          Done for Today
        </button>

        <p className="text-center text-gray-500 text-xs mt-3">
          Cancel anytime
        </p>
      </div>
    </div>
  );
}

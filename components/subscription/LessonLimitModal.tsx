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

  const handleUpgrade = () => {
    if (!isLoggedIn) {
      router.push('/auth/signup?redirect=/pricing');
    } else {
      router.push('/pricing');
    }
  };

  const handleMaybeLater = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1A2C35] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-white/10">
        {/* Crown icon */}
        <div className="text-center mb-5">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-4xl">👑</span>
          </div>

          <h2 className="text-2xl font-black text-white mb-2">
            Great Progress!
          </h2>

          <p className="text-gray-400">
            You've completed <span className="text-white font-bold">{lessonsCompleted} lessons</span> today!
          </p>
        </div>

        {/* Message */}
        <div className="bg-[#0D1A1F] rounded-xl p-4 mb-5 text-center">
          <p className="text-gray-300 text-sm mb-2">
            To continue your chess journey with unlimited lessons,
          </p>
          <p className="text-white font-bold text-lg">
            Become a Premium Member
          </p>
          <div className="mt-3 flex items-baseline justify-center gap-1">
            <span className="text-3xl font-black text-[#58CC02]">$4.99</span>
            <span className="text-gray-400">/month</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          {[
            'Unlimited lessons every day',
            'Access all curriculum levels',
            'Track your improvement',
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-sm">
              <span className="text-[#58CC02]">✓</span>
              <span className="text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#4CAF00] text-white font-bold text-lg transition-all hover:opacity-90 shadow-lg shadow-green-500/20"
          >
            {isLoggedIn ? 'Upgrade to Premium' : 'Sign Up & Upgrade'}
          </button>

          <button
            onClick={handleMaybeLater}
            className="w-full py-3 rounded-xl bg-transparent text-gray-400 font-medium text-sm hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          Cancel anytime
        </p>
      </div>
    </div>
  );
}

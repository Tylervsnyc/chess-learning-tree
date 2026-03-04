'use client';

import Link from 'next/link';

interface SelfPromoCardProps {
  onClick?: () => void;
}

export function SelfPromoCard({ onClick }: SelfPromoCardProps) {
  return (
    <Link
      href="/pricing"
      onClick={onClick}
      className="block rounded-2xl p-4 relative overflow-hidden transition-transform active:scale-[0.98]"
      style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFECB3)' }}
    >
      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-600 to-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg">
        BEST VALUE
      </div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-600">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" fill="currentColor" />
              <path d="M5 19a2 2 0 012-2h10a2 2 0 012 2v0a2 2 0 01-2 2H7a2 2 0 01-2-2v0z" fill="currentColor" />
            </svg>
            <p className="font-bold text-chess-text text-sm">Premium</p>
          </div>
          <p className="text-amber-700/60 text-xs mt-0.5">Unlimited lessons every day</p>
        </div>
        <div className="text-right">
          <span className="text-amber-700 font-black text-lg">$4.99</span>
          <span className="text-amber-700/50 text-xs">/mo</span>
        </div>
      </div>
      <div
        className="w-full py-3 rounded-xl font-bold text-white text-center text-sm"
        style={{
          background: 'linear-gradient(135deg, #D4A017, #B8860B)',
          boxShadow: '0 3px 0 #8B6508',
        }}
      >
        Start Premium
      </div>
    </Link>
  );
}

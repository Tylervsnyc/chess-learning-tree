'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="h-full bg-[#eef6fc] text-[#3c3c3c] flex flex-col overflow-hidden">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-12 overflow-hidden">
        <div className="max-w-sm w-full">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/brand/logo-horizontal-light.svg"
              alt="ChessPath"
              width={280}
              height={65}
              style={{ width: 'clamp(200px, 60vw, 280px)', height: 'auto' }}
              priority
            />
          </div>

          {/* Story paragraphs */}
          <div className="space-y-3 text-center">
            <p className="text-[#3c3c3c]/80 leading-relaxed">
              <span className="text-[#3c3c3c] font-medium">We&apos;re building the best chess education in the world</span> — and making it free for everyone.
            </p>

            <p className="text-[#3c3c3c]/80 leading-relaxed">
              Every puzzle has been <span className="text-[#58CC02] font-medium">hand-checked by humans over 3,000 times</span> and organized by a chess education expert to build your skills step by step.
            </p>

            <p className="text-[#3c3c3c]/80 leading-relaxed">
              Research shows that <span className="text-[#1CB0F6] font-medium">5-10 minutes of daily practice</span> is the most effective way to improve. That&apos;s exactly what we&apos;ve built.
            </p>

            {/* Free info */}
            <div className="bg-white rounded-xl p-3 mt-3 shadow-sm">
              <p className="text-[#3c3c3c]/80 text-sm leading-relaxed">
                <span className="font-semibold text-[#58CC02]">Free forever.</span> Premium members help keep it that way.
              </p>
            </div>
          </div>

          {/* CTA - Right below content */}
          <div className="mt-5">
            <Link
              href="/learn"
              className="block w-full py-4 text-center font-bold text-lg rounded-2xl text-white transition-all hover:brightness-105 active:translate-y-[2px] shadow-[0_4px_0_#3d8c01]"
              style={{ backgroundColor: '#58CC02' }}
            >
              Begin Learning
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

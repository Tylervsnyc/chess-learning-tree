'use client';

import { ReactNode } from 'react';

export default function StagingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef6fc]">
      {/* Staging banner */}
      <div className="bg-orange-500 text-white text-center py-1 text-xs font-medium">
        STAGING - V2 Curriculum Preview
      </div>
      {children}
    </div>
  );
}

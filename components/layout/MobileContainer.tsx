'use client';

import React, { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-[#131F24]">
      <div className="max-w-lg mx-auto">
        {children}
      </div>
    </div>
  );
}

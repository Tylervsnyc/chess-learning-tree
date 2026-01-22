'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AdminGate({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const hasAccess = searchParams.get('admin') === 'true';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-500">Page not found</div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

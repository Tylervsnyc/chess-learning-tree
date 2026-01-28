'use client';

import { useUser } from '@/hooks/useUser';
import { Suspense } from 'react';

function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUser();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#58CC02] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Check if user is logged in and is admin
  const isAdmin = user && profile?.is_admin === true;

  if (!isAdmin) {
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

import { redirect } from 'next/navigation';

// Middleware handles routing: logged in → /learn, not logged in → /welcome.
// This fallback catches any edge case where middleware doesn't fire.
export default function RootPage() {
  redirect('/welcome');
}

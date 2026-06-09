import { createClient } from '@/lib/supabase/server';
import { SolveClient } from './SolveClient';

/**
 * /solve — one easy puzzle, zero choices (CHE-368).
 *
 * The D1 return email deep-links here instead of the home screen: the
 * checkmate-in-1 board (same one as the cold IG landing) is on screen
 * immediately. Signed-in users get a plain keep-going CTA after the win;
 * signed-out users get the signup capture, same as cold traffic.
 */
export const metadata = {
  title: 'Checkmate in One — The Chess Path',
  description: 'One move wins. Find it.',
};

export default async function SolvePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <SolveClient authed={!!user} />;
}

import { redirect } from 'next/navigation';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

export default function RepertoirePage() {
  if (!FEATURE_FLAGS.SHOW_OPENINGS) {
    redirect('/');
  }

  // Openings UI will be restored here when SHOW_OPENINGS is enabled
  return null;
}

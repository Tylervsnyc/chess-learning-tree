import { redirect } from 'next/navigation';

// Legacy route — redirect to /path
export default function LearnRedirect() {
  redirect('/path');
}

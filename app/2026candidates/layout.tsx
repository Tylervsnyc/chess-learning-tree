/**
 * Candidates pages get a bare layout — no NavHeader, no max-width container.
 * These are recording/production tools, not user-facing app pages.
 */
export default function CandidatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

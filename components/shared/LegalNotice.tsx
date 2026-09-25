/**
 * LegalNotice — trademark + copyright line shown at the foot of About, Profile,
 * Terms, and Privacy. Rookie, The Chess Path, and Rookie's Revenge are marks of
 * Learn Through Stories LLC; keep this text in sync with docs/ip/rookie-provenance.md.
 * Swap ™ for ® per mark once the USPTO registration issues.
 */
export const LEGAL_ENTITY = 'Learn Through Stories LLC';

export default function LegalNotice({ className = '' }: { className?: string }) {
  const year = new Date().getFullYear();
  return (
    <p className={`text-[11px] leading-relaxed text-chess-text-muted/70 text-center px-2 ${className}`}>
      Rookie&trade;, The Chess Path&trade;, Chess Boxing&trade; and Rookie&apos;s Revenge&trade; are trademarks of {LEGAL_ENTITY}.
      Rookie&apos;s name, likeness, voice, animations and personality are protected characters.
      &copy; 2026&ndash;{year} {LEGAL_ENTITY}. All rights reserved.
    </p>
  );
}

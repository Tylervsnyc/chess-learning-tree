/**
 * Get country flag emoji by country code
 */
export function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    US: '🇺🇸',
    IN: '🇮🇳',
    NL: '🇳🇱',
    DE: '🇩🇪',
    UZ: '🇺🇿',
    CN: '🇨🇳',
    RU: '🇷🇺',
    KZ: '🇰🇿',
    FIDE: '🏳️',
  };
  return flags[countryCode] || '🏳️';
}

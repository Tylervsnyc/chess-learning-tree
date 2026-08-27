import { Section, Text, Link } from '@react-email/components';
import * as React from 'react';
import { MiniRookIcon } from './EmailLayout';

/**
 * Shared pieces for the Chess Boxing email set (launch + the four lifecycle
 * emails). These were originally hand-rolled inside ChessBoxingLaunch; they
 * live here so all five emails share one look instead of drifting apart.
 */

export const APP_STORE_URL =
  'https://apps.apple.com/us/app/chess-boxing-by-chess-path/id6796812770';

/** Where the templates pull their imagery from (prod, so real inboxes resolve). */
export const IMAGE_BASE = 'https://chesspath.app';

export const PILL_COLORS: Record<string, { bg: string; shadow: string }> = {
  green: { bg: '#58CC02', shadow: '#3d8c01' },
  purple: { bg: '#CE82FF', shadow: '#a855f7' },
  gold: { bg: '#FFC800', shadow: '#CC9E00' },
  red: { bg: '#FF4B4B', shadow: '#C63232' },
  blue: { bg: '#1CB0F6', shadow: '#0d7ec4' },
};

export type PillColor = keyof typeof PILL_COLORS;

/** A small colored pill used as a section title. */
export function PillTitle({ text, color, href }: { text: string; color: PillColor; href: string }) {
  const c = PILL_COLORS[color];
  return (
    <table cellPadding="0" cellSpacing="0" role="presentation">
      <tbody>
        <tr>
          <td
            style={{
              backgroundColor: c.bg,
              borderRadius: '8px',
              padding: '4px 12px',
              boxShadow: `0 2px 0 0 ${c.shadow}`,
            }}
          >
            <Link href={href} style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>
              {text}
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** The App Store CTA — dark pill, drawn in HTML so it renders without an image. */
export function AppStoreButton({ href }: { href: string }) {
  return (
    <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
      <tbody>
        <tr>
          <td
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: '14px',
              padding: '14px 30px',
              boxShadow: '0 4px 0 0 #000000',
            }}
          >
            <Link
              href={href}
              style={{
                color: '#FFFFFF',
                fontSize: '17px',
                fontWeight: 'bold',
                textDecoration: 'none',
                whiteSpace: 'nowrap' as const,
              }}
            >
              Download on the App Store &nbsp;&rarr;
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** The primary in-app CTA — same shape as AppStoreButton, in a pill color. */
export function BoxingButton({
  href,
  children,
  color = 'green',
}: {
  href: string;
  children: React.ReactNode;
  color?: PillColor;
}) {
  const c = PILL_COLORS[color];
  return (
    <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
      <tbody>
        <tr>
          <td
            style={{
              backgroundColor: c.bg,
              borderRadius: '14px',
              padding: '14px 30px',
              boxShadow: `0 4px 0 0 ${c.shadow}`,
            }}
          >
            <Link
              href={href}
              style={{
                color: '#FFFFFF',
                fontSize: '17px',
                fontWeight: 'bold',
                textDecoration: 'none',
                whiteSpace: 'nowrap' as const,
              }}
            >
              {children}
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** Rookie speaking, with her pixel rook beside her. */
export function RookQuote({ children }: { children: React.ReactNode }) {
  return (
    <Section style={rookQuote}>
      <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top', width: '36px', paddingRight: '10px', paddingTop: '4px' }}>
              <MiniRookIcon />
            </td>
            <td style={{ verticalAlign: 'top' }}>
              <Text style={quoteText}>{children}</Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

/**
 * A row of big numbers — fight record, best round, punches thrown. Renders as a
 * table so it survives Outlook. Pass 2-4 items; more than that gets cramped.
 */
export function StatRow({ items }: { items: { label: string; value: string }[] }) {
  return (
    <Section style={statBox}>
      <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
        <tbody>
          <tr>
            {items.map((it) => (
              <td key={it.label} style={{ textAlign: 'center' as const, verticalAlign: 'top' }}>
                <Text style={statValue}>{it.value}</Text>
                <Text style={statLabel}>{it.label}</Text>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Shared styles. Kept here so every Chess Boxing email reads as one family.
// ---------------------------------------------------------------------------

export const boxingHeading = {
  color: '#2A3C45',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '12px 0 4px 0',
  textAlign: 'center' as const,
};

export const boxingSubheading = {
  color: '#6B7C8A',
  fontSize: '15px',
  fontStyle: 'italic' as const,
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

export const boxingBody = {
  color: '#6B7C8A',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 14px 0',
};

export const boxingDivider = { borderColor: '#EEF6FC', margin: '20px 0' };

export const boxingButtonContainer = { margin: '24px 0 20px', textAlign: 'center' as const };

export const boxingWebNote = {
  color: '#94A3B8',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '12px 0 0 0',
  textAlign: 'center' as const,
};

export const boxingWebLink = { color: '#1CB0F6', textDecoration: 'underline' };

export const boxingSignoff = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

export const boxingAppIcon = {
  borderRadius: '18px',
  display: 'block' as const,
  margin: '0 auto',
  width: '84px',
  height: 'auto',
};

const rookQuote = {
  backgroundColor: '#EEF6FC',
  borderRadius: '10px',
  borderLeft: '3px solid #1CB0F6',
  padding: '12px 14px',
  margin: '0 0 8px 0',
};

const quoteText = {
  color: '#2A3C45',
  fontSize: '15px',
  lineHeight: '24px',
  fontStyle: 'italic' as const,
  margin: '0',
};

const statBox = {
  backgroundColor: '#EEF6FC',
  borderRadius: '12px',
  border: '1px solid #DCE8F0',
  padding: '16px 12px',
  margin: '0 0 16px 0',
};

const statValue = {
  color: '#2A3C45',
  fontSize: '26px',
  fontWeight: 'bold' as const,
  lineHeight: '30px',
  margin: '0 0 2px 0',
};

const statLabel = {
  color: '#94A3B8',
  fontSize: '11px',
  fontWeight: 'bold' as const,
  letterSpacing: '0.6px',
  lineHeight: '14px',
  margin: '0',
  textTransform: 'uppercase' as const,
};

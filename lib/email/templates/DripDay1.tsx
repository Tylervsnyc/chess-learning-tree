import { Section, Text, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, SmallRookIcon } from './components/EmailLayout';
import type { DripDay1Props } from '@/types/email';

/**
 * D1 return trigger (CHE-368): sent ~20-48h after a user's FIRST activity,
 * to users who haven't solved a puzzle yet. One job — get them onto ONE easy
 * puzzle (/solve, the checkmate-in-1 board), not a menu of options.
 */

const UTM_BASE = 'utm_source=email&utm_medium=drip&utm_campaign=drip_day1';

const BOARD_IMAGE =
  'https://iklsd8qlm1eiwekn.public.blob.vercel-storage.com/email/tactics-thumb-0FdHyIdLSWaIKLUKNWfuUGIhdJVpmN.png';

export function DripDay1({
  displayName,
  appUrl,
  unsubscribeUrl,
}: DripDay1Props) {
  const greeting = displayName ? `${displayName}, ` : '';
  const solveUrl = `${appUrl}/solve?${UTM_BASE}&utm_content=solve`;
  return (
    <EmailLayout
      preview="One move wins the game. I set up the board for you."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>One Move. One Win.</Text>

      <Section style={rookQuote}>
        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '48px', paddingRight: '10px', paddingTop: '4px' }}>
                <SmallRookIcon />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <Text style={quoteText}>
                  &ldquo;{greeting}I set up a board for you. One move and it&apos;s
                  checkmate. I&apos;ve been staring at it since you left.&rdquo;
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Hr style={divider} />

      <Section style={{ textAlign: 'center' as const }}>
        <Link href={solveUrl}>
          <Img
            src={BOARD_IMAGE}
            alt="Checkmate in one"
            width="220"
            height="220"
            style={boardImage}
          />
        </Link>

        <Text style={solveTagline}>White to move. Mate in one.</Text>

        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
          <tbody>
            <tr>
              <td style={ctaButton}>
                <Link href={solveUrl} style={ctaLink}>
                  Show me the board
                </Link>
              </td>
            </tr>
          </tbody>
        </table>

        <Text style={smallNote}>Takes about ten seconds. Feels better than it should.</Text>
      </Section>
    </EmailLayout>
  );
}

const heading = {
  color: '#2A3C45',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
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

const divider = { borderColor: '#EEF6FC', margin: '20px 0' };

const boardImage = {
  borderRadius: '12px',
  width: '220px',
  height: '220px',
  display: 'inline-block' as const,
  margin: '0 auto 12px auto',
};

const solveTagline = {
  color: '#2A3C45',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  margin: '0 0 16px 0',
};

const ctaButton = {
  backgroundColor: '#58CC02',
  borderRadius: '12px',
  padding: '12px 32px',
  boxShadow: '0 3px 0 0 #3d8c01',
};

const ctaLink = {
  color: '#FFFFFF',
  fontSize: '17px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
};

const smallNote = {
  color: '#6B7C8A',
  fontSize: '13px',
  margin: '16px 0 0 0',
};

export default DripDay1;

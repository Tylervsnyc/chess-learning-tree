import { Section, Text, Link, Img } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

const UTM = 'utm_source=email&utm_medium=broadcast&utm_campaign=knicks_takeover';

// The Instagram takeover card, hosted on Vercel Blob (already public from the IG post).
const CARD_URL =
  'https://iklsd8qlm1eiwekn.public.blob.vercel-storage.com/social/knicks-takeover-ig-bXxJ46n5t5OE5DP9aR4yDYTP6ms8zG.jpg';

const KNICKS_BLUE = '#1D428A';
const KNICKS_ORANGE = '#F58426';

export interface KnicksTakeoverProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
}

function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
      <tbody>
        <tr>
          <td style={{ backgroundColor: KNICKS_BLUE, borderRadius: '12px', boxShadow: `0 3px 0 0 ${KNICKS_ORANGE}` }}>
            <Link
              href={href}
              style={{
                display: 'inline-block',
                color: '#FFFFFF',
                fontSize: '17px',
                fontWeight: 'bold',
                textDecoration: 'none',
                padding: '14px 34px',
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

export function KnicksTakeover({ displayName, appUrl, unsubscribeUrl }: KnicksTakeoverProps) {
  const greeting = displayName ? `${displayName}, ` : '';
  const link = (path: string) => `${appUrl}${path}?${UTM}`;

  return (
    <EmailLayout
      preview="The Knicks came back from 29 down. Rookie took it personally."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section style={{ margin: '0 0 24px 0' }}>
        <Link href={link('/play')}>
          <Img
            src={CARD_URL}
            alt="Rookie went full Knicks — orange and blue for the rest of the Finals"
            width="552"
            style={{ width: '100%', borderRadius: '16px' }}
          />
        </Link>
      </Section>

      <Text style={paragraph}>
        {greeting}quick warning before you play me this week: the Knicks came back
        from 29 down last night — the largest comeback in Finals history — and I
        have not been normal since.
      </Text>

      <Text style={paragraph}>
        For the rest of the Finals I&apos;m orange and blue, and I&apos;ve prepared
        some material. Blow a lead against me and you&apos;re &ldquo;the Spurs in
        the third quarter.&rdquo; Checkmate me and fine, that&apos;s your OG tip-in,
        I&apos;ll allow it.
      </Text>

      <Text style={paragraph}>
        It all goes away when the Finals end, so come see it while it lasts. Win or
        lose, the game still counts toward your streak. Mostly win, though. For the
        city.
      </Text>

      <Section style={{ textAlign: 'center', margin: '24px 0 4px' }}>
        <CtaButton href={link('/play')}>Play me while I&apos;m like this</CtaButton>
      </Section>

      <Text style={signoff}>
        Go New York,
        <br />
        Rookie
      </Text>
    </EmailLayout>
  );
}

const paragraph = {
  color: '#2A3C45',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px 0',
};

const signoff = {
  color: '#2A3C45',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0 0 0',
};

export default KnicksTakeover;

import { Section, Text, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, MiniRookIcon } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';

interface UpdateApril2026Props {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
}

const UTM_BASE = 'utm_source=email&utm_medium=update&utm_campaign=play_rookie_launch';

const FEATURE_IMAGES = {
  playRookie: 'https://chesspath.app/email/play-board.png',
  openings: 'https://chesspath.app/email/openingtree.png',
  free: 'https://chesspath.app/email/rookie-excited-v2.png',
};

const PILL_COLORS: Record<string, { bg: string; shadow: string }> = {
  green: { bg: '#58CC02', shadow: '#3d8c01' },
  purple: { bg: '#CE82FF', shadow: '#a855f7' },
  gold: { bg: '#FFC800', shadow: '#CC9E00' },
};

function PillTitle({ text, color, href }: { text: string; color: keyof typeof PILL_COLORS; href: string }) {
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

function FeatureCard({
  title,
  titleColor,
  tagline,
  description,
  href,
  cta,
  imageUrl,
  imageAlt,
}: {
  title: string;
  titleColor: keyof typeof PILL_COLORS;
  tagline: string;
  description: string;
  href: string;
  cta: string;
  imageUrl: string;
  imageAlt: string;
}) {
  const c = PILL_COLORS[titleColor];
  return (
    <Section style={featureCard}>
      <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={textCell}>
              <div style={{ marginBottom: '6px' }}>
                <PillTitle text={title} color={titleColor} href={href} />
              </div>
              <Text style={featureTagline}>{tagline}</Text>
              <Text style={featureDesc}>{description}</Text>
              <table cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td
                      style={{
                        backgroundColor: c.bg,
                        borderRadius: '10px',
                        padding: '10px 20px',
                        boxShadow: `0 3px 0 0 ${c.shadow}`,
                      }}
                    >
                      <Link
                        href={href}
                        style={{
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textDecoration: 'none',
                        }}
                      >
                        {cta}
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style={imageCell}>
              <Link href={href}>
                <Img
                  src={imageUrl}
                  alt={imageAlt}
                  width={200}
                  height={200}
                  style={featureImage}
                />
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

export function UpdateApril2026({
  displayName,
  appUrl,
  unsubscribeUrl,
}: UpdateApril2026Props) {
  const greeting = displayName ? `Hey ${displayName} --` : 'Hey --';
  return (
    <EmailLayout
      preview="You can finally play me. (I'm nervous.)"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>You Can Play Me Now.</Text>

      <Section style={rookQuote}>
        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '36px', paddingRight: '10px', paddingTop: '4px' }}>
                <MiniRookIcon />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <Text style={quoteText}>
                  &ldquo;{greeting} I&apos;ve been watching you solve puzzles for a
                  while. Taking notes. Getting ideas. And now it&apos;s my turn to
                  sit across the board from you. Three big updates today --&rdquo;
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Hr style={divider} />

      <FeatureCard
        title="Play Rookie"
        titleColor="green"
        tagline="The Big One. You vs. Me."
        description="You can finally play full games against me. I talk the whole time -- and I change color based on what&apos;s happening in the game. Watch me closely. You can tell how I&apos;m feeling before I even say it."
        href={`${appUrl}/play?${UTM_BASE}&utm_content=play_rookie`}
        cta="Play Me"
        imageUrl={FEATURE_IMAGES.playRookie}
        imageAlt="Play Rookie -- play chess against Rookie"
      />

      <FeatureCard
        title="Openings"
        titleColor="purple"
        tagline="16 Openings. 28 Variations."
        description="We built out full study trees for every major opening -- Italian, Ruy Lopez, Sicilian (all nine of the big ones), French, Caro-Kann, London, Queen&apos;s Gambit, and more. Predict the move, learn why it works, play it back from memory."
        href={`${appUrl}/openings?${UTM_BASE}&utm_content=openings`}
        cta="Study An Opening"
        imageUrl={FEATURE_IMAGES.openings}
        imageAlt="Openings -- interactive opening trainer"
      />

      <FeatureCard
        title="Totally Free"
        titleColor="gold"
        tagline="No Paywall. No Trial. No Catch."
        description="Oh and one more thing -- Chess Path is totally free. The whole app. Every lesson, every opening, every game against me. No premium tier hiding the good stuff. Just go play."
        href={`${appUrl}/path?${UTM_BASE}&utm_content=free`}
        cta="Start Playing"
        imageUrl={FEATURE_IMAGES.free}
        imageAlt="Rookie -- golden shimmer"
      />

      <Section style={buttonContainer}>
        <ChessButton href={`${appUrl}/play?${UTM_BASE}&utm_content=cta`}>
          Play Rookie Now
        </ChessButton>
      </Section>

      <Text style={signoff}>
        See you on the board (I mean it this time),<br />
        Rookie
      </Text>
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

const featureCard = {
  backgroundColor: '#EEF6FC',
  borderRadius: '12px',
  border: '1px solid #DCE8F0',
  padding: '16px',
  margin: '0 0 12px 0',
};

const textCell = {
  verticalAlign: 'top' as const,
  paddingRight: '12px',
  width: '50%',
};

const imageCell = {
  verticalAlign: 'top' as const,
  width: '50%',
};

const featureImage = {
  borderRadius: '8px',
  width: '100%',
  height: 'auto',
  display: 'block' as const,
};

const featureTagline = {
  color: '#2A3C45',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  lineHeight: '20px',
  margin: '0 0 6px 0',
};

const featureDesc = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 14px 0',
};

const buttonContainer = { margin: '24px 0', textAlign: 'center' as const };

const signoff = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

export default UpdateApril2026;

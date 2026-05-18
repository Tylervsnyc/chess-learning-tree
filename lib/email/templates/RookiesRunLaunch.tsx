import { Section, Text, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, MiniRookIcon } from './components/EmailLayout';
import { ChessButton } from './components/ChessButton';

interface RookiesRunLaunchProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
  imageBase?: string;
}

const UTM_BASE = 'utm_source=email&utm_medium=update&utm_campaign=rookies_run_launch';

const IMAGE_BASE = 'https://chesspath.app';

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
                  width={180}
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

export function RookiesRunLaunch({
  displayName,
  appUrl,
  unsubscribeUrl,
  imageBase = IMAGE_BASE,
}: RookiesRunLaunchProps) {
  const greeting = displayName ? `Hey ${displayName} --` : 'Hey --';
  const runHref = `${appUrl}/run?${UTM_BASE}&utm_content=run`;
  const images = {
    board: `${imageBase}/email/rookies-run-board.jpg`,
    abilities: `${imageBase}/email/rookies-run-abilities.png`,
  };
  return (
    <EmailLayout
      preview="She's got this. (She does not have this.)"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={heading}>Rookie&apos;s Run</Text>
      <Text style={subheading}>She&apos;s got this. (She does not have this.)</Text>

      <Section style={rookQuote}>
        <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '36px', paddingRight: '10px', paddingTop: '4px' }}>
                <MiniRookIcon />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <Text style={quoteText}>
                  &ldquo;{greeting} I made a new game. It&apos;s me, alone, trying
                  to cross the board. Ten levels. Black pieces everywhere. I told
                  everyone I didn&apos;t need help. I do, in fact, need help.
                  That&apos;s where you come in.&rdquo;
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Hr style={divider} />

      <FeatureCard
        title="The Run"
        titleColor="green"
        tagline="Daily roguelike. 10 levels. One life."
        description="Get me from rank 1 to rank 8. The black pieces don&apos;t move -- but one wrong step and the run is over. Fresh board tomorrow. Same Rookie. (Slightly more nervous.)"
        href={runHref}
        cta="Play Today's Run"
        imageUrl={images.board}
        imageAlt="Rookie's Run -- the board"
      />

      <FeatureCard
        title="12 Abilities"
        titleColor="purple"
        tagline="Bishop Step. Knight Hop. Phase Step."
        description="Fill my tempo bar and I get to claim a power -- borrow another piece&apos;s moveset, leap over enemies, walk through walls. I collect them as I go. The good runs are the ones where the abilities line up just right."
        href={runHref}
        cta="See The Abilities"
        imageUrl={images.abilities}
        imageAlt="Rookie's Run -- 12 abilities"
      />

      <Section style={buttonContainer}>
        <ChessButton href={runHref}>
          Start Today&apos;s Run
        </ChessButton>
      </Section>

      <Text style={signoff}>
        Don&apos;t let me die out there,<br />
        Rookie
      </Text>
    </EmailLayout>
  );
}

const heading = {
  color: '#2A3C45',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
  textAlign: 'center' as const,
};

const subheading = {
  color: '#6B7C8A',
  fontSize: '15px',
  fontStyle: 'italic' as const,
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
  width: '55%',
};

const imageCell = {
  verticalAlign: 'top' as const,
  width: '45%',
  textAlign: 'center' as const,
};

const featureImage = {
  borderRadius: '8px',
  width: '100%',
  maxWidth: '180px',
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

export default RookiesRunLaunch;

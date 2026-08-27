import { Section, Text, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import {
  APP_STORE_URL,
  AppStoreButton,
  IMAGE_BASE,
  PILL_COLORS,
  PillTitle,
  RookQuote,
} from './components/BoxingBits';

interface ChessBoxingLaunchProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
  imageBase?: string;
}

const UTM_BASE = 'utm_source=email&utm_medium=update&utm_campaign=chess_boxing_launch';

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
  description: React.ReactNode;
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
                <Img src={imageUrl} alt={imageAlt} width={180} style={featureImage} />
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

export function ChessBoxingLaunch({
  displayName,
  appUrl,
  unsubscribeUrl,
  imageBase = IMAGE_BASE,
}: ChessBoxingLaunchProps) {
  const greeting = displayName ? `Hey ${displayName} \u2014` : 'Hey \u2014';
  const storeHref = `${APP_STORE_URL}?${UTM_BASE}`;
  const boxHref = `${appUrl}/box?${UTM_BASE}&utm_content=web`;

  const images = {
    icon: `${imageBase}/social/chessboxing-app-icon.png`,
    phones: `${imageBase}/boxing/welcome/phones-v2.webp`,
    boards: `${imageBase}/boxing/welcome/boards-v2.webp`,
    crew: `${imageBase}/boxing/welcome/crew-v2.webp`,
  };

  return (
    <EmailLayout
      preview="Chess Boxing is on the App Store. I have never been hit before."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section style={{ textAlign: 'center' as const, margin: '0 0 4px 0' }}>
        <Img src={images.icon} alt="Chess Boxing app icon" width={84} style={appIcon} />
      </Section>

      <Text style={heading}>Chess Boxing</Text>
      <Text style={subheading}>Rounds of puzzles and punches. It&apos;s on the App Store. It&apos;s free.</Text>

      <RookQuote>
        &ldquo;{greeting} I want to explain the last year of my life. Someone
        told me chess boxing was a real sport. I said that was made up. It is
        not made up. There is a world championship. People play a round of
        chess, then punch each other, then sit back down and play more chess,
        which is the single funniest thing humans have ever agreed to do.
        So we built it. It came out Monday.&rdquo;
      </RookQuote>

      <Hr style={divider} />

      <FeatureCard
        title="The Workout"
        titleColor="green"
        tagline="Your phone camera counts the punches."
        description="Prop it up, throw hands, and the app counts every one. No watch, no strap, no belt clip. And the video never leaves your device — it sits there watching you throw a very slow jab and it tells absolutely nobody."
        href={storeHref}
        cta="Try a Round"
        imageUrl={images.phones}
        imageAlt="Boxers in hand wraps training on their phones beside the ring"
      />

      <FeatureCard
        title="The Bout"
        titleColor="purple"
        tagline="Official 11-round format. Chess, punches, chess."
        description="Alternating rounds, same as the real sport. Solve under a clock while your arms are still shaking, which turns out to be the entire point. Or build a custom round card if eleven rounds sounds like a lot. It does. It is."
        href={storeHref}
        cta="Fight a Bout"
        imageUrl={images.boards}
        imageAlt="A row of chess boards with a clock, heavy bags behind them"
      />

      <FeatureCard
        title="Crews"
        titleColor="gold"
        tagline="Your club gets its own board."
        description="Daily leaderboard, reset every day, so a bad Tuesday is just a bad Tuesday. Start a crew and it becomes your gym against itself. The Chessboxing NYC crew at Gleason's is already on there. They are, I regret to report, extremely good."
        href={storeHref}
        cta="Join a Crew"
        imageUrl={images.crew}
        imageAlt="Chessboxing NYC meetup at Gleason's Gym"
      />

      <Section style={buttonContainer}>
        <AppStoreButton href={storeHref} />
        <Text style={webNote}>
          Not on an iPhone? It runs in your browser at{' '}
          <Link href={boxHref} style={webLink}>
            chesspath.app/box
          </Link>
          .
        </Text>
      </Section>

      <Section style={askBox}>
        <Text style={askHeading}>One small, undignified request</Text>
        <Text style={askText}>
          We launched Monday with zero ratings. Zero. A blank space where the
          stars go. If you download it and it doesn&apos;t ruin your day, leaving a
          rating takes about eleven seconds and does more for us than anything
          else I&apos;m capable of doing, on account of being a rook.
        </Text>
      </Section>

      <Text style={signoff}>
        Gloves up,<br />
        Rookie
      </Text>
    </EmailLayout>
  );
}

const appIcon = {
  borderRadius: '18px',
  display: 'block' as const,
  margin: '0 auto',
  width: '84px',
  height: 'auto',
};

const heading = {
  color: '#2A3C45',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '12px 0 4px 0',
  textAlign: 'center' as const,
};

const subheading = {
  color: '#6B7C8A',
  fontSize: '15px',
  fontStyle: 'italic' as const,
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
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
  backgroundColor: '#DCE8F0',
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

const buttonContainer = { margin: '24px 0 20px', textAlign: 'center' as const };

const webNote = {
  color: '#94A3B8',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '12px 0 0 0',
  textAlign: 'center' as const,
};

const webLink = { color: '#1CB0F6', textDecoration: 'underline' };

const askBox = {
  backgroundColor: '#FFF8E1',
  borderRadius: '10px',
  borderLeft: '3px solid #FFC800',
  padding: '14px 16px',
  margin: '0 0 20px 0',
};

const askHeading = {
  color: '#2A3C45',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  margin: '0 0 6px 0',
};

const askText = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const signoff = {
  color: '#6B7C8A',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

export default ChessBoxingLaunch;

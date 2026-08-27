import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

/**
 * BoxingEmailLayout — the Chess Boxing shell.
 *
 * The Chess Path EmailLayout (light blue #EEF6FC, pixel rook, "The Fun Way To
 * Learn Chess") is the wrong brand for these: Chess Boxing runs the gym
 * palette. This mirrors the shipped FightResultCard instead — a cream
 * fight-poster card (#f3e9d2) in navy ink (#1b2340), sitting on a dark gym
 * floor, with belt gold and corner red as the only accents.
 *
 * Every colour here is lifted from components/chessboxing/*, not invented.
 *
 * Email constraints this obeys: tables not flex, inline styles only, no webp
 * (see scripts/build-email-assets.ts), no CSS transforms, and no reliance on
 * background-image — Outlook ignores all four.
 */

// --- the palette, straight from the app ---------------------------------
export const CB = {
  /** Gym floor, behind the card. components/chessboxing/RingHome.tsx */
  gym: '#131a2e',
  gymDeep: '#0b101e',
  /** Fight-poster paper. FightResultCard's window. */
  cream: '#f3e9d2',
  /** The ink everything is printed in. */
  ink: '#1b2340',
  /** Secondary body copy on cream — 6.7:1. */
  ink70: '#4a5068',
  /** Small caps labels on cream — 5.1:1. */
  ink55: '#5c6076',
  /** Cream at reduced weight on navy — 7.1:1. */
  creamMuted: '#a8a598',
  /** Belt gold. */
  gold: '#f6c445',
  goldDeep: '#b8860b',
  goldInk: '#3d2e00',
  /** Corner red. */
  red: '#ff4b4b',
  redDeep: '#8a1f1f',
  /** Body copy printed ON gold — a darker shade of gold's own hue, 5.9:1.
   *  Cool gray on gold reads muddy; never use ink70 there. */
  onGold: '#54430f',
} as const;

/**
 * Where the email-safe art lives. Absolute, because an inbox is not our origin.
 *
 * EMAIL_IMAGE_BASE overrides the host so /test/email-preview can point at
 * localhost and you can see the art before it has shipped to prod. Real sends
 * always resolve to chesspath.app — the env var is unset in production.
 */
const IMAGE_HOST =
  process.env.EMAIL_IMAGE_BASE ??
  // In `next dev` the art has usually not shipped to prod yet, so
  // /test/email-preview would render a page of broken frames. A relative path
  // resolves against localhost in the browser. Real sends run with
  // NODE_ENV=production and get the absolute URL an inbox needs.
  (process.env.NODE_ENV === 'development' ? '' : 'https://chesspath.app');

export const CB_IMG = `${IMAGE_HOST}/email/boxing`;

export const CB_APP_STORE =
  'https://apps.apple.com/us/app/chess-boxing-by-chess-path/id6796812770';

interface BoxingEmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  unsubscribeUrl: string;
  /** Set on the celebration email so the header gets the full red rule. */
  accent?: 'gold' | 'red';
}

export function BoxingEmailLayout({
  preview,
  children,
  unsubscribeUrl,
  accent = 'gold',
}: BoxingEmailLayoutProps) {
  const rule = accent === 'red' ? CB.red : CB.gold;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Gym strip: icon + wordmark, on the dark floor. */}
          <Section style={header}>
            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'middle', paddingRight: 12 }}>
                    <Img src={`${CB_IMG}/icon.png`} alt="" width={44} height={44} style={headerIcon} />
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                    <Text style={wordmark}>CHESS BOXING</Text>
                    <Text style={wordmarkSub}>Rounds of puzzles and punches</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* The rule under the header is the only thing that changes tone. */}
          <Section style={{ ...ruleBar, backgroundColor: rule }}>
            <Text style={ruleSpacer}>&nbsp;</Text>
          </Section>

          {/* The fight card. */}
          <Section style={card}>{children}</Section>

          <Section style={footer}>
            <Text style={footerText}>
              You get this because you have an account at Chess Path. Chess Boxing is
              the same account.
            </Text>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Stop these emails
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// -----------------------------------------------------------------------
// Shared building blocks. Each email picks a different subset so the six
// don't read as one template with the words swapped.
// -----------------------------------------------------------------------

/**
 * The poster banner — a solid bar of colour with the headline knocked out of
 * it, the way a fight poster names the event. Straight, not rotated: CSS
 * transforms don't survive Outlook.
 */
export function PosterBanner({
  kicker,
  headline,
  tone = 'ink',
}: {
  kicker?: string;
  headline: string;
  tone?: 'ink' | 'red' | 'gold';
}) {
  // Contrast, measured: cream on #ff4b4b is only 2.75:1, so bright red never
  // carries cream text. Navy ink on it is 4.65:1 and reads like a fight poster.
  const bg = tone === 'red' ? CB.red : tone === 'gold' ? CB.gold : CB.ink;
  const onColour = tone === 'red' || tone === 'gold';
  const fg = tone === 'red' ? CB.ink : tone === 'gold' ? CB.goldInk : CB.cream;
  // The kicker is 10px, so it needs the full 4.5:1 too — no tinted-down variant.
  const sub = onColour ? fg : CB.creamMuted;

  return (
    <Section style={{ ...banner, backgroundColor: bg }}>
      {kicker && <Text style={{ ...bannerKicker, color: sub }}>{kicker}</Text>}
      <Text style={{ ...bannerHeadline, color: fg }}>{headline}</Text>
    </Section>
  );
}

/**
 * The voice block. A solid navy panel, not a quote with a coloured edge —
 * whoever is speaking is in the corner, so they get the corner's colour.
 *
 * Defaults to Rookie ("FROM YOUR CORNER"). The celebration email overrides the
 * label because Tyler is the one talking there, not the mascot.
 */
export function CornerLine({
  children,
  label = 'FROM YOUR CORNER',
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <Section style={cornerBlock}>
      <Text style={cornerLabel}>{label}</Text>
      {React.Children.toArray(children).map((para, i) => (
        <Text key={i} style={i === 0 ? cornerText : cornerTextNext}>
          {para}
        </Text>
      ))}
    </Section>
  );
}

/** The judges' card: big tabular numbers over hairline-ruled labels. */
export function ScoreCard({
  items,
  title,
}: {
  items: { label: string; value: string }[];
  title?: string;
}) {
  const w = `${Math.floor(100 / items.length)}%`;
  // No media queries: Gmail strips <style>, so the card has to survive 320px
  // on its own. Three columns at that width give each value ~85px, which is
  // not enough for "2-3-1" at 28px — it broke to two lines. Step the value
  // down instead, and never let the number itself wrap.
  const valueStyle = items.length >= 3 ? scoreValueTight : scoreValue;
  return (
    <Section style={scoreWrap}>
      {title && <Text style={scoreTitle}>{title}</Text>}
      <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
        <tbody>
          <tr>
            {items.map((it, i) => (
              <td
                key={it.label}
                style={{
                  width: w,
                  textAlign: 'center' as const,
                  verticalAlign: 'top' as const,
                  borderLeft: i === 0 ? 'none' : `1px solid ${CB.ink}22`,
                }}
              >
                <Text style={valueStyle}>{it.value}</Text>
                <Text style={scoreLabel}>{it.label}</Text>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

/**
 * A mode on the card: painted sprite on the left, name and one line of what it
 * is on the right. Used for PUZZLE BOXING / BOUT MODE.
 */
export function ModeRow({
  icon,
  iconWidth = 52,
  name,
  line,
  href,
  cta,
}: {
  icon: string;
  iconWidth?: number;
  name: string;
  line: string;
  href: string;
  cta: string;
}) {
  return (
    <Section style={modeRow}>
      <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ width: `${iconWidth + 16}px`, verticalAlign: 'top' }}>
              <Link href={href}>
                <Img
                  src={icon}
                  alt=""
                  width={iconWidth}
                  style={{ display: 'block', width: `${iconWidth}px`, height: 'auto' }}
                />
              </Link>
            </td>
            <td style={{ verticalAlign: 'top' }}>
              <Text style={modeName}>{name}</Text>
              <Text style={modeLine}>{line}</Text>
              <Link href={href} style={modeCta}>
                {cta} &rarr;
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

/** The primary action. Flat colour, hard bottom edge — the app's button. */
export function FightButton({
  href,
  children,
  tone = 'red',
}: {
  href: string;
  children: React.ReactNode;
  tone?: 'red' | 'gold' | 'ink';
}) {
  // Buttons use the app's DEEP red (FightResultCard's meltdown red), not the
  // bright one: cream on #8a1f1f is 7.6:1, cream on #ff4b4b is 2.75:1.
  const map = {
    red: { bg: CB.redDeep, edge: '#5c1414', fg: CB.cream },
    gold: { bg: CB.gold, edge: CB.goldDeep, fg: CB.goldInk },
    ink: { bg: CB.ink, edge: '#0b101e', fg: CB.cream },
  } as const;
  const c = map[tone];

  return (
    <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
      <tbody>
        <tr>
          <td
            style={{
              backgroundColor: c.bg,
              borderRadius: '12px',
              padding: '15px 32px',
              boxShadow: `0 4px 0 0 ${c.edge}`,
            }}
          >
            <Link
              href={href}
              style={{
                color: c.fg,
                fontSize: '16px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
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

/** Full-bleed photograph with a caption printed underneath, poster style. */
export function GymPhoto({
  src,
  alt,
  caption,
  width = 512,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
}) {
  return (
    <Section style={{ margin: '0 0 18px 0' }}>
      <Img src={src} alt={alt} width={width} style={{ ...photo, maxWidth: `${width}px` }} />
      {caption && <Text style={photoCaption}>{caption}</Text>}
    </Section>
  );
}

/** A ruled break — the dashed line off the scorecard. */
export function CardRule() {
  return <Section style={cardRule}><Text style={ruleSpacer}>&nbsp;</Text></Section>;
}

// -----------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const body = {
  backgroundColor: CB.gymDeep,
  fontFamily: FONT,
  margin: 0,
  padding: '24px 0',
};

const container = {
  backgroundColor: CB.gym,
  margin: '0 auto',
  maxWidth: '560px',
  overflow: 'hidden',
  borderRadius: '14px',
};

const header = {
  backgroundColor: CB.gym,
  padding: '22px 24px 18px',
  textAlign: 'center' as const,
};

const headerIcon = {
  borderRadius: '10px',
  display: 'block' as const,
  width: '44px',
  height: '44px',
};

const wordmark = {
  color: CB.cream,
  fontSize: '21px',
  fontWeight: 900,
  letterSpacing: '0.14em',
  lineHeight: '22px',
  margin: 0,
};

const wordmarkSub = {
  color: CB.creamMuted,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  lineHeight: '14px',
  margin: '3px 0 0 0',
};

const ruleBar = { height: '5px', lineHeight: '5px', fontSize: 0 };
const ruleSpacer = { margin: 0, fontSize: 0, lineHeight: 0 };

const card = {
  backgroundColor: CB.cream,
  padding: '28px 26px 26px',
};

const footer = {
  backgroundColor: CB.gym,
  padding: '18px 24px 20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: CB.creamMuted,
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 6px 0',
};

const unsubscribeLink = {
  color: CB.creamMuted,
  fontSize: '12px',
  textDecoration: 'underline',
};

const banner = {
  padding: '14px 18px',
  borderRadius: '10px',
  margin: '0 0 18px 0',
  textAlign: 'center' as const,
};

const bannerKicker = {
  fontSize: '10px',
  fontWeight: 900,
  letterSpacing: '0.28em',
  lineHeight: '14px',
  margin: '0 0 4px 0',
};

const bannerHeadline = {
  fontSize: '30px',
  fontWeight: 900,
  letterSpacing: '-0.01em',
  lineHeight: '32px',
  margin: 0,
  textTransform: 'uppercase' as const,
};

const cornerBlock = {
  backgroundColor: CB.ink,
  borderRadius: '10px',
  padding: '14px 16px',
  margin: '0 0 18px 0',
};

const cornerLabel = {
  color: CB.creamMuted,
  fontSize: '9px',
  fontWeight: 900,
  letterSpacing: '0.26em',
  lineHeight: '12px',
  margin: '0 0 6px 0',
};

const cornerText = {
  color: CB.cream,
  fontSize: '15px',
  lineHeight: '23px',
  margin: 0,
};

/** Second and later paragraphs in a voice block. */
const cornerTextNext = { ...cornerText, margin: '12px 0 0 0' };

const scoreWrap = {
  border: `2px solid ${CB.ink}`,
  borderRadius: '10px',
  padding: '14px 8px 12px',
  margin: '0 0 18px 0',
};

const scoreTitle = {
  color: CB.ink55,
  fontSize: '9px',
  fontWeight: 900,
  letterSpacing: '0.26em',
  lineHeight: '12px',
  margin: '0 0 10px 0',
  textAlign: 'center' as const,
};

const scoreValue = {
  color: CB.ink,
  fontSize: '28px',
  fontWeight: 900,
  lineHeight: '30px',
  margin: '0 0 3px 0',
  whiteSpace: 'nowrap' as const,
};

const scoreValueTight = { ...scoreValue, fontSize: '22px', lineHeight: '26px' };

const scoreLabel = {
  color: CB.ink55,
  fontSize: '10px',
  fontWeight: 800,
  letterSpacing: '0.14em',
  lineHeight: '13px',
  margin: 0,
  // Two lines' worth, always: "BEST ROUND" wraps at 320px and would otherwise
  // shove its column's baseline below the others.
  minHeight: '26px',
  textTransform: 'uppercase' as const,
};

const modeRow = {
  margin: '0 0 16px 0',
};

const modeName = {
  color: CB.ink,
  fontSize: '15px',
  fontWeight: 900,
  letterSpacing: '0.1em',
  lineHeight: '18px',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
};

const modeLine = {
  color: CB.ink70,
  fontSize: '14px',
  lineHeight: '21px',
  margin: '0 0 6px 0',
};

const modeCta = {
  color: CB.redDeep,
  fontSize: '13px',
  fontWeight: 800,
  letterSpacing: '0.04em',
  textDecoration: 'none',
};

const photo = {
  borderRadius: '10px',
  display: 'block' as const,
  height: 'auto',
  maxWidth: '100%',
  width: '100%',
};

const photoCaption = {
  color: CB.ink55,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  lineHeight: '15px',
  margin: '8px 0 0 0',
  textAlign: 'center' as const,
};

const cardRule = {
  borderTop: `1px dashed ${CB.ink}55`,
  height: '1px',
  lineHeight: '1px',
  fontSize: 0,
  margin: '4px 0 20px 0',
};

// --- text styles the templates share ------------------------------------

export const cbHeading = {
  color: CB.ink,
  fontSize: '26px',
  fontWeight: 900,
  letterSpacing: '-0.01em',
  lineHeight: '30px',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

export const cbDek = {
  color: CB.ink70,
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 18px 0',
  textAlign: 'center' as const,
};

export const cbBody = {
  color: CB.ink70,
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

export const cbSignoff = {
  color: CB.ink55,
  fontSize: '14px',
  lineHeight: '21px',
  margin: '18px 0 0 0',
};

export const cbButtonWrap = { margin: '22px 0 6px', textAlign: 'center' as const };

export const cbFootnote = {
  color: CB.ink55,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '12px 0 0 0',
  textAlign: 'center' as const,
};

export const cbLink = { color: CB.redDeep, textDecoration: 'underline' };

/** Body copy inside a gold block. Uses gold's own hue, not the cool ink ramp. */
export const cbGoldBody = {
  color: CB.onGold,
  fontSize: '14px',
  lineHeight: '21px',
  margin: 0,
};

/** The heading of a gold block. */
export const cbGoldHeading = {
  color: CB.goldInk,
  fontSize: '14px',
  fontWeight: 900,
  letterSpacing: '0.04em',
  margin: '0 0 6px 0',
  textTransform: 'uppercase' as const,
};

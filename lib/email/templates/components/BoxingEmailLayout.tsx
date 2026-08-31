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
 * palette. The app is DARK — gym navy floor (#131a2e) with raised navy
 * surfaces (#1b2a4a) — so the email is too. Cream (#f3e9d2) is the ink the
 * card is printed in, not the paper. Belt gold and corner red are the only
 * accents. The old-school engraved icons are drawn on cream, so each one sits
 * in a cream "sticker" cell and reads as a patch sewn onto the dark card.
 *
 * Every colour here is lifted from components/chessboxing/* (RingHome,
 * BoxingLogoLoader, FightResultCard), not invented.
 *
 * Email constraints this obeys: tables not flex, inline styles only, no webp
 * (see scripts/build-email-assets.ts), no CSS transforms, and no reliance on
 * background-image — Outlook ignores all four. Every cream/gold surface is a
 * real backgroundColor on a td or section (the same inline style FightButton always used).
 */

// --- the palette, straight from the app ---------------------------------
export const CB = {
  /** Page floor behind the card. components/chessboxing/RingHome.tsx */
  gym: '#131a2e',
  gymDeep: '#0b101e',
  /** Raised panels in the app (BoxingLogoLoader / RingHome cards). */
  surface: '#1b2a4a',
  /** Board-square blue; borders and hairlines on a surface. */
  square: '#28375f',
  /** The cream the card is printed in. FightResultCard's paper, now the ink. */
  cream: '#f3e9d2',
  /** Navy ink — used ON cream stickers and cream buttons only. */
  ink: '#1b2340',
  /** Secondary copy on the dark card — 11:1 on gym, 9:1 on surface. */
  text70: '#cfc8b8',
  /** Small caps labels on the dark card — 7.1:1 on gym, 5.6:1 on surface. */
  text55: '#a8a598',
  /** @deprecated alias kept for older templates: reads as text70 on dark. */
  ink70: '#cfc8b8',
  /** @deprecated alias kept for older templates: reads as text55 on dark. */
  ink55: '#a8a598',
  /** Cream at reduced weight on navy. Same value as text55. */
  creamMuted: '#a8a598',
  /** Belt gold. */
  gold: '#f6c445',
  goldDeep: '#b8860b',
  goldInk: '#3d2e00',
  /** Corner red — the rope red the app uses. */
  red: '#e5484d',
  redBright: '#ff4b4b',
  redDeep: '#8a1f1f',
  /** Body copy printed ON a solid gold slab (only FightButton gold uses it). */
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
          {/* Gym strip: the ring-rook app icon, big, with the wordmark beside it. */}
          <Section style={header}>
            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'middle', paddingRight: 16 }}>
                    <Img src={`${CB_IMG}/icon.png`} alt="Chess Boxing" width={68} height={68} style={headerIcon} />
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

          {/* The fight card. Same navy as the floor — the content is the card. */}
          <Section style={card}>{children}</Section>

          <Section style={footer}>
            <Text style={footerText}>
              You get this because you have an account at Chess Path. Chess Boxing is
              the same account.
            </Text>
            <Text style={footerText}>
              From the makers of{' '}
              <Link
                href="https://chesspath.app?utm_source=email&utm_medium=lifecycle&utm_campaign=cb_footer"
                style={footerLink}
              >
                Chess Path
              </Link>{' '}
              &mdash; the fun way to learn chess.
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
 * The poster banner — a bar of colour with the headline knocked out of it,
 * the way a fight poster names the event. Straight, not rotated: CSS
 * transforms don't survive Outlook.
 *
 * 'ink' is the default and is now a raised navy surface with a gold kicker —
 * on a dark card the loud tones (red / gold) are reserved for the one email
 * that earns them.
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
  // Contrast, measured: cream on #e5484d is only 3.2:1, so red never carries
  // cream text. Navy ink on it is 5.1:1 and reads like a fight poster.
  const bg = tone === 'red' ? CB.red : tone === 'gold' ? CB.gold : CB.surface;
  const fg = tone === 'red' ? CB.ink : tone === 'gold' ? CB.goldInk : CB.cream;
  // The kicker is 10px, so it needs the full 4.5:1 too. Gold on surface is 9:1.
  const sub = tone === 'ink' ? CB.gold : fg;

  return (
    <Section style={{ ...banner, backgroundColor: bg, borderColor: tone === 'ink' ? CB.square : bg }}>
      {kicker && <Text style={{ ...bannerKicker, color: sub }}>{kicker}</Text>}
      <Text style={{ ...bannerHeadline, color: fg }}>{headline}</Text>
    </Section>
  );
}

/**
 * The voice block. A raised navy panel with the corner's gold rule down the
 * left — whoever is speaking is in the corner, so they get the corner's colour.
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
      {groupParagraphs(children).map((para, i) => (
        <Text key={i} style={i === 0 ? cornerText : cornerTextNext}>
          {para}
        </Text>
      ))}
    </Section>
  );
}

/**
 * One paragraph per React element child; runs of plain strings/numbers
 * (`&ldquo;{greeting}{outcome} ...&rdquo;` is four text nodes) stay together
 * as ONE paragraph instead of each landing on its own line.
 */
function groupParagraphs(children: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let run: React.ReactNode[] = [];
  const flush = () => {
    if (run.length) out.push(run.length === 1 ? run[0] : <>{run}</>);
    run = [];
  };
  React.Children.toArray(children).forEach((child) => {
    if (typeof child === 'string' || typeof child === 'number') run.push(child);
    else {
      flush();
      out.push(child);
    }
  });
  flush();
  return out;
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
                  borderLeft: i === 0 ? 'none' : `1px solid ${CB.square}`,
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
 * A cream sticker: the engraved icons are drawn on cream paper, so on the dark
 * card each one sits in a rounded cream cell and reads as a patch. Renders as
 * a table so the cream is a real bgcolor, not a CSS effect Outlook drops.
 */
export function Sticker({
  src,
  alt = '',
  width,
  height,
  href,
  pad = 6,
  radius = 16,
  align = 'left',
}: {
  src: string;
  alt?: string;
  width: number;
  height?: number;
  href?: string;
  pad?: number;
  radius?: number;
  align?: 'left' | 'center';
}) {
  const img = (
    <Img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{
        display: 'block',
        width: `${width}px`,
        height: height ? `${height}px` : 'auto',
        borderRadius: `${Math.max(radius - pad, 4)}px`,
      }}
    />
  );
  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{ margin: align === 'center' ? '0 auto' : 0 }}
    >
      <tbody>
        <tr>
          <td
            style={{
              backgroundColor: CB.cream,
              borderRadius: `${radius}px`,
              padding: `${pad}px`,
              boxShadow: `0 3px 0 0 ${CB.goldDeep}`,
              lineHeight: 0,
              fontSize: 0,
            }}
          >
            {href ? <Link href={href}>{img}</Link> : img}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/**
 * A mode on the card: engraved sticker on the left, name and one line of what
 * it is on the right. Used for PUZZLE BOXING / BOUT MODE.
 */
export function ModeRow({
  icon,
  iconWidth = 64,
  iconHeight,
  cellWidth,
  name,
  line,
  href,
  cta,
}: {
  icon: string;
  iconWidth?: number;
  /** For non-square art (the sign, the speed bag). Defaults to square. */
  iconHeight?: number;
  /** Fix the icon column so rows with different icon widths still align. */
  cellWidth?: number;
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
            <td style={{ width: `${(cellWidth ?? iconWidth) + 12 + 16}px`, verticalAlign: 'top', paddingRight: '16px' }}>
              <Sticker src={icon} width={iconWidth} height={iconHeight ?? iconWidth} href={href} />
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
  // Red: the app's rope red with navy ink on it (5.1:1) — cream on it is
  // only 3.2:1. 'ink' is the quiet button: on a navy card it is cream with
  // navy text, the inverse of the old cream-on-navy.
  const map = {
    red: { bg: CB.red, edge: CB.redDeep, fg: CB.ink },
    gold: { bg: CB.gold, edge: CB.goldDeep, fg: CB.goldInk },
    ink: { bg: CB.cream, edge: CB.text55, fg: CB.ink },
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
  border: `1px solid ${CB.square}`,
};

const header = {
  backgroundColor: CB.gym,
  padding: '26px 24px 22px',
  textAlign: 'center' as const,
};

const headerIcon = {
  borderRadius: '15px',
  display: 'block' as const,
  width: '68px',
  height: '68px',
};

const wordmark = {
  color: CB.cream,
  fontSize: '26px',
  fontWeight: 900,
  letterSpacing: '0.14em',
  lineHeight: '28px',
  margin: 0,
};

const wordmarkSub = {
  color: CB.gold,
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '0.12em',
  lineHeight: '14px',
  margin: '4px 0 0 0',
  textTransform: 'uppercase' as const,
};

const ruleBar = { height: '5px', lineHeight: '5px', fontSize: 0 };
const ruleSpacer = { margin: 0, fontSize: 0, lineHeight: 0 };

const card = {
  backgroundColor: CB.gym,
  padding: '28px 26px 26px',
};

const footer = {
  backgroundColor: CB.gymDeep,
  borderTop: `1px solid ${CB.square}`,
  padding: '18px 24px 20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: CB.text55,
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 6px 0',
};

const footerLink = {
  color: CB.creamMuted,
  textDecoration: 'underline',
};

const unsubscribeLink = {
  color: CB.text55,
  fontSize: '12px',
  textDecoration: 'underline',
};

const banner = {
  padding: '16px 18px',
  borderRadius: '12px',
  border: '1px solid',
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
  backgroundColor: CB.surface,
  borderLeft: `4px solid ${CB.gold}`,
  borderRadius: '12px',
  padding: '14px 16px',
  margin: '0 0 18px 0',
};

const cornerLabel = {
  color: CB.gold,
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
  backgroundColor: CB.surface,
  border: `1px solid ${CB.square}`,
  borderRadius: '12px',
  padding: '14px 8px 12px',
  margin: '0 0 18px 0',
};

const scoreTitle = {
  color: CB.gold,
  fontSize: '9px',
  fontWeight: 900,
  letterSpacing: '0.26em',
  lineHeight: '12px',
  margin: '0 0 10px 0',
  textAlign: 'center' as const,
};

const scoreValue = {
  color: CB.cream,
  fontSize: '28px',
  fontWeight: 900,
  lineHeight: '30px',
  margin: '0 0 3px 0',
  whiteSpace: 'nowrap' as const,
};

const scoreValueTight = { ...scoreValue, fontSize: '22px', lineHeight: '26px' };

const scoreLabel = {
  color: CB.text55,
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
  margin: '0 0 18px 0',
};

const modeName = {
  color: CB.cream,
  fontSize: '15px',
  fontWeight: 900,
  letterSpacing: '0.1em',
  lineHeight: '18px',
  margin: '2px 0 4px 0',
  textTransform: 'uppercase' as const,
};

const modeLine = {
  color: CB.text70,
  fontSize: '14px',
  lineHeight: '21px',
  margin: '0 0 6px 0',
};

const modeCta = {
  color: CB.gold,
  fontSize: '13px',
  fontWeight: 800,
  letterSpacing: '0.04em',
  textDecoration: 'none',
};

const photo = {
  borderRadius: '12px',
  display: 'block' as const,
  height: 'auto',
  maxWidth: '100%',
  width: '100%',
};

const photoCaption = {
  color: CB.text55,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  lineHeight: '15px',
  margin: '8px 0 0 0',
  textAlign: 'center' as const,
};

const cardRule = {
  borderTop: `1px dashed ${CB.square}`,
  height: '1px',
  lineHeight: '1px',
  fontSize: 0,
  margin: '4px 0 20px 0',
};

// --- text styles the templates share ------------------------------------

export const cbHeading = {
  color: CB.cream,
  fontSize: '26px',
  fontWeight: 900,
  letterSpacing: '-0.01em',
  lineHeight: '30px',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

export const cbDek = {
  color: CB.text70,
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 18px 0',
  textAlign: 'center' as const,
};

export const cbBody = {
  color: CB.text70,
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

export const cbSignoff = {
  color: CB.text55,
  fontSize: '14px',
  lineHeight: '21px',
  margin: '18px 0 0 0',
};

export const cbButtonWrap = { margin: '22px 0 6px', textAlign: 'center' as const };

export const cbFootnote = {
  color: CB.text55,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '12px 0 0 0',
  textAlign: 'center' as const,
};

export const cbLink = { color: CB.gold, textDecoration: 'underline' };

/** Small-caps section heading on the card, e.g. "WHAT ELSE IS ON THE CARD". */
export const cbSectionHeading = {
  color: CB.gold,
  fontSize: '12px',
  fontWeight: 900,
  letterSpacing: '0.26em',
  lineHeight: '15px',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

/**
 * The gold callout ("THEN COME BACK TOMORROW", the rating ask). On the dark
 * card a solid gold slab shouted; it is now a raised navy panel with a gold
 * rule down the left and the heading in gold. Same shape as CornerLine so the
 * two read as one system, told apart by who is speaking.
 */
export const cbGoldBox = {
  backgroundColor: CB.surface,
  borderLeft: `4px solid ${CB.gold}`,
  borderRadius: '12px',
  padding: '14px 16px',
  margin: '0 0 4px 0',
};

/** Body copy inside a gold callout. */
export const cbGoldBody = {
  color: CB.text70,
  fontSize: '14px',
  lineHeight: '21px',
  margin: 0,
};

/** The heading of a gold callout. */
export const cbGoldHeading = {
  color: CB.gold,
  fontSize: '14px',
  fontWeight: 900,
  letterSpacing: '0.04em',
  margin: '0 0 6px 0',
  textTransform: 'uppercase' as const,
};

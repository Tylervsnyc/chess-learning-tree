import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  unsubscribeUrl: string;
}

/**
 * Pixel-art rook icon built from colored table cells.
 * Works in all email clients (no SVG, no images to load).
 * Matches the AnimatedLogo breathing rook colors.
 */
const ROOK_GRID = [
  // Row 0: Crown points — cols 0, 2, 4
  ['#1CB0F6', null, '#2FCBEF', null, '#A560E8'],
  // Row 1: Crown rim — all 5 cols
  ['#58CC02', '#FFC800', '#FF9600', '#FF6B6B', '#FF4B4B'],
  // Row 2: Head — cols 1, 2, 3
  [null, '#1CB0F6', '#2FCBEF', '#A560E8', null],
  // Row 3: Neck — cols 1, 2, 3
  [null, '#58CC02', '#FFC800', '#FF9600', null],
  // Row 4: Body — cols 1, 2, 3
  [null, '#FF6B6B', '#FF4B4B', '#1CB0F6', null],
  // Row 5: Base — all 5 cols
  ['#2FCBEF', '#A560E8', '#58CC02', '#FFC800', '#FF9600'],
];

const CELL = 10; // px per block
const GAP = 2;   // px gap between blocks

function RookIcon() {
  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <tbody>
        {ROOK_GRID.map((row, ri) => (
          <tr key={ri}>
            {row.map((color, ci) => (
              <td
                key={ci}
                style={{
                  width: CELL,
                  height: CELL,
                  padding: GAP / 2,
                }}
              >
                {color && (
                  <div
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 2,
                      backgroundColor: color,
                    }}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** "path" with per-letter colors to approximate the brand gradient (gold → red → blue) */
function GradientPath() {
  const letters = [
    { char: 'p', color: '#FFC800' },
    { char: 'a', color: '#FF9600' },
    { char: 't', color: '#FF6B6B' },
    { char: 'h', color: '#1CB0F6' },
  ];
  return (
    <>
      {letters.map(({ char, color }) => (
        <span key={char} style={{ ...wordmarkBase, color }}>{char}</span>
      ))}
    </>
  );
}

export function EmailLayout({ preview, children, unsubscribeUrl }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header — dark to showcase the colorful rook */}
          <Section style={header}>
            <Row>
              <Column align="center">
                <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ verticalAlign: 'middle', paddingRight: 12 }}>
                        <RookIcon />
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <span style={{ ...wordmarkBase, color: '#FFFFFF' }}>chess</span>
                        <GradientPath />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Column>
            </Row>
          </Section>

          {/* Main Content — light background for readability */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you have an account at The Chess Path.
            </Text>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe from these emails
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: '#F2F4F7',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '20px 0',
};

const container = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '560px',
  overflow: 'hidden',
  border: '1px solid #E5E7EB',
};

const header = {
  backgroundColor: '#131F24',
  padding: '24px',
  textAlign: 'center' as const,
};

const wordmarkBase = {
  fontSize: '28px',
  fontWeight: 700 as const,
  letterSpacing: '-0.5px',
};

const content = {
  padding: '32px 24px',
};

const footer = {
  borderTop: '1px solid #E5E7EB',
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9CA3AF',
  fontSize: '12px',
  margin: '0 0 8px 0',
};

const unsubscribeLink = {
  color: '#9CA3AF',
  fontSize: '12px',
  textDecoration: 'underline',
};

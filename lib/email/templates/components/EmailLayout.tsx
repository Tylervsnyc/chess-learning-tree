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
import { getMatteBackground } from '@/lib/daily-rook-blocks';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  unsubscribeUrl: string;
}

const ROOK_GRID = [
  ['#1CB0F6', null, '#2FCBEF', null, '#A560E8'],
  ['#58CC02', '#FFC800', '#FF9600', '#FF6B6B', '#FF4B4B'],
  [null, '#1CB0F6', '#2FCBEF', '#A560E8', null],
  [null, '#58CC02', '#FFC800', '#FF9600', null],
  [null, '#FF6B6B', '#FF4B4B', '#1CB0F6', null],
  ['#2FCBEF', '#A560E8', '#58CC02', '#FFC800', '#FF9600'],
];

const CELL = 10;
const GAP = 2;

function RookIcon({ cellSize = CELL }: { cellSize?: number } = {}) {
  return (
    <table cellPadding="0" cellSpacing="0" role="presentation" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <tbody>
        {ROOK_GRID.map((row, ri) => (
          <tr key={ri}>
            {row.map((color, ci) => (
              <td key={ci} style={{ width: cellSize, height: cellSize, padding: GAP / 2 }}>
                {color && (
                  <div style={{ width: cellSize, height: cellSize, borderRadius: 2, backgroundColor: color, background: getMatteBackground(color) }} />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MiniRookIcon() {
  return <RookIcon cellSize={5} />;
}

export function SmallRookIcon() {
  return <RookIcon cellSize={7} />;
}

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
                        <div>
                          <span style={{ ...wordmarkBase, color: '#2A3C45' }}>chess</span>
                          <GradientPath />
                        </div>
                        <div style={{ marginTop: '2px' }}>
                          <span style={tagline}>The Fun Way To Learn Chess</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Column>
            </Row>
          </Section>

          <Section style={content}>
            {children}
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you signed up at The Chess Path.
            </Text>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: '#EEF6FC',
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
};

const header = {
  backgroundColor: '#EEF6FC',
  borderBottom: '1px solid #DCE8F0',
  padding: '20px 24px',
  textAlign: 'center' as const,
};

const wordmarkBase = {
  fontSize: '28px',
  fontWeight: 700 as const,
  letterSpacing: '-0.5px',
};

const tagline = {
  color: '#6B7C8A',
  fontSize: '10px',
  fontWeight: 500 as const,
  letterSpacing: '0.3px',
};

const content = {
  padding: '32px 24px 24px',
};

const footer = {
  borderTop: '1px solid #EEF6FC',
  padding: '16px 24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#94A3B8',
  fontSize: '12px',
  margin: '0 0 4px 0',
};

const unsubscribeLink = {
  color: '#94A3B8',
  fontSize: '12px',
  textDecoration: 'underline',
};

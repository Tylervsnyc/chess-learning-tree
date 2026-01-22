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

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  unsubscribeUrl: string;
}

export function EmailLayout({ preview, children, unsubscribeUrl }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>♟ The Chess Path</Text>
          </Section>

          {/* Main Content */}
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

// Styles matching The Chess Path dark theme
const body = {
  backgroundColor: '#0D1A1F',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '20px 0',
};

const container = {
  backgroundColor: '#131F24',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '560px',
  overflow: 'hidden',
};

const header = {
  backgroundColor: '#1A2C35',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '24px',
  textAlign: 'center' as const,
};

const logoText = {
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: 0,
};

const content = {
  padding: '32px 24px',
};

const footer = {
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6B7C85',
  fontSize: '12px',
  margin: '0 0 8px 0',
};

const unsubscribeLink = {
  color: '#6B7C85',
  fontSize: '12px',
  textDecoration: 'underline',
};

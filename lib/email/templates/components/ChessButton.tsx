import { Button } from '@react-email/components';
import * as React from 'react';

interface ChessButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'premium';
}

const STYLES: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: '#58CC02',
    borderBottom: '4px solid #46A302',
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    border: '2px solid #58CC02',
    color: '#58CC02',
  },
  premium: {
    backgroundColor: '#F59E0B',
    borderBottom: '4px solid #C2410C',
    color: '#FFFFFF',
  },
};

export function ChessButton({ href, children, variant = 'primary' }: ChessButtonProps) {
  return (
    <Button
      href={href}
      style={{
        ...STYLES[variant],
        borderRadius: '12px',
        display: 'inline-block',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '14px 32px',
        textAlign: 'center',
        textDecoration: 'none',
      }}
    >
      {children}
    </Button>
  );
}

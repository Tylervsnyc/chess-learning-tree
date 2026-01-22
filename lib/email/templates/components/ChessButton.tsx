import { Button } from '@react-email/components';
import * as React from 'react';

interface ChessButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function ChessButton({ href, children, variant = 'primary' }: ChessButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Button
      href={href}
      style={{
        backgroundColor: isPrimary ? '#58CC02' : 'transparent',
        borderRadius: '12px',
        border: isPrimary ? 'none' : '2px solid #58CC02',
        color: isPrimary ? '#131F24' : '#58CC02',
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

import type { Metadata } from 'next';
import LearnPageContent from '@/components/learn/LearnPageContent';

export const metadata: Metadata = {
  title: 'The Chess Path - The Fun Way to Learn Chess',
  description: 'The Fun Way to Learn Chess. Learn chess tactics in 15 min/day. The fastest way to stop losing and start winning.',
  keywords: ['chess tactics', 'learn chess', 'chess for beginners', 'fun way to learn chess', 'chess training'],
  openGraph: {
    title: 'The Chess Path - The Fun Way to Learn Chess',
    description: 'The Fun Way to Learn Chess. Learn chess tactics in 15 min/day. The fastest way to stop losing and start winning.',
    url: 'https://chesspath.app/path',
    siteName: 'The Chess Path',
    images: [
      {
        url: 'https://chesspath.app/api/og/default',
        width: 1200,
        height: 630,
        alt: 'The Chess Path - The Fun Way to Learn Chess',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Chess Path - The Fun Way to Learn Chess',
    description: 'The Fun Way to Learn Chess. Learn chess tactics in 15 min/day.',
    images: ['https://chesspath.app/api/og/default'],
  },
};

export default function PathPage() {
  return <LearnPageContent />;
}

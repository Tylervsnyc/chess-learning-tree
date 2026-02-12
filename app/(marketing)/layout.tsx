import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Chess Path - Beat Your Friends at Chess',
  description: 'Chess. Made Simple. Learn chess tactics in 15 min/day. The fastest way to stop losing and start winning.',
  keywords: ['chess tactics', 'learn chess', 'chess for beginners', 'beat friends at chess', 'chess training'],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

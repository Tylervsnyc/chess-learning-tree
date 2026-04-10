import { UpdateApril2026 } from '@/lib/email/templates/UpdateApril2026';

export default function EmailPreviewPage() {
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <UpdateApril2026
        displayName="Tyler"
        appUrl="https://chesspath.app"
        unsubscribeUrl="https://chesspath.app/api/email/unsubscribe?preview=1"
      />
    </div>
  );
}

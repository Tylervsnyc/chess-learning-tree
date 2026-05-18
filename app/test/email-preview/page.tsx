import { render } from '@react-email/render';
import { RookiesRunLaunch } from '@/lib/email/templates/RookiesRunLaunch';

export default async function EmailPreviewPage() {
  const html = await render(
    RookiesRunLaunch({
      displayName: 'Tyler',
      appUrl: 'https://chesspath.app',
      unsubscribeUrl: 'https://chesspath.app/api/email/unsubscribe?preview=1',
      imageBase: '',
    }),
  );

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <iframe
        srcDoc={html}
        style={{ width: '100%', height: '100%', border: 0 }}
        title="Email preview"
      />
    </div>
  );
}

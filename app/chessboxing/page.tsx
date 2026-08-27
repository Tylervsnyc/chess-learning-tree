import { render } from '@react-email/render';
import { BoxingLaunchParty } from '@/lib/email/templates/BoxingLaunchParty';

/**
 * /chessboxing — the launch announcement as a shareable page.
 *
 * It renders the SAME component the celebration email sends
 * (lib/email/templates/BoxingLaunchParty), so the two can never drift: edit
 * the email and this follows. Only two things differ, both because a link
 * someone was handed is not an inbox — the unsubscribe footer becomes a
 * credit line, and the CTAs carry a share campaign rather than an email one.
 *
 * Static: nothing here is per-request.
 */

export const dynamic = 'force-static';

const APP_URL = 'https://chesspath.app';

/** Pull the <body> contents out; the App Router owns the document. */
function bodyOf(html: string): string {
  const body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
  return body.slice(body.indexOf('>') + 1);
}

export default async function ChessBoxingPage() {
  const email = await render(
    BoxingLaunchParty({ appUrl: APP_URL, unsubscribeUrl: `${APP_URL}/chessboxing` }),
  );

  const html = bodyOf(email)
    // No mailing list involved when someone taps a link in a group chat.
    .replace(
      /You get this because you have an account at Chess Path\. Chess Boxing is\s*the same account\./,
      'Made by Tyler at Chess Path. Photographed at Gleason&#x27;s Gym, Brooklyn.',
    )
    .replace(/<a[^>]*>Stop these emails<\/a>/, '')
    // Tell shared-link traffic apart from email traffic in the daily report.
    .replace(/utm_medium=celebration&amp;utm_campaign=cb_launch_party/g,
             'utm_medium=share&amp;utm_campaign=cb_launch_page');

  return (
    // globals.css sets `overflow: hidden` on body (pages own their scrolling),
    // so this wrapper has to BE the scroll container — minHeight would just
    // grow and leave everything below the fold unreachable.
    <div
      style={{ background: '#0b101e', height: '100dvh', overflowY: 'auto' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

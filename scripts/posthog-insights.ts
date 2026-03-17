#!/usr/bin/env npx tsx
/**
 * PostHog UX Insights Script
 *
 * Queries PostHog for UI/UX data and outputs actionable insights,
 * improvement suggestions, and A/B test ideas.
 *
 * Usage: npx tsx scripts/posthog-insights.ts [--days=7] [--json] [--post-linear]
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

if (!API_KEY || !PROJECT_ID) {
  console.error('Missing POSTHOG_PERSONAL_API_KEY or POSTHOG_PROJECT_ID in .env.local');
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
const days = parseInt(args.find(a => a.startsWith('--days='))?.split('=')[1] || '7');
const jsonOutput = args.includes('--json');
const postLinear = args.includes('--post-linear');
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_TEAM_ID = '54251f1e-c50a-49ee-8b04-974acf6ffb10';

interface QueryResult {
  results: unknown[][];
  columns: string[];
}

async function hogql(query: string): Promise<QueryResult> {
  const res = await fetch(`${HOST}/api/projects/${PROJECT_ID}/query/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PostHog API error ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
}

// ============================================
// QUERIES
// ============================================

async function getEventCounts() {
  const data = await hogql(`
    SELECT event, count() as cnt
    FROM events
    WHERE timestamp > now() - interval ${days} day
    GROUP BY event ORDER BY cnt DESC LIMIT 30
  `);
  return data.results.map(r => ({ event: r[0] as string, count: r[1] as number }));
}

async function getTopPages() {
  const data = await hogql(`
    SELECT properties."$current_url" as url, count() as cnt
    FROM events
    WHERE event = '$pageview' AND timestamp > now() - interval ${days} day
      AND properties."$current_url" NOT LIKE '%localhost%'
    GROUP BY url ORDER BY cnt DESC LIMIT 25
  `);
  return data.results.map(r => ({ url: r[0] as string, views: r[1] as number }));
}

async function getPageLeaves() {
  const data = await hogql(`
    SELECT properties."$current_url" as url, count() as cnt
    FROM events
    WHERE event = '$pageleave' AND timestamp > now() - interval ${days} day
      AND properties."$current_url" NOT LIKE '%localhost%'
    GROUP BY url ORDER BY cnt DESC LIMIT 25
  `);
  return data.results.map(r => ({ url: r[0] as string, leaves: r[1] as number }));
}

async function getRageClicks() {
  const data = await hogql(`
    SELECT
      properties."$el_text" as element,
      properties."$current_url" as url,
      count() as cnt
    FROM events
    WHERE event = '$rageclick' AND timestamp > now() - interval ${days} day
      AND properties."$current_url" NOT LIKE '%localhost%'
    GROUP BY element, url ORDER BY cnt DESC LIMIT 20
  `);
  return data.results.map(r => ({
    element: r[0] as string | null,
    url: r[1] as string,
    count: r[2] as number,
  }));
}

async function getSignupFunnel() {
  const data = await hogql(`
    SELECT event, count() as cnt
    FROM events
    WHERE event IN ('signup_page_viewed', 'signup_started', 'signup_completed', 'signup_failed')
      AND timestamp > now() - interval ${days} day
    GROUP BY event ORDER BY cnt DESC
  `);
  return Object.fromEntries(data.results.map(r => [r[0], r[1]]));
}

async function getLessonFunnel() {
  const data = await hogql(`
    SELECT event, count() as cnt
    FROM events
    WHERE event IN ('lesson_started', 'lesson_completed', 'lesson_abandoned')
      AND timestamp > now() - interval ${days} day
    GROUP BY event ORDER BY cnt DESC
  `);
  return Object.fromEntries(data.results.map(r => [r[0], r[1]]));
}

async function getSubscriptionFunnel() {
  const data = await hogql(`
    SELECT event, count() as cnt
    FROM events
    WHERE event IN ('paywall_viewed', 'pricing_viewed', 'checkout_started', 'checkout_completed', 'checkout_abandoned')
      AND timestamp > now() - interval ${days} day
    GROUP BY event ORDER BY cnt DESC
  `);
  return Object.fromEntries(data.results.map(r => [r[0], r[1]]));
}

async function getBounceRate() {
  const data = await hogql(`
    SELECT
      properties."$current_url" as url,
      count() as pageviews,
      countIf(properties."$prev_pageview_last_scroll_percentage" = 0 OR properties."$prev_pageview_last_scroll_percentage" IS NULL) as no_scroll
    FROM events
    WHERE event = '$pageview' AND timestamp > now() - interval ${days} day
      AND properties."$current_url" NOT LIKE '%localhost%'
    GROUP BY url
    HAVING pageviews >= 5
    ORDER BY pageviews DESC LIMIT 15
  `);
  return data.results.map(r => ({
    url: r[0] as string,
    pageviews: r[1] as number,
    noScroll: r[2] as number,
    bounceRate: Math.round(((r[2] as number) / (r[1] as number)) * 100),
  }));
}

async function getDeviceBreakdown() {
  const data = await hogql(`
    SELECT properties."$device_type" as device, count() as cnt
    FROM events
    WHERE event = '$pageview' AND timestamp > now() - interval ${days} day
      AND properties."$current_url" NOT LIKE '%localhost%'
    GROUP BY device ORDER BY cnt DESC
  `);
  return data.results.map(r => ({ device: r[0] as string, count: r[1] as number }));
}

async function getAutocaptureHotspots() {
  const data = await hogql(`
    SELECT
      properties."$el_text" as element,
      properties."$current_url" as url,
      count() as clicks
    FROM events
    WHERE event = '$autocapture' AND timestamp > now() - interval ${days} day
      AND properties."$current_url" NOT LIKE '%localhost%'
      AND properties."$el_text" IS NOT NULL
      AND properties."$el_text" != ''
    GROUP BY element, url ORDER BY clicks DESC LIMIT 25
  `);
  return data.results.map(r => ({
    element: r[0] as string,
    url: r[1] as string,
    clicks: r[2] as number,
  }));
}

async function getDailyChallengeFunnel() {
  const data = await hogql(`
    SELECT event, count() as cnt
    FROM events
    WHERE event IN ('daily_challenge_viewed', 'daily_challenge_started', 'daily_challenge_completed')
      AND timestamp > now() - interval ${days} day
    GROUP BY event ORDER BY cnt DESC
  `);
  return Object.fromEntries(data.results.map(r => [r[0], r[1]]));
}

async function getTutorialFunnel() {
  const data = await hogql(`
    SELECT event, count() as cnt
    FROM events
    WHERE event IN ('tutorial_started', 'tutorial_step_completed', 'tutorial_completed', 'tutorial_skipped')
      AND timestamp > now() - interval ${days} day
    GROUP BY event ORDER BY cnt DESC
  `);
  return Object.fromEntries(data.results.map(r => [r[0], r[1]]));
}

// ============================================
// ANALYSIS
// ============================================

interface Insight {
  category: 'ux_issue' | 'drop_off' | 'opportunity' | 'positive';
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  suggestion: string;
}

interface ABTest {
  name: string;
  hypothesis: string;
  variants: string[];
  metric: string;
  priority: 'high' | 'medium' | 'low';
}

function analyzeData(data: {
  events: { event: string; count: number }[];
  topPages: { url: string; views: number }[];
  pageLeaves: { url: string; leaves: number }[];
  rageClicks: { element: string | null; url: string; count: number }[];
  signupFunnel: Record<string, number>;
  lessonFunnel: Record<string, number>;
  subscriptionFunnel: Record<string, number>;
  bounceRate: { url: string; pageviews: number; noScroll: number; bounceRate: number }[];
  devices: { device: string; count: number }[];
  autocapture: { element: string; url: string; clicks: number }[];
  dailyChallenge: Record<string, number>;
  tutorial: Record<string, number>;
}) {
  const insights: Insight[] = [];
  const abTests: ABTest[] = [];

  // --- Rage Click Analysis ---
  if (data.rageClicks.length > 0) {
    const totalRage = data.rageClicks.reduce((sum, r) => sum + r.count, 0);
    const topRage = data.rageClicks[0];
    insights.push({
      category: 'ux_issue',
      severity: totalRage > 15 ? 'high' : totalRage > 5 ? 'medium' : 'low',
      title: `${totalRage} rage clicks detected`,
      detail: `Most frustration on: ${topRage.url} (element: "${topRage.element || 'unknown'}", ${topRage.count} rage clicks)`,
      suggestion: 'Investigate unresponsive buttons/links. Add loading states, increase tap targets, or fix broken interactions.',
    });

    // Auth page rage clicks
    const authRage = data.rageClicks.filter(r => r.url.includes('/auth/'));
    if (authRage.length > 0) {
      const authRageTotal = authRage.reduce((sum, r) => sum + r.count, 0);
      insights.push({
        category: 'ux_issue',
        severity: 'high',
        title: `${authRageTotal} rage clicks on auth pages`,
        detail: `Users are frustrated on signup/login: ${authRage.map(r => `${r.url} (${r.count})`).join(', ')}`,
        suggestion: 'Review auth forms for slow responses, unclear errors, or confusing fields. Consider simplifying to email-only or adding OAuth.',
      });

      abTests.push({
        name: 'Simplified Auth Flow',
        hypothesis: 'Reducing signup form friction will increase conversion',
        variants: ['Current form', 'Email-only signup (no password initially)', 'Social auth (Google) prominent'],
        metric: 'signup_completed rate',
        priority: 'high',
      });
    }
  }

  // --- Signup Funnel ---
  const signupViewed = (data.signupFunnel['signup_page_viewed'] as number) || 0;
  const signupStarted = (data.signupFunnel['signup_started'] as number) || 0;
  const signupCompleted = (data.signupFunnel['signup_completed'] as number) || 0;

  if (signupViewed > 0) {
    const startRate = Math.round((signupStarted / signupViewed) * 100);
    const completionRate = signupStarted > 0 ? Math.round((signupCompleted / signupStarted) * 100) : 0;

    if (startRate < 50) {
      insights.push({
        category: 'drop_off',
        severity: 'high',
        title: `Only ${startRate}% of signup viewers start signing up`,
        detail: `${signupViewed} viewed → ${signupStarted} started → ${signupCompleted} completed`,
        suggestion: 'The signup page may be intimidating. Consider showing value prop, reducing required fields, or allowing guest trial first.',
      });
    }

    if (completionRate < 50 && signupStarted > 3) {
      insights.push({
        category: 'drop_off',
        severity: 'high',
        title: `Only ${completionRate}% of signups complete`,
        detail: `${signupStarted} started but only ${signupCompleted} finished. ${(data.signupFunnel['signup_failed'] as number) || 0} failed attempts.`,
        suggestion: 'Check for form validation issues, slow responses, or confusing error messages.',
      });
    }

    abTests.push({
      name: 'Signup Page Value Prop',
      hypothesis: 'Showing chess improvement stats on signup page increases conversion',
      variants: ['Current signup page', 'Signup with testimonials/stats', 'Signup with free lesson preview'],
      metric: 'signup_completed / signup_page_viewed',
      priority: signupViewed > 30 ? 'high' : 'medium',
    });
  }

  // --- Lesson Funnel ---
  const lessonStarted = (data.lessonFunnel['lesson_started'] as number) || 0;
  const lessonCompleted = (data.lessonFunnel['lesson_completed'] as number) || 0;
  const lessonAbandoned = (data.lessonFunnel['lesson_abandoned'] as number) || 0;

  if (lessonStarted > 0) {
    const completionRate = Math.round((lessonCompleted / lessonStarted) * 100);
    const abandonRate = Math.round((lessonAbandoned / lessonStarted) * 100);

    if (completionRate >= 70) {
      insights.push({
        category: 'positive',
        severity: 'low',
        title: `${completionRate}% lesson completion rate`,
        detail: `${lessonStarted} started, ${lessonCompleted} completed, ${lessonAbandoned} abandoned`,
        suggestion: 'Strong completion rate. Consider adding post-lesson engagement hooks (share, next lesson CTA).',
      });
    } else if (completionRate < 50) {
      insights.push({
        category: 'drop_off',
        severity: 'high',
        title: `Only ${completionRate}% lesson completion (${abandonRate}% abandon)`,
        detail: `${lessonStarted} started, ${lessonCompleted} completed, ${lessonAbandoned} abandoned`,
        suggestion: 'Lessons may be too long or hard. Consider shorter lessons, better hints, or difficulty adjustment.',
      });

      abTests.push({
        name: 'Lesson Length/Difficulty',
        hypothesis: 'Shorter lessons or adaptive difficulty improves completion',
        variants: ['Current lessons', 'Fewer puzzles per lesson', 'Adaptive hint system'],
        metric: 'lesson_completed / lesson_started',
        priority: 'high',
      });
    } else {
      insights.push({
        category: 'opportunity',
        severity: 'medium',
        title: `${completionRate}% lesson completion rate`,
        detail: `${lessonStarted} started, ${lessonCompleted} completed, ${lessonAbandoned} abandoned`,
        suggestion: 'Room to improve. Analyze which specific lessons have the worst drop-off.',
      });
    }
  }

  // --- Subscription Funnel ---
  const paywallViewed = (data.subscriptionFunnel['paywall_viewed'] as number) || 0;
  const pricingViewed = (data.subscriptionFunnel['pricing_viewed'] as number) || 0;
  const checkoutStarted = (data.subscriptionFunnel['checkout_started'] as number) || 0;
  const checkoutCompleted = (data.subscriptionFunnel['checkout_completed'] as number) || 0;

  if (paywallViewed + pricingViewed > 0) {
    const totalTop = paywallViewed + pricingViewed;
    const startRate = totalTop > 0 ? Math.round((checkoutStarted / totalTop) * 100) : 0;

    insights.push({
      category: checkoutCompleted > 0 ? 'opportunity' : 'drop_off',
      severity: checkoutStarted === 0 ? 'high' : 'medium',
      title: `Subscription funnel: ${totalTop} viewed → ${checkoutStarted} started → ${checkoutCompleted} completed`,
      detail: `${startRate}% proceed to checkout from paywall/pricing.`,
      suggestion: checkoutStarted === 0
        ? 'No one is starting checkout. Review pricing page clarity, add social proof, or test different price points.'
        : 'Optimize pricing page with testimonials, comparison table, or limited-time offer.',
    });

    abTests.push({
      name: 'Pricing Page Optimization',
      hypothesis: 'Social proof and urgency increase checkout conversion',
      variants: ['Current pricing', 'Pricing with user testimonials', 'Pricing with "X users joined this week"'],
      metric: 'checkout_completed / pricing_viewed',
      priority: 'high',
    });
  }

  // --- Daily Challenge Funnel ---
  const dcViewed = (data.dailyChallenge['daily_challenge_viewed'] as number) || 0;
  const dcStarted = (data.dailyChallenge['daily_challenge_started'] as number) || 0;
  const dcCompleted = (data.dailyChallenge['daily_challenge_completed'] as number) || 0;

  if (dcViewed > 0) {
    const startRate = Math.round((dcStarted / dcViewed) * 100);
    if (startRate < 50) {
      insights.push({
        category: 'drop_off',
        severity: 'medium',
        title: `Only ${startRate}% of daily challenge viewers start playing`,
        detail: `${dcViewed} viewed → ${dcStarted} started → ${dcCompleted} completed`,
        suggestion: 'The daily challenge page may need a stronger CTA or auto-start behavior.',
      });
    }
  }

  // --- Tutorial Analysis ---
  const tutStarted = (data.tutorial['tutorial_started'] as number) || 0;
  const tutCompleted = (data.tutorial['tutorial_completed'] as number) || 0;
  const tutSkipped = (data.tutorial['tutorial_skipped'] as number) || 0;

  if (tutStarted > 0 && tutSkipped > 0) {
    const skipRate = Math.round((tutSkipped / tutStarted) * 100);
    if (skipRate > 30) {
      insights.push({
        category: 'ux_issue',
        severity: 'medium',
        title: `${skipRate}% tutorial skip rate`,
        detail: `${tutStarted} started, ${tutCompleted} completed, ${tutSkipped} skipped`,
        suggestion: 'Tutorial may be too long or boring. Consider making it shorter, more interactive, or optional.',
      });
    }
  }

  // --- Page Bounce/Leave Analysis ---
  for (const page of data.topPages.slice(0, 10)) {
    const leave = data.pageLeaves.find(l => l.url === page.url);
    if (leave) {
      const leaveRate = Math.round((leave.leaves / page.views) * 100);
      if (leaveRate > 60 && page.views > 10) {
        const pageName = new URL(page.url).pathname;
        insights.push({
          category: 'drop_off',
          severity: leaveRate > 80 ? 'high' : 'medium',
          title: `${leaveRate}% leave rate on ${pageName}`,
          detail: `${page.views} views, ${leave.leaves} leaves`,
          suggestion: `High exit rate on ${pageName}. Check if users find what they need or get confused.`,
        });
      }
    }
  }

  // --- Device Analysis ---
  const totalDeviceViews = data.devices.reduce((sum, d) => sum + d.count, 0);
  const mobileShare = data.devices
    .filter(d => d.device === 'Mobile')
    .reduce((sum, d) => sum + d.count, 0);
  const mobilePercent = totalDeviceViews > 0 ? Math.round((mobileShare / totalDeviceViews) * 100) : 0;

  if (mobilePercent > 50) {
    insights.push({
      category: 'opportunity',
      severity: 'medium',
      title: `${mobilePercent}% mobile traffic`,
      detail: `Device breakdown: ${data.devices.map(d => `${d.device}: ${d.count}`).join(', ')}`,
      suggestion: 'Majority mobile audience. Prioritize mobile UX testing and consider PWA improvements.',
    });
  }

  // --- Engagement Gaps ---
  const shareClicked = data.events.find(e => e.event === 'share_clicked')?.count || 0;
  const shareCompleted = data.events.find(e => e.event === 'share_completed')?.count || 0;
  if (lessonCompleted > 0 && shareClicked === 0) {
    insights.push({
      category: 'opportunity',
      severity: 'medium',
      title: 'No share activity despite lesson completions',
      detail: `${lessonCompleted} lessons completed but ${shareClicked} shares clicked`,
      suggestion: 'Make share prompt more prominent after lesson completion. Consider auto-showing share card.',
    });
  } else if (shareClicked > 0 && shareCompleted === 0) {
    insights.push({
      category: 'ux_issue',
      severity: 'medium',
      title: 'Share clicks but no completions',
      detail: `${shareClicked} share clicks, ${shareCompleted} completions`,
      suggestion: 'Share flow may be broken or confusing. Test the share flow on mobile.',
    });
  }

  // --- General A/B Tests ---
  abTests.push({
    name: 'Landing Page CTA',
    hypothesis: 'A more specific CTA increases lesson starts from homepage',
    variants: ['Current CTA', '"Try a Free Puzzle"', '"Start Your First Lesson"'],
    metric: 'lesson_started from homepage visitors',
    priority: 'medium',
  });

  if (lessonCompleted > 10) {
    abTests.push({
      name: 'Post-Lesson Upsell',
      hypothesis: 'Showing premium features after lesson completion increases conversions',
      variants: ['No upsell', 'Soft upsell banner', 'Full-screen premium preview'],
      metric: 'pricing_viewed from lesson_completed users',
      priority: 'medium',
    });
  }

  return { insights, abTests };
}

// ============================================
// LINEAR
// ============================================

async function postToLinear(title: string, content: string) {
  if (!LINEAR_API_KEY) {
    console.warn('Missing LINEAR_API_KEY — skipping Linear post');
    return null;
  }
  const res = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: LINEAR_API_KEY },
    body: JSON.stringify({
      query: 'mutation($input: DocumentCreateInput!) { documentCreate(input: $input) { success document { id url } } }',
      variables: { input: { title, content, teamId: LINEAR_TEAM_ID } },
    }),
  });
  if (!res.ok) throw new Error('Linear API error ' + res.status);
  const data = await res.json();
  if (data.errors) throw new Error('Linear: ' + JSON.stringify(data.errors));
  return data.data.documentCreate.document;
}

function buildMarkdown(
  topPages: { url: string; views: number }[],
  devices: { device: string; count: number }[],
  rageClicks: { element: string | null; url: string; count: number }[],
  signupFunnel: Record<string, number>,
  lessonFunnel: Record<string, number>,
  subscriptionFunnel: Record<string, number>,
  dailyChallenge: Record<string, number>,
  tutorial: Record<string, number>,
  insights: Insight[],
  abTests: ABTest[],
): string {
  const today = new Date().toISOString().slice(0, 10);
  let md = `# UX Insights -- ${today}\n\n*Last ${days} days*\n\n`;

  md += `## Funnels\n\n`;
  md += `| Funnel | Flow |\n|--------|------|\n`;
  md += `| Signup | ${signupFunnel['signup_page_viewed'] || 0} viewed -> ${signupFunnel['signup_started'] || 0} started -> ${signupFunnel['signup_completed'] || 0} completed |\n`;
  md += `| Lessons | ${lessonFunnel['lesson_started'] || 0} started -> ${lessonFunnel['lesson_completed'] || 0} completed (${lessonFunnel['lesson_abandoned'] || 0} abandoned) |\n`;
  md += `| Subscription | ${subscriptionFunnel['paywall_viewed'] || 0} paywall -> ${subscriptionFunnel['pricing_viewed'] || 0} pricing -> ${subscriptionFunnel['checkout_started'] || 0} checkout -> ${subscriptionFunnel['checkout_completed'] || 0} paid |\n`;
  md += `| Daily Challenge | ${dailyChallenge['daily_challenge_viewed'] || 0} viewed -> ${dailyChallenge['daily_challenge_started'] || 0} started -> ${dailyChallenge['daily_challenge_completed'] || 0} completed |\n`;
  md += `| Tutorial | ${tutorial['tutorial_started'] || 0} started -> ${tutorial['tutorial_completed'] || 0} completed (${tutorial['tutorial_skipped'] || 0} skipped) |\n\n`;

  md += `## Devices\n\n| Device | Count |\n|--------|-------|\n`;
  devices.forEach(d => { md += `| ${d.device || 'Unknown'} | ${d.count} |\n`; });

  md += `\n## Top Pages\n\n| Page | Views |\n|------|-------|\n`;
  topPages.slice(0, 10).forEach(p => {
    try {
      const path = new URL(p.url).pathname + (new URL(p.url).search || '');
      md += `| ${path} | ${p.views} |\n`;
    } catch { /* skip bad URLs */ }
  });

  if (rageClicks.length > 0) {
    md += `\n## Rage Clicks\n\n| Element | Page | Count |\n|---------|------|-------|\n`;
    rageClicks.slice(0, 8).forEach(r => {
      try {
        const path = new URL(r.url).pathname;
        md += `| ${r.element || '(no text)'} | ${path} | ${r.count} |\n`;
      } catch { /* skip */ }
    });
  }

  md += `\n## Insights\n\n`;
  insights.forEach(i => {
    const sev = { high: 'HIGH', medium: 'MED', low: 'LOW' }[i.severity];
    md += `**[${sev}] ${i.title}**\n${i.detail}\n*${i.suggestion}*\n\n`;
  });

  md += `## A/B Test Ideas\n\n`;
  abTests.forEach((t, idx) => {
    md += `${idx + 1}. **${t.name}** [${t.priority.toUpperCase()}]\n`;
    md += `   Hypothesis: ${t.hypothesis}\n`;
    md += `   Variants: ${t.variants.join(' | ')}\n`;
    md += `   Measure: ${t.metric}\n\n`;
  });

  md += `---\n*Generated by scripts/posthog-insights.ts*`;
  return md;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log(`\n📊 PostHog UX Insights — Last ${days} days\n`);
  console.log('Fetching data...\n');

  const [
    events, topPages, pageLeaves, rageClicks,
    signupFunnel, lessonFunnel, subscriptionFunnel,
    bounceRate, devices, autocapture,
    dailyChallenge, tutorial,
  ] = await Promise.all([
    getEventCounts(),
    getTopPages(),
    getPageLeaves(),
    getRageClicks(),
    getSignupFunnel(),
    getLessonFunnel(),
    getSubscriptionFunnel(),
    getBounceRate(),
    getDeviceBreakdown(),
    getAutocaptureHotspots(),
    getDailyChallengeFunnel(),
    getTutorialFunnel(),
  ]);

  const rawData = {
    events, topPages, pageLeaves, rageClicks,
    signupFunnel, lessonFunnel, subscriptionFunnel,
    bounceRate, devices, autocapture,
    dailyChallenge, tutorial,
  };

  const { insights, abTests } = analyzeData(rawData);

  if (jsonOutput) {
    console.log(JSON.stringify({ rawData, insights, abTests }, null, 2));
    return;
  }

  // --- Print Report ---

  // Raw numbers summary
  console.log('═══════════════════════════════════════');
  console.log('  RAW DATA SUMMARY');
  console.log('═══════════════════════════════════════\n');

  console.log('Top Events:');
  events.slice(0, 15).forEach(e => {
    console.log(`  ${e.event.padEnd(30)} ${e.count}`);
  });

  console.log('\nTop Pages:');
  topPages.slice(0, 10).forEach(p => {
    const path = new URL(p.url).pathname + (new URL(p.url).search || '');
    console.log(`  ${path.padEnd(40)} ${p.views} views`);
  });

  console.log('\nDevices:');
  devices.forEach(d => console.log(`  ${(d.device || 'Unknown').padEnd(15)} ${d.count}`));

  console.log('\nFunnels:');
  console.log(`  Signup:       ${signupFunnel['signup_page_viewed'] || 0} viewed → ${signupFunnel['signup_started'] || 0} started → ${signupFunnel['signup_completed'] || 0} completed`);
  console.log(`  Lessons:      ${lessonFunnel['lesson_started'] || 0} started → ${lessonFunnel['lesson_completed'] || 0} completed (${lessonFunnel['lesson_abandoned'] || 0} abandoned)`);
  console.log(`  Subscription: ${subscriptionFunnel['paywall_viewed'] || 0} paywall → ${subscriptionFunnel['pricing_viewed'] || 0} pricing → ${subscriptionFunnel['checkout_started'] || 0} checkout → ${subscriptionFunnel['checkout_completed'] || 0} paid`);
  console.log(`  Daily:        ${dailyChallenge['daily_challenge_viewed'] || 0} viewed → ${dailyChallenge['daily_challenge_started'] || 0} started → ${dailyChallenge['daily_challenge_completed'] || 0} completed`);
  console.log(`  Tutorial:     ${tutorial['tutorial_started'] || 0} started → ${tutorial['tutorial_completed'] || 0} completed (${tutorial['tutorial_skipped'] || 0} skipped)`);

  if (rageClicks.length > 0) {
    console.log('\nRage Clicks (frustration):');
    rageClicks.slice(0, 8).forEach(r => {
      const path = new URL(r.url).pathname;
      console.log(`  "${r.element || '(no text)'}" on ${path} — ${r.count}x`);
    });
  }

  // Insights
  console.log('\n\n═══════════════════════════════════════');
  console.log('  UX INSIGHTS & SUGGESTIONS');
  console.log('═══════════════════════════════════════\n');

  const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const sorted = insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  sorted.forEach(insight => {
    const icon = { ux_issue: '🔴', drop_off: '🟡', opportunity: '🔵', positive: '🟢' }[insight.category];
    const sev = { high: 'HIGH', medium: 'MED', low: 'LOW' }[insight.severity];
    console.log(`${icon} [${sev}] ${insight.title}`);
    console.log(`   ${insight.detail}`);
    console.log(`   → ${insight.suggestion}`);
    console.log('');
  });

  // A/B Tests
  console.log('═══════════════════════════════════════');
  console.log('  SUGGESTED A/B TESTS');
  console.log('═══════════════════════════════════════\n');

  const sortedTests = abTests.sort((a, b) => severityOrder[a.priority] - severityOrder[b.priority]);
  sortedTests.forEach((test, i) => {
    console.log(`${i + 1}. ${test.name} [${test.priority.toUpperCase()}]`);
    console.log(`   Hypothesis: ${test.hypothesis}`);
    console.log(`   Variants: ${test.variants.join(' | ')}`);
    console.log(`   Measure: ${test.metric}`);
    console.log('');
  });

  // --- Post to Linear ---
  if (postLinear) {
    const md = buildMarkdown(topPages, devices, rageClicks, signupFunnel, lessonFunnel, subscriptionFunnel, dailyChallenge, tutorial, sorted, sortedTests);
    console.log('Posting UX Insights to Linear...');
    const doc = await postToLinear(`UX Insights -- ${new Date().toISOString().slice(0, 10)}`, md);
    if (doc) console.log(`Posted: ${doc.url}`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

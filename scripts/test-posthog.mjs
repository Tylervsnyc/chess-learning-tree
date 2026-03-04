import 'dotenv/config';

const k = process.env.POSTHOG_PERSONAL_API_KEY;
const pid = process.env.POSTHOG_PROJECT_ID;
console.log('Key:', k?.slice(0,8) + '...' + k?.slice(-4), 'Project:', pid);

const r = await fetch(`https://us.posthog.com/api/projects/${pid}/query/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${k}` },
  body: JSON.stringify({ query: { kind: 'HogQLQuery', query: 'SELECT count() FROM events LIMIT 1' } })
});
console.log('Status:', r.status);
const t = await r.text();
console.log(t.slice(0, 500));

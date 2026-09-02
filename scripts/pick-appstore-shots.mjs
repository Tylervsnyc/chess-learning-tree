/**
 * Local picker for Chess Path App Store screenshots.
 *
 * Serves out/appstore-chesspath/raw/ as a click-to-order gallery on :4174.
 * "Upload" POSTs the ordered picks; this server then replaces BOTH screenshot
 * sets (iPhone 6.9" + iPad 13") on the Chess Path 1.0 en-US listing via the
 * App Store Connect API. iPad frames are the same phone shots centered on a
 * page-blue canvas (2064x2752) — Apple accepts that for phone-layout apps.
 *
 * Usage: node scripts/pick-appstore-shots.mjs   (then open http://localhost:4174)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createPrivateKey, sign, createHash } from 'node:crypto';
import sharp from 'sharp';

const RAW = path.resolve('out/appstore-chesspath/raw');
const PORT = 4174;
const KEY_ID = '767R5DY9P3';
const ISS = 'ec78424a-d56e-4da4-ace6-cc4e91f8bb49';
const KEY_FILE = path.join(process.env.HOME, 'Downloads/AuthKey_767R5DY9P3.p8');
const VERSION_ID = 'a7bfda7b-f80f-497d-8443-427041b79616'; // Chess Path App 1.0
const SETS = { iphone: 'APP_IPHONE_67', ipad: 'APP_IPAD_PRO_3GEN_129' };

function jwt() {
  const key = createPrivateKey(fs.readFileSync(KEY_FILE));
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const h = b64({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' });
  const p = b64({ iss: ISS, iat: now, exp: now + 1200, aud: 'appstoreconnect-v1' });
  const s = sign('sha256', Buffer.from(h + '.' + p), { key, dsaEncoding: 'ieee-p1363' }).toString('base64url');
  return `${h}.${p}.${s}`;
}

async function upload(files, log) {
  const H = { Authorization: 'Bearer ' + jwt(), 'Content-Type': 'application/json' };
  const api = async (method, p, body) => {
    const r = await fetch('https://api.appstoreconnect.apple.com/v1' + p, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
    const t = await r.text();
    let j; try { j = JSON.parse(t); } catch { j = { raw: t }; }
    if (r.status >= 300) throw new Error(`${method} ${p} ${r.status} ${JSON.stringify(j.errors || j).slice(0, 300)}`);
    return j;
  };
  const vl = (await api('GET', `/appStoreVersions/${VERSION_ID}/appStoreVersionLocalizations`)).data.find((l) => l.attributes.locale === 'en-US');
  const existing = (await api('GET', `/appStoreVersionLocalizations/${vl.id}/appScreenshotSets`)).data;

  for (const [dir, type] of Object.entries(SETS)) {
    let set = existing.find((s) => s.attributes.screenshotDisplayType === type);
    if (!set) set = (await api('POST', '/appScreenshotSets', { data: { type: 'appScreenshotSets', attributes: { screenshotDisplayType: type }, relationships: { appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: vl.id } } } } })).data;
    const old = (await api('GET', `/appScreenshotSets/${set.id}/appScreenshots`)).data;
    for (const o of old) await api('DELETE', `/appScreenshots/${o.id}`);
    log(`${dir}: cleared ${old.length} old`);

    const ids = [];
    for (const [i, f] of files.entries()) {
      let buf = fs.readFileSync(path.join(RAW, f));
      if (dir === 'ipad') {
        const inner = await sharp(buf).resize({ height: 2640 }).toBuffer();
        buf = await sharp({ create: { width: 2064, height: 2752, channels: 3, background: '#eef6fc' } })
          .composite([{ input: inner, gravity: 'center' }]).png().toBuffer();
      }
      const name = `${String(i + 1).padStart(2, '0')}-${f}`;
      const res = (await api('POST', '/appScreenshots', { data: { type: 'appScreenshots', attributes: { fileName: name, fileSize: buf.length }, relationships: { appScreenshotSet: { data: { type: 'appScreenshotSets', id: set.id } } } } })).data;
      for (const op of res.attributes.uploadOperations) {
        const hd = {}; for (const x of op.requestHeaders) hd[x.name] = x.value;
        const r = await fetch(op.url, { method: op.method, headers: hd, body: buf.subarray(op.offset, op.offset + op.length) });
        if (!r.ok) throw new Error('chunk upload ' + r.status);
      }
      await api('PATCH', `/appScreenshots/${res.id}`, { data: { type: 'appScreenshots', id: res.id, attributes: { uploaded: true, sourceFileChecksum: createHash('md5').update(buf).digest('hex') } } });
      ids.push(res.id);
      log(`${dir}: uploaded ${name}`);
    }
    await api('PATCH', `/appScreenshotSets/${set.id}/relationships/appScreenshots`, { data: ids.map((id) => ({ type: 'appScreenshots', id })) });
  }
  await new Promise((r) => setTimeout(r, 15000));
  for (const s of (await api('GET', `/appStoreVersionLocalizations/${vl.id}/appScreenshotSets`)).data) {
    const sh = (await api('GET', `/appScreenshotSets/${s.id}/appScreenshots`)).data;
    log(`${s.attributes.screenshotDisplayType}: ` + sh.map((x) => `${x.attributes.fileName} ${x.attributes.assetDeliveryState?.state}`).join(', '));
  }
}

function page() {
  const files = fs.readdirSync(RAW).filter((f) => /^\d+-.*\.png$/.test(f)).sort();
  return `<!doctype html><title>Pick Chess Path screenshots</title>
<style>
body{font-family:-apple-system,sans-serif;background:#eef6fc;margin:0;color:#101a33}
header{position:sticky;top:0;background:#fff;padding:14px 20px;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;gap:16px;align-items:center;z-index:2}
header b{font-size:16px}#count{color:#555}
button{background:#58cc02;color:#fff;border:0;border-radius:10px;padding:12px 18px;font-weight:700;font-size:15px;cursor:pointer}
button:disabled{background:#bbb;cursor:default}
#clear{background:#fff;color:#101a33;border:1px solid #ccc}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;padding:20px}
figure{margin:0;background:#fff;border-radius:12px;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,.08);cursor:pointer;position:relative;border:3px solid transparent}
figure.on{border-color:#58cc02}
img{width:100%;border-radius:8px;display:block}
figcaption{font-size:12px;margin-top:6px;font-weight:600}
.n{position:absolute;top:12px;left:12px;background:#58cc02;color:#fff;font-weight:800;font-size:18px;width:34px;height:34px;border-radius:17px;display:none;align-items:center;justify-content:center}
figure.on .n{display:flex}
#log{white-space:pre-wrap;font:12px/1.5 Menlo,monospace;background:#101a33;color:#cfe;padding:12px 20px;display:none}
</style>
<header><b>Pick screenshots</b><span id=count>0 of 10 picked. Click in the order you want them.</span>
<button id=clear>Clear</button><button id=go disabled>Upload to App Store</button></header>
<div id=log></div>
<div class=g>${files.map((f) => `<figure data-f="${f}"><span class=n></span><img src="/raw/${f}" loading=lazy><figcaption>${f}</figcaption></figure>`).join('')}</div>
<script>
const picks=[];const count=document.getElementById('count'),go=document.getElementById('go'),log=document.getElementById('log');
function render(){document.querySelectorAll('figure').forEach(fg=>{const i=picks.indexOf(fg.dataset.f);fg.classList.toggle('on',i>=0);fg.querySelector('.n').textContent=i+1});
count.textContent=picks.length+' of 10 picked. Click in the order you want them.';go.disabled=!picks.length}
document.querySelectorAll('figure').forEach(fg=>fg.onclick=()=>{const f=fg.dataset.f,i=picks.indexOf(f);if(i>=0)picks.splice(i,1);else if(picks.length<10)picks.push(f);render()});
document.getElementById('clear').onclick=()=>{picks.length=0;render()};
go.onclick=async()=>{go.disabled=true;go.textContent='Uploading...';log.style.display='block';log.textContent='';
const r=await fetch('/submit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(picks)});
const rd=r.body.getReader(),dec=new TextDecoder();while(true){const{done,value}=await rd.read();if(done)break;log.textContent+=dec.decode(value)}
go.textContent='Done — check App Store Connect';};
</script>`;
}

http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') { res.setHeader('content-type', 'text/html'); return res.end(page()); }
  if (req.method === 'GET' && req.url.startsWith('/raw/')) {
    const f = path.join(RAW, path.basename(decodeURIComponent(req.url.slice(5))));
    if (!fs.existsSync(f)) { res.statusCode = 404; return res.end(); }
    res.setHeader('content-type', 'image/png'); return fs.createReadStream(f).pipe(res);
  }
  if (req.method === 'POST' && req.url === '/submit') {
    let body = ''; for await (const c of req) body += c;
    const files = JSON.parse(body);
    res.setHeader('content-type', 'text/plain');
    const log = (s) => { console.log(s); res.write(s + '\n'); };
    try { log(`Uploading ${files.length} shots: ${files.join(', ')}`); await upload(files, log); log('DONE'); }
    catch (e) { log('ERROR ' + e.message); }
    return res.end();
  }
  res.statusCode = 404; res.end();
}).listen(PORT, () => console.log(`Picker at http://localhost:${PORT}`));

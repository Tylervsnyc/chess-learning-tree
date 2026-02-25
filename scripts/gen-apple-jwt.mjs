import { readFileSync } from 'fs';
import { createPrivateKey, createSign } from 'crypto';

const teamId = '4L856PWBZN';
const keyId = 'PTVWXXTL48';
const clientId = 'app.chesspath.web';
const keyFile = process.argv[2] || `${process.env.HOME}/Downloads/AuthKey_PTVWXXTL48.p8`;

const privateKey = readFileSync(keyFile, 'utf8');

// JWT header + payload
const header = { alg: 'ES256', kid: keyId };
const now = Math.floor(Date.now() / 1000);
const payload = {
  iss: teamId,
  iat: now,
  exp: now + 15777000, // ~6 months
  aud: 'https://appleid.apple.com',
  sub: clientId,
};

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const signingInput = `${base64url(header)}.${base64url(payload)}`;
const key = createPrivateKey(privateKey);
const sign = createSign('SHA256');
sign.update(signingInput);
const sig = sign.sign(key);

// ES256 signature is DER-encoded, need to convert to raw r||s (64 bytes)
function derToRaw(der) {
  const buf = Buffer.from(der);
  let offset = 2; // skip 0x30 + length
  if (buf[1] & 0x80) offset += (buf[1] & 0x7f);

  // Read r
  offset++; // 0x02 tag
  let rLen = buf[offset++];
  let r = buf.subarray(offset, offset + rLen);
  if (r[0] === 0) r = r.subarray(1); // strip leading zero
  offset += rLen;

  // Read s
  offset++; // 0x02 tag
  let sLen = buf[offset++];
  let s = buf.subarray(offset, offset + sLen);
  if (s[0] === 0) s = s.subarray(1); // strip leading zero

  // Pad to 32 bytes each
  const rPad = Buffer.alloc(32); r.copy(rPad, 32 - r.length);
  const sPad = Buffer.alloc(32); s.copy(sPad, 32 - s.length);
  return Buffer.concat([rPad, sPad]);
}

const rawSig = derToRaw(sig);
const sigB64 = rawSig.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

const jwt = `${signingInput}.${sigB64}`;
console.log(jwt);

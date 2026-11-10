import { createPublicKey, createVerify, KeyObject } from 'crypto';

/**
 * Verifies a Firebase ID token (the signed-in user's JWT) without
 * firebase-admin/auth. That module pulls in jwks-rsa → jose (ESM-only), which
 * crashes Vercel's function loader with ERR_REQUIRE_ESM. The checks below are
 * the ones Firebase documents for third-party JWT libraries.
 */

const CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let certCache: { keys: Record<string, KeyObject>; expires: number } | null = null;

async function publicKeys(): Promise<Record<string, KeyObject>> {
  if (certCache && Date.now() < certCache.expires) return certCache.keys;
  const res = await fetch(CERTS_URL);
  if (!res.ok) throw new Error(`Could not fetch Firebase certs (${res.status})`);
  const pems = (await res.json()) as Record<string, string>;
  const keys: Record<string, KeyObject> = {};
  for (const [kid, pem] of Object.entries(pems)) keys[kid] = createPublicKey(pem);
  const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get('cache-control') || '')?.[1] || 3600);
  certCache = { keys, expires: Date.now() + maxAge * 1000 };
  return keys;
}

function decodePart(part: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
}

/** Returns the user's uid if the token is valid for this project, else throws. */
export async function verifyIdToken(token: string): Promise<string> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID');

  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const [h, p, sig] = parts;
  const header = decodePart(h);
  const payload = decodePart(p);

  if (header.alg !== 'RS256' || typeof header.kid !== 'string') throw new Error('Bad header');

  const keys = await publicKeys();
  const key = keys[header.kid];
  if (!key) throw new Error('Unknown key id');

  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${h}.${p}`);
  if (!verifier.verify(key, Buffer.from(sig, 'base64url'))) throw new Error('Bad signature');

  const now = Math.floor(Date.now() / 1000);
  const skew = 60;
  if (payload.aud !== projectId) throw new Error('Wrong audience');
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('Wrong issuer');
  if (typeof payload.exp !== 'number' || payload.exp + skew < now) throw new Error('Expired');
  if (typeof payload.iat !== 'number' || payload.iat - skew > now) throw new Error('Issued in future');
  if (typeof payload.auth_time !== 'number' || payload.auth_time - skew > now) throw new Error('Bad auth_time');
  if (typeof payload.sub !== 'string' || !payload.sub) throw new Error('No subject');

  return payload.sub;
}

export type UserSession = {
  id: string;
  name: string;
  avatar: string;
  provider: 'github' | 'discord';
};

function toBase64Url(value: Uint8Array | string) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value;
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const padded = normalizeBase64Url(value);
  const base64 = atob(padded);
  const bytes = Uint8Array.from(base64, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function fromBase64UrlBytes(value: string) {
  const padded = normalizeBase64Url(value);
  const base64 = atob(padded);
  return Uint8Array.from(base64, (char) => char.charCodeAt(0));
}

function normalizeBase64Url(value: string) {
  return value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
}

async function getSigningKey() {
  const sessionSecret = import.meta.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET is required for auth sessions.');
  }

  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signSession(session: UserSession) {
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = toBase64Url(
    JSON.stringify({
      ...session,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    }),
  );
  const body = `${header}.${payload}`;
  const signature = await crypto.subtle.sign('HMAC', await getSigningKey(), new TextEncoder().encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function readSession(token?: string | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const body = `${header}.${payload}`;
  const isValid = await crypto.subtle.verify(
    'HMAC',
    await getSigningKey(),
    fromBase64UrlBytes(signature),
    new TextEncoder().encode(body),
  );
  if (!isValid) return null;
  const parsed = JSON.parse(fromBase64Url(payload));
  if (typeof parsed.exp !== 'number' || parsed.exp < Math.floor(Date.now() / 1000)) return null;
  return {
    id: String(parsed.id),
    name: String(parsed.name),
    avatar: String(parsed.avatar),
    provider: parsed.provider === 'discord' ? 'discord' : 'github',
  } as UserSession;
}

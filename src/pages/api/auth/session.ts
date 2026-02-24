import type { APIRoute } from 'astro';

import { SESSION_COOKIE_NAME } from '../../../lib/auth';
import { readSession } from '../../../lib/session';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { cookies } = context;

  const locals = (context as {
    locals?: { runtime?: { env?: Record<string, string> } };
    platform?: { env?: Record<string, string> };
  }).locals;

  const platform = (context as {
    locals?: { runtime?: { env?: Record<string, string> } };
    platform?: { env?: Record<string, string> };
  }).platform;

  const env = (locals?.runtime?.env ?? platform?.env ?? import.meta.env) as Record<string, string>;

  const session = await readSession(cookies.get(SESSION_COOKIE_NAME)?.value ?? null, env);
  return new Response(JSON.stringify({ session }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
};

import type { APIRoute } from 'astro';

import { SESSION_COOKIE_NAME } from '../../../lib/auth';
import { readSession } from '../../../lib/session';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const session = await readSession(cookies.get(SESSION_COOKIE_NAME)?.value ?? null);
  return new Response(JSON.stringify({ session }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
};

import type { APIRoute, APIContext } from 'astro';
import { createGithubOAuth } from '../../../../lib/auth';
import {
  oauthStateCookieOptions,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '../../../../lib/auth';
import { signSession } from '../../../../lib/session';

const STATE_COOKIE_NAME = 'github_oauth_state';

export const prerender = false;

export const GET: APIRoute = async (context: APIContext) => {
  const { cookies, redirect, url } = context;

  // Get runtime env (Workers) or local dev env
  const platform = (context as APIContext & {
    platform?: { env?: Record<string, string> };
  }).platform;

  const env = (platform?.env ?? import.meta.env) as Record<string, string>;

  const github = createGithubOAuth(env);

  if (!github) {
    return new Response('GitHub OAuth not configured', { status: 500 });
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const storedState = cookies.get(STATE_COOKIE_NAME)?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response('Invalid OAuth callback', { status: 400 });
  }

  const tokens = await github.validateAuthorizationCode(code);

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
      'User-Agent': 'allscripty-programs-auth',
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    return new Response('Unable to fetch GitHub profile.', { status: 401 });
  }

  const user = await response.json();

  const sessionToken = await signSession({
    id: String(user.id),
    name: user.name ?? user.login ?? 'GitHub User',
    avatar: user.avatar_url ?? '',
    provider: 'github',
  });

  const isProd = import.meta.env.PROD;

  cookies.delete(STATE_COOKIE_NAME, oauthStateCookieOptions(isProd));

  cookies.set(
    SESSION_COOKIE_NAME,
    sessionToken,
    sessionCookieOptions(isProd)
  );

  return redirect('/');
};

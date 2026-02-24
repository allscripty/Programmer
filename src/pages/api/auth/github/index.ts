import type { APIRoute, APIContext } from 'astro';
import { generateState } from 'arctic';
import { createGithubOAuth } from '../../../../lib/auth';

const STATE_COOKIE_NAME = 'github_oauth_state';

export const prerender = false;

export const GET: APIRoute = async (context: APIContext) => {
  const { cookies, redirect } = context;

  const locals = (context as APIContext & {
    locals?: { runtime?: { env?: Record<string, string> } };
  }).locals;

  const platform = (context as APIContext & {
    platform?: { env?: Record<string, string> };
  }).platform;

  const env = (locals?.runtime?.env ?? platform?.env ?? import.meta.env) as Record<string, string>;

  const github = createGithubOAuth(env, context.url);

  if (!github) {
    return new Response('GitHub OAuth not configured', { status: 500 });
  }

  const state = generateState();
  const url = await github.createAuthorizationURL(state, ['read:user', 'user:email']);

  const isProd = import.meta.env.PROD;

  cookies.set(STATE_COOKIE_NAME, state, {
    path: '/',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 60 * 10,
  });

  return redirect(url.toString());
};

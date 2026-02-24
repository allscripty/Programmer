import type { APIRoute, APIContext } from 'astro';
import { createDiscordOAuth } from '../../../../lib/auth';
import {
  oauthStateCookieOptions,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '../../../../lib/auth';
import { signSession } from '../../../../lib/session';

const STATE_COOKIE_NAME = 'discord_oauth_state';

export const prerender = false;

export const GET: APIRoute = async (context: APIContext) => {
  const { cookies, redirect, url } = context;

  const locals = (context as APIContext & {
    locals?: { runtime?: { env?: Record<string, string> } };
  }).locals;

  // Get runtime env (Workers) or local dev env
  const platform = (context as APIContext & {
    platform?: { env?: Record<string, string> };
  }).platform;

  const env = (locals?.runtime?.env ?? platform?.env ?? import.meta.env) as Record<string, string>;

  const discord = createDiscordOAuth(env, url);

  if (!discord) {
    return new Response("Discord OAuth not configured", { status: 500 });
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const storedState = cookies.get(STATE_COOKIE_NAME)?.value ?? null;
  const codeVerifier = cookies.get("discord_code_verifier")?.value ?? null;

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return new Response("Invalid OAuth callback", { status: 400 });
  }

  const tokens = await discord.validateAuthorizationCode(code, codeVerifier);

  cookies.delete("discord_oauth_state", { path: "/" });
  cookies.delete("discord_code_verifier", { path: "/" });

  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`
    }
  });

  if (!response.ok) {
    return new Response('Unable to fetch Discord profile.', { status: 401 });
  }

  const user = await response.json();

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : '';

  const sessionToken = await signSession({
    id: String(user.id),
    name: user.global_name ?? user.username ?? 'Discord User',
    avatar,
    provider: 'discord',
  }, env);

  const isProd = import.meta.env.PROD;

  cookies.delete(STATE_COOKIE_NAME, oauthStateCookieOptions(isProd));

  cookies.set(
    SESSION_COOKIE_NAME,
    sessionToken,
    sessionCookieOptions(isProd)
  );

  return redirect("/");
};
import type { APIContext } from 'astro';
import { generateCodeVerifier, generateState } from "arctic";
import { createDiscordOAuth } from '../../../../lib/auth';

export const prerender = false;

export async function GET(context: APIContext) {
  const { cookies, redirect } = context;

  const platform = (context as APIContext & {
    platform?: { env?: Record<string, string> };
  }).platform;

  const env = platform?.env ?? import.meta.env;

  const discord = createDiscordOAuth(env as Record<string, string>, context.url);

  if (!discord) {
    return new Response("Discord OAuth not configured", { status: 500 });
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const isProd = import.meta.env.PROD;

  cookies.set("discord_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 60 * 10
  });

  cookies.set("discord_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 60 * 10
  });

  const url = discord.createAuthorizationURL(
    state,
    codeVerifier,
    ["identify", "email"]
  );

  return redirect(url.toString());
}
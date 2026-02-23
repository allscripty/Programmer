import { Discord, GitHub } from 'arctic';

export function createGithubOAuth(env: Record<string, string>) {
  if (
    !env.GITHUB_CLIENT_ID ||
    !env.GITHUB_CLIENT_SECRET ||
    !env.GITHUB_CALLBACK_URL
  ) {
    return null;
  }

  return new GitHub(
    env.GITHUB_CLIENT_ID,
    env.GITHUB_CLIENT_SECRET,
    env.GITHUB_CALLBACK_URL
  );
}

export function createDiscordOAuth(env: Record<string, string>) {
  if (
    !env.DISCORD_CLIENT_ID ||
    !env.DISCORD_CLIENT_SECRET ||
    !env.DISCORD_CALLBACK_URL
  ) {
    return null;
  }

  return new Discord(
    env.DISCORD_CLIENT_ID,
    env.DISCORD_CLIENT_SECRET,
    env.DISCORD_CALLBACK_URL
  );
}

export const oauthStateCookieOptions = (isProd: boolean) => ({
  path: '/',
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  maxAge: 60 * 10,
});

export const SESSION_COOKIE_NAME = 'auth_session';

export const sessionCookieOptions = (isProd: boolean) => ({
  path: '/',
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
});
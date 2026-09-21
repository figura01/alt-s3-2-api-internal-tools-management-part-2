import type { CookieOptions, NextFunction, Request, Response } from 'express';

export const REFRESH_COOKIE = 'techcorp_refresh';

export const SESSION_COOKIE = 'techcorp_session';

export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
  };
}

export function extractSessionCookie(request: Request): string | null {
  return extractCookie(request, SESSION_COOKIE);
}

export function extractCookie(request: Request, name: string): string | null {
  const cookie = request.headers.cookie?.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!cookie) return null;
  try {
    return decodeURIComponent(cookie.slice(name.length + 1));
  } catch {
    return null;
  }
}

export function setSessionCookie(response: Response, token: string): void {
  // The token comes directly from AuthService, never from client input.
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) as { exp: number };
  response.cookie(SESSION_COOKIE, token, {
    ...sessionCookieOptions(),
    expires: new Date(payload.exp * 1000),
  });
}

export function csrfProtection(allowedOrigin: string) {
  return (request: Request, response: Response, next: NextFunction): void => {
    response.setHeader('Cache-Control', 'no-store');
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      next();
      return;
    }
    // Custom headers require a CORS preflight; foreign origins are rejected
    // explicitly as well. This also covers login and logout CSRF.
    if (request.get('X-CSRF-Protection') !== '1' ||
      (request.get('Origin') && request.get('Origin') !== allowedOrigin)) {
      response.status(403).json({ statusCode: 403, message: 'Invalid request origin' });
      return;
    }
    next();
  };
}


export function setRefreshCookie(response: Response, token: string, expires: Date): void {
  response.cookie(REFRESH_COOKIE, token, { ...sessionCookieOptions(), path: '/api/auth', expires });
}

export function clearSessionCookies(response: Response): void {
  response.clearCookie(SESSION_COOKIE, sessionCookieOptions());
  response.clearCookie(REFRESH_COOKIE, { ...sessionCookieOptions(), path: '/api/auth' });
}

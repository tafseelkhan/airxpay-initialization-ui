export interface JWTPayload { merchantId?: string; sub?: string; exp?: number; iat?: number; [key: string]: unknown }

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const jsonPayload = decodeURIComponent(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
        .split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch { return null; }
}

export function getMerchantIdFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.merchantId || payload?.sub || null;
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return false;
  return payload.exp < Math.floor(Date.now() / 1000);
}

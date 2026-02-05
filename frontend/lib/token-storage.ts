/**
 * Secure token storage utilities for the frontend application
 */

// Key constants
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Store authentication token
 * @param token - JWT token string
 */
export const storeToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieve authentication token
 * @returns token string or null if not found
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Remove authentication token
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Store refresh token
 * @param refreshToken - Refresh token string
 */
export const storeRefreshToken = (refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Retrieve refresh token
 * @returns refresh token string or null if not found
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

/**
 * Remove refresh token
 */
export const removeRefreshToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Split token to get payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode payload (base64 decode)
    const payload = JSON.parse(atob(parts[1]));

    // Check expiration
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    // If there's an error parsing the token, consider it expired
    return true;
  }
};

/**
 * Get token expiration time
 * @param token - JWT token string
 * @returns expiration timestamp or null if unable to parse
 */
export const getTokenExpiration = (token: string): number | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload.exp;
  } catch (error) {
    return null;
  }
};

/**
 * Clear all authentication tokens
 */
export const clearAuthTokens = (): void => {
  removeToken();
  removeRefreshToken();
};

/**
 * Check if user is authenticated
 * @returns true if user is authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }

  return !isTokenExpired(token);
};
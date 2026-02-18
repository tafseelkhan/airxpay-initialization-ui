// src/plugins/tokenRefreshPlugin.ts

import { getStoredToken, setStoredToken, clearStoredToken } from '../utils/tokenStorage';
import { refreshMerchantTokenInternal } from '../api/merchantProxy';
import { ErrorHandler } from '../error/errorHandler';

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export class TokenRefreshPlugin {
  private static isRefreshing = false;
  private static failedQueue: QueueItem[] = [];
  private static refreshPromise: Promise<string> | null = null;

  static async getValidToken(): Promise<string | null> {
    const token = await getStoredToken();
    
    if (!token) {
      return null;
    }

    // Check if token is expired (simplified - in production use JWT decode)
    const isExpired = this.isTokenExpired(token);
    
    if (!isExpired) {
      return token;
    }

    // Token expired, refresh it
    return this.refreshToken();
  }

  static async refreshToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await refreshMerchantTokenInternal();
        
        if (response?.token) {
          await setStoredToken(response.token);
          this.processQueue(null, response.token);
          resolve(response.token);
        } else {
          throw new Error('No token in refresh response');
        }
      } catch (error) {
        await clearStoredToken();
        this.processQueue(error as Error, null);
        reject(error);
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }

  private static processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp - 60000; // Consider expired 1 minute before actual expiry
    } catch {
      return true; // If can't decode, consider expired
    }
  }

  static addToQueue(resolve: (value: unknown) => void, reject: (reason?: unknown) => void) {
    this.failedQueue.push({ resolve, reject });
  }
}
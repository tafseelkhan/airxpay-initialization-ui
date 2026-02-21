// src/utils/tokenManager.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshMerchantTokenInternal } from '../../api/merchantProxy';
import { STORAGE_KEYS } from '../../etc/constants';

// Queue for failed requests during token refresh
interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string> | null = null;
  private failedQueue: QueueItem[] = [];

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.MERCHANT_TOKEN);
    } catch (error) {
      console.error('[TokenManager] Failed to get token:', error);
      return null;
    }
  }

  /**
   * Set token in storage
   */
  async setToken(token: string): Promise<void> {
    if (!token?.trim()) {
      throw new Error('Invalid token');
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MERCHANT_TOKEN, token);
      console.log('[TokenManager] Token stored successfully');
    } catch (error) {
      console.error('[TokenManager] Failed to store token:', error);
      throw error;
    }
  }

  /**
   * Clear token from storage
   */
  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.MERCHANT_TOKEN);
      console.log('[TokenManager] Token cleared');
    } catch (error) {
      console.error('[TokenManager] Failed to clear token:', error);
    }
  }

  /**
   * Get valid token - refreshes if expired
   */
  async getValidToken(): Promise<string | null> {
    const token = await this.getToken();
    
    if (!token) {
      return null;
    }

    // Check if token is expired
    const isExpired = this.isTokenExpired(token);
    
    if (!isExpired) {
      return token;
    }

    // Token expired, refresh it
    return this.refreshToken();
  }

  /**
   * Refresh token - handles concurrent requests
   */
  async refreshToken(): Promise<string> {
    // If already refreshing, return existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        console.log('[TokenManager] Refreshing token...');
        
        const response = await refreshMerchantTokenInternal();
        
        if (response?.token) {
          await this.setToken(response.token);
          this.processQueue(null, response.token);
          resolve(response.token);
        } else {
          throw new Error('No token in refresh response');
        }
      } catch (error) {
        await this.clearToken();
        this.processQueue(error as Error, null);
        reject(error);
      } finally {
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  /**
   * Add request to queue during token refresh
   */
  addToQueue(resolve: (value: unknown) => void, reject: (reason?: unknown) => void) {
    this.failedQueue.push({ resolve, reject });
  }

  /**
   * Simple token expiry check
   * In production, use JWT decode
   */
  private isTokenExpired(token: string): boolean {
    try {
      // Simple check - if token is older than 1 hour, consider expired
      // In production, decode JWT and check exp claim
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      const exp = payload.exp * 1000; // Convert to milliseconds
      
      return Date.now() >= exp - 60000; // Consider expired 1 minute before actual expiry
    } catch {
      // If can't decode, assume expired and try to refresh
      return true;
    }
  }
}

export const tokenManager = TokenManager.getInstance();
// src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';
import { TokenPair } from '../core/types';

export class TokenStorage {
  private static instance: TokenStorage;
  private logger: any;

  private constructor(logger?: any) {
    this.logger = logger;
  }

  static getInstance(logger?: any): TokenStorage {
    if (!TokenStorage.instance) {
      TokenStorage.instance = new TokenStorage(logger);
    }
    return TokenStorage.instance;
  }

  /**
   * Save token pair securely
   */
  async saveTokens(tokens: TokenPair): Promise<void> {
    try {
      // Use SecureStore for React Native
      await SecureStore.setItemAsync(
        STORAGE_KEYS.ACCESS_TOKEN,
        tokens.accessToken
      );
      await SecureStore.setItemAsync(
        STORAGE_KEYS.REFRESH_TOKEN,
        tokens.refreshToken
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.TOKEN_EXPIRY,
        tokens.expiresAt.toString()
      );

      this.logger?.info('Tokens saved successfully');
    } catch (error) {
      this.logger?.error('Failed to save tokens:', error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      this.logger?.error('Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      this.logger?.error('Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Get token expiry
   */
  async getTokenExpiry(): Promise<number | null> {
    try {
      const expiry = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      return expiry ? parseInt(expiry, 10) : null;
    } catch (error) {
      this.logger?.error('Failed to get token expiry:', error);
      return null;
    }
  }

  /**
   * Check if token exists
   */
  async hasToken(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }

  /**
   * Check if token is expired
   */
  async isTokenExpired(): Promise<boolean> {
    const expiry = await this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() >= expiry;
  }

  /**
   * Clear all tokens
   */
  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
      
      this.logger?.info('Tokens cleared');
    } catch (error) {
      this.logger?.error('Failed to clear tokens:', error);
    }
  }
}
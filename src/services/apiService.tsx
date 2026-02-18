// services/airxpay.service.ts
import {
  initializeInternalApi,
  createMerchantInternal,
  getMerchantStatusInternal,
  refreshMerchantTokenInternal
} from '../api/merchantProxy';
import { CreateMerchantPayload, MerchantCreateResponse, MerchantStatusResponse } from '../types/merchantTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUBLIC_KEY_STORAGE = '@airxpay_public_key';

class AirXPayService {
  private initialized = false;

  /**
   * Initialize the SDK with public key
   */
  async initialize(publicKey: string): Promise<void> {
    try {
      if (!publicKey?.trim()) {
        throw new Error('Public key is required');
      }
      
      initializeInternalApi(publicKey);
      await AsyncStorage.setItem(PUBLIC_KEY_STORAGE, publicKey);
      this.initialized = true;
      
      console.log('✅ AirXPay SDK initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AirXPay SDK:', error);
      throw error;
    }
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Create merchant (called on final step)
   */
  async createMerchant(payload: CreateMerchantPayload): Promise<MerchantCreateResponse> {
    this.checkInitialized();
    
    try {
      console.log('📝 Creating merchant with payload:', { ...payload, merchantEmail: payload.merchantEmail });
      
      const response = await createMerchantInternal(payload);
      
      // Token is automatically stored by the SDK
      console.log('✅ Merchant created successfully:', response.merchant.merchantId);
      
      return response;
    } catch (error: any) {
      console.error('❌ Failed to create merchant:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get merchant status (used in onboarding complete screen)
   */
  async getMerchantStatus(): Promise<MerchantStatusResponse> {
    this.checkInitialized();
    
    try {
      console.log('🔍 Fetching merchant status...');
      
      const response = await getMerchantStatusInternal();
      
      console.log('✅ Merchant status retrieved:', response.status);
      
      return response;
    } catch (error: any) {
      console.error('❌ Failed to get merchant status:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Refresh merchant token
   */
  async refreshToken(): Promise<void> {
    this.checkInitialized();
    
    try {
      console.log('🔄 Refreshing merchant token...');
      
      await refreshMerchantTokenInternal();
      
      console.log('✅ Token refreshed successfully');
    } catch (error: any) {
      console.error('❌ Failed to refresh token:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Check if SDK is initialized
   */
  private checkInitialized(): void {
    if (!this.initialized) {
      throw new Error('AirXPay SDK not initialized. Call initialize() first.');
    }
  }

  /**
   * Handle and normalize errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || error.response.data?.error || 'Server error';
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return error;
    }
  }
}

// Singleton instance
export const airxpayService = new AirXPayService();
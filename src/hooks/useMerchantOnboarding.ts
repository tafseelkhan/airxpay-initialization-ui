// src/hooks/useMerchantOnboarding.ts

import { useState, useEffect, useCallback } from 'react';
import {
  createMerchantInternal,
  getMerchantStatusInternal,
  initializeInternalApi
} from '../api/merchantProxy';
import { setStoredToken, storeMerchantData, getStoredMerchantData } from '../utils/tokenStorage';
import { ErrorHandler, AppError } from '../error/errorHandler';
import { CreateMerchantPayload, MerchantCreateResponse, MerchantStatusResponse } from '../types/merchantTypes';
import { ConfigManager } from '../options/configOptions';

interface UseMerchantOnboardingReturn {
  // States
  loading: boolean;
  error: AppError | null;
  merchantData: MerchantCreateResponse | null;
  merchantStatus: MerchantStatusResponse | null;
  
  // Actions
  initialize: (publicKey?: string) => void;  // ✅ Made optional
  createMerchant: (payload: CreateMerchantPayload) => Promise<MerchantCreateResponse | null>;
  fetchStatus: () => Promise<MerchantStatusResponse | null>;
  clearError: () => void;
  reset: () => void;
}

export const useMerchantOnboarding = (): UseMerchantOnboardingReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [merchantData, setMerchantData] = useState<MerchantCreateResponse | null>(null);
  const [merchantStatus, setMerchantStatus] = useState<MerchantStatusResponse | null>(null);

  const config = ConfigManager.getInstance();

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = async () => {
      const cached = await getStoredMerchantData();
      if (cached) {
        setMerchantData(cached);
      }
    };
    loadCachedData();
  }, []);

  // ✅ Updated initialize - now optional publicKey
  const initialize = useCallback((publicKey?: string) => {
    try {
      initializeInternalApi(publicKey);
      
      const hasSecret = config.getSecretKey();
      const hasClient = config.getClientKey();
      
      if (hasSecret && hasClient) {
        config.log('🚀 Merchant onboarding hook initialized with ALL keys');
      } else {
        config.log('🚀 Merchant onboarding hook initialized with public key only');
      }
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError);
    }
  }, []);

  const createMerchant = useCallback(async (
    payload: CreateMerchantPayload
  ): Promise<MerchantCreateResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      config.log('📝 Creating merchant...');
      
      const response = await createMerchantInternal(payload);
      
      if (response.token) {
        await setStoredToken(response.token);
        config.log('🔑 Token stored successfully');
      }
      
      await storeMerchantData(response);
      setMerchantData(response);
      
      config.log('✅ Merchant created successfully:', response.merchant.merchantId);
      return response;
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError);
      config.error('❌ Create merchant failed:', appError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatus = useCallback(async (): Promise<MerchantStatusResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      config.log('🔍 Fetching merchant status...');
      
      const status = await getMerchantStatusInternal();
      setMerchantStatus(status);
      
      config.log('✅ Merchant status fetched:', status.status);
      return status;
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError);
      config.error('❌ Fetch status failed:', appError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setMerchantData(null);
    setMerchantStatus(null);
    setError(null);
    setLoading(false);
    config.log('🔄 Merchant onboarding reset');
  }, []);

  return {
    loading,
    error,
    merchantData,
    merchantStatus,
    initialize,
    createMerchant,
    fetchStatus,
    clearError,
    reset
  };
};
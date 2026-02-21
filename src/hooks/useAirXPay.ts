// src/hooks/useAirXPay.ts

import { useState, useCallback } from 'react';
import { useAirXPaySafe } from '../contexts/AirXPayProvider';
import { createMerchantInternal, getMerchantStatusInternal } from '../api/merchantProxy';
import { tokenManager } from '../utils/token/tokenManager';
import { CreateMerchantPayload, MerchantCreateResponse, MerchantStatusResponse } from '../types';
import { ErrorHandler, AppError } from '../error/errorHandler';

interface UseAirXPayReturn {
  // States
  loading: boolean;
  error: AppError | null;
  merchantData: MerchantCreateResponse | null;
  merchantStatus: MerchantStatusResponse | null;
  token: string | null;
  
  // Actions
  createMerchant: (payload: CreateMerchantPayload) => Promise<MerchantCreateResponse | null>;
  getMerchantStatus: () => Promise<MerchantStatusResponse | null>;
  refreshToken: () => Promise<string | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAirXPay = (): UseAirXPayReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [merchantData, setMerchantData] = useState<MerchantCreateResponse | null>(null);
  const [merchantStatus, setMerchantStatus] = useState<MerchantStatusResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const context = useAirXPaySafe();

  /**
   * ✅ CREATE MERCHANT - Main API for onboarding
   */
  const createMerchant = useCallback(async (
    payload: CreateMerchantPayload
  ): Promise<MerchantCreateResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('[useAirXPay] 📝 Creating merchant...');
      
      const response = await createMerchantInternal(payload);
      
      // Token is automatically stored by createMerchantInternal
      const storedToken = await tokenManager.getToken();
      setToken(storedToken);
      
      setMerchantData(response);
      
      console.log('[useAirXPay] ✅ Merchant created:', response.merchant.merchantId);
      return response;
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError);
      console.error('[useAirXPay] ❌ Create failed:', appError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ GET MERCHANT STATUS - Check onboarding status
   */
  const getMerchantStatus = useCallback(async (): Promise<MerchantStatusResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('[useAirXPay] 🔍 Fetching merchant status...');
      
      const status = await getMerchantStatusInternal();
      setMerchantStatus(status);
      
      console.log('[useAirXPay] ✅ Status fetched:', status.status);
      return status;
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError);
      console.error('[useAirXPay] ❌ Status fetch failed:', appError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔄 REFRESH TOKEN - Manual refresh if needed
   */
  const refreshToken = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('[useAirXPay] 🔄 Refreshing token...');
      
      const newToken = await tokenManager.refreshToken();
      setToken(newToken);
      
      console.log('[useAirXPay] ✅ Token refreshed');
      return newToken;
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError);
      console.error('[useAirXPay] ❌ Token refresh failed:', appError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🚪 LOGOUT - Clear all data
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await tokenManager.clearToken();
      setToken(null);
      setMerchantData(null);
      setMerchantStatus(null);
      
      // Also call context logout if available
      if (context?.logout) {
        await context.logout();
      }
      
      console.log('[useAirXPay] ✅ Logged out');
    } catch (err) {
      console.error('[useAirXPay] ❌ Logout failed:', err);
    }
  }, [context]);

  /**
   * ❌ Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    merchantData,
    merchantStatus,
    token,
    createMerchant,
    getMerchantStatus,
    refreshToken,
    logout,
    clearError,
  };
};
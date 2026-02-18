// src/contexts/AirXPayProvider.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AirXPayConfig, MerchantCreateResponse } from '../types/merchantTypes';
import { getStoredToken, clearStoredToken } from '../utils/tokenStorage';
// ✅ FIXED: import initializeInternalApi instead of initializeApi
import { initializeInternalApi, verifyPublicKey } from '../api/merchantProxy';
import { getMerchantIdFromToken } from '../utils/jwt';

interface AirXPayContextType extends AirXPayConfig {
  isValid: boolean;
  loading: boolean;
  merchantData?: MerchantCreateResponse;
  hasToken: boolean;
  merchantId?: string;
  setHasToken: (value: boolean) => void;
  logout: () => Promise<void>;
}

const AirXPayContext = createContext<AirXPayContextType | null>(null);

interface Props {
  config: AirXPayConfig;
  children: React.ReactNode;
  enableLogging?: boolean;
}

export const AirXPayProvider: React.FC<Props> = ({ config, children, enableLogging = __DEV__ }) => {
  const [state, setState] = useState<AirXPayContextType>({
    ...config,
    isValid: false,
    loading: true,
    hasToken: false,
    setHasToken: () => {},
    logout: async () => {},
  });

  const [hasToken, setHasToken] = useState(false);
  const [merchantId, setMerchantId] = useState<string>();

  const logout = useCallback(async () => {
    await clearStoredToken();
    setHasToken(false);
    setMerchantId(undefined);
    if (enableLogging) console.log('[AirXPay] User logged out');
  }, [enableLogging]);

  useEffect(() => {
    const initialize = async () => {
      if (!config.publicKey?.trim()) {
        setState(prev => ({ ...prev, isValid: false, loading: false }));
        return;
      }

      try {
        // ✅ FIXED: Call initializeInternalApi instead of initializeApi
        initializeInternalApi(config.publicKey);

        const token = await getStoredToken();
        const validToken = !!token;
        const id = validToken ? getMerchantIdFromToken(token) || undefined : undefined;

        setHasToken(validToken);
        setMerchantId(id);

        const verification = await verifyPublicKey(config.publicKey);

        setState({
          ...config,
          isValid: true,
          loading: false,
          merchantData: verification.merchantData,
          hasToken: validToken,
          merchantId: id,
          setHasToken,
          logout,
        });

        if (enableLogging) console.log('[AirXPay] Initialized', { hasToken: validToken });
      } catch (err: any) {
        setState({ ...config, isValid: false, loading: false, hasToken: false, setHasToken, logout });
        if (enableLogging) console.error('[AirXPay] Init failed', err);
      }
    };
    initialize();
  }, [config, enableLogging, logout]);

  return <AirXPayContext.Provider value={{ ...state, hasToken, merchantId, setHasToken, logout }}>{children}</AirXPayContext.Provider>;
};

export const useAirXPay = (): AirXPayContextType => {
  const context = useContext(AirXPayContext);
  if (!context) throw new Error('useAirXPay must be used inside <AirXPayProvider>');
  return context;
};

export const useAirXPaySafe = () => {
  try {
    return useAirXPay();
  } catch {
    return null;
  }
};

export const useProviderReady = (): boolean => {
  const airXPay = useAirXPaySafe();
  return !!airXPay && airXPay.isValid && !airXPay.loading;
};
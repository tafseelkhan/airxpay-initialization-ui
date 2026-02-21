// src/contexts/AirXPayProvider.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AirXPayConfig, MerchantCreateResponse } from '../types';
import { tokenManager } from '../utils/token/tokenManager';
import { initializeInternalApi, verifyPublicKey } from '../api/merchantProxy';

interface AirXPayContextType extends AirXPayConfig {
  isValid: boolean;
  loading: boolean;
  merchantData?: MerchantCreateResponse;
  hasToken: boolean;
  merchantId?: string;
  mode: 'test' | 'live';
  setHasToken: (value: boolean) => void;
  logout: () => Promise<void>;
}

const AirXPayContext = createContext<AirXPayContextType | null>(null);

interface Props {
  config: AirXPayConfig;
  children: React.ReactNode;
  enableLogging?: boolean;
}

export const AirXPayProvider: React.FC<Props> = ({ 
  config, 
  children, 
  enableLogging = __DEV__ 
}) => {
  const [state, setState] = useState<AirXPayContextType>({
    ...config,
    isValid: false,
    loading: true,
    hasToken: false,
    mode: 'test',
    setHasToken: () => {},
    logout: async () => {},
  });

  const [hasToken, setHasToken] = useState(false);
  const [merchantId, setMerchantId] = useState<string>();
  const [mode, setMode] = useState<'test' | 'live'>('test');

  const logout = useCallback(async () => {
    await tokenManager.clearToken();
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
        // Initialize internal API
        initializeInternalApi(config.publicKey);

        // Check for existing token
        const token = await tokenManager.getToken();
        const validToken = !!token;

        setHasToken(validToken);
        
        // Extract merchantId from token if available
        let id: string | undefined;
        if (validToken && token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            id = payload.merchantId || payload.sub;
          } catch {
            // Ignore decode errors
          }
        }
        
        setMerchantId(id);

        // Verify public key with developer backend
        const verification = await verifyPublicKey(config.publicKey);
        
        const verifiedMode = verification.merchantData?.mode || 'test';
        setMode(verifiedMode);

        if (enableLogging) {
          console.log('[AirXPay] Verification response:', {
            valid: verification.valid,
            mode: verifiedMode,
          });
        }

        setState({
          ...config,
          isValid: verification.valid,
          loading: false,
          mode: verifiedMode,
          merchantData: verification.merchantData,
          hasToken: validToken,
          merchantId: id,
          setHasToken,
          logout,
        });

        if (enableLogging) {
          console.log('[AirXPay] Initialized successfully', { 
            hasToken: validToken,
            mode: verifiedMode 
          });
        }

      } catch (err: any) {
        console.error('[AirXPay] Init failed:', err);
        
        setState({ 
          ...config, 
          isValid: false, 
          loading: false, 
          hasToken: false, 
          mode: 'test',
          setHasToken, 
          logout,
        });
      }
    };
    
    initialize();
  }, [config.publicKey, enableLogging, logout]);

  return (
    <AirXPayContext.Provider 
      value={{ 
        ...state, 
        hasToken, 
        merchantId, 
        mode,
        setHasToken, 
        logout 
      }}
    >
      {children}
    </AirXPayContext.Provider>
  );
};

export const useAirXPay = (): AirXPayContextType => {
  const context = useContext(AirXPayContext);
  if (!context) {
    throw new Error('useAirXPay must be used inside <AirXPayProvider>');
  }
  return context;
};

export const useAirXPaySafe = (): AirXPayContextType | null => {
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
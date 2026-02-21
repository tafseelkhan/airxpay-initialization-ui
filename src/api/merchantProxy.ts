// src/api/merchantProxy.ts

import { CreateMerchantPayload, MerchantCreateResponse, MerchantStatusResponse } from '../types/merchantTypes';
import { ConfigManager } from '../options/configOptions';
import { PayloadValidator } from '../schema/validators';
import { ErrorHandler } from '../error/errorHandler';
import { API_ENDPOINTS } from '../etc/constants';
import { FlixoraEncrypted } from '../secure';
import { EventEmitter } from '../core/events/EventEmitter';
import { EventMap } from '../core/events/types';
import { getStoredToken } from '../utils/tokenStorage';

const BACKEND_URL = 'http://172.20.10.12:7000'; // Developer's backend URL

let globalEvents: EventEmitter<EventMap> | null = null;

export const setEventEmitter = (emitter: EventEmitter<EventMap>) => {
  globalEvents = emitter;
};

export const initializeInternalApi = (publicKey?: string): void => {
  const config = ConfigManager.getInstance();
  
  if (publicKey) {
    const errors = PayloadValidator.validatePublicKey(publicKey);
    if (errors.length > 0) {
      throw new Error(errors[0].message);
    }
    
    const existingConfig = config.getFrontendConfig() || {};
    config.setFrontendConfig({ 
      ...existingConfig,
      publicKey 
    });
    
    const vault = FlixoraEncrypted.getInstance();
    vault.storeKey('publicKey', publicKey);
  }
  
  const finalConfig = config.getFrontendConfig();
  if (!finalConfig?.publicKey) {
    throw new Error('Public key is required');
  }

  config.log('🚀 AirXPay SDK initialized:');
  config.log('  📌 Public key:', finalConfig.publicKey.substring(0, 8) + '...');
};

/**
 * ✅ CREATE MERCHANT - ONLY API THAT SHOULD BE USED
 * This calls the developer's backend, which then calls AirXPay Core
 */
export const createMerchantInternal = async (
  payload: CreateMerchantPayload
): Promise<MerchantCreateResponse> => {
  const config = ConfigManager.getInstance();
  const vault = FlixoraEncrypted.getInstance();
  
  try {
    // Validate payload
    const errors = PayloadValidator.validateCreateMerchant(payload);
    if (errors.length > 0) {
      throw {
        response: {
          status: 422,
          data: {
            message: 'Validation failed',
            userMessage: errors[0].message,
            errors
          }
        }
      };
    }

    config.log('📤 Creating merchant with payload:', payload);

    // Get public key from vault
    const publicKey = vault.hasKey('publicKey') 
      ? vault.getKey('publicKey') 
      : config.getPublicKey();

    if (!publicKey) {
      throw new Error('Public key is required');
    }

    // Request body
    const requestBody = {
      merchantName: payload.merchantName,
      merchantEmail: payload.merchantEmail,
      merchantPhone: payload.merchantPhone,
      businessName: payload.businessName,
      businessType: payload.businessType,
      businessCategory: payload.businessCategory,
      country: payload.country,
      nationality: payload.nationality,
      mode: payload.mode,
      metadata: payload.metadata
    };

    config.log('📡 Sending request to developer backend:', `${BACKEND_URL}${API_ENDPOINTS.CREATE_MERCHANT}`);

    // Call DEVELOPER'S BACKEND (not AirXPay Core directly)
    const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.CREATE_MERCHANT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Public-Key': publicKey,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data
        }
      };
    }

    // Store token if returned from developer backend
    if (data.token) {
      const { setStoredToken } = await import('../utils/tokenStorage');
      await setStoredToken(data.token);
    }

    config.log('✅ Merchant created successfully:', data);
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('❌ Create merchant failed:', appError);
    throw appError;
  }
};

/**
 * ✅ GET MERCHANT STATUS - ONLY API THAT SHOULD BE USED
 * This calls the developer's backend with token authentication
 */
export const getMerchantStatusInternal = async (): Promise<MerchantStatusResponse> => {
  const config = ConfigManager.getInstance();
  
  try {
    config.log('🔍 Fetching merchant status from developer backend');

    // Get token from storage (handled by tokenManager)
    const token = await getStoredToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.GET_MERCHANT_STATUS}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data
        }
      };
    }

    config.log('✅ Merchant status fetched:', data);
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('❌ Fetch status failed:', appError);
    throw appError;
  }
};

/**
 * 🔄 REFRESH TOKEN - HANDLED INTERNALLY ONLY
 * Called automatically on 401
 */
export const refreshMerchantTokenInternal = async (): Promise<{ token: string }> => {
  const config = ConfigManager.getInstance();
  
  try {
    config.log('🔄 Refreshing token via developer backend');

    const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data
        }
      };
    }

    if (data.token) {
      const { setStoredToken } = await import('../utils/tokenStorage');
      await setStoredToken(data.token);
    }

    config.log('✅ Token refreshed successfully');
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('❌ Token refresh failed:', appError);
    throw appError;
  }
};

/**
 * 🔑 VERIFY PUBLIC KEY - Called during initialization
 */
export const verifyPublicKey = async (publicKey: string): Promise<{ valid: boolean; merchantData?: any }> => {
  const config = ConfigManager.getInstance();
  
  try {
    config.log('🔑 Verifying public key with developer backend:', publicKey.substring(0, 8) + '...');

    const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.VERIFY_PUBLIC_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicKey }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data
        }
      };
    }

    config.log('✅ Public key verified successfully');
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('❌ Public key verification failed:', appError);
    throw appError;
  }
};
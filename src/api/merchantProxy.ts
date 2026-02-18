// src/api/merchantProxy.ts

import { CreateMerchantPayload, MerchantCreateResponse, MerchantStatusResponse } from '../types/merchantTypes';
import { ConfigManager } from '../options/configOptions';
import { PayloadValidator } from '../schema/validators';
import { ErrorHandler } from '../error/errorHandler';
import { API_ENDPOINTS } from '../etc/constants';
import { FlixoraEncrypted } from '../secure';  // 👈 IMPORT KARO

const BACKEND_URL = 'http://172.20.10.12:7000';

export const initializeInternalApi = (publicKey?: string): void => {
  const config = ConfigManager.getInstance();
  
  // Load keys from process.flixora (kisi bhi name se)
  config.loadKeysFromProcess();
  
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
    
    // 👇 VAULT MEIN BHI STORE KARO
    const vault = FlixoraEncrypted.getInstance();
    vault.storeKey('publicKey', publicKey);
  }
  
  const finalConfig = config.getFrontendConfig();
  if (!finalConfig?.publicKey) {
    throw new Error('Public key is required. Set via initializeInternalApi() or process.flixora.ANY_NAME');
  }

  config.log('🚀 AirXPay SDK initialized:');
  config.log('  📌 Public key:', finalConfig.publicKey.substring(0, 8) + '...');
  
  // 👇 VAULT SE CHECK KARO
  const vault = FlixoraEncrypted.getInstance();
  if (vault.hasKey('secretKey')) {
    config.log('  🔐 Secret key: [ENCRYPTED IN VAULT]');
  }
  if (vault.hasKey('clientKey')) {
    config.log('  🔐 Client key: [ENCRYPTED IN VAULT]');
  }
};

export const createMerchantInternal = async (
  payload: CreateMerchantPayload
): Promise<MerchantCreateResponse> => {
  const config = ConfigManager.getInstance();
  const vault = FlixoraEncrypted.getInstance();  // 👈 VAULT GET KARO
  
  try {
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

    const publicKey = config.getPublicKey();
    
    // 👇 VAULT SE DECRYPTED KEYS LO
    const secretKey = vault.hasKey('secretKey') ? vault.getKey('secretKey') : undefined;
    const clientKey = vault.hasKey('clientKey') ? vault.getKey('clientKey') : undefined;

    const requestBody: any = {
      ...payload,
      publicKey
    };
    
    if (secretKey) {
      requestBody.secretKey = secretKey;
      config.log('🔐 Including secret key in request');
    }
    
    if (clientKey) {
      requestBody.clientKey = clientKey;
      config.log('🔐 Including client key in request');
    }

    config.log('📡 Sending request to:', `${BACKEND_URL}${API_ENDPOINTS.CREATE_MERCHANT}`);

    const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.CREATE_MERCHANT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    config.log('✅ Merchant created successfully:', data);
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('❌ Create merchant failed:', appError);
    throw appError;
  }
};

// Get merchant status
export const getMerchantStatusInternal = async (): Promise<MerchantStatusResponse> => {
  const config = ConfigManager.getInstance();
  
  try {
    config.log('🔍 Fetching merchant status');

    const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.GET_MERCHANT_STATUS}`, {
      method: 'GET',
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

    config.log('✅ Merchant status fetched:', data);
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('❌ Fetch status failed:', appError);
    throw appError;
  }
};

// Refresh token
export const refreshMerchantTokenInternal = async (): Promise<{ token: string }> => {
  const config = ConfigManager.getInstance();
  
  try {
    config.log('🔄 Refreshing token');

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

    config.log('✅ Token refreshed successfully');
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('❌ Token refresh failed:', appError);
    throw appError;
  }
};

// Verify public key
export const verifyPublicKey = async (publicKey: string): Promise<{ valid: boolean; merchantData?: any }> => {
  const config = ConfigManager.getInstance();
  
  try {
    config.log('🔑 Verifying public key:', publicKey.substring(0, 8) + '...');

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
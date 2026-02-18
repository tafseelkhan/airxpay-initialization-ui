// src/api/merchantProxy.ts

import { CreateMerchantPayload, MerchantCreateResponse, MerchantStatusResponse } from '../types/merchantTypes';
import { ConfigManager } from '../options/configOptions';
import { PayloadValidator } from '../schema/validators';
import { ErrorHandler } from '../error/errorHandler';
import { API_ENDPOINTS } from '../etc/constants';

const BACKEND_URL = 'http://your-backend-server.com'; // Replace with your backend URL

// Initialize SDK with public key
export const initializeInternalApi = (publicKey: string): void => {
  const config = ConfigManager.getInstance();
  
  // Validate public key
  const errors = PayloadValidator.validatePublicKey(publicKey);
  if (errors.length > 0) {
    throw new Error(errors[0].message);
  }

  config.setFrontendConfig({ publicKey });
  config.log('AirXPay SDK initialized with public key:', publicKey.substring(0, 8) + '...');
};

// Create merchant via backend proxy
export const createMerchantInternal = async (
  payload: CreateMerchantPayload
): Promise<MerchantCreateResponse> => {
  const config = ConfigManager.getInstance();
  
  try {
    // Validate payload before sending
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

    config.log('Creating merchant with payload:', payload);

    // Get public key
    const publicKey = config.getPublicKey();

    // Send to backend proxy
    const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.CREATE_MERCHANT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        publicKey // Send public key to backend
      }),
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

    config.log('Merchant created successfully:', data);
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('Create merchant failed:', appError);
    throw appError;
  }
};

// Get merchant status
export const getMerchantStatusInternal = async (): Promise<MerchantStatusResponse> => {
  const config = ConfigManager.getInstance();
  
  try {
    config.log('Fetching merchant status');

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

    config.log('Merchant status fetched:', data);
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('Fetch status failed:', appError);
    throw appError;
  }
};

// Refresh token
export const refreshMerchantTokenInternal = async (): Promise<{ token: string }> => {
  const config = ConfigManager.getInstance();
  
  try {
    config.log('Refreshing token');

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

    config.log('Token refreshed successfully');
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('Token refresh failed:', appError);
    throw appError;
  }
};

// ✅ ADDED: Verify public key function - YE FUNCTION MISSING THA
export const verifyPublicKey = async (publicKey: string): Promise<{ valid: boolean; merchantData?: any }> => {
  const config = ConfigManager.getInstance();
  
  try {
    config.log('Verifying public key:', publicKey.substring(0, 8) + '...');

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

    config.log('Public key verified successfully');
    return data;
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    config.error('Public key verification failed:', appError);
    throw appError;
  }
};
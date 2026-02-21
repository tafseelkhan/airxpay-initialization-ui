// src/api/client.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ConfigManager } from '../../options/configOptions';
import { getStoredToken } from '../../utils/tokenStorage';
import { TokenRefreshPlugin } from '../../plugins/tokenRefreshPlugin';
import { API_TIMEOUTS } from '../../etc/constants';
import { EventEmitter } from '../../core/events/EventEmitter';
import { EventMap } from '../../core/events/types';

export const createApiClient = (
  baseURL: string,
  events?: EventEmitter<EventMap>
): AxiosInstance => {
  const config = ConfigManager.getInstance();
  const vault = config.getVault();
  
  const client = axios.create({
    baseURL,
    timeout: API_TIMEOUTS.DEFAULT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - SIRF 3 KEYS
  client.interceptors.request.use(
    async (request: InternalAxiosRequestConfig) => {
      
      // 1️⃣ PUBLIC KEY from vault
      try {
        const publicKey = vault.hasKey('publicKey') 
          ? vault.getKey('publicKey') 
          : config.getPublicKey();
        
        if (publicKey) {
          request.headers['X-Public-Key'] = publicKey;
        }
      } catch {
        // Public key not set yet
      }

      // 2️⃣ SECRET KEY from vault
      try {
        const secretKey = vault.hasKey('secretKey') 
          ? vault.getKey('secretKey') 
          : null;
        
        if (secretKey) {
          request.headers['Authorization'] = `Bearer ${secretKey}`;
        }
      } catch {
        // Secret key not set yet
      }

      // 3️⃣ CLIENT KEY from vault
      try {
        const clientKey = vault.hasKey('clientKey') 
          ? vault.getKey('clientKey') 
          : null;
        
        if (clientKey) {
          request.headers['X-Client-Key'] = clientKey;
        }
      } catch {
        // Client key not set yet
      }

      config.log('API Request:', {
        url: request.url,
        method: request.method,
        hasPublicKey: !!request.headers['X-Public-Key'],
        hasSecretKey: !!request.headers['Authorization'],
        hasClientKey: !!request.headers['X-Client-Key']
      });

      return request;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor (same as before)
  client.interceptors.response.use(
    (response) => {
      config.log('API Response:', {
        url: response.config.url,
        status: response.status
      });
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await TokenRefreshPlugin.refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};
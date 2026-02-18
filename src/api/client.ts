// src/api/client.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ConfigManager } from '../options/configOptions';
import { getStoredToken } from '../utils/tokenStorage';
import { TokenRefreshPlugin } from '../plugins/tokenRefreshPlugin';
import { API_TIMEOUTS } from '../etc/constants';

export const createApiClient = (baseURL: string): AxiosInstance => {
  const config = ConfigManager.getInstance();
  const client = axios.create({
    baseURL,
    timeout: API_TIMEOUTS.DEFAULT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    async (request: InternalAxiosRequestConfig) => {
      // Add public key to headers
      try {
        const publicKey = config.getPublicKey();
        request.headers['X-Public-Key'] = publicKey;
      } catch {
        // Public key not set yet
      }

      // Add auth token if available
      const token = await TokenRefreshPlugin.getValidToken();
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }

      config.log('API Request:', {
        url: request.url,
        method: request.method,
        hasToken: !!token
      });

      return request;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
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

      // Handle 401 Unauthorized - token expired
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
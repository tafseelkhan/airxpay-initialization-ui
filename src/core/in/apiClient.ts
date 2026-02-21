// src/utils/apiClient.ts

import { tokenManager } from '../../utils/token/tokenManager';
import { ConfigManager } from '../../options/configOptions';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  retryOnRefresh?: boolean;
}

class ApiClient {
  private config: ConfigManager;

  constructor() {
    this.config = ConfigManager.getInstance();
  }

  /**
   * Make authenticated request with token auto-refresh
   */
  async request<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, retryOnRefresh = true, ...fetchOptions } = options;

    // Prepare headers
    const headers = new Headers(fetchOptions.headers || {});
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Add public key if available
    try {
      const config = this.config.getFrontendConfig();
      if (config?.publicKey) {
        headers.set('X-Public-Key', config.publicKey);
      }
    } catch {
      // Public key not set
    }

    // Add auth token if required
    if (requiresAuth) {
      const token = await tokenManager.getValidToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Make request
    let response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 - Token expired
    if (response.status === 401 && requiresAuth && retryOnRefresh) {
      this.config.log('🔄 401 received, attempting token refresh...');

      try {
        // Refresh token
        const newToken = await tokenManager.refreshToken();

        // Retry request with new token
        headers.set('Authorization', `Bearer ${newToken}`);
        
        response = await fetch(url, {
          ...fetchOptions,
          headers,
        });

        if (!response.ok) {
          throw await this.handleError(response);
        }

        return response.json();
      } catch (refreshError) {
        this.config.error('❌ Token refresh failed:', refreshError);
        throw refreshError;
      }
    }

    // Handle non-200 responses
    if (!response.ok) {
      throw await this.handleError(response);
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Handle error response
   */
  private async handleError(response: Response): Promise<Error> {
    try {
      const data = await response.json();
      const error = new Error(data.message || data.userMessage || 'Request failed');
      (error as any).status = response.status;
      (error as any).data = data;
      return error;
    } catch {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      (error as any).status = response.status;
      return error;
    }
  }
}

export const apiClient = new ApiClient();
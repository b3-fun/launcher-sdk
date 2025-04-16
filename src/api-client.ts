import { ApiResponse, SDKConfig } from './types';

/**
 * API Client for making requests to the backend
 */
export class ApiClient {
  private baseUrl: string = "https://api.basement.fun";
  private debug: boolean;

  constructor(config: SDKConfig) {
    this.debug = config.debug || false;
  }


  /**
   * Makes a GET request to the API
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Makes a POST request to the API
   */
  async post<T>(endpoint: string, method: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(method),
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }


  private getHeaders(xServiceMethod?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (xServiceMethod && xServiceMethod != "") {
      headers['X-Service-Method'] = xServiceMethod;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      if (this.debug) {
        console.error('API Error:', data);
      }
      
      return {
        success: false,
        error: {
          code: data.error?.code || 'unknown_error',
          message: data.error?.message || 'An unknown error occurred',
        },
      };
    }
    
    return {
      success: true,
      data: data as T,
    };
  }

  private handleError<T>(error: any): ApiResponse<T> {
    if (this.debug) {
      console.error('SDK Error:', error);
    }
    
    return {
      success: false,
      error: {
        code: 'network_error',
        message: error.message || 'A network error occurred',
      },
    };
  }
} 
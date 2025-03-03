import { HttpClient, HttpMethod, HttpRequestOptions, HttpResponse, HttpError, RateLimitError } from './http-client';
import fetch from 'cross-fetch';
import AbortController from 'abort-controller';

/**
 * Implementation of HttpClient using the Fetch API
 */
export class FetchClient implements HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultParams: Record<string, string | number>;
  private defaultOptions: Partial<HttpRequestOptions>;

  /**
   * Create a new FetchClient
   * @param baseUrl - Base URL for API requests
   * @param defaultHeaders - Default headers to include in all requests
   * @param defaultOptions - Default request options
   */
  constructor(
    baseUrl: string = '',
    defaultHeaders: Record<string, string> = {},
    defaultOptions: Partial<HttpRequestOptions> = {}
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
    this.defaultParams = {};
    this.defaultOptions = defaultOptions;
  }

  /**
   * Set default request headers
   * @param headers - Headers to set
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set default query parameters
   * @param params - Parameters to set
   */
  setDefaultParams(params: Record<string, string | number>): void {
    this.defaultParams = { ...this.defaultParams, ...params };
  }

  /**
   * Send an HTTP request
   * @param method - HTTP method
   * @param url - Request URL or path (appended to baseUrl)
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  async request<T = any>(
    method: HttpMethod,
    url: string,
    options: HttpRequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const mergedOptions = this.mergeOptions(options);
    const fullUrl = this.buildUrl(url, mergedOptions.params);
    const controller = new AbortController();
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...(mergedOptions.headers || {})
      },
      signal: controller.signal as any // Type assertion to bypass AbortSignal compatibility issues
    };

    if (mergedOptions.body) {
      fetchOptions.body = JSON.stringify(mergedOptions.body);
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json'
      };
    }

    // Set up timeout if specified
    let timeoutId: NodeJS.Timeout | null = null;
    if (mergedOptions.timeout) {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, mergedOptions.timeout);
    }

    try {
      const response = await this.executeRequest(fullUrl, fetchOptions, mergedOptions);
      
      // Clean up timeout if it was set
      if (timeoutId) clearTimeout(timeoutId);
      
      return await this.parseResponse<T>(response, fullUrl);
    } catch (error: any) {
      // Clean up timeout if it was set
      if (timeoutId) clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new HttpError('Request timeout', 408, 'Request Timeout', fullUrl);
      }
      
      throw error;
    }
  }

  /**
   * Send a GET request
   * @param url - Request URL
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  async get<T = any>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, options);
  }

  /**
   * Send a POST request
   * @param url - Request URL
   * @param body - Request body
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  async post<T = any>(url: string, body?: any, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, { ...options, body });
  }

  /**
   * Send a PUT request
   * @param url - Request URL
   * @param body - Request body
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  async put<T = any>(url: string, body?: any, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, { ...options, body });
  }

  /**
   * Send a DELETE request
   * @param url - Request URL
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  async delete<T = any>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, options);
  }

  /**
   * Build a complete URL from path and query parameters
   * @param path - URL path
   * @param params - Query parameters
   * @returns Complete URL string
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    // Handle absolute URLs
    const baseUrl = path.startsWith('http') ? '' : this.baseUrl;
    let url = `${baseUrl}${path}`;

    // Add query parameters if provided
    if (params && Object.keys(params).length > 0) {
      const queryParams = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          // Handle arrays
          if (Array.isArray(value)) {
            return `${key}=${value.join(',')}`;
          }
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join('&');

      url += url.includes('?') ? `&${queryParams}` : `?${queryParams}`;
    }

    return url;
  }

  /**
   * Merge user-provided options with defaults
   * @param options - Request options
   * @returns Merged options
   */
  private mergeOptions(options: HttpRequestOptions): HttpRequestOptions {
    return {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...(this.defaultOptions.headers || {}),
        ...(options.headers || {})
      },
      params: {
        ...this.defaultParams,
        ...(this.defaultOptions.params || {}),
        ...(options.params || {})
      }
    };
  }

  /**
   * Execute an HTTP request with retry logic
   * @param url - Full request URL
   * @param options - Fetch options
   * @param requestOptions - Request options including retry settings
   * @returns Promise resolving to a Response
   */
  private async executeRequest(
    url: string, 
    options: RequestInit,
    requestOptions: HttpRequestOptions
  ): Promise<Response> {
    const retry = requestOptions.retry ?? this.defaultOptions.retry ?? false;
    const maxRetries = requestOptions.maxRetries ?? this.defaultOptions.maxRetries ?? 3;
    const initialDelay = requestOptions.retryDelay ?? this.defaultOptions.retryDelay ?? 300;
    
    let lastError: Error | null = null;
    let retryCount = 0;
    
    while (retryCount <= maxRetries) {
      try {
        const response = await fetch(url, options);
        
        // If we hit a rate limit and should retry, handle it
        if (response.status === 429 && retry && retryCount < maxRetries) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '1', 10) * 1000;
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          retryCount++;
          continue;
        }
        
        return response;
      } catch (error: any) {
        // Network errors can be retried
        if (error.name === 'TypeError' && retry && retryCount < maxRetries) {
          lastError = error;
          await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, retryCount)));
          retryCount++;
          continue;
        }
        
        throw error;
      }
    }
    
    // If we've exhausted retries, throw the last error
    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Parse a fetch Response into an HttpResponse
   * @param response - Fetch Response object
   * @param url - Request URL
   * @returns Promise resolving to an HttpResponse
   */
  private async parseResponse<T>(response: Response, url: string): Promise<HttpResponse<T>> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '1', 10) * 1000;
        throw new RateLimitError(
          `Rate limit exceeded: ${data.status_message || 'Too many requests'}`,
          response.status,
          response.statusText,
          url,
          retryAfter,
          data
        );
      }
      
      throw new HttpError(
        `HTTP Error: ${data.status_message || response.statusText || 'Unknown error'}`,
        response.status,
        response.statusText,
        url,
        data
      );
    }
    
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
      url
    };
  }
}

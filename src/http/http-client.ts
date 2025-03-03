/**
 * HTTP request method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * HTTP request options
 */
export interface HttpRequestOptions {
  /** Query parameters */
  params?: Record<string, any>;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body */
  body?: any;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Whether to retry the request on failure */
  retry?: boolean;
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Initial retry delay in milliseconds */
  retryDelay?: number;
  /** Whether to cache the response */
  cache?: boolean;
  /** Cache TTL in milliseconds */
  cacheTtl?: number;
}

/**
 * HTTP response interface
 */
export interface HttpResponse<T = any> {
  /** Response data */
  data: T;
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** Response headers */
  headers: Record<string, string>;
  /** Request URL */
  url: string;
}

/**
 * Interface for HTTP clients
 */
export interface HttpClient {
  /**
   * Send an HTTP request
   * @param method - HTTP method
   * @param url - Request URL
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  request<T = any>(
    method: HttpMethod,
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>>;
  
  /**
   * Send a GET request
   * @param url - Request URL
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  get<T = any>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
  
  /**
   * Send a POST request
   * @param url - Request URL
   * @param body - Request body
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  post<T = any>(url: string, body?: any, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
  
  /**
   * Send a PUT request
   * @param url - Request URL
   * @param body - Request body
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  put<T = any>(url: string, body?: any, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
  
  /**
   * Send a DELETE request
   * @param url - Request URL
   * @param options - Request options
   * @returns Promise resolving to an HttpResponse
   */
  delete<T = any>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
  
  /**
   * Set default request headers
   * @param headers - Headers to set
   */
  setDefaultHeaders(headers: Record<string, string>): void;
  
  /**
   * Set default query parameters
   * @param params - Parameters to set
   */
  setDefaultParams(params: Record<string, string | number>): void;
}

/**
 * HTTP error class
 */
export class HttpError extends Error {
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** Response data */
  data?: any;
  /** Request URL */
  url: string;

  /**
   * Create a new HttpError
   * @param message - Error message
   * @param status - HTTP status code
   * @param statusText - HTTP status text
   * @param url - Request URL
   * @param data - Response data
   */
  constructor(
    message: string,
    status: number,
    statusText: string,
    url: string,
    data?: any
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.data = data;
  }
}

/**
 * Rate limit error class
 */
export class RateLimitError extends HttpError {
  /** Time to wait before retrying (in milliseconds) */
  retryAfter?: number;

  /**
   * Create a new RateLimitError
   * @param message - Error message
   * @param status - HTTP status code
   * @param statusText - HTTP status text
   * @param url - Request URL
   * @param retryAfter - Time to wait before retrying (in milliseconds)
   * @param data - Response data
   */
  constructor(
    message: string,
    status: number,
    statusText: string,
    url: string,
    retryAfter?: number,
    data?: any
  ) {
    super(message, status, statusText, url, data);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

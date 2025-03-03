import { HttpClient } from '../http/http-client';
import { UrlHelper } from '../utils/url-helper';
import { Cache } from '../utils/cache';

/**
 * Base class for API resources
 */
export abstract class BaseResource {
  protected http: HttpClient;
  protected baseUrl: string;
  protected cache: Cache | null;
  protected language: string;
  
  /**
   * Create a new BaseResource
   * @param http - HTTP client
   * @param baseUrl - API base URL
   * @param cache - Cache instance or null if caching is disabled
   * @param language - Default language for requests
   */
  constructor(http: HttpClient, baseUrl: string, cache: Cache | null = null, language: string = 'en-US') {
    this.http = http;
    this.baseUrl = baseUrl;
    this.cache = cache;
    this.language = language;
  }
  
  /**
   * Send a GET request with optional caching
   * @param path - API endpoint path
   * @param params - Query parameters
   * @param options - Request options
   * @returns Promise resolving to response data
   */
  protected async get<T>(
    path: string, 
    params: Record<string, any> = {}, 
    options: { cache?: boolean; cacheTtl?: number } = {}
  ): Promise<T> {
    // Handle language parameter
    if (this.language && !params.language) {
      params.language = this.language;
    }
    
    // Check cache first if enabled and not explicitly disabled
    const shouldUseCache = this.cache !== null && options.cache !== false;
    const cacheKey = this.getCacheKey(path, params);
    
    if (shouldUseCache && this.cache!.has(cacheKey)) {
      return this.cache!.get(cacheKey) as T;
    }
    
    // Make the request
    const response = await this.http.get<T>(path, { params });
    
    // Cache the result if caching is enabled
    if (shouldUseCache) {
      this.cache!.set(cacheKey, response.data, options.cacheTtl);
    }
    
    return response.data;
  }
  
  /**
   * Send a POST request
   * @param path - API endpoint path
   * @param body - Request body
   * @param params - Query parameters
   * @returns Promise resolving to response data
   */
  protected async post<T>(path: string, body: any, params: Record<string, any> = {}): Promise<T> {
    // Handle language parameter
    if (this.language && !params.language) {
      params.language = this.language;
    }
    
    const response = await this.http.post<T>(path, body, { params });
    return response.data;
  }
  
  /**
   * Build a path with parameters
   * @param path - Path template with placeholders
   * @param params - Parameters to replace in the path
   * @returns Processed path
   */
  protected buildPath(path: string, params: Record<string, any>): string {
    return UrlHelper.replacePath(path, params);
  }
  
  /**
   * Generate a cache key for a request
   * @param path - API path
   * @param params - Request parameters
   * @returns Cache key string
   */
  private getCacheKey(path: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);
    
    return `${path}:${JSON.stringify(sortedParams)}`;
  }
}
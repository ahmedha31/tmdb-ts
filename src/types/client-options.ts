/**
 * Authentication method options
 */
export interface AuthOptions {
  /** TMDB API Key */
  apiKey?: string;
}

/**
 * HTTP client configuration options
 */
export interface HttpOptions {
  /** Base URL for the API */
  baseUrl?: string;
  /** Default timeout in milliseconds */
  timeout?: number;
  /** Whether to enable request retries */
  retry?: boolean;
  /** Maximum number of retries */
  maxRetries?: number;
  /** Initial retry delay in milliseconds */
  retryDelay?: number;
}

/**
 * Cache configuration options
 */
export interface CacheOptions {
  /** Whether to enable response caching */
  enabled?: boolean;
  /** Maximum cache size in items */
  maxSize?: number;
  /** Default cache TTL in milliseconds */
  ttl?: number;
}

/**
 * Configuration options for the TMDB client
 */
export interface TMDBClientOptions {
  /** Authentication options */
  auth: AuthOptions;
  /** HTTP client options */
  http?: HttpOptions;
  /** Cache options */
  cache?: CacheOptions;
  /** Default language for requests (ISO 639-1 code) */
  language?: string;
  /** Default region for requests (ISO 3166-1 code) */
  region?: string;
  /** Whether to include adult content in responses */
  includeAdult?: boolean;
}

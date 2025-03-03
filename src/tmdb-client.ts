import { FetchClient } from './http/fetch-client';
import { API_CONFIG } from './config/api-config';
import { TMDBClientOptions } from './types/client-options';
import { Cache } from './utils/cache';
import { AuthManager } from './authentication/auth-manager';
import { MoviesResource } from './resources/movies-resource';
import { TVResource } from './resources/tv-resource';
import { SearchResource } from './resources/search-resource';
import { PeopleResource } from './resources/people-resource';
import { DiscoverResource } from './resources/discover-resource';
import { TrendingResource } from './resources/trending-resource';
import { ConfigurationResource } from './resources/configuration-resource';
import { UrlHelper, ImageUrlOptions } from './utils/url-helper';
import { ImageSizeType } from './types/common';

/**
 * Main client class for The Movie Database API
 */
export class TMDBClient {
  /** Movies API */
  readonly movies: MoviesResource;
  /** TV Shows API */
  readonly tv: TVResource;
  /** Search API */
  readonly search: SearchResource;
  /** People API */
  readonly people: PeopleResource;
  /** Discover API */
  readonly discover: DiscoverResource;
  /** Trending API */
  readonly trending: TrendingResource;
  /** Configuration API */
  readonly configuration: ConfigurationResource;
  /** Images helper */
  readonly images: typeof UrlHelper;
  /** Authentication manager */
  private readonly authManager: AuthManager;
  /** HTTP client */
  private readonly httpClient: FetchClient;
  /** Cache instance */
  private readonly cache: Cache | null;
  /** Default language */
  private readonly language: string;

  /**
   * Create a new TMDB client
   * @param options - Client options
   */
  constructor(options: TMDBClientOptions) {
    // Validate options
    if (!options.auth.apiKey && !options.auth.accessToken) {
      throw new Error('Either apiKey or accessToken must be provided');
    }
    
    // Set up HTTP client
    const baseUrl = options.http?.baseUrl || API_CONFIG.BASE_URL;
    this.httpClient = new FetchClient(baseUrl, {}, {
      timeout: options.http?.timeout || 10000,
      retry: options.http?.retry ?? true,
      maxRetries: options.http?.maxRetries || 3,
      retryDelay: options.http?.retryDelay || 1000
    });
    
    // Set up authentication
    if (options.auth.apiKey) {
      // Add API key as a default parameter to all requests
      this.httpClient.setDefaultParams({
        api_key: options.auth.apiKey
      });
    } else if (options.auth.accessToken) {
      // Use Bearer token authentication
      this.httpClient.setDefaultHeaders({
        Authorization: `Bearer ${options.auth.accessToken}`
      });
    }
    
    // Set up cache if enabled
    this.cache = options.cache?.enabled !== false
      ? new Cache(
          options.cache?.maxSize || 100,
          options.cache?.ttl || 5 * 60 * 1000
        )
      : null;
    
    // Set default language
    this.language = options.language || API_CONFIG.DEFAULT_LANGUAGE;
    
    // Create authentication manager
    this.authManager = new AuthManager(
      this.httpClient,
      options.auth.apiKey || '',
      options.auth.sessionId
    );

    // Initialize resources
    this.movies = new MoviesResource(this.httpClient, baseUrl, this.cache, this.language);
    this.tv = new TVResource(this.httpClient, baseUrl, this.cache, this.language);
    this.search = new SearchResource(this.httpClient, baseUrl, this.cache, this.language);
    this.people = new PeopleResource(this.httpClient, baseUrl, this.cache, this.language);
    this.discover = new DiscoverResource(this.httpClient, baseUrl, this.cache, this.language);
    this.trending = new TrendingResource(this.httpClient, baseUrl, this.cache, this.language);
    this.configuration = new ConfigurationResource(this.httpClient, baseUrl, this.cache, this.language);
    
    // Set image helper
    this.images = UrlHelper;
  }

  /**
   * Get image URL helper
   * @returns URL helper object
   */
  getImageUrl(options: ImageUrlOptions, type: ImageSizeType = 'poster'): string | null {
    return UrlHelper.getImageUrl(options, type);
  }

  /**
   * Authenticate with username and password
   * @param username - TMDB username
   * @param password - TMDB password
   * @returns Promise resolving to session ID
   */
  async authenticate(username: string, password: string): Promise<string> {
    return this.authManager.authenticate(username, password);
  }
  
  /**
   * Set a session ID
   * @param sessionId - Session ID
   */
  setSessionId(sessionId: string): void {
    this.authManager.setSessionId(sessionId);
  }

  /**
   * Get the session ID
   * @returns Session ID or null if not authenticated
   */
  getSessionId(): string | null {
    return this.authManager.getSessionId();
  }

  /**
   * Check if a session is active
   * @returns True if a session ID is present, false otherwise
   */
  hasSession(): boolean {
    return this.authManager.hasSession();
  }
}

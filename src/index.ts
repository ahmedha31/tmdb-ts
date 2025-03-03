/**
 * TMDB TypeScript SDK
 * @module tmdb-typescript-sdk
 */

// Main client export
export { TMDBClient } from './tmdb-client';

// Types
export * from './types/client-options';
export * from './types/common';
export * from './types/movies';
export * from './types/tv';
export * from './types/people';
export * from './types/configuration';

// HTTP
export { HttpClient, HttpError, RateLimitError } from './http/http-client';
export { FetchClient } from './http/fetch-client';

// Utils
export { Cache } from './utils/cache';
export { UrlHelper, ImageUrlOptions } from './utils/url-helper';

// Resources
export { MoviesResource } from './resources/movies-resource';
export { TVResource } from './resources/tv-resource';
export { SearchResource } from './resources/search-resource';
export { PeopleResource } from './resources/people-resource';
export { DiscoverResource } from './resources/discover-resource';
export { TrendingResource } from './resources/trending-resource';
export { ConfigurationResource } from './resources/configuration-resource';

// Authentication
export { AuthManager } from './authentication/auth-manager';

// API Config
export { API_CONFIG, ENDPOINTS, IMAGE_SIZES } from './config/api-config';

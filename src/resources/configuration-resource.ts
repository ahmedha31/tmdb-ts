import { BaseResource } from './base-resource';
import { ENDPOINTS } from '../config/api-config';
import { ApiConfiguration, GenreListResponse } from '../types/configuration';

/**
 * Configuration API resource class
 */
export class ConfigurationResource extends BaseResource {
  /**
   * Get API configuration
   * @returns Promise resolving to API configuration
   */
  async getApiConfiguration(): Promise<ApiConfiguration> {
    return this.get<ApiConfiguration>(ENDPOINTS.CONFIGURATION);
  }

  /**
   * Get movie genres
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to movie genres
   */
  async getMovieGenres(language?: string): Promise<GenreListResponse> {
    return this.get<GenreListResponse>(ENDPOINTS.GENRE_MOVIE_LIST, { language });
  }

  /**
   * Get TV show genres
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to TV genres
   */
  async getTVGenres(language?: string): Promise<GenreListResponse> {
    return this.get<GenreListResponse>(ENDPOINTS.GENRE_TV_LIST, { language });
  }
}

import { BaseResource } from './base-resource';
import { ENDPOINTS } from '../config/api-config';
import { PaginatedResponse, MediaType, TimeWindow } from '../types/common';

/**
 * Trending API resource class for trending content
 */
export class TrendingResource extends BaseResource {
  /**
   * Get trending items
   * @param mediaType - Type of media (movie, tv, person, or all)
   * @param timeWindow - Time window (day or week)
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to paginated trending results
   */
  async getAll<T = any>(
    mediaType: MediaType | 'all',
    timeWindow: TimeWindow,
    page: number = 1,
    language?: string
  ): Promise<PaginatedResponse<T>> {
    const path = this.buildPath(ENDPOINTS.TRENDING, {
      media_type: mediaType,
      time_window: timeWindow
    });
    
    return this.get<PaginatedResponse<T>>(path, {
      page,
      language
    });
  }

  /**
   * Get trending movies
   * @param timeWindow - Time window (day or week)
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to paginated trending movies
   */
  async getMovies<T = any>(
    timeWindow: TimeWindow,
    page: number = 1,
    language?: string
  ): Promise<PaginatedResponse<T>> {
    return this.getAll<T>(MediaType.Movie, timeWindow, page, language);
  }

  /**
   * Get trending TV shows
   * @param timeWindow - Time window (day or week)
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to paginated trending TV shows
   */
  async getTVShows<T = any>(
    timeWindow: TimeWindow,
    page: number = 1,
    language?: string
  ): Promise<PaginatedResponse<T>> {
    return this.getAll<T>(MediaType.Tv, timeWindow, page, language);
  }

  /**
   * Get trending people
   * @param timeWindow - Time window (day or week)
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to paginated trending people
   */
  async getPeople<T = any>(
    timeWindow: TimeWindow,
    page: number = 1,
    language?: string
  ): Promise<PaginatedResponse<T>> {
    return this.getAll<T>(MediaType.Person, timeWindow, page, language);
  }
}

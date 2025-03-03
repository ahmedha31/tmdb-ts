import { BaseResource } from './base-resource';
import { ENDPOINTS } from '../config/api-config';
import { MovieListResult, MovieDiscoverParams } from '../types/movies';
import { TVShowListResult, TVDiscoverParams } from '../types/tv';
import { PaginatedResponse } from '../types/common';

/**
 * Discover API resource class for finding content based on filters
 */
export class DiscoverResource extends BaseResource {
  /**
   * Discover movies based on filters
   * @param params - Movie discovery parameters
   * @returns Promise resolving to paginated movie results
   */
  async movies(params: MovieDiscoverParams): Promise<PaginatedResponse<MovieListResult>> {
    return this.get<PaginatedResponse<MovieListResult>>(ENDPOINTS.DISCOVER_MOVIE, {
      language: params.language,
      page: params.page,
      sort_by: params.sort_by,
      include_adult: params.include_adult,
      include_video: params.include_video,
      primary_release_year: params.primary_release_year,
      'primary_release_date.gte': params['primary_release_date.gte'],
      'primary_release_date.lte': params['primary_release_date.lte'],
      'release_date.gte': params['release_date.gte'],
      'release_date.lte': params['release_date.lte'],
      'vote_count.gte': params['vote_count.gte'],
      'vote_average.gte': params['vote_average.gte'],
      'vote_average.lte': params['vote_average.lte'],
      with_genres: params.with_genres,
      without_genres: params.without_genres,
      with_keywords: params.with_keywords,
      certification: params.certification,
      certification_country: params.certification_country,
      'certification.gte': params['certification.gte'],
      'certification.lte': params['certification.lte'],
      with_original_language: params.with_original_language
    });
  }

  /**
   * Discover TV shows based on filters
   * @param params - TV discovery parameters
   * @returns Promise resolving to paginated TV show results
   */
  async tvShows(params: TVDiscoverParams): Promise<PaginatedResponse<TVShowListResult>> {
    return this.get<PaginatedResponse<TVShowListResult>>(ENDPOINTS.DISCOVER_TV, {
      language: params.language,
      page: params.page,
      sort_by: params.sort_by,
      first_air_date_year: params.first_air_date_year,
      'first_air_date.gte': params['first_air_date.gte'],
      'first_air_date.lte': params['first_air_date.lte'],
      'vote_count.gte': params['vote_count.gte'],
      'vote_average.gte': params['vote_average.gte'],
      with_networks: params.with_networks,
      with_genres: params.with_genres,
      without_genres: params.without_genres,
      with_keywords: params.with_keywords,
      with_runtime: params.with_runtime,
      with_original_language: params.with_original_language
    });
  }
}

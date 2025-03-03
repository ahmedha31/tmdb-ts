import { BaseResource } from './base-resource';
import { ENDPOINTS } from '../config/api-config';
import { MovieListResult, MovieSearchParams } from '../types/movies';
import { TVShowListResult, TVSearchParams } from '../types/tv';
import { PaginatedResponse, MediaType } from '../types/common';

/**
 * Person result from search
 */
interface PersonListResult {
  id: number;
  name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  known_for_department: string;
  gender: number;
  known_for: any[];
}

/**
 * Multi-search result item
 */
interface MultiSearchResult {
  id: number;
  media_type: MediaType;
  // Properties from MovieListResult, TVShowListResult, or PersonListResult
  [key: string]: any;
}

/**
 * Parameters for person search
 */
interface PersonSearchParams {
  query: string;
  language?: string;
  page?: number;
  include_adult?: boolean;
  region?: string;
}

/**
 * Parameters for multi search
 */
interface MultiSearchParams {
  query: string;
  language?: string;
  page?: number;
  include_adult?: boolean;
  region?: string;
}

/**
 * Search API resource class
 */
export class SearchResource extends BaseResource {
  /**
   * Search for movies
   * @param params - Movie search parameters
   * @returns Promise resolving to paginated movie results
   */
  async movies(params: MovieSearchParams): Promise<PaginatedResponse<MovieListResult>> {
    return this.get<PaginatedResponse<MovieListResult>>(ENDPOINTS.SEARCH_MOVIE, {
      query: params.query,
      language: params.language,
      page: params.page,
      include_adult: params.include_adult,
      region: params.region,
      year: params.year,
      primary_release_year: params.primary_release_year
    });
  }

  /**
   * Search for TV shows
   * @param params - TV search parameters
   * @returns Promise resolving to paginated TV show results
   */
  async tvShows(params: TVSearchParams): Promise<PaginatedResponse<TVShowListResult>> {
    return this.get<PaginatedResponse<TVShowListResult>>(ENDPOINTS.SEARCH_TV, {
      query: params.query,
      language: params.language,
      page: params.page,
      include_adult: params.include_adult,
      first_air_date_year: params.first_air_date_year
    });
  }

  /**
   * Search for people
   * @param params - Person search parameters
   * @returns Promise resolving to paginated person results
   */
  async people(params: PersonSearchParams): Promise<PaginatedResponse<PersonListResult>> {
    return this.get<PaginatedResponse<PersonListResult>>(ENDPOINTS.SEARCH_PERSON, {
      query: params.query,
      language: params.language,
      page: params.page,
      include_adult: params.include_adult,
      region: params.region
    });
  }

  /**
   * Multi-search across movies, TV shows, and people
   * @param params - Multi search parameters
   * @returns Promise resolving to paginated multi-search results
   */
  async multi(params: MultiSearchParams): Promise<PaginatedResponse<MultiSearchResult>> {
    return this.get<PaginatedResponse<MultiSearchResult>>(ENDPOINTS.SEARCH_MULTI, {
      query: params.query,
      language: params.language,
      page: params.page,
      include_adult: params.include_adult,
      region: params.region
    });
  }
}
import { BaseResource } from './base-resource';
import { ENDPOINTS } from '../config/api-config';
import { 
  MovieDetails, 
  MovieCredits, 
  MovieListResult, 
  MovieDetailsParams 
} from '../types/movies';
import { PaginatedResponse, ImageCollection, Video } from '../types/common';

/**
 * Movies API resource class
 */
export class MoviesResource extends BaseResource {
  /**
   * Get movie details by ID
   * @param params - Movie details parameters
   * @param options - Request options
   * @returns Promise resolving to movie details
   */
  async getDetails(
    params: MovieDetailsParams, 
    options: { cache?: boolean } = {}
  ): Promise<MovieDetails> {
    const path = this.buildPath(ENDPOINTS.MOVIE_DETAILS, {
      movie_id: params.movieId
    });
    
    const queryParams: Record<string, any> = {};
    if (params.language) queryParams.language = params.language;
    if (params.appendToResponse) queryParams.append_to_response = params.appendToResponse;
    
    return this.get<MovieDetails>(path, queryParams, options);
  }

  /**
   * Get movie credits by movie ID
   * @param movieId - Movie ID
   * @param language - Language (ISO 639-1 code)
   * @param options - Request options
   * @returns Promise resolving to movie credits
   */
  async getCredits(
    movieId: number, 
    language?: string,
    options: { cache?: boolean } = {}
  ): Promise<MovieCredits> {
    const path = this.buildPath(ENDPOINTS.MOVIE_CREDITS, {
      movie_id: movieId
    });
    
    const queryParams: Record<string, any> = {};
    if (language) queryParams.language = language;
    
    return this.get<MovieCredits>(path, queryParams, options);
  }

  /**
   * Get movie images by movie ID
   * @param movieId - Movie ID
   * @param includeImageLanguage - Comma-separated list of ISO 639-1 language codes to include
   * @param options - Request options
   * @returns Promise resolving to movie images
   */
  async getImages(
    movieId: number, 
    includeImageLanguage?: string,
    options: { cache?: boolean } = {}
  ): Promise<ImageCollection> {
    const path = this.buildPath(ENDPOINTS.MOVIE_IMAGES, {
      movie_id: movieId
    });
    
    const queryParams: Record<string, any> = {};
    if (includeImageLanguage) queryParams.include_image_language = includeImageLanguage;
    
    return this.get<ImageCollection>(path, queryParams, options);
  }

  /**
   * Get movie videos by movie ID
   * @param movieId - Movie ID
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to movie videos
   */
  async getVideos(movieId: number, language?: string): Promise<{ id: number; results: Video[] }> {
    const path = this.buildPath(ENDPOINTS.MOVIE_VIDEOS, {
      movie_id: movieId
    });
    
    return this.get<{ id: number; results: Video[] }>(path, { language });
  }

  /**
   * Get movie recommendations by movie ID
   * @param movieId - Movie ID
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to movie recommendations
   */
  async getRecommendations(
    movieId: number,
    page: number = 1,
    language?: string
  ): Promise<PaginatedResponse<MovieListResult>> {
    const path = this.buildPath(ENDPOINTS.MOVIE_RECOMMENDATIONS, {
      movie_id: movieId
    });
    
    return this.get<PaginatedResponse<MovieListResult>>(path, { page, language });
  }

  /**
   * Get similar movies by movie ID
   * @param movieId - Movie ID
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to similar movies
   */
  async getSimilar(
    movieId: number,
    page: number = 1,
    language?: string
  ): Promise<PaginatedResponse<MovieListResult>> {
    const path = this.buildPath(ENDPOINTS.MOVIE_SIMILAR, {
      movie_id: movieId
    });
    
    return this.get<PaginatedResponse<MovieListResult>>(path, { page, language });
  }

  /**
   * Get popular movies
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @param region - Region (ISO 3166-1 code)
   * @param options - Request options
   * @returns Promise resolving to popular movies
   */
  async getPopular(
    page: number = 1,
    language?: string,
    region?: string,
    options: { cache?: boolean, cacheTtl?: number } = {}
  ): Promise<PaginatedResponse<MovieListResult>> {
    // Set a default cacheTtl for popular movies if not provided but cache is enabled
    if (options.cache && options.cacheTtl === undefined) {
      options.cacheTtl = 30 * 60 * 1000; // 30 minutes in milliseconds
    }
    
    const queryParams: Record<string, any> = {
      page
    };
    
    if (language) queryParams.language = language;
    if (region) queryParams.region = region;
    
    return this.get<PaginatedResponse<MovieListResult>>(
      ENDPOINTS.MOVIE_POPULAR, 
      queryParams,
      options
    );
  }

  /**
   * Get now playing movies
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @param region - Region (ISO 3166-1 code)
   * @returns Promise resolving to now playing movies
   */
  async getNowPlaying(
    page: number = 1,
    language?: string,
    region?: string
  ): Promise<PaginatedResponse<MovieListResult>> {
    return this.get<PaginatedResponse<MovieListResult>>(ENDPOINTS.MOVIE_NOW_PLAYING, {
      page,
      language,
      region
    });
  }

  /**
   * Get top rated movies
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @param region - Region (ISO 3166-1 code)
   * @returns Promise resolving to top rated movies
   */
  async getTopRated(
    page: number = 1,
    language?: string,
    region?: string
  ): Promise<PaginatedResponse<MovieListResult>> {
    return this.get<PaginatedResponse<MovieListResult>>(ENDPOINTS.MOVIE_TOP_RATED, {
      page,
      language,
      region
    });
  }

  /**
   * Get upcoming movies
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @param region - Region (ISO 3166-1 code)
   * @returns Promise resolving to upcoming movies
   */
  async getUpcoming(
    page: number = 1,
    language?: string,
    region?: string
  ): Promise<PaginatedResponse<MovieListResult>> {
    return this.get<PaginatedResponse<MovieListResult>>(ENDPOINTS.MOVIE_UPCOMING, {
      page,
      language,
      region
    });
  }
}

import { BaseResource } from './base-resource';
import { ENDPOINTS } from '../config/api-config';
import { 
  TVShowDetails, 
  TVCredits, 
  TVShowListResult, 
  TVDetailsParams, 
  TVSeasonParams,
  TVEpisodeParams,
  Season,
  Episode
} from '../types/tv';
import { PaginatedResponse, ImageCollection, Video } from '../types/common';

/**
 * TV Shows API resource class
 */
export class TVResource extends BaseResource {
  /**
   * Get TV show details by ID
   * @param params - TV details parameters
   * @param options - Request options
   * @returns Promise resolving to TV show details
   */
  async getDetails(
    params: TVDetailsParams,
    options: { cache?: boolean } = {}
  ): Promise<TVShowDetails> {
    const path = this.buildPath(ENDPOINTS.TV_DETAILS, {
      tv_id: params.tvId
    });
    
    const queryParams: Record<string, any> = {};
    if (params.language) queryParams.language = params.language;
    if (params.appendToResponse) queryParams.append_to_response = params.appendToResponse;
    
    return this.get<TVShowDetails>(path, queryParams, options);
  }

  /**
   * Get TV season details
   * @param params - TV season parameters
   * @param options - Request options
   * @returns Promise resolving to season details
   */
  async getSeason(
    params: TVSeasonParams,
    options: { cache?: boolean } = {}
  ): Promise<Season> {
    const path = this.buildPath(ENDPOINTS.TV_SEASON_DETAILS, {
      tv_id: params.tvId,
      season_number: params.seasonNumber
    });
    
    const queryParams: Record<string, any> = {};
    if (params.language) queryParams.language = params.language;
    if (params.appendToResponse) queryParams.append_to_response = params.appendToResponse;
    
    return this.get<Season>(path, queryParams, options);
  }

  /**
   * Get TV episode details
   * @param params - TV episode parameters
   * @param options - Request options
   * @returns Promise resolving to episode details
   */
  async getEpisode(
    params: TVEpisodeParams,
    options: { cache?: boolean } = {}
  ): Promise<Episode> {
    const path = this.buildPath(ENDPOINTS.TV_EPISODE_DETAILS, {
      tv_id: params.tvId,
      season_number: params.seasonNumber,
      episode_number: params.episodeNumber
    });
    
    const queryParams: Record<string, any> = {};
    if (params.language) queryParams.language = params.language;
    if (params.appendToResponse) queryParams.append_to_response = params.appendToResponse;
    
    return this.get<Episode>(path, queryParams, options);
  }

  /**
   * Get TV credits by TV ID
   * @param tvId - TV ID
   * @param language - Language (ISO 639-1 code)
   * @param options - Request options
   * @returns Promise resolving to TV credits
   */
  async getCredits(
    tvId: number, 
    language?: string,
    options: { cache?: boolean } = {}
  ): Promise<TVCredits> {
    const path = this.buildPath(ENDPOINTS.TV_CREDITS, {
      tv_id: tvId
    });
    
    const queryParams: Record<string, any> = {};
    if (language) queryParams.language = language;
    
    return this.get<TVCredits>(path, queryParams, options);
  }

  /**
   * Get TV images by TV ID
   * @param tvId - TV ID
   * @param includeImageLanguage - Comma-separated list of ISO 639-1 language codes to include
   * @param options - Request options
   * @returns Promise resolving to TV images
   */
  async getImages(
    tvId: number,
    includeImageLanguage?: string,
    options: { cache?: boolean } = {}
  ): Promise<ImageCollection> {
    const path = this.buildPath(ENDPOINTS.TV_IMAGES, {
      tv_id: tvId
    });
    
    const queryParams: Record<string, any> = {};
    if (includeImageLanguage) queryParams.include_image_language = includeImageLanguage;
    
    return this.get<ImageCollection>(path, queryParams, options);
  }

  /**
   * Get TV videos by TV ID
   * @param tvId - TV ID
   * @param language - Language (ISO 639-1 code)
   * @param options - Request options
   * @returns Promise resolving to TV videos
   */
  async getVideos(
    tvId: number,
    language?: string,
    options: { cache?: boolean } = {}
  ): Promise<{ id: number; results: Video[] }> {
    const path = this.buildPath(ENDPOINTS.TV_VIDEOS, {
      tv_id: tvId
    });
    
    const queryParams: Record<string, any> = {};
    if (language) queryParams.language = language;
    
    return this.get<{ id: number; results: Video[] }>(path, queryParams, options);
  }

  /**
   * Get similar TV shows by TV ID
   * @param tvId - TV ID
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @param options - Request options
   * @returns Promise resolving to similar TV shows
   */
  async getSimilar(
    tvId: number,
    page: number = 1,
    language?: string,
    options: { cache?: boolean } = {}
  ): Promise<PaginatedResponse<TVShowListResult>> {
    const path = this.buildPath(ENDPOINTS.TV_SIMILAR, {
      tv_id: tvId
    });
    
    const queryParams: Record<string, any> = { page };
    if (language) queryParams.language = language;
    
    return this.get<PaginatedResponse<TVShowListResult>>(path, queryParams, options);
  }

  /**
   * Get popular TV shows
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @param options - Request options
   * @returns Promise resolving to popular TV shows
   */
  async getPopular(
    page: number = 1,
    language?: string,
    options: { cache?: boolean } = {}
  ): Promise<PaginatedResponse<TVShowListResult>> {
    const queryParams: Record<string, any> = { page };
    if (language) queryParams.language = language;
    
    return this.get<PaginatedResponse<TVShowListResult>>(ENDPOINTS.TV_POPULAR, queryParams, options);
  }

  /**
   * Get top-rated TV shows
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @param options - Request options
   * @returns Promise resolving to top-rated TV shows
   */
  async getTopRated(
    page: number = 1,
    language?: string,
    options: { cache?: boolean } = {}
  ): Promise<PaginatedResponse<TVShowListResult>> {
    const queryParams: Record<string, any> = { page };
    if (language) queryParams.language = language;
    
    return this.get<PaginatedResponse<TVShowListResult>>(ENDPOINTS.TV_TOP_RATED, queryParams, options);
  }
}

import { BaseResource } from './base-resource';
import { ENDPOINTS } from '../config/api-config';
import { 
  PersonListResult, 
  PersonDetails, 
  PersonMovieCredits, 
  PersonTVCredits,
  PersonDetailsParams
} from '../types/people';
import { PaginatedResponse, ImageCollection } from '../types/common';

/**
 * People API resource class
 */
export class PeopleResource extends BaseResource {
  /**
   * Get person details by ID
   * @param params - Person details parameters
   * @returns Promise resolving to person details
   */
  async getDetails(params: PersonDetailsParams): Promise<PersonDetails> {
    const path = this.buildPath(ENDPOINTS.PERSON, {
      person_id: params.personId
    });
    
    return this.get<PersonDetails>(path, {
      language: params.language,
      append_to_response: params.appendToResponse
    });
  }

  /**
   * Get a person's movie credits
   * @param personId - Person ID
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to person's movie credits
   */
  async getMovieCredits(personId: number, language?: string): Promise<PersonMovieCredits> {
    const path = this.buildPath(ENDPOINTS.PERSON_MOVIE_CREDITS, {
      person_id: personId
    });
    
    return this.get<PersonMovieCredits>(path, { language });
  }

  /**
   * Get a person's TV credits
   * @param personId - Person ID
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to person's TV credits
   */
  async getTVCredits(personId: number, language?: string): Promise<PersonTVCredits> {
    const path = this.buildPath(ENDPOINTS.PERSON_TV_CREDITS, {
      person_id: personId
    });
    
    return this.get<PersonTVCredits>(path, { language });
  }

  /**
   * Get a person's images
   * @param personId - Person ID
   * @returns Promise resolving to person's images
   */
  async getImages(personId: number): Promise<{ id: number; profiles: ImageCollection['posters'] }> {
    const path = this.buildPath(ENDPOINTS.PERSON_IMAGES, {
      person_id: personId
    });
    
    return this.get<{ id: number; profiles: ImageCollection['posters'] }>(path);
  }

  /**
   * Get popular people
   * @param page - Page number
   * @param language - Language (ISO 639-1 code)
   * @returns Promise resolving to popular people
   */
  async getPopular(
    page: number = 1,
    language?: string
  ): Promise<PaginatedResponse<PersonListResult>> {
    return this.get<PaginatedResponse<PersonListResult>>(ENDPOINTS.PERSON_POPULAR, {
      page,
      language
    });
  }
}

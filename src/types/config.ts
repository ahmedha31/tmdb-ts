/**
 * TMDB API Configuration response
 */
export interface ApiConfiguration {
  /** Image configuration */
  images: {
    /** Base URL for images */
    base_url: string;
    /** Secure base URL for images */
    secure_base_url: string;
    /** Available backdrop image sizes */
    backdrop_sizes: string[];
    /** Available logo image sizes */
    logo_sizes: string[];
    /** Available poster image sizes */
    poster_sizes: string[];
    /** Available profile image sizes */
    profile_sizes: string[];
    /** Available still image sizes */
    still_sizes: string[];
  };
  /** Available change keys */
  change_keys: string[];
}

/**
 * Genre list response
 */
export interface GenreListResponse {
  /** List of genres */
  genres: {
    /** Genre ID */
    id: number;
    /** Genre name */
    name: string;
  }[];
}

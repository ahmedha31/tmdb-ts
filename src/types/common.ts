/**
 * Common pagination parameters for TMDB API requests
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
}

/**
 * Common response structure for paginated results
 */
export interface PaginatedResponse<T> {
  /** Page number */
  page: number;
  /** Array of results */
  results: T[];
  /** Total number of pages */
  total_pages: number;
  /** Total number of results */
  total_results: number;
}

/**
 * Common image object
 */
export interface Image {
  /** Aspect ratio of the image */
  aspect_ratio: number;
  /** File path relative to the image base URL */
  file_path: string;
  /** Height of the image in pixels */
  height: number;
  /** Width of the image in pixels */
  width: number;
  /** ISO 639-1 language code */
  iso_639_1: string | null;
  /** Vote average for the image */
  vote_average: number;
  /** Vote count for the image */
  vote_count: number;
}

/**
 * Collection of images for a movie, TV show, or person
 */
export interface ImageCollection {
  /** Collection ID */
  id: number;
  /** Backdrop images */
  backdrops?: Image[];
  /** Logo images */
  logos?: Image[];
  /** Poster images */
  posters?: Image[];
  /** Profile images (for people) */
  profiles?: Image[];
  /** Still images (for TV episodes) */
  stills?: Image[];
}

/**
 * Video types
 */
export type VideoType = 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';

/**
 * Video object
 */
export interface Video {
  /** ISO 639-1 language code */
  iso_639_1: string;
  /** ISO 3166-1 country code */
  iso_3166_1: string;
  /** Video name */
  name: string;
  /** Video key (e.g., YouTube video ID) */
  key: string;
  /** Video site (e.g., 'YouTube') */
  site: string;
  /** Video size (e.g., 1080) */
  size: number;
  /** Video type */
  type: VideoType;
  /** Whether the video is official */
  official: boolean;
  /** Publication date (ISO 8601) */
  published_at: string;
  /** Video ID */
  id: string;
}

/**
 * Genre object
 */
export interface Genre {
  /** Genre ID */
  id: number;
  /** Genre name */
  name: string;
}

/**
 * Enum for media types
 */
export enum MediaType {
  Movie = "movie",
  Tv = "tv",
  Person = "person"
}

/**
 * Enum for time windows
 */
export enum TimeWindow {
  Day = "day",
  Week = "week"
}

/**
 * Types of image sizes
 */
export type ImageSizeType = "backdrop" | "logo" | "poster" | "profile" | "still";

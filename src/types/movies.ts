import { Genre } from './common';

/**
 * Basic movie object returned in lists
 */
export interface MovieListResult {
  /** Whether the movie is for adults */
  adult: boolean;
  /** Path to the backdrop image */
  backdrop_path: string | null;
  /** Array of genre IDs associated with the movie */
  genre_ids: number[];
  /** Movie ID */
  id: number;
  /** Original language of the movie (ISO 639-1 code) */
  original_language: string;
  /** Original title of the movie */
  original_title: string;
  /** Movie overview/summary */
  overview: string;
  /** Popularity score */
  popularity: number;
  /** Path to the poster image */
  poster_path: string | null;
  /** Release date (YYYY-MM-DD) */
  release_date: string;
  /** Movie title */
  title: string;
  /** Whether the movie has video */
  video: boolean;
  /** Average vote score (0-10) */
  vote_average: number;
  /** Number of votes */
  vote_count: number;
}

/**
 * Production company information
 */
export interface ProductionCompany {
  /** Company ID */
  id: number;
  /** Company logo path */
  logo_path: string | null;
  /** Company name */
  name: string;
  /** Company origin country */
  origin_country: string;
}

/**
 * Production country information
 */
export interface ProductionCountry {
  /** ISO 3166-1 country code */
  iso_3166_1: string;
  /** Country name */
  name: string;
}

/**
 * Spoken language information
 */
export interface SpokenLanguage {
  /** English name */
  english_name: string;
  /** ISO 639-1 language code */
  iso_639_1: string;
  /** Language name */
  name: string;
}

/**
 * Detailed movie information
 */
export interface MovieDetails extends MovieListResult {
  /** Movie belongs to collection */
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  /** Movie budget in USD */
  budget: number;
  /** Genres associated with the movie */
  genres: Genre[];
  /** Movie homepage URL */
  homepage: string | null;
  /** IMDB ID */
  imdb_id: string | null;
  /** Production companies */
  production_companies: ProductionCompany[];
  /** Production countries */
  production_countries: ProductionCountry[];
  /** Revenue in USD */
  revenue: number;
  /** Runtime in minutes */
  runtime: number | null;
  /** Spoken languages */
  spoken_languages: SpokenLanguage[];
  /** Movie status (e.g., "Released") */
  status: string;
  /** Movie tagline */
  tagline: string | null;
}

/**
 * Cast member in a movie
 */
export interface MovieCastMember {
  /** Whether the actor is an adult */
  adult: boolean;
  /** Gender (1: female, 2: male, 0: unknown) */
  gender: number;
  /** Cast member ID */
  id: number;
  /** Known department */
  known_for_department: string;
  /** Actor name */
  name: string;
  /** Original name */
  original_name: string;
  /** Popularity score */
  popularity: number;
  /** Path to profile image */
  profile_path: string | null;
  /** Cast ID */
  cast_id: number;
  /** Character name */
  character: string;
  /** Credit ID */
  credit_id: string;
  /** Order in the cast list */
  order: number;
}

/**
 * Crew member in a movie
 */
export interface MovieCrewMember {
  /** Whether the crew member is an adult */
  adult: boolean;
  /** Gender (1: female, 2: male, 0: unknown) */
  gender: number;
  /** Crew member ID */
  id: number;
  /** Known department */
  known_for_department: string;
  /** Crew member name */
  name: string;
  /** Original name */
  original_name: string;
  /** Popularity score */
  popularity: number;
  /** Path to profile image */
  profile_path: string | null;
  /** Credit ID */
  credit_id: string;
  /** Department */
  department: string;
  /** Job title */
  job: string;
}

/**
 * Movie credits (cast and crew)
 */
export interface MovieCredits {
  /** Movie ID */
  id: number;
  /** Cast members */
  cast: MovieCastMember[];
  /** Crew members */
  crew: MovieCrewMember[];
}

/**
 * Parameters for fetching movie details
 */
export interface MovieDetailsParams {
  /** Movie ID */
  movieId: number;
  /** Language (ISO 639-1 code) */
  language?: string;
  /** Append to response (additional data to include) */
  appendToResponse?: string;
}

/**
 * Parameters for searching movies
 */
export interface MovieSearchParams {
  /** Search query */
  query: string;
  /** Language (ISO 639-1 code) */
  language?: string;
  /** Page number */
  page?: number;
  /** Include adult content */
  include_adult?: boolean;
  /** Region (ISO 3166-1 code) */
  region?: string;
  /** Year */
  year?: number;
  /** Primary release year */
  primary_release_year?: number;
}

/**
 * Parameters for discovering movies
 */
export interface MovieDiscoverParams {
  /** Language (ISO 639-1 code) */
  language?: string;
  /** Page number */
  page?: number;
  /** Sort results by */
  sort_by?: string;
  /** Include adult content */
  include_adult?: boolean;
  /** Include video content */
  include_video?: boolean;
  /** Primary release year */
  primary_release_year?: number;
  /** Primary release date greater than or equal to */
  'primary_release_date.gte'?: string;
  /** Primary release date less than or equal to */
  'primary_release_date.lte'?: string;
  /** Release date greater than or equal to */
  'release_date.gte'?: string;
  /** Release date less than or equal to */
  'release_date.lte'?: string;
  /** Minimum vote count */
  'vote_count.gte'?: number;
  /** Minimum vote average */
  'vote_average.gte'?: number;
  /** Maximum vote average */
  'vote_average.lte'?: number;
  /** Comma-separated list of genre IDs to include */
  with_genres?: string;
  /** Comma-separated list of genre IDs to exclude */
  without_genres?: string;
  /** Comma-separated list of keywords to include */
  with_keywords?: string;
  /** Content certification */
  certification?: string;
  /** Certification country */
  certification_country?: string;
  /** Minimum certification */
  'certification.gte'?: string;
  /** Maximum certification */
  'certification.lte'?: string;
  /** Original language (ISO 639-1 code) */
  with_original_language?: string;
}

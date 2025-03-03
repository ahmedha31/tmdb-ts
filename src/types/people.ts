import { MovieListResult } from './movies';
import { TVShowListResult } from './tv';

/**
 * Basic person information
 */
export interface PersonListResult {
  /** Whether the person is an adult */
  adult: boolean;
  /** Gender (1: female, 2: male, 0: unknown) */
  gender: number;
  /** Person ID */
  id: number;
  /** Known department */
  known_for_department: string;
  /** Person name */
  name: string;
  /** Original name */
  original_name?: string;
  /** Popularity score */
  popularity: number;
  /** Path to profile image */
  profile_path: string | null;
  /** Known for (movies and/or shows) */
  known_for?: (MovieListResult | TVShowListResult)[];
}

/**
 * Detailed person information
 */
export interface PersonDetails extends PersonListResult {
  /** Person's alias names */
  also_known_as?: string[];
  /** Person's biography */
  biography: string;
  /** Person's birthday (YYYY-MM-DD) */
  birthday: string | null;
  /** Person's death day (YYYY-MM-DD) */
  deathday: string | null;
  /** Person's homepage URL */
  homepage: string | null;
  /** Person's IMDB ID */
  imdb_id: string | null;
  /** Person's place of birth */
  place_of_birth: string | null;
}

/**
 * Movie credit for a person
 */
export interface MovieCredit {
  /** Is adult movie */
  adult: boolean;
  /** Backdrop path */
  backdrop_path: string | null;
  /** Genre IDs */
  genre_ids: number[];
  /** Movie ID */
  id: number;
  /** Original language */
  original_language: string;
  /** Original title */
  original_title: string;
  /** Movie overview */
  overview: string;
  /** Popularity score */
  popularity: number;
  /** Poster path */
  poster_path: string | null;
  /** Release date */
  release_date: string;
  /** Movie title */
  title: string;
  /** Video flag */
  video: boolean;
  /** Vote average */
  vote_average: number;
  /** Vote count */
  vote_count: number;
  /** Character played */
  character?: string;
  /** Credit ID */
  credit_id: string;
  /** Order in cast */
  order?: number;
  /** Department */
  department?: string;
  /** Job */
  job?: string;
}

/**
 * TV credit for a person
 */
export interface TVCredit {
  /** Backdrop path */
  backdrop_path: string | null;
  /** First air date */
  first_air_date: string;
  /** Genre IDs */
  genre_ids: number[];
  /** TV show ID */
  id: number;
  /** TV show name */
  name: string;
  /** Origin country */
  origin_country: string[];
  /** Original language */
  original_language: string;
  /** Original name */
  original_name: string;
  /** TV show overview */
  overview: string;
  /** Popularity score */
  popularity: number;
  /** Poster path */
  poster_path: string | null;
  /** Vote average */
  vote_average: number;
  /** Vote count */
  vote_count: number;
  /** Character played */
  character?: string;
  /** Credit ID */
  credit_id: string;
  /** Episode count */
  episode_count?: number;
  /** Department */
  department?: string;
  /** Job */
  job?: string;
}

/**
 * Movie credits for a person
 */
export interface PersonMovieCredits {
  /** Person ID */
  id: number;
  /** Cast credits */
  cast: MovieCredit[];
  /** Crew credits */
  crew: MovieCredit[];
}

/**
 * TV credits for a person
 */
export interface PersonTVCredits {
  /** Person ID */
  id: number;
  /** Cast credits */
  cast: TVCredit[];
  /** Crew credits */
  crew: TVCredit[];
}

/**
 * Parameters for retrieving a person's details
 */
export interface PersonDetailsParams {
  /** Person ID */
  personId: number;
  /** Language (ISO 639-1 code) */
  language?: string;
  /** Append to response (additional data to include) */
  appendToResponse?: string;
}

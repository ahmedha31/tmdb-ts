import { Genre } from './common';

/**
 * Basic TV show object returned in lists
 */
export interface TVShowListResult {
  /** Path to the backdrop image */
  backdrop_path: string | null;
  /** First air date */
  first_air_date: string;
  /** Array of genre IDs */
  genre_ids: number[];
  /** TV show ID */
  id: number;
  /** TV show name */
  name: string;
  /** Origin country codes */
  origin_country: string[];
  /** Original language */
  original_language: string;
  /** Original name */
  original_name: string;
  /** Overview */
  overview: string;
  /** Popularity */
  popularity: number;
  /** Path to the poster image */
  poster_path: string | null;
  /** Average vote */
  vote_average: number;
  /** Vote count */
  vote_count: number;
}

/**
 * Network information
 */
export interface Network {
  /** Network ID */
  id: number;
  /** Network name */
  name: string;
  /** Network logo path */
  logo_path: string | null;
  /** Origin country */
  origin_country: string;
}

/**
 * TV show season
 */
export interface Season {
  /** Air date */
  air_date: string | null;
  /** Episode count */
  episode_count: number;
  /** ID */
  id: number;
  /** Name */
  name: string;
  /** Overview */
  overview: string;
  /** Poster path */
  poster_path: string | null;
  /** Season number */
  season_number: number;
  /** Episodes (only present when getting season details) */
  episodes?: Episode[];
}

/**
 * TV show episode
 */
export interface Episode {
  /** Air date */
  air_date: string | null;
  /** Episode number */
  episode_number: number;
  /** ID */
  id: number;
  /** Name */
  name: string;
  /** Overview */
  overview: string;
  /** Production code */
  production_code: string;
  /** Runtime in minutes */
  runtime: number;
  /** Season number */
  season_number: number;
  /** Still path */
  still_path: string | null;
  /** Vote average */
  vote_average: number;
  /** Vote count */
  vote_count: number;
  /** Crew (only present when getting episode details) */
  crew?: {
    id: number;
    credit_id: string;
    name: string;
    department: string;
    job: string;
    profile_path: string | null;
  }[];
  /** Guest stars (only present when getting episode details) */
  guest_stars?: {
    id: number;
    name: string;
    credit_id: string;
    character: string;
    order: number;
    profile_path: string | null;
  }[];
}

/**
 * Creator of a TV show
 */
export interface Creator {
  /** Creator ID */
  id: number;
  /** Credit ID */
  credit_id: string;
  /** Creator name */
  name: string;
  /** Creator gender */
  gender: number;
  /** Path to profile image */
  profile_path: string | null;
}

/**
 * Detailed information about a TV show
 */
export interface TVShowDetails extends TVShowListResult {
  /** Whether the show is for adults */
  adult?: boolean;
  /** Created by */
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  /** Episode run time in minutes */
  episode_run_time: number[];
  /** Genres */
  genres: Genre[];
  /** Homepage URL */
  homepage: string;
  /** Whether the show is in production */
  in_production: boolean;
  /** Languages */
  languages: string[];
  /** Last air date */
  last_air_date: string;
  /** Last episode to air */
  last_episode_to_air: Episode | null;
  /** Next episode to air */
  next_episode_to_air: Episode | null;
  /** Networks */
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  /** Number of episodes */
  number_of_episodes: number;
  /** Number of seasons */
  number_of_seasons: number;
  /** Production companies */
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  /** Production countries */
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  /** Seasons */
  seasons: Season[];
  /** Spoken languages */
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  /** Status */
  status: string;
  /** Type */
  type: string;
}

/**
 * Cast member in a TV show
 */
export interface TVCastMember {
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
  /** Character name */
  character: string;
  /** Credit ID */
  credit_id: string;
  /** Order in the cast list */
  order: number;
}

/**
 * Crew member in a TV show
 */
export interface TVCrewMember {
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
 * TV show credits
 */
export interface TVCredits {
  /** TV show ID */
  id: number;
  /** Cast */
  cast: {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    character: string;
    credit_id: string;
    order: number;
  }[];
  /** Crew */
  crew: {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    credit_id: string;
    department: string;
    job: string;
  }[];
}

/**
 * Parameters for TV show details
 */
export interface TVDetailsParams {
  /** TV show ID */
  tvId: number;
  /** Language */
  language?: string;
  /** Additional data to include (comma-separated) */
  appendToResponse?: string;
}

/**
 * Parameters for TV show season
 */
export interface TVSeasonParams {
  /** TV show ID */
  tvId: number;
  /** Season number */
  seasonNumber: number;
  /** Language */
  language?: string;
  /** Additional data to include (comma-separated) */
  appendToResponse?: string;
}

/**
 * Parameters for TV show episode
 */
export interface TVEpisodeParams {
  /** TV show ID */
  tvId: number;
  /** Season number */
  seasonNumber: number;
  /** Episode number */
  episodeNumber: number;
  /** Language */
  language?: string;
  /** Additional data to include (comma-separated) */
  appendToResponse?: string;
}

/**
 * Parameters for TV show search
 */
export interface TVSearchParams {
  /** Search query */
  query: string;
  /** Page number */
  page?: number;
  /** Language */
  language?: string;
  /** Include adult content */
  include_adult?: boolean;
  /** First air date year */
  first_air_date_year?: number;
}

/**
 * Parameters for discovering TV shows
 */
export interface TVDiscoverParams {
  /** Language (ISO 639-1 code) */
  language?: string;
  /** Page number */
  page?: number;
  /** Sort results by */
  sort_by?: string;
  /** First air date year */
  first_air_date_year?: number;
  /** First air date greater than or equal to */
  "first_air_date.gte"?: string;
  /** First air date less than or equal to */
  "first_air_date.lte"?: string;
  /** Minimum vote count */
  "vote_count.gte"?: number;
  /** Minimum vote average */
  "vote_average.gte"?: number;
  /** With the specified networks */
  with_networks?: string;
  /** Comma-separated list of genre IDs to include */
  with_genres?: string;
  /** Comma-separated list of genre IDs to exclude */
  without_genres?: string;
  /** Comma-separated list of keywords to include */
  with_keywords?: string;
  /** With the specified runtime */
  with_runtime?: string;
  /** Original language (ISO 639-1 code) */
  with_original_language?: string;
}

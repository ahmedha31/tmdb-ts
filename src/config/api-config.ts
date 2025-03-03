/**
 * TMDB API configuration values
 */
export const API_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  API_VERSION: "3",
  DEFAULT_LANGUAGE: "en-US",
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 1000 // TMDB limits to 1000 results (50 pages of 20 items)
};

/**
 * Available endpoints in the TMDB API
 */
export const ENDPOINTS = {
  // Authentication
  AUTH_TOKEN: "/authentication/token/new",
  AUTH_SESSION: "/authentication/session/new",
  AUTH_VALIDATE_TOKEN: "/authentication/token/validate_with_login",
  
  // Configuration
  CONFIGURATION: "/configuration",
  
  // Movies
  MOVIES: "/movie",
  MOVIE_DETAILS: "/movie/{movie_id}",
  MOVIE_CREDITS: "/movie/{movie_id}/credits",
  MOVIE_IMAGES: "/movie/{movie_id}/images",
  MOVIE_VIDEOS: "/movie/{movie_id}/videos",
  MOVIE_RECOMMENDATIONS: "/movie/{movie_id}/recommendations",
  MOVIE_SIMILAR: "/movie/{movie_id}/similar",
  MOVIE_POPULAR: "/movie/popular",
  MOVIE_NOW_PLAYING: "/movie/now_playing",
  MOVIE_TOP_RATED: "/movie/top_rated",
  MOVIE_UPCOMING: "/movie/upcoming",
  
  // TV
  TV: "/tv",
  TV_DETAILS: "/tv/{tv_id}",
  TV_SEASON_DETAILS: "/tv/{tv_id}/season/{season_number}",
  TV_EPISODE_DETAILS: "/tv/{tv_id}/season/{season_number}/episode/{episode_number}",
  TV_CREDITS: "/tv/{tv_id}/credits",
  TV_IMAGES: "/tv/{tv_id}/images",
  TV_VIDEOS: "/tv/{tv_id}/videos",
  TV_RECOMMENDATIONS: "/tv/{tv_id}/recommendations",
  TV_SIMILAR: "/tv/{tv_id}/similar",
  TV_POPULAR: "/tv/popular",
  TV_TOP_RATED: "/tv/top_rated",
  
  // People
  PERSON: "/person/{person_id}",
  PERSON_MOVIE_CREDITS: "/person/{person_id}/movie_credits",
  PERSON_TV_CREDITS: "/person/{person_id}/tv_credits",
  PERSON_IMAGES: "/person/{person_id}/images",
  PERSON_POPULAR: "/person/popular",
  
  // Search
  SEARCH_MOVIE: "/search/movie",
  SEARCH_TV: "/search/tv",
  SEARCH_PERSON: "/search/person",
  SEARCH_MULTI: "/search/multi",
  
  // Discover
  DISCOVER_MOVIE: "/discover/movie",
  DISCOVER_TV: "/discover/tv",
  
  // Trending
  TRENDING: "/trending/{media_type}/{time_window}",
  
  // Genres
  GENRE_MOVIE_LIST: "/genre/movie/list",
  GENRE_TV_LIST: "/genre/tv/list"
};

/**
 * Available image sizes
 */
export const IMAGE_SIZES = {
  backdrop: ["w300", "w780", "w1280", "original"],
  logo: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
  poster: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
  profile: ["w45", "w185", "h632", "original"],
  still: ["w92", "w185", "w300", "original"]
};

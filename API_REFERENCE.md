# TMDB TypeScript SDK API Reference

This document provides a comprehensive reference of the TMDB TypeScript SDK classes, methods, and interfaces.

## Table of Contents

- [Client](#tmdbclient)
- [Movies](#movies)
- [TV Shows](#tv-shows)
- [Search](#search)
- [People](#people)
- [Discover](#discover)
- [Trending](#trending)
- [Configuration](#configuration)
- [Images](#images)
- [Authentication](#authentication)

## TMDBClient

The main client class for interacting with the TMDB API.

### Constructor

```typescript
constructor(options: TMDBClientOptions)
```

#### TMDBClientOptions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| auth | AuthOptions | Yes | Authentication options |
| http? | HttpOptions | No | HTTP client options |
| cache? | CacheOptions | No | Caching options |
| language? | string | No | Default language (ISO 639-1) |
| region? | string | No | Default region (ISO 3166-1) |
| includeAdult? | boolean | No | Whether to include adult content |

#### AuthOptions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| apiKey? | string | One of these is required | TMDB API key |
| accessToken? | string | One of these is required | TMDB API read access token |
| sessionId? | string | No | Session ID for authenticated requests |

#### HttpOptions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| baseUrl? | string | No | API base URL |
| timeout? | number | No | Request timeout in milliseconds |
| retry? | boolean | No | Whether to retry failed requests |
| maxRetries? | number | No | Maximum retry attempts |
| retryDelay? | number | No | Initial retry delay in milliseconds |

#### CacheOptions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| enabled? | boolean | No | Whether to enable caching |
| maxSize? | number | No | Maximum cache size in items |
| ttl? | number | No | Default TTL in milliseconds |

### Properties

| Name | Type | Description |
|------|------|-------------|
| movies | MoviesResource | Movies API |
| tv | TVResource | TV Shows API |
| search | SearchResource | Search API |
| people | PeopleResource | People API |
| discover | DiscoverResource | Discover API |
| trending | TrendingResource | Trending API |
| configuration | ConfigurationResource | Configuration API |
| images | UrlHelper | Image URL utilities |

### Methods

#### authenticate

Authenticates with TMDB using username and password.

```typescript
async authenticate(username: string, password: string): Promise<string>
```

Returns: A Promise resolving to the session ID.

#### setSessionId

Sets a session ID for authentication.

```typescript
setSessionId(sessionId: string): void
```

#### getSessionId

Gets the current session ID.

```typescript
getSessionId(): string | null
```

Returns: The current session ID or null if none is set.

#### hasSession

Checks if a session is active.

```typescript
hasSession(): boolean
```

Returns: True if a session ID is present, false otherwise.

## Movies

Methods for accessing movie information.

### getDetails

Gets detailed information about a movie.

```typescript
async getDetails(params: MovieDetailsParams): Promise<MovieDetails>
```

#### MovieDetailsParams

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| movieId | number | Yes | Movie ID |
| language? | string | No | Language (ISO 639-1) |
| appendToResponse? | string | No | Additional data to include |

### getCredits

Gets cast and crew information for a movie.

```typescript
async getCredits(movieId: number, language?: string): Promise<MovieCredits>
```

### getImages

Gets images for a movie.

```typescript
async getImages(movieId: number, includeImageLanguage?: string): Promise<ImageCollection>
```

### getVideos

Gets videos for a movie.

```typescript
async getVideos(movieId: number, language?: string): Promise<{ id: number; results: Video[] }>
```

### getRecommendations

Gets recommended movies based on a movie.

```typescript
async getRecommendations(
  movieId: number,
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<MovieListResult>>
```

### getSimilar

Gets similar movies to a movie.

```typescript
async getSimilar(
  movieId: number,
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<MovieListResult>>
```

### getPopular

Gets popular movies.

```typescript
async getPopular(
  page: number = 1,
  language?: string,
  region?: string
): Promise<PaginatedResponse<MovieListResult>>
```

### getNowPlaying

Gets now playing movies.

```typescript
async getNowPlaying(
  page: number = 1,
  language?: string,
  region?: string
): Promise<PaginatedResponse<MovieListResult>>
```

### getTopRated

Gets top-rated movies.

```typescript
async getTopRated(
  page: number = 1,
  language?: string,
  region?: string
): Promise<PaginatedResponse<MovieListResult>>
```

### getUpcoming

Gets upcoming movies.

```typescript
async getUpcoming(
  page: number = 1,
  language?: string,
  region?: string
): Promise<PaginatedResponse<MovieListResult>>
```

## TV Shows

Methods for accessing TV show information.

### getDetails

Gets detailed information about a TV show.

```typescript
async getDetails(params: TVDetailsParams): Promise<TVShowDetails>
```

### getSeason

Gets detailed information about a TV season.

```typescript
async getSeason(params: TVSeasonParams): Promise<Season>
```

### getEpisode

Gets detailed information about a TV episode.

```typescript
async getEpisode(params: TVEpisodeParams): Promise<Episode>
```

### getCredits

Gets cast and crew information for a TV show.

```typescript
async getCredits(tvId: number, language?: string): Promise<TVCredits>
```

### getImages

Gets images for a TV show.

```typescript
async getImages(tvId: number, includeImageLanguage?: string): Promise<ImageCollection>
```

### getVideos

Gets videos for a TV show.

```typescript
async getVideos(tvId: number, language?: string): Promise<{ id: number; results: Video[] }>
```

### getRecommendations

Gets recommended TV shows based on a TV show.

```typescript
async getRecommendations(
  tvId: number,
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<TVShowListResult>>
```

### getSimilar

Gets similar TV shows to a TV show.

```typescript
async getSimilar(
  tvId: number,
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<TVShowListResult>>
```

### getPopular

Gets popular TV shows.

```typescript
async getPopular(
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<TVShowListResult>>
```

### getTopRated

Gets top-rated TV shows.

```typescript
async getTopRated(
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<TVShowListResult>>
```

## Search

Methods for searching TMDB.

### movies

Searches for movies.

```typescript
async movies(params: MovieSearchParams): Promise<PaginatedResponse<MovieListResult>>
```

### tvShows

Searches for TV shows.

```typescript
async tvShows(params: TVSearchParams): Promise<PaginatedResponse<TVShowListResult>>
```

### people

Searches for people.

```typescript
async people(params: PersonSearchParams): Promise<PaginatedResponse<PersonListResult>>
```

### multi

Searches across all types (movies, TV, people).

```typescript
async multi(params: MultiSearchParams): Promise<PaginatedResponse<MultiSearchResult>>
```

## People

Methods for accessing people information.

### getDetails

Gets detailed information about a person.

```typescript
async getDetails(params: PersonDetailsParams): Promise<PersonDetails>
```

### getMovieCredits

Gets movie credits for a person.

```typescript
async getMovieCredits(personId: number, language?: string): Promise<PersonMovieCredits>
```

### getTVCredits

Gets TV credits for a person.

```typescript
async getTVCredits(personId: number, language?: string): Promise<PersonTVCredits>
```

### getImages

Gets images for a person.

```typescript
async getImages(personId: number): Promise<{ id: number; profiles: ImageCollection['posters'] }>
```

### getPopular

Gets popular people.

```typescript
async getPopular(
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<PersonListResult>>
```

## Discover

Methods for discovering content.

### movies

Discovers movies based on filters.

```typescript
async movies(params: MovieDiscoverParams): Promise<PaginatedResponse<MovieListResult>>
```

### tvShows

Discovers TV shows based on filters.

```typescript
async tvShows(params: TVDiscoverParams): Promise<PaginatedResponse<TVShowListResult>>
```

## Trending

Methods for accessing trending content.

### getAll

Gets trending items of all types.

```typescript
async getAll<T = any>(
  mediaType: MediaType | 'all',
  timeWindow: TimeWindow,
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<T>>
```

### getMovies

Gets trending movies.

```typescript
async getMovies<T = any>(
  timeWindow: TimeWindow,
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<T>>
```

### getTVShows

Gets trending TV shows.

```typescript
async getTVShows<T = any>(
  timeWindow: TimeWindow,
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<T>>
```

### getPeople

Gets trending people.

```typescript
async getPeople<T = any>(
  timeWindow: TimeWindow,
  page: number = 1,
  language?: string
): Promise<PaginatedResponse<T>>
```

## Configuration

Methods for accessing TMDB configuration.

### getApiConfiguration

Gets API configuration.

```typescript
async getApiConfiguration(): Promise<ApiConfiguration>
```

### getMovieGenres

Gets movie genres.

```typescript
async getMovieGenres(language?: string): Promise<GenreListResponse>
```

### getTVGenres

Gets TV show genres.

```typescript
async getTVGenres(language?: string): Promise<GenreListResponse>
```

## Images

Helper methods for constructing image URLs.

### getImageUrl

Constructs a URL for an image asset.

```typescript
static getImageUrl(options: ImageUrlOptions, type: ImageSizeType = 'poster'): string | null
```

### getPosterUrl

Constructs a URL for a poster image.

```typescript
static getPosterUrl(options: ImageUrlOptions): string | null
```
# TMDB TypeScript SDK

A robust, type-safe, and user-friendly TypeScript SDK for The Movie Database (TMDB) API. This SDK provides comprehensive access to TMDB's endpoints while following modern TypeScript and JavaScript best practices.

## Features

- 🌐 **Complete API Coverage**: Support for all major TMDB endpoints including movies, TV shows, people, search, discover, and trending
- 📘 **Fully Typed**: Comprehensive TypeScript declarations for all API requests and responses
- 🔄 **Modern JavaScript**: ES modules with CommonJS compatibility
- 🌍 **Universal**: Works in both Node.js and browser environments
- 🔒 **Authentication**: Support for API key and session-based authentication
- 🖼️ **Image Helpers**: Easy construction of image URLs with proper sizing
- 📊 **Pagination**: First-class support for paginated endpoints
- 🚦 **Rate Limiting**: Built-in handling for API request limits with automatic retries
- 📦 **Caching**: Optional response caching to improve performance

## Installation

```bash
npm install tmdb-typescript-sdk
```

or

```bash
yarn add tmdb-typescript-sdk
```

## Quick Start

```typescript
import { TMDBClient } from 'tmdb-typescript-sdk';

// Initialize the client with your API key
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here'
  }
});

// Get popular movies
async function getPopularMovies() {
  try {
    const movies = await tmdb.movies.getPopular();
    console.log(movies.results);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
  }
}

// Get movie details
async function getMovieDetails(movieId: number) {
  try {
    const movie = await tmdb.movies.getDetails({ movieId });
    console.log(`${movie.title} (${movie.release_date.split('-')[0]})`);
    console.log(movie.overview);
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
}

// Search for movies
async function searchMovies(query: string) {
  try {
    const results = await tmdb.search.movies({ query });
    console.log(`Found ${results.total_results} movies matching "${query}"`);
    results.results.forEach(movie => {
      console.log(`${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})`);
    });
  } catch (error) {
    console.error('Error searching movies:', error);
  }
}
```

## Documentation

For full documentation and examples, please see the [API Reference](API_REFERENCE.md).

### Working with Images

```typescript
// Get a poster image URL
const posterUrl = tmdb.images.getPosterUrl({
  path: movie.poster_path,
  size: 'w500'
});

// Get a backdrop image URL
const backdropUrl = tmdb.images.getBackdropUrl({
  path: movie.backdrop_path,
  size: 'original'
});
```

### Enabling Cache

```typescript
// Initialize with caching enabled
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here'
  },
  cache: {
    enabled: true,
    maxSize: 100, // Maximum cache entries
    ttl: 300000   // Cache TTL in milliseconds (5 minutes)
  }
});
```

### Error Handling

```typescript
try {
  const movie = await tmdb.movies.getDetails({ movieId: 123 });
  // Process movie data
} catch (error) {
  if (error instanceof HttpError) {
    console.error(`HTTP Error ${error.status}: ${error.message}`);
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limit exceeded. Retry after ${error.retryAfter}ms`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Examples

See the [examples](examples/) directory for more usage examples.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

/* eslint-disable no-console */
import { TMDBClient, TimeWindow } from '../src';

// Initialize the client - Replace with your actual API key
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here'
  }
});

async function basicUsageDemo() {
  try {
    console.log('=== TMDB SDK Basic Usage Example ===');
    
    // 1. Get information about a specific movie
    const movieId = 550; // Fight Club
    console.log(`\nGetting details for movie ID: ${movieId}`);
    
    const movie = await tmdb.movies.getDetails({ movieId });
    
    console.log(`Title: ${movie.title} (${movie.release_date.split('-')[0]})`);
    console.log(`Genres: ${movie.genres.map(g => g.name).join(', ')}`);
    console.log(`Rating: ${movie.vote_average}/10 from ${movie.vote_count} votes`);
    console.log(`Overview: ${movie.overview}`);
    
    // 2. Search for movies by title
    const searchQuery = 'Matrix';
    console.log(`\nSearching for movies with title: "${searchQuery}"`);
    
    const searchResults = await tmdb.search.movies({ query: searchQuery });
    
    console.log(`Found ${searchResults.total_results} results. Top 3 matches:`);
    searchResults.results.slice(0, 3).forEach((movie, i) => {
      console.log(`${i+1}. ${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'}) - ${movie.vote_average}/10`);
    });
    
    // 3. Get popular TV shows
    console.log('\nGetting popular TV shows:');
    
    const popularShows = await tmdb.tv.getPopular();
    
    console.log('Top 3 popular shows:');
    popularShows.results.slice(0, 3).forEach((show, i) => {
      console.log(`${i+1}. ${show.name} (${show.first_air_date?.split('-')[0] || 'N/A'}) - ${show.vote_average}/10`);
    });
    
    // 4. Working with images
    console.log('\nWorking with images:');
    
    const posterUrl = tmdb.images.getPosterUrl({
      path: movie.poster_path,
      size: 'w500'
    });
    
    console.log(`Poster URL: ${posterUrl}`);
    
    // 5. Discover movies by genre and year
    console.log('\nDiscovering sci-fi movies from 2022:');
    
    // Get genres to find the ID for "Science Fiction"
    const genreResponse = await tmdb.configuration.getMovieGenres();
    const scifiGenre = genreResponse.genres.find(g => g.name === 'Science Fiction');
    
    if (scifiGenre) {
      const scifiMovies = await tmdb.discover.movies({
        with_genres: String(scifiGenre.id),
        primary_release_year: 2022,
        'vote_count.gte': 50, // At least 50 votes
        sort_by: 'popularity.desc'
      });
      
      console.log(`Found ${scifiMovies.total_results} sci-fi movies from 2022. Top 3:`);
      scifiMovies.results.slice(0, 3).forEach((movie, i) => {
        console.log(`${i+1}. ${movie.title} - ${movie.vote_average}/10`);
      });
    }
    
    // 6. Get trending content for today
    console.log('\nGetting trending movies for today:');
    
    const trending = await tmdb.trending.getMovies(TimeWindow.Day);
    
    console.log('Top 3 trending movies today:');
    trending.results.slice(0, 3).forEach((movie, i) => {
      console.log(`${i+1}. ${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})`);
    });
  } catch (error) {
    console.error('Error in basic usage example:', error);
  }
}

basicUsageDemo();
import { TMDBClient } from '../src';

// Initialize the client
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  }
});

async function discoverExamples() {
  try {
    // Get genre lists first
    console.log('=== Genre Lists ===');
    const movieGenres = await tmdb.configuration.getMovieGenres();
    const tvGenres = await tmdb.configuration.getTVGenres();
    
    console.log('Movie Genres:');
    movieGenres.genres.forEach(genre => console.log(`- ${genre.id}: ${genre.name}`));
    
    console.log('\nTV Genres:');
    tvGenres.genres.forEach(genre => console.log(`- ${genre.id}: ${genre.name}`));
    
    // Discover highly rated sci-fi movies from 2020-2022
    console.log('\n=== Discover Sci-Fi Movies ===');
    const scifiMovies = await tmdb.discover.movies({
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100, // At least 100 votes
      with_genres: '878', // Sci-Fi genre ID
      'release_date.gte': '2020-01-01',
      'release_date.lte': '2022-12-31',
      include_adult: false,
      include_video: false,
      page: 1
    });
    
    console.log(`Found ${scifiMovies.total_results} sci-fi movies from 2020-2022`);
    scifiMovies.results.slice(0, 5).forEach((movie, i) => {
      console.log(`${i+1}. ${movie.title} (${movie.release_date.split('-')[0]}) - Rating: ${movie.vote_average}/10`);
      console.log(`   Overview: ${movie.overview.substring(0, 100)}...`);
    });
    
    // Discover popular drama TV shows with high ratings
    console.log('\n=== Discover Drama TV Shows ===');
    const dramaShows = await tmdb.discover.tvShows({
      sort_by: 'popularity.desc',
      with_genres: '18', // Drama genre ID
      'vote_average.gte': 8, // Rating at least 8
      'first_air_date.gte': '2010-01-01',
      with_original_language: 'en', // English language shows
      page: 1
    });
    
    console.log(`Found ${dramaShows.total_results} popular drama TV shows`);
    dramaShows.results.slice(0, 5).forEach((show, i) => {
      console.log(`${i+1}. ${show.name} (${show.first_air_date.split('-')[0]}) - Rating: ${show.vote_average}/10`);
      console.log(`   Overview: ${show.overview.substring(0, 100)}...`);
    });
    
    // Discover trending action movies currently in theaters
    console.log('\n=== Discover Action Movies in Theaters ===');
    const actionMovies = await tmdb.discover.movies({
      sort_by: 'popularity.desc',
      with_genres: '28', // Action genre ID
      // Using type assertion to allow custom parameters not in the interface
      ...(({ with_release_type: '2|3' }) as any), // Theatrical release
      'primary_release_date.gte': new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 60 days
      'primary_release_date.lte': new Date().toISOString().split('T')[0], // Today
      include_adult: false,
      include_video: false,
      page: 1
    });
    
    console.log(`Found ${actionMovies.total_results} recent action movies in theaters`);
    actionMovies.results.slice(0, 5).forEach((movie, i) => {
      console.log(`${i+1}. ${movie.title} (${movie.release_date}) - Popularity: ${movie.popularity}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

discoverExamples();

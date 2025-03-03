/* eslint-disable no-console */
import { TMDBClient } from '../src';

// Initialize the client with caching enabled
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  },
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000 // 5 minutes
  }
});

/**
 * Advanced discovery patterns for finding specific content
 */
async function advancedDiscoverExamples() {
  console.log('=== Advanced Discover API Examples ===');
  
  // First, get genre maps for easy referencing
  const movieGenreResponse = await tmdb.configuration.getMovieGenres();
  const tvGenreResponse = await tmdb.configuration.getTVGenres();
  
  // Create genre ID-to-name maps for easier lookups
  const movieGenreMap: Record<string, string> = {};
  const tvGenreMap: Record<string, string> = {};
  
  movieGenreResponse.genres.forEach(genre => {
    movieGenreMap[genre.id] = genre.name;
  });
  
  tvGenreResponse.genres.forEach(genre => {
    tvGenreMap[genre.id] = genre.name;
  });
  
  // Example 1: Find high-rated movies that were box office hits
  console.log('\n1. High-rated box office hits in the past 5 years:');
  const currentYear = new Date().getFullYear();
  const fiveYearsAgo = `${currentYear - 5}-01-01`;
  
  const boxOfficeHits = await tmdb.discover.movies({
    sort_by: 'revenue.desc',
    'vote_average.gte': 7.5,
    'vote_count.gte': 500,
    'primary_release_date.gte': fiveYearsAgo,
    with_original_language: 'en',
    include_adult: false,
    page: 1
  });
  
  console.log(`Found ${boxOfficeHits.total_results} box office hits`);
  boxOfficeHits.results.slice(0, 5).forEach((movie, i) => {
    const genreNames = movie.genre_ids
      .map(id => movieGenreMap[id] || `Unknown(${id})`)
      .join(', ');
      
    console.log(`${i+1}. ${movie.title} (${movie.release_date.split('-')[0]})`);
    console.log(`   Genres: ${genreNames}`);
    console.log(`   Rating: ${movie.vote_average}/10 from ${movie.vote_count} votes`);
  });
  
  // Example 2: Find hidden gems - highly rated movies with lower popularity
  console.log('\n2. Hidden gems - highly rated movies with lower popularity:');
  const hiddenGems = await tmdb.discover.movies({
    sort_by: 'vote_average.desc',
    'vote_average.gte': 7.5,
    'vote_count.gte': 100,
    ...(({ 'vote_count.lte': 500 }) as any),
    'popularity.lte': 20,
    include_adult: false,
    page: 1
  });
  
  console.log(`Found ${hiddenGems.total_results} hidden gems`);
  hiddenGems.results.slice(0, 5).forEach((movie, i) => {
    const genreNames = movie.genre_ids
      .map(id => movieGenreMap[id] || `Unknown(${id})`)
      .join(', ');
      
    console.log(`${i+1}. ${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})`);
    console.log(`   Genres: ${genreNames}`);
    console.log(`   Rating: ${movie.vote_average}/10 from ${movie.vote_count} votes`);
    console.log(`   Popularity score: ${movie.popularity}`);
  });
  
  // Example 3: Find TV shows similar to popular shows like "Breaking Bad"
  console.log('\n3. Finding TV shows for fans of "Breaking Bad":');
  
  // First search for Breaking Bad to get its ID
  const breakingBadSearch = await tmdb.search.tvShows({
    query: 'Breaking Bad',
    page: 1
  });
  
  if (breakingBadSearch.results.length > 0) {
    const breakingBad = breakingBadSearch.results[0];
    console.log(`Found ${breakingBad.name} (ID: ${breakingBad.id})`);
    
    // Get similar shows
    const similarShows = await tmdb.tv.getSimilar(breakingBad.id);
    
    console.log(`Shows similar to ${breakingBad.name}:`);
    similarShows.results.slice(0, 5).forEach((show, i) => {
      const genreNames = show.genre_ids
        .map(id => tvGenreMap[id] || `Unknown(${id})`)
        .join(', ');
        
      console.log(`${i+1}. ${show.name} (${show.first_air_date?.split('-')[0] || 'N/A'})`);
      console.log(`   Genres: ${genreNames}`);
      console.log(`   Rating: ${show.vote_average}/10`);
    });
    
    // Now find shows with similar genres
    const genreIds = breakingBad.genre_ids.join(',');
    
    console.log(`\nOther shows with similar genres (${
      breakingBad.genre_ids.map(id => tvGenreMap[id]).join(', ')
    }):`);
    
    const genreSimilarShows = await tmdb.discover.tvShows({
      sort_by: 'popularity.desc',
      with_genres: genreIds,
      'vote_count.gte': 100,
      'first_air_date.lte': breakingBad.first_air_date,
      page: 1
    });
    
    genreSimilarShows.results
      .filter(show => show.id !== breakingBad.id) // Filter out Breaking Bad itself
      .slice(0, 5)
      .forEach((show, i) => {
        console.log(`${i+1}. ${show.name} (${show.first_air_date?.split('-')[0] || 'N/A'})`);
        console.log(`   Rating: ${show.vote_average}/10 from ${show.vote_count} votes`);
      });
  }
  
  // Example 4: Advanced content filtering - family-friendly adventure movies
  console.log('\n4. Family-friendly adventure movies:');
  
  // Find the Adventure genre ID
  const adventureGenreId = Object.keys(movieGenreMap).find(
    id => movieGenreMap[id] === 'Adventure'
  );
  
  const familyFriendlyMovies = await tmdb.discover.movies({
    with_genres: adventureGenreId,
    certification_country: 'US',
    certification: 'G',
    sort_by: 'popularity.desc',
    'vote_count.gte': 200,
    include_adult: false,
    page: 1
  });
  
  console.log(`Found ${familyFriendlyMovies.total_results} family-friendly adventure movies`);
  familyFriendlyMovies.results.slice(0, 5).forEach((movie, i) => {
    console.log(`${i+1}. ${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})`);
    console.log(`   Overview: ${movie.overview.substring(0, 100)}...`);
  });
}

advancedDiscoverExamples();

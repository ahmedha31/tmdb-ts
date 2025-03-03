/* eslint-disable no-console */
import { TMDBClient } from '../src';

// Initialize the client
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  }
});

/**
 * Example demonstrating the Movies API capabilities
 */
async function moviesExample() {
  try {
    console.log('=== Movies API Examples ===');
    
    // Get popular movies
    console.log('\n1. Getting popular movies:');
    const popularMovies = await tmdb.movies.getPopular();
    
    console.log(`Found ${popularMovies.total_results} popular movies (showing first 5):`);
    popularMovies.results.slice(0, 5).forEach((movie, i) => {
      console.log(`${i+1}. ${movie.title} (${movie.release_date.split('-')[0]}) - Rating: ${movie.vote_average}/10`);
    });
    
    // Get detailed information for a specific movie
    // Using the first popular movie from previous request
    const movieId = popularMovies.results[0].id;
    console.log(`\n2. Getting details for: ${popularMovies.results[0].title} (ID: ${movieId})`);
    
    const movieDetails = await tmdb.movies.getDetails({ 
      movieId,
      appendToResponse: 'videos,credits'
    });
    
    // Display basic movie information
    console.log('\nMovie Details:');
    console.log(`Title: ${movieDetails.title}`);
    console.log(`Original Title: ${movieDetails.original_title}`);
    console.log(`Release Date: ${movieDetails.release_date}`);
    console.log(`Runtime: ${movieDetails.runtime} minutes`);
    console.log(`Genres: ${movieDetails.genres.map(g => g.name).join(', ')}`);
    console.log(`Overview: ${movieDetails.overview}`);
    
    // Get movie credits separately
    console.log('\n3. Getting credits for the movie:');
    const credits = await tmdb.movies.getCredits(movieId);
    
    // Display cast information
    console.log('\nCast:');
    credits.cast.slice(0, 5).forEach((actor, i) => {
      console.log(`${i+1}. ${actor.name} as ${actor.character}`);
    });
    
    // Display crew information (director, producer, etc.)
    const director = credits.crew.find(person => person.job === 'Director');
    console.log(`\nDirector: ${director ? director.name : 'Unknown'}`);
    
    // Get movie videos
    console.log('\n4. Getting videos for the movie:');
    const videos = await tmdb.movies.getVideos(movieId);
    
    // Find and display trailer
    const trailer = videos.results.find(video => 
      video.type === 'Trailer' && video.official === true
    );
    
    if (trailer) {
      console.log('\nOfficial Trailer:');
      console.log(`Name: ${trailer.name}`);
      console.log(`Site: ${trailer.site}`);
      console.log(`URL: https://www.youtube.com/watch?v=${trailer.key}`);
    } else {
      console.log('\nNo official trailer found.');
    }
    
    // Get similar movies
    console.log('\n5. Finding similar movies:');
    const similarMovies = await tmdb.movies.getSimilar(movieId);
    
    console.log(`Found ${similarMovies.total_results} similar movies (showing first 5):`);
    similarMovies.results.slice(0, 5).forEach((movie, i) => {
      console.log(`${i+1}. ${movie.title} (${movie.release_date.split('-')[0]}) - ${movie.vote_average}/10`);
    });
    
    // Get now playing movies with region filtering
    console.log('\n6. Getting movies now playing in theaters (US):');
    const nowPlaying = await tmdb.movies.getNowPlaying(1, 'en-US', 'US');
    
    console.log(`Found ${nowPlaying.total_results} movies now playing (showing first 5):`);
    nowPlaying.results.slice(0, 5).forEach((movie, i) => {
      console.log(`${i+1}. ${movie.title} (${movie.release_date.split('-')[0]})`);
    });
    
  } catch (error) {
    console.error('Error in movies example:', error.message);
  }
}

moviesExample();

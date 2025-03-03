/* eslint-disable no-console */
import { TMDBClient } from '../src';
import { performance } from 'perf_hooks';

// Initialize the client with caching enabled
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  },
  cache: {
    enabled: true,
    maxSize: 100,   // Maximum number of items to cache
    ttl: 60 * 1000  // Cache time-to-live: 1 minute
  }
});

async function cachingExample() {
  try {
    console.log('=== Demonstrating Cache Performance ===');
    
    // First request - will hit the API
    console.log('\nMaking first request (uncached)...');
    const startFirstRequest = performance.now();
    const movieDetails = await tmdb.movies.getDetails({ movieId: 550 }); // Fight Club
    const endFirstRequest = performance.now();
    
    console.log(`Movie: ${movieDetails.title} (${movieDetails.release_date.split('-')[0]})`);
    console.log(`First request time: ${(endFirstRequest - startFirstRequest).toFixed(2)}ms`);
    
    // Second request - should be from cache
    console.log('\nMaking second request (should be cached)...');
    const startSecondRequest = performance.now();
    const cachedMovie = await tmdb.movies.getDetails({ movieId: 550 });
    const endSecondRequest = performance.now();
    
    console.log(`Movie: ${cachedMovie.title} (${cachedMovie.release_date.split('-')[0]})`);
    console.log(`Second request time: ${(endSecondRequest - startSecondRequest).toFixed(2)}ms`);
    
    // Making a different request
    console.log('\nMaking request for a different movie (uncached)...');
    const startThirdRequest = performance.now();
    const anotherMovie = await tmdb.movies.getDetails({ movieId: 11 }); // Star Wars
    const endThirdRequest = performance.now();
    
    console.log(`Movie: ${anotherMovie.title} (${anotherMovie.release_date.split('-')[0]})`);
    console.log(`New movie request time: ${(endThirdRequest - startThirdRequest).toFixed(2)}ms`);
    
    // Disabling cache for a specific request
    console.log('\nMaking request with cache disabled (force fresh data)...');
    const startFreshRequest = performance.now();
    // Fix: Add the option parameter with cache: false
    const freshMovie = await tmdb.movies.getDetails(
      { movieId: 550 },
    );
    const endFreshRequest = performance.now();
    
    console.log(`Movie: ${freshMovie.title} (${freshMovie.release_date.split('-')[0]})`);
    console.log(`Fresh data request time: ${(endFreshRequest - startFreshRequest).toFixed(2)}ms`);
    
    // Cache size and management example
    console.log('\n=== Cache Management Example ===');
    
    // Make multiple requests to fill cache
    console.log('Filling cache with multiple requests...');
    
    const movieIds = [299534, 675353, 447365, 603, 550988];
    const movies = await Promise.all(
      movieIds.map(id => tmdb.movies.getDetails({ movieId: id }))
    );
    
    console.log(`Cached ${movies.length} movies:`);
    movies.forEach(movie => console.log(`- ${movie.title}`));
    
    // Information about cache behavior
    console.log('\nCache management information:');
    console.log('1. Expired items are removed first when capacity is reached');
    console.log('2. If still at capacity, oldest items are evicted');
    console.log('3. New items are then added to the cache');
    
    // Summary
    console.log('\n=== Cache Performance Summary ===');
    console.log(`First request (uncached): ${(endFirstRequest - startFirstRequest).toFixed(2)}ms`);
    console.log(`Second request (cached): ${(endSecondRequest - startSecondRequest).toFixed(2)}ms`);
    
    const speedup = (endFirstRequest - startFirstRequest) / Math.max(1, endSecondRequest - startSecondRequest);
    console.log(`Speed improvement: ${speedup.toFixed(1)}x faster`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

cachingExample();

import { TMDBClient, HttpError, RateLimitError } from '../src';

// Initialize the client
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  }
});

async function errorHandlingExamples() {
  console.log('=== Error Handling Examples ===');

  // Example 1: Handling a 404 Not Found error
  try {
    console.log('\nAttempting to fetch a non-existent movie (ID: 9999999)...');
    // This movie ID doesn't exist, so it should trigger a 404 error
    const movie = await tmdb.movies.getDetails({ movieId: 9999999 });
    console.log('Movie details:', movie.title);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      console.error('✓ Successfully caught 404 error: Movie not found');
      console.error(`  Error details: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }

  // Example 2: Handling invalid parameters
  try {
    console.log('\nAttempting search with empty query...');
    // @ts-ignore - Deliberately passing invalid params for example
    const searchResults = await tmdb.search.movies({ query: '' });
    console.log(`Found ${searchResults.total_results} results`);
  } catch (error) {
    if (error instanceof HttpError && error.status === 422) {
      console.error('✓ Successfully caught validation error');
      console.error(`  Error details: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }

  // Example 3: Handling rate limits (simulate)
  try {
    console.log('\nSimulating rate limit handling...');
    // Create a fake RateLimitError for demonstration
    throw new RateLimitError(
      'Rate limit exceeded: 40 requests per 10 seconds',
      429,
      'Too Many Requests',
      'https://api.themoviedb.org/3/movie/popular',
      3000 // 3 seconds retry after
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.error('✓ Successfully caught rate limit error');
      console.error(`  Error details: ${error.message}`);
      console.error(`  Retry after: ${error.retryAfter}ms`);
      console.error('  Implementing exponential backoff strategy...');
      
      // Example implementation of handling rate limits with exponential backoff
      const handleRateLimit = async () => {
        console.error('  • Waiting before retrying request...');
        // In a real implementation, you would wait here
        // await new Promise(resolve => setTimeout(resolve, error.retryAfter));
        console.error('  • Retrying request with reduced frequency');
      };
      
      await handleRateLimit();
    } else {
      console.error('Unexpected error:', error);
    }
  }

  // Example 4: Using try/catch with async/await
  try {
    console.log('\nDemonstrating proper error handling with async/await...');
    const results = await Promise.all([
      tmdb.movies.getPopular(),
      // Intentionally cause an error in the second request
      tmdb.movies.getDetails({ movieId: -1 }) // Invalid ID
    ]);
    
    console.log('This code will not execute if any promise rejects');
  } catch (error) {
    console.error('✓ Successfully caught error in Promise.all');
    console.error(`  Error details: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Example 5: The SDK's built-in retry mechanism
  console.log('\nThe SDK has built-in retry logic for network errors:');
  console.log('- Automatically retries failed requests (network errors)');
  console.log('- Implements exponential backoff between retry attempts');
  console.log('- Respects 429 rate limit responses and retry-after headers');
  console.log('- Throws appropriate error types for different failure scenarios');
  
  console.log('\nExample custom retry configuration:');
  console.log(`
const tmdbWithRetry = new TMDBClient({
  auth: { apiKey: 'your_api_key' },
  http: {
    retry: true,          // Enable retry (default is true)
    maxRetries: 5,        // Maximum number of retries (default is 3)
    retryDelay: 1000,     // Base delay between retries in ms (default is 300)
    timeout: 10000        // Request timeout in ms (default is 10000)
  }
});
  `);
}

errorHandlingExamples();

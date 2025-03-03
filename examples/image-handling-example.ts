/* eslint-disable no-console */
import { TMDBClient } from '../src';

// Initialize the client
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  }
});

/**
 * This example demonstrates how to work with TMDB images
 */
async function imageHandlingExample() {
  try {
    console.log('=== TMDB Image Handling Example ===');
    
    // First, let's fetch the API configuration to get available image sizes
    const config = await tmdb.configuration.getApiConfiguration();
    
    console.log('Available Image Configurations:');
    console.log('- Base URL:', config.images.secure_base_url);
    
    console.log('\nAvailable Poster Sizes:');
    config.images.poster_sizes.forEach(size => console.log(`- ${size}`));
    
    console.log('\nAvailable Backdrop Sizes:');
    config.images.backdrop_sizes.forEach(size => console.log(`- ${size}`));
    
    console.log('\nAvailable Profile Sizes:');
    config.images.profile_sizes.forEach(size => console.log(`- ${size}`));
    
    // Let's get a popular movie to demonstrate images
    console.log('\nFetching a popular movie...');
    const popularMovies = await tmdb.movies.getPopular(1);
    const movie = popularMovies.results[0];
    
    console.log(`Selected Movie: ${movie.title} (${movie.release_date.split('-')[0]})`);
    
    // Now let's get various image URLs for this movie
    
    // Poster image
    const posterUrl = tmdb.images.getPosterUrl({
      path: movie.poster_path,
      size: 'w500'
    });
    
    // Backdrop image
    const backdropUrl = tmdb.images.getBackdropUrl({
      path: movie.backdrop_path,
      size: 'w1280'
    });
    
    console.log('\nGenerated Image URLs:');
    console.log(`Poster (w500): ${posterUrl}`);
    console.log(`Backdrop (w1280): ${backdropUrl}`);
    
    // Let's fetch detailed movie images
    console.log('\nFetching all available images for this movie...');
    const movieImages = await tmdb.movies.getImages(movie.id);
    
    console.log(`- ${movieImages.backdrops?.length || 0} backdrop images`);
    console.log(`- ${movieImages.posters?.length || 0} poster images`);
    
    // Getting image URLs directly from the helper utility
    console.log('\nDifferent ways to generate image URLs:');
    
    // Method 1: Using the images property directly
    const posterUrlMethod1 = tmdb.images.getPosterUrl({
      path: movie.poster_path,
      size: 'w185'
    });
    console.log('Method 1:', posterUrlMethod1);
    
    // Method 2: Using getImageUrl with type parameter
    const posterUrlMethod2 = tmdb.images.getImageUrl({
      path: movie.poster_path,
      size: 'w185'
    }, 'poster');
    console.log('Method 2:', posterUrlMethod2);
    
    // Example with non-existent image
    const nonExistentUrl = tmdb.images.getPosterUrl({
      path: null,
      size: 'w500'
    });
    console.log('\nHandling null/missing image paths:', nonExistentUrl);
    
    // Demonstrating how to handle images in an application
    console.log('\nTypical image handling pattern in an application:');
    console.log(`
// React component example
function MoviePoster({ path, alt, size = "w342" }) {
  const imageUrl = path 
    ? \`${config.images.secure_base_url}\${size}\${path}\`
    : '/path/to/placeholder-image.jpg';
    
  return <img src={imageUrl} alt={alt} />;
}
`);

  } catch (error) {
    console.error('Error in image handling example:', error.message);
  }
}

imageHandlingExample();

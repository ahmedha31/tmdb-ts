import { TMDBClient, MediaType, TimeWindow } from '../src';

// Initialize the client with caching enabled
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  },
  cache: {
    enabled: true
  },
  language: 'en-US'
});

/**
 * This example shows a more complex use case combining multiple API features
 * to create a personalized movie/TV recommendation flow.
 */
async function combinedExample() {
  try {
    console.log('=== Building a Personalized Recommendation System ===');
    
    // Step 1: Get trending content to find popular reference points
    console.log('\n1. Getting trending content as starting points...');
    const trendingMovies = await tmdb.trending.getMovies(TimeWindow.Week);
    const trendingShows = await tmdb.trending.getTVShows(TimeWindow.Week);
    
    // Select a trending movie and show as reference points
    const referenceMovie = trendingMovies.results[0];
    const referenceShow = trendingShows.results[0];
    
    console.log(`Reference Movie: ${referenceMovie.title}`);
    console.log(`Reference TV Show: ${referenceShow.name}`);
    
    // Step 2: Get similar content based on these reference points
    console.log('\n2. Finding similar content to our reference points...');
    
    // Similar movies
    const similarMovies = await tmdb.movies.getSimilar(referenceMovie.id);
    console.log(`Found ${similarMovies.total_results} movies similar to ${referenceMovie.title}`);
    
    // Similar TV shows
    const similarShows = await tmdb.tv.getSimilar(referenceShow.id);
    console.log(`Found ${similarShows.total_results} shows similar to ${referenceShow.name}`);
    
    // Step 3: Extract genres from our reference content to use for discovery
    console.log('\n3. Extracting genres for deeper recommendations...');
    
    // Get full movie details to extract genres
    const movieDetails = await tmdb.movies.getDetails({ movieId: referenceMovie.id });
    const movieGenreIds = movieDetails.genres.map(genre => genre.id).join(',');
    
    console.log(`${referenceMovie.title} genres: ${movieDetails.genres.map(g => g.name).join(', ')}`);
    
    // Step 4: Use the Discover API to find hidden gems with these genres
    console.log('\n4. Discovering hidden gems based on genres...');
    const hiddenGems = await tmdb.discover.movies({
      with_genres: movieGenreIds,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100, // Enough votes to be reliable
      'vote_average.gte': 7.0, // Good quality
      'primary_release_date.gte': '2010-01-01', // Relatively recent
      include_adult: false,
      page: 1
    });
    
    // Filter out our original reference movie
    const recommendations = hiddenGems.results
      .filter(movie => movie.id !== referenceMovie.id)
      .slice(0, 5);
    
    // Step 5: Get details for a couple of top recommendations
    console.log('\n5. Preparing detailed recommendations...');
    
    // Deep details for top recommendation
    if (recommendations.length > 0) {
      const topRecommendation = recommendations[0];
      const details = await tmdb.movies.getDetails({ movieId: topRecommendation.id });
      const credits = await tmdb.movies.getCredits(topRecommendation.id);
      const videos = await tmdb.movies.getVideos(topRecommendation.id);
      
      // Trailer URL
      const trailer = videos.results.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      const trailerUrl = trailer 
        ? `https://www.youtube.com/watch?v=${trailer.key}` 
        : 'No trailer available';
      
      // Cast info
      const topCast = credits.cast.slice(0, 3).map(person => person.name).join(', ');
      
      // Director info
      const director = credits.crew.find(person => person.job === 'Director');
      const directorName = director ? director.name : 'Unknown';
      
      // Create comprehensive recommendation
      console.log('\n===== TOP RECOMMENDATION =====');
      console.log(`${details.title} (${details.release_date.split('-')[0]})`);
      console.log(`Rating: ${details.vote_average}/10 from ${details.vote_count} votes`);
      console.log(`Director: ${directorName}`);
      console.log(`Starring: ${topCast}`);
      console.log(`Runtime: ${details.runtime} minutes`);
      
      // Poster URL using the image helper
      const posterUrl = tmdb.images.getPosterUrl({
        path: details.poster_path,
        size: 'w342'
      });
      console.log(`Poster: ${posterUrl}`);
      
      console.log(`Trailer: ${trailerUrl}`);
      console.log(`\nOverview: ${details.overview}`);
      
      // Additional recommendations
      console.log('\n===== ADDITIONAL RECOMMENDATIONS =====');
      for (let i = 1; i < recommendations.length; i++) {
        console.log(`${i}. ${recommendations[i].title} (${recommendations[i].release_date.split('-')[0]}) - ${recommendations[i].vote_average}/10`);
      }
    }
    
    console.log('\nThis example demonstrates how to build a recommendation system by:');
    console.log('1. Starting with trending content');
    console.log('2. Finding similar content to establish preferences');
    console.log('3. Extracting genres to broaden the recommendation base');
    console.log('4. Using the Discover API to find content matching these preferences');
    console.log('5. Enhancing recommendations with detailed information and media links');
    
  } catch (error) {
    console.error('Error in combined example:', error.message);
  }
}

combinedExample();

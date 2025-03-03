/* eslint-disable no-console */
import { TMDBClient, MediaType, TimeWindow } from '../src';

// Initialize the client
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  }
});

async function trendingExamples() {
  try {
    // Get trending movies for the day
    console.log('=== Trending Movies Today ===');
    const trendingMoviesToday = await tmdb.trending.getMovies(TimeWindow.Day);
    
    console.log(`Top 5 trending movies today:`);
    trendingMoviesToday.results.slice(0, 5).forEach((movie, i) => {
      console.log(`${i+1}. ${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'}) - Popularity: ${movie.popularity.toFixed(1)}`);
      console.log(`   Overview: ${movie.overview.substring(0, 100)}...`);
    });
    
    // Get trending TV shows for the week
    console.log('\n=== Trending TV Shows This Week ===');
    const trendingTVWeek = await tmdb.trending.getTVShows(TimeWindow.Week);
    
    console.log(`Top 5 trending TV shows this week:`);
    trendingTVWeek.results.slice(0, 5).forEach((show, i) => {
      console.log(`${i+1}. ${show.name} (${show.first_air_date?.split('-')[0] || 'N/A'}) - Popularity: ${show.popularity.toFixed(1)}`);
      console.log(`   Overview: ${show.overview.substring(0, 100)}...`);
    });
    
    // Get trending people for the day
    console.log('\n=== Trending People Today ===');
    const trendingPeopleToday = await tmdb.trending.getPeople(TimeWindow.Day);
    
    console.log(`Top 5 trending people today:`);
    trendingPeopleToday.results.slice(0, 5).forEach((person, i) => {
      console.log(`${i+1}. ${person.name} - Known for: ${person.known_for_department}`);
    });
    
    // Get all trending media for the week
    console.log('\n=== All Trending Media This Week ===');
    const allTrendingWeek = await tmdb.trending.getAll('all', TimeWindow.Week);
    
    console.log(`Top trending items this week by media type:`);
    
    // Type-safe way to group results
    const movies: any[] = [];
    const tvShows: any[] = [];
    const people: any[] = [];
    
    allTrendingWeek.results.forEach(item => {
      if ('media_type' in item) {
        switch (item.media_type) {
          case MediaType.Movie:
            movies.push(item);
            break;
          case MediaType.Tv:
            tvShows.push(item);
            break;
          case MediaType.Person:
            people.push(item);
            break;
        }
      }
    });
    
    // Now display each group
    if (movies.length) {
      console.log('\nMOVIES');
      movies.slice(0, 3).forEach((movie, i) => {
        console.log(`${i+1}. ${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})`);
      });
    }
    
    if (tvShows.length) {
      console.log('\nTV');
      tvShows.slice(0, 3).forEach((show, i) => {
        console.log(`${i+1}. ${show.name} (${show.first_air_date?.split('-')[0] || 'N/A'})`);
      });
    }
    
    if (people.length) {
      console.log('\nPEOPLE');
      people.slice(0, 3).forEach((person, i) => {
        console.log(`${i+1}. ${person.name}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

trendingExamples();

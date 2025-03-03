import { TMDBClient, MediaType } from '../src';

// Initialize the client
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  }
});

async function searchExamples() {
  try {
    // Search for movies
    console.log('\n=== Movie Search ===');
    const movieResults = await tmdb.search.movies({
      query: 'Matrix',
      year: 1999,
      include_adult: false
    });
    
    console.log(`Found ${movieResults.total_results} movies matching "Matrix"`);
    movieResults.results.slice(0, 3).forEach((movie, i) => {
      console.log(`${i+1}. ${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'}) - ${movie.vote_average}/10`);
    });

    // Search for TV shows
    console.log('\n=== TV Show Search ===');
    const tvResults = await tmdb.search.tvShows({
      query: 'Breaking Bad',
      include_adult: false
    });
    
    console.log(`Found ${tvResults.total_results} TV shows matching "Breaking Bad"`);
    tvResults.results.slice(0, 3).forEach((show, i) => {
      console.log(`${i+1}. ${show.name} (${show.first_air_date?.split('-')[0] || 'N/A'}) - ${show.vote_average}/10`);
    });
    
    // Search for people
    console.log('\n=== Person Search ===');
    const personResults = await tmdb.search.people({
      query: 'Tom Hanks',
      include_adult: false
    });
    
    console.log(`Found ${personResults.total_results} people matching "Tom Hanks"`);
    personResults.results.slice(0, 3).forEach((person, i) => {
      console.log(`${i+1}. ${person.name} - Known for: ${person.known_for_department}`);
      if (person.known_for && person.known_for.length > 0) {
        const titles = person.known_for.map(item => {
          if ('title' in item) {
            return item.title;
          } else if ('name' in item) {
            return item.name;
          }
          return 'Unknown';
        });
        console.log(`   Notable works: ${titles.join(', ')}`);
      }
    });
    
    // Multi-search
    console.log('\n=== Multi Search ===');
    const multiResults = await tmdb.search.multi({
      query: 'Avengers',
      include_adult: false
    });
    
    console.log(`Found ${multiResults.total_results} items matching "Avengers"`);
    multiResults.results.slice(0, 5).forEach((item, i) => {
      let details = '';
      if (item.media_type === MediaType.Movie) {
        details = `Movie: ${item.title} (${item.release_date?.split('-')[0] || 'N/A'})`;
      } else if (item.media_type === MediaType.Tv) {
        details = `TV Show: ${item.name} (${item.first_air_date?.split('-')[0] || 'N/A'})`;
      } else if (item.media_type === MediaType.Person) {
        details = `Person: ${item.name}`;
      }
      console.log(`${i+1}. ${details}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

searchExamples();

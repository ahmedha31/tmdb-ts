import { TMDBClient } from '../src';

// Initialize the client
const tmdb = new TMDBClient({
  auth: {
    apiKey: 'your_api_key_here' // Replace with your actual API key
  }
});

/**
 * This example demonstrates authentication with TMDB.
 * 
 * TMDB authentication typically follows these steps:
 * 1. Create a request token
 * 2. User authorizes the token (via login)
 * 3. Create a session with the authorized token
 * 4. Use the session ID for requests requiring authentication
 * 
 * Note: To run this example, you'll need a TMDB account and API key.
 * Replace 'your_username' and 'your_password' with your actual credentials.
 */
async function authenticationExample() {
  try {
    console.log('=== TMDB Authentication Example ===');
    
    // The TMDBClient provides a helper method that handles the entire auth flow:
    console.log('Attempting to authenticate with TMDB...');
    
    // This will:
    // 1. Create a request token
    // 2. Validate it with login credentials
    // 3. Create a session
    // 4. Store the session ID in the client
    
    // Note: For security, consider using environment variables instead of hardcoding
    // const username = process.env.TMDB_USERNAME;
    // const password = process.env.TMDB_PASSWORD;
    
    /*
    const sessionId = await tmdb.authenticate('your_username', 'your_password');
    console.log('Authentication successful!');
    console.log(`Session ID: ${sessionId}`);
    */
    
    // For this example, let's just demonstrate the API calls without making them:
    console.log('Authentication flow (simulation):');
    console.log('1. Creating request token...');
    // const tokenResponse = await tmdb.authManager.createRequestToken();
    
    console.log('2. User authorizes token (via login)...');
    // const validatedTokenResponse = await tmdb.authManager.validateWithLogin(
    //   'username', 'password', tokenResponse.request_token
    // );
    
    console.log('3. Creating session with authorized token...');
    // const sessionResponse = await tmdb.authManager.createSession(
    //   validatedTokenResponse.request_token
    // );
    
    console.log('4. Session established, storing session ID...');
    // tmdb.setSessionId(sessionResponse.session_id);
    
    // Checking if we already have a session (for demonstration)
    if (tmdb.hasSession()) {
      console.log('Session is active!');
      console.log(`Session ID: ${tmdb.getSessionId()}`);
    } else {
      console.log('No active session.');
    }
    
    // Setting a session ID manually (if you already have one)
    console.log('\nYou can also set a session ID manually if you have one:');
    console.log('tmdb.setSessionId("your_session_id_here");');
    
    console.log('\nSession IDs are valid until explicitly deleted through the TMDB API');
    console.log('or until the user logs out on the TMDB website.');
    
    // Using a session for authenticated requests
    console.log('\nOnce authenticated, you can access endpoints requiring authentication:');
    console.log('- Rate movies or TV shows');
    console.log('- Add to watchlists or favorites');
    console.log('- Access account specific information');
    console.log('- And more...');
    
  } catch (error) {
    console.error('Authentication Error:', error.message);
    
    if (error.status === 401) {
      console.error('Invalid username/password combination.');
    } else if (error.status === 404) {
      console.error('The API request failed. Please check your API key.');
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

authenticationExample();

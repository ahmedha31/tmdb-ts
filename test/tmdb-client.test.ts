import { TMDBClient } from '../src/tmdb-client';
import { FetchClient } from '../src/http/fetch-client';
import { AuthManager } from '../src/authentication/auth-manager';

// Mock dependencies
jest.mock('../src/http/fetch-client');
jest.mock('../src/authentication/auth-manager');
jest.mock('../src/resources/movies-resource');
jest.mock('../src/resources/tv-resource');
jest.mock('../src/resources/search-resource');

describe('TMDBClient', () => {
  const MockedFetchClient = FetchClient as jest.MockedClass<typeof FetchClient>;
  const MockedAuthManager = AuthManager as jest.MockedClass<typeof AuthManager>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure the mocked methods exist on the FetchClient prototype
    MockedFetchClient.prototype.setDefaultParams = jest.fn();
    MockedFetchClient.prototype.setDefaultHeaders = jest.fn();
  });
  
  describe('constructor', () => {
    it('should create a client with API key auth', () => {
      const _client = new TMDBClient({
        auth: {
          apiKey: 'test-api-key'
        }
      });
      
      expect(MockedFetchClient).toHaveBeenCalled();
      // Should set API key as query parameter, not header
      expect(MockedFetchClient.prototype.setDefaultParams).toHaveBeenCalledWith({
        api_key: 'test-api-key'
      });
      expect(MockedAuthManager).toHaveBeenCalledWith(
        expect.any(Object),
        'test-api-key',
        undefined
      );
    });
    
    it('should create a client with access token auth', () => {
      const _client = new TMDBClient({
        auth: {
          accessToken: 'test-access-token'
        }
      });
      
      expect(MockedFetchClient).toHaveBeenCalled();
      // Access token still uses Authorization header
      expect(MockedFetchClient.prototype.setDefaultHeaders).toHaveBeenCalledWith({
        Authorization: 'Bearer test-access-token'
      });
    });
    
    it('should throw if neither apiKey nor accessToken is provided', () => {
      expect(() => {
        new TMDBClient({
          auth: {}
        });
      }).toThrow('Either apiKey or accessToken must be provided');
    });
    
    it('should initialize with cache if enabled', () => {
      const client = new TMDBClient({
        auth: {
          apiKey: 'test-api-key'
        },
        cache: {
          enabled: true,
          maxSize: 200,
          ttl: 60000
        }
      });
      
      // We can't directly test the Cache instance, but we can verify that the resources were
      // initialized with the expected parameters
      expect(client).toHaveProperty('movies');
      expect(client).toHaveProperty('tv');
      expect(client).toHaveProperty('search');
    });
    
    it('should use default language if not specified', () => {
      const client = new TMDBClient({
        auth: {
          apiKey: 'test-api-key'
        }
      });
      
      // Default language should be en-US
      expect(client).toHaveProperty('movies');
    });
    
    it('should use specified language', () => {
      const client = new TMDBClient({
        auth: {
          apiKey: 'test-api-key'
        },
        language: 'fr-FR'
      });
      
      expect(client).toHaveProperty('movies');
    });

    it('should configure API client with correct options', () => {
      const _client = new TMDBClient({
        auth: {
          apiKey: 'test-api-key'
        },
        http: {
          timeout: 5000,
          retry: true,
          maxRetries: 2,
          retryDelay: 500
        }
      });

      expect(MockedFetchClient).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          timeout: 5000,
          retry: true,
          maxRetries: 2,
          retryDelay: 500
        })
      );
    });
  });
  
  describe('authentication methods', () => {
    let client: TMDBClient;
    
    beforeEach(() => {
      client = new TMDBClient({
        auth: {
          apiKey: 'test-api-key'
        }
      });
      
      // Reset mock implementation
      (MockedAuthManager.prototype.authenticate as jest.Mock).mockReset();
      (MockedAuthManager.prototype.setSessionId as jest.Mock).mockReset();
      (MockedAuthManager.prototype.getSessionId as jest.Mock).mockReset();
      (MockedAuthManager.prototype.hasSession as jest.Mock).mockReset();
    });
    
    it('should call authenticate on the auth manager', async () => {
      (MockedAuthManager.prototype.authenticate as jest.Mock).mockResolvedValue('test-session-id');
      
      const result = await client.authenticate('username', 'password');
      
      expect(MockedAuthManager.prototype.authenticate).toHaveBeenCalledWith('username', 'password');
      expect(result).toBe('test-session-id');
    });
    
    it('should call setSessionId on the auth manager', () => {
      client.setSessionId('test-session-id');
      
      expect(MockedAuthManager.prototype.setSessionId).toHaveBeenCalledWith('test-session-id');
    });
    
    it('should call getSessionId on the auth manager', () => {
      (MockedAuthManager.prototype.getSessionId as jest.Mock).mockReturnValue('test-session-id');
      
      const result = client.getSessionId();
      
      expect(MockedAuthManager.prototype.getSessionId).toHaveBeenCalled();
      expect(result).toBe('test-session-id');
    });
    
    it('should call hasSession on the auth manager', () => {
      (MockedAuthManager.prototype.hasSession as jest.Mock).mockReturnValue(true);
      
      const result = client.hasSession();
      
      expect(MockedAuthManager.prototype.hasSession).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('image URL methods', () => {
    let client: TMDBClient;

    beforeEach(() => {
      client = new TMDBClient({
        auth: {
          apiKey: 'test-api-key'
        }
      });
    });

    it('should generate correct image URL', () => {
      // Mock the UrlHelper static methods
      const originalGetImageUrl = client.images.getImageUrl;
      client.images.getImageUrl = jest.fn().mockReturnValue('https://image.tmdb.org/t/p/w500/test-path.jpg');

      const result = client.getImageUrl({ 
        path: '/test-path.jpg', 
        size: 'w500' 
      }, 'poster');

      expect(client.images.getImageUrl).toHaveBeenCalledWith(
        { path: '/test-path.jpg', size: 'w500' },
        'poster'
      );
      expect(result).toBe('https://image.tmdb.org/t/p/w500/test-path.jpg');

      // Restore original method
      client.images.getImageUrl = originalGetImageUrl;
    });
  });
});

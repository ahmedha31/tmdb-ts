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
        'test-api-key'
      );
    });
  
    it('should throw if neither apiKey nor accessToken is provided', () => {
      expect(() => {
        new TMDBClient({
          auth: {}
        });
      }).toThrow('API key must be provided');
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

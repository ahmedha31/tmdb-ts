import { MoviesResource } from '../../src/resources/movies-resource';
import { API_CONFIG } from '../../src/config/api-config';
import { FetchClient } from '../../src';



describe('MoviesResource', () => {
  let moviesResource: MoviesResource;
  const tmdbBaseUrl = API_CONFIG.BASE_URL;
  const fetchClient = new FetchClient(tmdbBaseUrl);
  
  beforeEach(() => {
    jest.clearAllMocks();
    moviesResource = new MoviesResource(fetchClient, tmdbBaseUrl);
    
    // Mock get method to return data directly
    (moviesResource as any).get = jest.fn().mockImplementation((path, params, options = {}) => {
      return { path, params, options };
    });
    
    // Mock buildPath method
    (moviesResource as any).buildPath = jest.fn().mockImplementation((path, params) => {
      // Simple implementation to replace {param} with actual value
      let result = path;
      for (const [key, value] of Object.entries(params)) {
        result = result.replace(`{${key}}`, String(value));
      }
      return result;
    });
  });
  
  describe('getDetails', () => {
    it('should request movie details with correct parameters', async () => {
      const params = { movieId: 123, language: 'en-US' };
      await moviesResource.getDetails(params);
      
      expect((moviesResource as any).get).toHaveBeenCalledWith(
        '/movie/123',
        {
          language: 'en-US',
          append_to_response: undefined
        },
        {} // Default options
      );
    });
    
    it('should include appendToResponse if provided', async () => {
      const params = { 
        movieId: 123, 
        language: 'en-US',
        appendToResponse: 'credits,videos'
      };
      await moviesResource.getDetails(params);
      
      expect((moviesResource as any).get).toHaveBeenCalledWith(
        '/movie/123',
        {
          language: 'en-US',
          append_to_response: 'credits,videos'
        },
        {} // Default options
      );
    });
    
    it('should pass cache options if provided', async () => {
      const params = { movieId: 123 };
      const options = { cache: false };
      await moviesResource.getDetails(params, options);
      
      expect((moviesResource as any).get).toHaveBeenCalledWith(
        '/movie/123',
        {
          language: undefined,
          append_to_response: undefined
        },
        { cache: false }
      );
    });
  });
  
  describe('getCredits', () => {
    it('should request movie credits with correct parameters', async () => {
      await moviesResource.getCredits(123, 'en-US');
      
      expect((moviesResource as any).get).toHaveBeenCalledWith(
        '/movie/123/credits',
        { language: 'en-US' },
        {} // Default options
      );
    });
    
    it('should pass cache options if provided', async () => {
      await moviesResource.getCredits(123, 'en-US', { cache: false });
      
      expect((moviesResource as any).get).toHaveBeenCalledWith(
        '/movie/123/credits',
        { language: 'en-US' },
        { cache: false }
      );
    });
  });
  
  describe('getVideos', () => {
    it('should request movie videos with correct parameters', async () => {
      await moviesResource.getVideos(123, 'en-US');
      
      expect((moviesResource as any).get).toHaveBeenCalledWith(
        '/movie/123/videos',
        { language: 'en-US' }
      );
    });
  });
  
  describe('getPopular', () => {
    it('should request popular movies with default parameters', async () => {
      await moviesResource.getPopular();
      
      expect((moviesResource as any).get).toHaveBeenCalledWith(
        '/movie/popular',
        {
          page: 1,
          language: undefined,
          region: undefined
        },
        {} // Default options
      );
    });
    
    it('should include all parameters when provided', async () => {
      // Fix test by including cacheTtl in the options
      await moviesResource.getPopular(2, 'fr-FR', 'FR', { cache: true,});
      
      expect((moviesResource as any).get).toHaveBeenCalledWith(
        '/movie/popular',
        {
          page: 2,
          language: 'fr-FR',
          region: 'FR'
        },
        { cache: true, cacheTtl: 1800000 }
      );
    });
  });
});

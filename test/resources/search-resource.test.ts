import { SearchResource } from '../../src/resources/search-resource';
import { HttpClient } from '../../src/http/http-client';
import { API_CONFIG } from '../../src/config/api-config';

// Mock HttpClient
const mockHttpClient: jest.Mocked<HttpClient> = {
  request: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  setDefaultHeaders: jest.fn(),
  setDefaultParams: jest.fn() // Add missing setDefaultParams method
};

describe('SearchResource', () => {
  let searchResource: SearchResource;
  const tmdbBaseUrl = API_CONFIG.BASE_URL;
  
  beforeEach(() => {
    jest.clearAllMocks();
    searchResource = new SearchResource(mockHttpClient, tmdbBaseUrl);
    
    // Mock get method
    (searchResource as any).get = jest.fn().mockImplementation((path, params) => {
      return { path, params };
    });
  });
  
  describe('movies', () => {
    it('should search movies with correct parameters', async () => {
      const params = {
        query: 'inception',
        language: 'en-US',
        page: 2,
        include_adult: false,
        region: 'US',
        year: 2010
      };
      
      await searchResource.movies(params);
      
      expect((searchResource as any).get).toHaveBeenCalledWith(
        '/search/movie',
        {
          query: 'inception',
          language: 'en-US',
          page: 2,
          include_adult: false,
          region: 'US',
          year: 2010,
          primary_release_year: undefined
        }
      );
    });
  });
  
  describe('tvShows', () => {
    it('should search TV shows with correct parameters', async () => {
      const params = {
        query: 'stranger things',
        language: 'en-US',
        page: 1,
        include_adult: true,
        first_air_date_year: 2016
      };
      
      await searchResource.tvShows(params);
      
      expect((searchResource as any).get).toHaveBeenCalledWith(
        '/search/tv',
        {
          query: 'stranger things',
          language: 'en-US',
          page: 1,
          include_adult: true,
          first_air_date_year: 2016
        }
      );
    });
  });
  
  describe('multi', () => {
    it('should perform multi-search with correct parameters', async () => {
      const params = {
        query: 'brad pitt',
        language: 'en-US',
        page: 1,
        include_adult: false
      };
      
      await searchResource.multi(params);
      
      expect((searchResource as any).get).toHaveBeenCalledWith(
        '/search/multi',
        {
          query: 'brad pitt',
          language: 'en-US',
          page: 1,
          include_adult: false,
          region: undefined
        }
      );
    });
  });
});

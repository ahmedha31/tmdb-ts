import { TVResource } from '../../src/resources/tv-resource';
import { FetchClient } from '../../src/http/fetch-client';
import { Cache } from '../../src/utils/cache';
import { TVShowDetails, TVCredits, TVShowListResult, Season, Episode } from '../../src/types/tv';
import { PaginatedResponse, ImageCollection, Video } from '../../src/types/common';
import { ENDPOINTS } from '../../src/config/api-config';

// Mock HttpClient
jest.mock('../../src/http/fetch-client');
const MockHttpClient = FetchClient as jest.MockedClass<typeof FetchClient>;

// Mock UrlHelper
jest.mock('../../src/utils/url-helper');

// Mock Cache
jest.mock('../../src/utils/cache');
const MockCache = Cache as jest.MockedClass<typeof Cache>;

describe('TVResource', () => {
  let httpClient: FetchClient;
  let cache: Cache;
  let resource: TVResource;
  const baseUrl = 'https://api.example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    httpClient = new MockHttpClient({} as any);
    cache = new MockCache();
    resource = new TVResource(httpClient, baseUrl, cache, 'en-US');

    // Mock buildPath to return the expected path
    (resource as any).buildPath = jest.fn((path: string, params: Record<string, any>) => {
      let replacedPath = path;
      for (const key in params) {
        replacedPath = replacedPath.replace(`{${key}}`, params[key]);
      }
      return replacedPath;
    });
  });

  describe('getDetails', () => {
    it('should get TV show details successfully', async () => {
      const tvId = 123;
      const mockResponse: TVShowDetails = { id: tvId, name: 'Test TV Show' } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getDetails({ tvId });

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}`, { params: { language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language and append_to_response parameters', async () => {
      const tvId = 123;
      const language = 'de-DE';
      const appendToResponse = 'credits,images';
      const mockResponse: TVShowDetails = { id: tvId, name: 'Test TV Show' } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getDetails({ tvId, language, appendToResponse });

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}`, { params: { language: 'de-DE', append_to_response: 'credits,images' } });
    });
  });

  describe('getSeason', () => {
    it('should get TV season details successfully', async () => {
      const tvId = 123;
      const seasonNumber = 1;
      const mockResponse: Season = { id: 456, name: 'Test Season' } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getSeason({ tvId, seasonNumber });

      expect(httpClient.get).toHaveBeenCalledWith(
        `/tv/${tvId}/season/${seasonNumber}`,
        { params: { language: 'en-US' } }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include language and append_to_response parameters', async () => {
      const tvId = 123;
      const seasonNumber = 1;
      const language = 'de-DE';
      const appendToResponse = 'credits,images';
      const mockResponse: Season = { id: 456, name: 'Test Season' } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getSeason({ tvId, seasonNumber, language, appendToResponse });

      expect(httpClient.get).toHaveBeenCalledWith(
        `/tv/${tvId}/season/${seasonNumber}`,
        { params: { language: 'de-DE', append_to_response: 'credits,images' } }
      );
    });
  });

  describe('getEpisode', () => {
    it('should get TV episode details successfully', async () => {
      const tvId = 123;
      const seasonNumber = 1;
      const episodeNumber = 1;
      const mockResponse: Episode = { id: 789, name: 'Test Episode' } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getEpisode({ tvId, seasonNumber, episodeNumber });

      expect(httpClient.get).toHaveBeenCalledWith(
        `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`,
        { params: { language: 'en-US' } }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include language and append_to_response parameters', async () => {
      const tvId = 123;
      const seasonNumber = 1;
      const episodeNumber = 1;
      const language = 'de-DE';
      const appendToResponse = 'credits,images';
      const mockResponse: Episode = { id: 789, name: 'Test Episode' } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getEpisode({ tvId, seasonNumber, episodeNumber, language, appendToResponse });

      expect(httpClient.get).toHaveBeenCalledWith(
        `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`,
        { params: { language: 'de-DE', append_to_response: 'credits,images' } }
      );
    });
  });

  describe('getCredits', () => {
    it('should get TV credits successfully', async () => {
      const tvId = 123;
      const mockResponse: TVCredits = { id: tvId, cast: [] } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getCredits(tvId);

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}/credits`, { params: { language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const tvId = 123;
      const language = 'de-DE';
      const mockResponse: TVCredits = { id: tvId, cast: [] } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getCredits(tvId, language);

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}/credits`, { params: { language: 'de-DE' } });
    });
  });

  describe('getImages', () => {
    it('should get TV images successfully', async () => {
      const tvId = 123;
      const mockResponse: ImageCollection = { id: tvId, backdrops: [], posters: [] };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getImages(tvId);

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}/images`, { params: { language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include include_image_language parameter', async () => {
      const tvId = 123;
      const includeImageLanguage = 'en,null';
      const mockResponse: ImageCollection = { id: tvId, backdrops: [], posters: [] };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getImages(tvId, includeImageLanguage);

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}/images`, { params: { language: 'en-US', include_image_language: 'en,null' } });
    });
  });

  describe('getVideos', () => {
    it('should get TV videos successfully', async () => {
      const tvId = 123;
      const mockResponse: { id: number; results: Video[] } = { id: tvId, results: [] };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getVideos(tvId);

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}/videos`, { params: { language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const tvId = 123;
      const language = 'de-DE';
      const mockResponse: { id: number; results: Video[] } = { id: tvId, results: [] };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getVideos(tvId, language);

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}/videos`, { params: { language: 'de-DE' } });
    });
  });

  describe('getSimilar', () => {
    it('should get similar TV shows successfully', async () => {
      const tvId = 123;
      const page = 1;
      const mockResponse: PaginatedResponse<TVShowListResult> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getSimilar(tvId, page);

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}/similar`, { params: { page: 1, language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const tvId = 123;
      const page = 1;
      const language = 'de-DE';
      const mockResponse: PaginatedResponse<TVShowListResult> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getSimilar(tvId, page, language);

      expect(httpClient.get).toHaveBeenCalledWith(`/tv/${tvId}/similar`, { params: { page: 1, language: 'de-DE' } });
    });
  });

  describe('getPopular', () => {
    it('should get popular TV shows successfully', async () => {
      const page = 1;
      const mockResponse: PaginatedResponse<TVShowListResult> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getPopular(page);

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.TV_POPULAR, { params: { page: 1, language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const page = 1;
      const language = 'de-DE';
      const mockResponse: PaginatedResponse<TVShowListResult> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getPopular(page, language);

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.TV_POPULAR, { params: { page: 1, language: 'de-DE' } });
    });
  });

  describe('getTopRated', () => {
    it('should get top-rated TV shows successfully', async () => {
      const page = 1;
      const mockResponse: PaginatedResponse<TVShowListResult> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getTopRated(page);

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.TV_TOP_RATED, { params: { page: 1, language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const page = 1;
      const language = 'de-DE';
      const mockResponse: PaginatedResponse<TVShowListResult> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getTopRated(page, language);

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.TV_TOP_RATED, { params: { page: 1, language: 'de-DE' } });
    });
  });
});

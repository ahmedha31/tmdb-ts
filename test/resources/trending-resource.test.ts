import { TrendingResource } from '../../src/resources/trending-resource';
import { FetchClient } from '../../src/http/fetch-client';
import { Cache } from '../../src/utils/cache';
import { PaginatedResponse, TimeWindow } from '../../src/types/common';

// Mock HttpClient
jest.mock('../../src/http/fetch-client');
const MockHttpClient = FetchClient as jest.MockedClass<typeof FetchClient>;

// Mock UrlHelper
jest.mock('../../src/utils/url-helper');

// Mock Cache
jest.mock('../../src/utils/cache');
const MockCache = Cache as jest.MockedClass<typeof Cache>;

describe('TrendingResource', () => {
  let httpClient: FetchClient;
  let cache: Cache;
  let resource: TrendingResource;
  const baseUrl = 'https://api.example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    httpClient = new MockHttpClient({} as any);
    cache = new MockCache();
    resource = new TrendingResource(httpClient, baseUrl, cache, 'en-US');

    // Mock buildPath to return the expected path
    (resource as any).buildPath = jest.fn((path: string, params: Record<string, any>) => {
      let replacedPath = path;
      replacedPath = replacedPath.replace(`{media_type}`, params.media_type);
      replacedPath = replacedPath.replace(`{time_window}`, params.time_window);
      return replacedPath;
    });
  });

  describe('getAll', () => {
    it('should get all trending items successfully', async () => {
      const mediaType = 'all';
      const timeWindow = TimeWindow.Day;
      const page = 1;
      const mockResponse: PaginatedResponse<any> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getAll(mediaType, timeWindow, page);

      const expectedPath = `/trending/${mediaType}/${timeWindow}`;
      expect(httpClient.get).toHaveBeenCalledWith(expectedPath, { params: { page: 1, language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const mediaType = 'all';
      const timeWindow = TimeWindow.Week;
      const page = 2;
      const language = 'de-DE';
      const mockResponse: PaginatedResponse<any> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getAll(mediaType, timeWindow, page, language);

      const expectedPath = `/trending/${mediaType}/${timeWindow}`;
      expect(httpClient.get).toHaveBeenCalledWith(expectedPath, { params: { page: 2, language: 'de-DE' } });
    });
  });

  describe('getMovies', () => {
    it('should get trending movies successfully', async () => {
      const timeWindow = TimeWindow.Week;
      const page = 1;
      const mockResponse: PaginatedResponse<any> = { page, results: [], total_pages: 1, total_results: 0 } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getMovies(timeWindow, page);

      expect(httpClient.get).toHaveBeenCalledWith(`/trending/movie/${timeWindow}`, { params: { page: 1, language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const timeWindow = TimeWindow.Week;
      const page = 2;
      const language = 'de-DE';
      const mockResponse: PaginatedResponse<any> = { page, results: [], total_pages: 1, total_results: 0 } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getMovies(timeWindow, page, language);

      expect(httpClient.get).toHaveBeenCalledWith(`/trending/movie/${timeWindow}`, { params: { page: 2, language: 'de-DE' } });
    });
  });

  describe('getTVShows', () => {
    it('should get trending TV shows successfully', async () => {
      const timeWindow = TimeWindow.Week;
      const page = 1;
      const mockResponse: PaginatedResponse<any> = { page, results: [], total_pages: 1, total_results: 0 } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getTVShows(timeWindow, page);

      expect(httpClient.get).toHaveBeenCalledWith(`/trending/tv/${timeWindow}`, { params: { page: 1, language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const timeWindow = TimeWindow.Week;
      const page = 1;
      const language = 'de-DE';
      const mockResponse: PaginatedResponse<any> = { page, results: [], total_pages: 1, total_results: 0 } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getTVShows(timeWindow, page, language);

      expect(httpClient.get).toHaveBeenCalledWith(`/trending/tv/${timeWindow}`, { params: { page: 1, language: 'de-DE' } });
    });
  });

  describe('getPeople', () => {
    it('should get trending people successfully', async () => {
      const timeWindow = TimeWindow.Week;
      const page = 1;
      const mockResponse: PaginatedResponse<any> = { page, results: [], total_pages: 1, total_results: 0 } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getPeople(timeWindow, page);

      expect(httpClient.get).toHaveBeenCalledWith(`/trending/person/${timeWindow}`, { params: { page: 1, language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const timeWindow = TimeWindow.Week;
      const page = 1;
      const language = 'de-DE';
      const mockResponse: PaginatedResponse<any> = { page, results: [], total_pages: 1, total_results: 0 } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getPeople(timeWindow, page, language);

      expect(httpClient.get).toHaveBeenCalledWith(`/trending/person/${timeWindow}`, { params: { page: 1, language: 'de-DE' } });
    });
  });
});

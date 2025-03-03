import { PeopleResource } from '../../src/resources/people-resource';
import { FetchClient } from '../../src/http/fetch-client';
import { UrlHelper } from '../../src/utils/url-helper';
import { Cache } from '../../src/utils/cache';
import {
  PersonDetails,
  PersonMovieCredits,
  PersonTVCredits,
  PersonListResult,
} from '../../src/types/people';
import { PaginatedResponse, ImageCollection } from '../../src/types/common';
import { ENDPOINTS } from '../../src/config/api-config';

// Mock HttpClient
jest.mock('../../src/http/fetch-client');
const MockHttpClient = FetchClient as jest.MockedClass<typeof FetchClient>;

// Mock UrlHelper
jest.mock('../../src/utils/url-helper');
const MockUrlHelper = UrlHelper as jest.Mocked<typeof UrlHelper>;

// Mock Cache
jest.mock('../../src/utils/cache');
const MockCache = Cache as jest.MockedClass<typeof Cache>;

describe('PeopleResource', () => {
  let httpClient: FetchClient;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let urlHelper: UrlHelper;
  let cache: Cache;
  let resource: PeopleResource;
  const baseUrl = 'https://api.example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    httpClient = new MockHttpClient({} as any);
    urlHelper = new MockUrlHelper();
    cache = new MockCache();
    resource = new PeopleResource(httpClient, baseUrl, cache, 'en-US');

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
    it('should get person details successfully', async () => {
      const personId = 123;
      const mockResponse: PersonDetails = { id: personId, name: 'Test Person' } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getDetails({ personId });

      expect(httpClient.get).toHaveBeenCalledWith(`/person/${personId}`, { params: { language: 'en-US', append_to_response: undefined } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language and append_to_response parameters', async () => {
      const personId = 123;
      const language = 'de-DE';
      const appendToResponse = 'movie_credits,tv_credits';
      const mockResponse: PersonDetails = { id: personId, name: 'Test Person' } as any;
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getDetails({ personId, language, appendToResponse });

      expect(httpClient.get).toHaveBeenCalledWith(`/person/${personId}`, { params: { language: 'de-DE', append_to_response: 'movie_credits,tv_credits' } });
    });
  });

  describe('getMovieCredits', () => {
    it('should get person movie credits successfully', async () => {
      const personId = 123;
      const mockResponse: PersonMovieCredits = {
          cast: [], crew: [],
          id: 0
      };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getMovieCredits(personId);

      expect(httpClient.get).toHaveBeenCalledWith(`/person/${personId}/movie_credits`, { params: { language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const personId = 123;
      const language = 'de-DE';
      const mockResponse: PersonMovieCredits = {
          cast: [], crew: [],
          id: 0
      };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getMovieCredits(personId, language);

      expect(httpClient.get).toHaveBeenCalledWith(`/person/${personId}/movie_credits`, { params: { language: 'de-DE' } });
    });
  });

  describe('getTVCredits', () => {
    it('should get person TV credits successfully', async () => {
      const personId = 123;
      const mockResponse: PersonTVCredits = {
          cast: [], crew: [],
          id: 0
      };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getTVCredits(personId);

      expect(httpClient.get).toHaveBeenCalledWith(`/person/${personId}/tv_credits`, { params: { language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const personId = 123;
      const language = 'de-DE';
       const mockResponse: PersonTVCredits = {
           cast: [], crew: [],
           id: 0
       };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getTVCredits(personId, language);

      expect(httpClient.get).toHaveBeenCalledWith(`/person/${personId}/tv_credits`, { params: { language: 'de-DE' } });
    });
  });

  describe('getImages', () => {
    it('should get person images successfully', async () => {
      const personId = 123;
      const mockResponse: ImageCollection = { id: personId, profiles: [] };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getImages(personId);

      expect(httpClient.get).toHaveBeenCalledWith(`/person/${personId}/images`, { params: { language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPopular', () => {
    it('should get popular people successfully', async () => {
      const page = 1;
      const mockResponse: PaginatedResponse<PersonListResult> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await resource.getPopular(page);

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.PERSON_POPULAR, { params: { page: 1, language: 'en-US' } });
      expect(result).toEqual(mockResponse);
    });

    it('should include language parameter', async () => {
      const page = 1;
      const language = 'de-DE';
      const mockResponse: PaginatedResponse<PersonListResult> = { page, results: [], total_pages: 1, total_results: 0 };
      (httpClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      await resource.getPopular(page, language);

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.PERSON_POPULAR, { params: { page: 1, language: 'de-DE' } });
    });
  });
});

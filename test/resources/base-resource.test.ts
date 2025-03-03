import { BaseResource } from '../../src/resources/base-resource';
import { FetchClient } from '../../src/http/fetch-client';
import { UrlHelper } from '../../src/utils/url-helper';
import { Cache } from '../../src/utils/cache';

// Mock HttpClient
jest.mock('../../src/http/fetch-client');
const MockHttpClient = FetchClient as jest.MockedClass<typeof FetchClient>;

// Mock UrlHelper
jest.mock('../../src/utils/url-helper');
const MockUrlHelper = UrlHelper as jest.Mocked<typeof UrlHelper>;

// Mock Cache
jest.mock('../../src/utils/cache');
const MockCache = Cache as jest.MockedClass<typeof Cache>;

class TestResource extends BaseResource {
  constructor(http: FetchClient, baseUrl: string, cache: Cache | null = null, language: string = 'en-US') {
    super(http, baseUrl, cache, language);
  }

  public testGet<T>(path: string, params: Record<string, any> = {}, options: { cache?: boolean; cacheTtl?: number } = {}): Promise<T> {
    return this.get<T>(path, params, options);
  }

  public testPost<T>(path: string, body: any, params: Record<string, any> = {}): Promise<T> {
    return this.post<T>(path, body, params);
  }

  public testBuildPath(path: string, params: Record<string, any>): string {
    return this.buildPath(path, params);
  }
}

describe('BaseResource', () => {
  let httpClient: FetchClient;
  let cache: Cache;
  let resource: TestResource;
  const baseUrl = 'https://api.example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    httpClient = new MockHttpClient({} as any);
    (httpClient.get as jest.Mock).mockResolvedValue({ data: {} });
    (httpClient.post as jest.Mock).mockResolvedValue({ data: {} });
    cache = new MockCache();
    resource = new TestResource(httpClient, baseUrl, cache, 'en-US');
  });

  it('should initialize correctly', () => {
    expect(resource['http']).toBe(httpClient);
    expect(resource['baseUrl']).toBe(baseUrl);
    expect(resource['cache']).toBe(cache);
    expect(resource['language']).toBe('en-US');

    const noCacheResource = new TestResource(httpClient, baseUrl, null);
    expect(noCacheResource['cache']).toBeNull();
  });

  describe('get', () => {
    it('should return data from cache if available', async () => {
      const path = '/test';
      const params = { key: 'value' };
      const cacheKey = `${path}:${JSON.stringify(params)}`;
      const cachedData = { data: 'cached data' };

      (cache.has as jest.Mock).mockReturnValue(true);
      (cache.get as jest.Mock).mockReturnValue(cachedData);

      const result = await resource.testGet(path, params, { cache: true });

      expect(cache.has).toHaveBeenCalledWith(cacheKey);
      expect(cache.get).toHaveBeenCalledWith(cacheKey);
      expect(httpClient.get).not.toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it('should fetch data from API and store in cache if not available', async () => {
      const path = '/test';
      const params = { key: 'value' };
      const cacheKey = `${path}:${JSON.stringify(params)}`;
      const apiData = { data: 'api data' };

      (cache.has as jest.Mock).mockReturnValue(false);
      (httpClient.get as jest.Mock).mockResolvedValue({ data: apiData });

      const result = await resource.testGet(path, params, { cache: true, cacheTtl: 3600 });

      expect(cache.has).toHaveBeenCalledWith(cacheKey);
      expect(httpClient.get).toHaveBeenCalledWith(path, { params: { ...params, language: 'en-US' } });
      expect(cache.set).toHaveBeenCalledWith(cacheKey, apiData, 3600);
      expect(result).toEqual(apiData);
    });

    it('should fetch data from API without using cache if cache is disabled', async () => {
      const path = '/test';
      const params = { key: 'value' };
      const apiData = { data: 'api data' };

      (httpClient.get as jest.Mock).mockResolvedValue({ data: apiData });

      const result = await resource.testGet(path, params, { cache: false });

      expect(cache.has).not.toHaveBeenCalled();
      expect(httpClient.get).toHaveBeenCalledWith(path, { params: { ...params, language: 'en-US' } });
      expect(cache.set).not.toHaveBeenCalled();
      expect(result).toEqual(apiData);
    });

    it('should include language parameter in the request', async () => {
      const path = '/test';
      const params = { key: 'value' };
      const apiData = { data: 'api data' };

      (httpClient.get as jest.Mock).mockResolvedValue({ data: apiData });

      await resource.testGet(path, params, { cache: false });

      expect(httpClient.get).toHaveBeenCalledWith(path, { params: { ...params, language: 'en-US' } });

      resource = new TestResource(httpClient, baseUrl, cache, 'de-DE');
      await resource.testGet(path, params, { cache: false });
      expect(httpClient.get).toHaveBeenCalledWith(path, { params: { ...params, language: 'de-DE' } });
    });

    it('should not override language parameter if already provided', async () => {
      const path = '/test';
      const params = { key: 'value', language: 'fr-FR' };
      const apiData = { data: 'api data' };

      (httpClient.get as jest.Mock).mockResolvedValue({ data: apiData });

      await resource.testGet(path, params, { cache: false });

      expect(httpClient.get).toHaveBeenCalledWith(path, { params: params });
    });
  });

  describe('post', () => {
    it('should send a POST request and return data', async () => {
      const path = '/test';
      const body = { key: 'value' };
      const params = { param1: 'value1' };
      const apiData = { data: 'api data' };

      (httpClient.post as jest.Mock).mockResolvedValue({ data: apiData });

      const result = await resource.testPost(path, body, params);

      expect(httpClient.post).toHaveBeenCalledWith(path, body, { params: { ...params, language: 'en-US' } });
      expect(result).toEqual(apiData);
    });

    it('should include language parameter in the request', async () => {
      const path = '/test';
      const body = { key: 'value' };
      const params = { param1: 'value1' };
      const apiData = { data: 'api data' };

      (httpClient.post as jest.Mock).mockResolvedValue({ data: apiData });

      await resource.testPost(path, body, params);

      expect(httpClient.post).toHaveBeenCalledWith(path, body, { params: { ...params, language: 'en-US' } });

      resource = new TestResource(httpClient, baseUrl, cache, 'de-DE');
      await resource.testPost(path, body, params);
      expect(httpClient.post).toHaveBeenCalledWith(path, body, { params: { ...params, language: 'de-DE' } });
    });

    it('should not override language parameter if already provided', async () => {
      const path = '/test';
      const body = { key: 'value' };
      const params = { param1: 'value1', language: 'fr-FR' };
      const apiData = { data: 'api data' };

      (httpClient.post as jest.Mock).mockResolvedValue({ data: apiData });

      await resource.testPost(path, body, params);

      expect(httpClient.post).toHaveBeenCalledWith(path, body, { params: params });
    });
  });

  describe('buildPath', () => {
    it('should replace path parameters using UrlHelper', () => {
      const path = '/movie/{movie_id}/review/{review_id}';
      const params = { movie_id: '123', review_id: '456' };
      const expectedPath = '/movie/123/review/456';

      MockUrlHelper.replacePath.mockReturnValue(expectedPath);

      const result = resource.testBuildPath(path, params);

      expect(MockUrlHelper.replacePath).toHaveBeenCalledWith(path, params);
      expect(result).toBe(expectedPath);
    });
  });
});

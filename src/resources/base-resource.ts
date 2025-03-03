import { FetchClient } from '../http/fetch-client';
import { Cache } from '../utils/cache';
import { UrlHelper } from '../utils/url-helper';

export abstract class BaseResource {
  private readonly http: FetchClient;
  private readonly baseUrl: string;
  private readonly cache: Cache | null;
  protected readonly language: string;

  constructor(http: FetchClient, baseUrl: string, cache: Cache | null = null, language: string = 'en-US') {
    this.http = http;
    this.baseUrl = baseUrl;
    this.cache = cache;
    this.language = language;
  }

  protected async get<T>(path: string, params: Record<string, any> = {}, options: { cache?: boolean; cacheTtl?: number } = {}): Promise<T> {
    const { cache: useCache = true, cacheTtl = 3600 } = options;
    const cacheKeyParams = { ...params };
    delete cacheKeyParams.language;
    const cacheKey = `${path}:${JSON.stringify(cacheKeyParams)}`
    if (this.cache && useCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as T;
    }

    const requestParams = { params: { ...params, language: params.language || this.language } };

    const response = await this.http.get<T>(path, requestParams);

    if (this.cache && useCache) {
      this.cache.set(cacheKey, response.data, cacheTtl);
    }

    return response.data;
  }

  protected async post<T>(path: string, body: any, params: Record<string, any> = {}): Promise<T> {
    const requestParams = { params: { ...params, language: params.language || this.language } };
    const response = await this.http.post<T>(path, body, requestParams);
    return response.data;
  }

  protected buildPath(path: string, params: Record<string, any>): string {
    return UrlHelper.replacePath(path, params);
  }
}
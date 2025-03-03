import { FetchClient } from '../../src/http/fetch-client';
import { HttpError, RateLimitError } from "../../src/http/http-client";
import { API_CONFIG } from '../../src/config/api-config';
import fetch from 'cross-fetch';

// Mock fetch module
jest.mock('cross-fetch');
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('FetchClient', () => {
  let client: FetchClient;
  const tmdbBaseUrl = API_CONFIG.BASE_URL;
  
  beforeEach(() => {
    jest.clearAllMocks();
    client = new FetchClient(tmdbBaseUrl);
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  describe('request', () => {
    it('should make a successful GET request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'content-type': 'application/json'
        }),
        json: jest.fn().mockResolvedValue({ data: 'test data' })
      };
      
      mockedFetch.mockResolvedValue(mockResponse as any);
      
      const response = await client.request('GET', '/movie/popular');
      
      expect(mockedFetch).toHaveBeenCalledWith(`${tmdbBaseUrl}/movie/popular`, expect.any(Object));
      expect(response.data).toEqual({ data: 'test data' });
      expect(response.status).toBe(200);
    });
    
    it('should merge default headers with request headers', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'content-type': 'application/json'
        }),
        json: jest.fn().mockResolvedValue({})
      };
      
      mockedFetch.mockResolvedValue(mockResponse as any);
      
      client.setDefaultHeaders({
        'Authorization': 'Bearer default-token',
        'Default-Header': 'default-value'
      });
      
      await client.request('GET', '/movie/550', {
        headers: {
          'Custom-Header': 'custom-value',
          'Authorization': 'Bearer custom-token'
        }
      });
      
      expect(mockedFetch).toHaveBeenCalledWith(`${tmdbBaseUrl}/movie/550`, expect.objectContaining({
        headers: expect.objectContaining({
          'Default-Header': 'default-value',
          'Custom-Header': 'custom-value',
          'Authorization': 'Bearer custom-token' // Custom should override default
        })
      }));
    });
    
    it('should handle default query parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'content-type': 'application/json'
        }),
        json: jest.fn().mockResolvedValue({})
      };
      
      mockedFetch.mockResolvedValue(mockResponse as any);
      
      // Set default params like API key
      client.setDefaultParams({
        api_key: 'test-api-key',
        language: 'en-US'
      });
      
      await client.get('/movie/popular');
      
      expect(mockedFetch).toHaveBeenCalledWith(
        `${tmdbBaseUrl}/movie/popular?api_key=test-api-key&language=en-US`,
        expect.any(Object)
      );
    });
    
    it('should handle body payload in POST requests', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({
          'content-type': 'application/json'
        }),
        json: jest.fn().mockResolvedValue({ id: 123 })
      };
      
      mockedFetch.mockResolvedValue(mockResponse as any);
      
      await client.post('/authentication/session/new', { request_token: 'test-token' });
      
      expect(mockedFetch).toHaveBeenCalledWith(`${tmdbBaseUrl}/authentication/session/new`, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ request_token: 'test-token' }),
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      }));
    });
    
    it('should handle HTTP errors with proper error types', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({
          'content-type': 'application/json'
        }),
        json: jest.fn().mockResolvedValue({ status_message: 'The resource you requested could not be found' })
      };
      
      mockedFetch.mockResolvedValue(mockResponse as any);
      
      await expect(client.get('/movie/9999999')).rejects.toThrow(HttpError);
      
      try {
        await client.get('/movie/9999999');
      } catch (error) {
        if (error instanceof HttpError) {
          expect(error.status).toBe(404);
          expect(error.message).toContain('The resource you requested could not be found');
          expect(error.url).toBe(`${tmdbBaseUrl}/movie/9999999`);
        } else {
          fail('Expected HttpError but got different error type');
        }
      }
    });
    
    it('should handle rate limit errors', async () => {
      const mockResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: new Headers({
          'content-type': 'application/json',
          'retry-after': '30'
        }),
        json: jest.fn().mockResolvedValue({ status_message: 'Rate limit exceeded' })
      };
      
      mockedFetch.mockResolvedValue(mockResponse as any);
      
      try {
        await client.get('/movie/popular');
        fail('Expected to throw RateLimitError');
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        expect((error as RateLimitError).retryAfter).toBe(30000); // 30 seconds in ms
      }
    });

    it('should handle timeout correctly', async () => {
      // Skip mocking AbortController and just check if the timeout error is thrown

      // Create a promise that never resolves to simulate a hanging request
      const neverResolvingPromise = new Promise<Response>(() => {
        // This promise intentionally never resolves or rejects
      });
      mockedFetch.mockReturnValue(neverResolvingPromise);

      // Make the fetch function throw an error that looks like an AbortError
      // when setTimeout is called
      jest.spyOn(global, 'setTimeout').mockImplementationOnce((callback) => {
        mockedFetch.mockRejectedValueOnce({ name: 'AbortError', message: 'The operation was aborted' });
        callback();
        return 123 as any;
      });

      // Attempt the request with a short timeout
      const requestPromise = client.get('/movie/550', { timeout: 100 });

      // Verify the request throws a timeout error
      await expect(requestPromise).rejects.toThrow('Request timeout');
      
      // Make sure the fetch was called
      expect(mockedFetch).toHaveBeenCalledWith(
        `${tmdbBaseUrl}/movie/550`,
        expect.objectContaining({
          method: 'GET'
          // We don't care about the signal anymore since we're testing behavior not implementation
        })
      );

      // Cleanup
      jest.restoreAllMocks();
    });
  });
  
  describe('retry behavior', () => {
    it('should retry on network errors', async () => {
      const networkError = new TypeError('Failed to fetch');
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'content-type': 'application/json'
        }),
        json: jest.fn().mockResolvedValue({ success: true })
      };
      
      // First call fails with network error, second succeeds
      mockedFetch
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(mockResponse as any);
      
      const result = await client.get('/movie/550', { retry: true, maxRetries: 3, retryDelay: 10 });
      
      expect(mockedFetch).toHaveBeenCalledTimes(2);
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ success: true });
    });
    
    it('should respect retry-after header for rate limits', async () => {
      jest.useFakeTimers();
      
      const rateLimitResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: new Headers({
          'content-type': 'application/json',
          'retry-after': '1' // 1 second
        }),
        json: jest.fn().mockResolvedValue({ status_message: 'Too many requests' })
      };
      
      const successResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'content-type': 'application/json'
        }),
        json: jest.fn().mockResolvedValue({ success: true })
      };
      
      // Mock implementation for fetch that handles the fake timer
      mockedFetch.mockImplementation(() => {
        if (mockedFetch.mock.calls.length === 1) {
          return Promise.resolve(rateLimitResponse as any);
        } else {
          return Promise.resolve(successResponse as any);
        }
      });
      
      // Start the request
      const requestPromise = client.get('/movie/popular', { retry: true, maxRetries: 3 });
      
      // Fast-forward past the retry-after time
      jest.advanceTimersByTime(1000);
      
      // Have to resolve promises that were queued
      await jest.runAllTimersAsync();
      
      const result = await requestPromise;
      
      expect(mockedFetch).toHaveBeenCalledTimes(2);
      expect(result.data).toEqual({ success: true });
    });
    
    it('should eventually fail after max retries', async () => {
      const networkError = new TypeError('Failed to fetch');
      
      // All calls fail with network error
      mockedFetch
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError);
      
      await expect(
        client.get('/movie/550', { retry: true, maxRetries: 2, retryDelay: 10 })
      ).rejects.toThrow('Failed to fetch');
      
      expect(mockedFetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });
});

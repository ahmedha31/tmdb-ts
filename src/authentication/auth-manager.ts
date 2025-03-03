import { HttpClient } from '../http/http-client';
import { ENDPOINTS } from '../config/api-config';

/**
 * Authentication token response
 */
interface TokenResponse {
  /** Success flag */
  success: boolean;
  /** Generated request token */
  request_token: string;
  /** Token expiration date */
  expires_at: string;
}

/**
 * Session creation response
 */
interface SessionResponse {
  /** Success flag */
  success: boolean;
  /** Generated session ID */
  session_id: string;
}

/**
 * Validation with login request
 */
interface ValidateWithLoginRequest {
  /** Username */
  username: string;
  /** Password */
  password: string;
  /** Request token to validate */
  request_token: string;
}

/**
 * Session creation request
 */
interface CreateSessionRequest {
  /** Validated request token */
  request_token: string;
}

/**
 * Class for managing TMDB authentication
 */
export class AuthManager {
  private http: HttpClient;
  private apiKey: string;
  private sessionId: string | null = null;

  /**
   * Create a new AuthManager
   * @param http - HTTP client instance
   * @param apiKey - TMDB API key
   * @param sessionId - Existing session ID (optional)
   */
  constructor(http: HttpClient, apiKey: string, sessionId?: string) {
    this.http = http;
    this.apiKey = apiKey;
    this.sessionId = sessionId || null;
  }

  /**
   * Create a new request token
   * @returns Promise resolving to token response
   */
  async createRequestToken(): Promise<TokenResponse> {
    // The API key is now handled automatically by the HTTP client
    const response = await this.http.get<TokenResponse>(ENDPOINTS.AUTH_TOKEN);
    return response.data;
  }

  /**
   * Validate a request token with user credentials
   * @param username - TMDB username
   * @param password - TMDB password
   * @param requestToken - Request token to validate
   * @returns Promise resolving to token response
   */
  async validateWithLogin(
    username: string,
    password: string,
    requestToken: string
  ): Promise<TokenResponse> {
    const payload: ValidateWithLoginRequest = {
      username,
      password,
      request_token: requestToken
    };
    
    // The API key is now handled automatically by the HTTP client
    const response = await this.http.post<TokenResponse>(
      ENDPOINTS.AUTH_VALIDATE_TOKEN,
      payload
    );
    
    return response.data;
  }

  /**
   * Create a new session with a validated request token
   * @param requestToken - Validated request token
   * @returns Promise resolving to session response
   */
  async createSession(requestToken: string): Promise<SessionResponse> {
    const payload: CreateSessionRequest = {
      request_token: requestToken
    };
    
    // The API key is now handled automatically by the HTTP client
    const response = await this.http.post<SessionResponse>(
      ENDPOINTS.AUTH_SESSION,
      payload
    );
    
    if (response.data.success) {
      this.sessionId = response.data.session_id;
    }
    
    return response.data;
  }

  /**
   * Perform full authentication flow
   * @param username - TMDB username
   * @param password - TMDB password
   * @returns Promise resolving to session ID
   */
  async authenticate(username: string, password: string): Promise<string> {
    const tokenResponse = await this.createRequestToken();
    const validatedTokenResponse = await this.validateWithLogin(
      username,
      password,
      tokenResponse.request_token
    );
    const sessionResponse = await this.createSession(validatedTokenResponse.request_token);
    
    return sessionResponse.session_id;
  }

  /**
   * Get the current session ID
   * @returns Session ID or null if not authenticated
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Set the session ID
   * @param sessionId - Session ID to set
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Check if a session is active
   * @returns True if a session ID is present, false otherwise
   */
  hasSession(): boolean {
    return this.sessionId !== null;
  }
}

import { API_CONFIG, IMAGE_SIZES } from '../config/api-config';
import { ImageSizeType } from '../types/common';

/**
 * Options for constructing an image URL
 */
export interface ImageUrlOptions {
  /** Path to the image (e.g., "/abc123def456.jpg") */
  path: string | null;
  /** Size of the image (e.g., "w500") */
  size: string;
}

/**
 * Helper class for working with TMDB URLs
 */
export class UrlHelper {
  /**
   * Construct a URL for an image asset
   * @param options - Image URL options
   * @param type - Type of image (poster, backdrop, etc.)
   * @returns Complete image URL or null if path is null
   */
  static getImageUrl(options: ImageUrlOptions, type: ImageSizeType = 'poster'): string | null {
    if (!options.path) {
      return null;
    }
    
    const availableSizes = IMAGE_SIZES[type] || ['original'];
    const size = availableSizes.includes(options.size) ? options.size : 'original';
    
    return `${API_CONFIG.IMAGE_BASE_URL}/${size}${options.path}`;
  }
  
  /**
   * Construct a URL for a poster image
   * @param options - Image URL options
   * @returns Complete poster URL or null if path is null
   */
  static getPosterUrl(options: ImageUrlOptions): string | null {
    return this.getImageUrl(options, 'poster');
  }
  
  /**
   * Construct a URL for a backdrop image
   * @param options - Image URL options
   * @returns Complete backdrop URL or null if path is null
   */
  static getBackdropUrl(options: ImageUrlOptions): string | null {
    return this.getImageUrl(options, 'backdrop');
  }
  
  /**
   * Construct a URL for a profile image
   * @param options - Image URL options
   * @returns Complete profile URL or null if path is null
   */
  static getProfileUrl(options: ImageUrlOptions): string | null {
    return this.getImageUrl(options, 'profile');
  }
  
  /**
   * Construct a URL for a still image
   * @param options - Image URL options
   * @returns Complete still URL or null if path is null
   */
  static getStillUrl(options: ImageUrlOptions): string | null {
    return this.getImageUrl(options, 'still');
  }
  
  /**
   * Construct a URL for a logo image
   * @param options - Image URL options
   * @returns Complete logo URL or null if path is null
   */
  static getLogoUrl(options: ImageUrlOptions): string | null {
    return this.getImageUrl(options, 'logo');
  }
  
  /**
   * Replace path parameters in a URL
   * @param path - URL path with placeholders (e.g., "/movie/{movie_id}")
   * @param params - Parameters to replace
   * @returns URL with replaced parameters
   */
  static replacePath(path: string, params: Record<string, string | number>): string {
    let result = path;
    
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(`{${key}}`, String(value));
    }
    
    return result;
  }
}

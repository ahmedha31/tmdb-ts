import { API_CONFIG } from '../../src/config/api-config';
import { UrlHelper } from '../../src/utils/url-helper';

describe('URL Helper', () => {
  describe('getImageUrl', () => {
    it('should construct a valid image URL with the given path and size', () => {
      const options = { path: '/test/path.jpg', size: 'w500' };
      const result = UrlHelper.getImageUrl(options);
      expect(result).toBe(`${API_CONFIG.IMAGE_BASE_URL}/w500/test/path.jpg`);
    });

    it('should return null if the path is null', () => {
      const options = { path: null, size: 'w500' };
      const result = UrlHelper.getImageUrl(options);
      expect(result).toBeNull();
    });

    it('should use "original" size if the provided size is not available for the given type', () => {
      const options = { path: '/test/path.jpg', size: 'invalid_size' };
      const result = UrlHelper.getImageUrl(options, 'poster');
      expect(result).toBe(`${API_CONFIG.IMAGE_BASE_URL}/original/test/path.jpg`);
    });

    it('should use the provided size if it is available for the given type', () => {
      const options = { path: '/test/path.jpg', size: 'w500' };
      const result = UrlHelper.getImageUrl(options, 'poster');
      expect(result).toBe(`${API_CONFIG.IMAGE_BASE_URL}/w500/test/path.jpg`);
    });

     it('should handle different image types', () => {
      const options = { path: '/test/path.jpg', size: 'w300' };
      const result = UrlHelper.getImageUrl(options, 'logo');
      expect(result).toBe(`${API_CONFIG.IMAGE_BASE_URL}/w300/test/path.jpg`);
    });
  });

  describe('getPosterUrl', () => {
    it('should construct a poster URL', () => {
      const options = { path: '/test/poster.jpg', size: 'w500' };
      const result = UrlHelper.getPosterUrl(options);
      expect(result).toBe(`${API_CONFIG.IMAGE_BASE_URL}/w500/test/poster.jpg`);
    });
  });

  describe('getBackdropUrl', () => {
    it('should construct a backdrop URL', () => {
      const options = { path: '/test/backdrop.jpg', size: 'w780' };
      const result = UrlHelper.getBackdropUrl(options);
      expect(result).toBe(`${API_CONFIG.IMAGE_BASE_URL}/w780/test/backdrop.jpg`);
    });
  });

  describe('getProfileUrl', () => {
    it('should construct a profile URL', () => {
      const options = { path: '/test/profile.jpg', size: 'h632' };
      const result = UrlHelper.getProfileUrl(options);
      expect(result).toBe(`${API_CONFIG.IMAGE_BASE_URL}/h632/test/profile.jpg`);
    });
  });

  describe('getStillUrl', () => {
    it('should construct a still URL', () => {
      const options = { path: '/test/still.jpg', size: 'w300' };
      const result = UrlHelper.getStillUrl(options);
      expect(result).toBe(`${API_CONFIG.IMAGE_BASE_URL}/w300/test/still.jpg`);
    });
  });

  describe('getLogoUrl', () => {
    it('should construct a logo URL', () => {
      const options = { path: '/test/logo.jpg', size: 'w300' };
      const result = UrlHelper.getLogoUrl(options);
      expect(result).toBe(`${API_CONFIG.IMAGE_BASE_URL}/w300/test/logo.jpg`);
    });
  });

  describe('replacePath', () => {
    it('should replace path parameters in a URL', () => {
      const path = '/movie/{movie_id}/review/{review_id}';
      const params = { movie_id: '123', review_id: '456' };
      const result = UrlHelper.replacePath(path, params);
      expect(result).toBe('/movie/123/review/456');
    });

    it('should handle multiple replacements', () => {
      const path = '/person/{person_id}/images/{image_id}';
      const params = { person_id: '789', image_id: '101' };
      const result = UrlHelper.replacePath(path, params);
      expect(result).toBe('/person/789/images/101');
    });

    it('should handle missing parameters by not replacing them', () => {
      const path = '/tv/{tv_id}/season/{season_number}';
      const params = { tv_id: '112' };
      const result = UrlHelper.replacePath(path, params);
      expect(result).toBe('/tv/112/season/{season_number}');
    });

    it('should handle empty params object', () => {
      const path = '/movie/{movie_id}';
      const params = {};
      const result = UrlHelper.replacePath(path, params);
      expect(result).toBe('/movie/{movie_id}');
    });
  });
});

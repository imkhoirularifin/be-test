import { UrlUtils } from './url';

describe('UrlUtils', () => {
  describe('generateShortUrl', () => {
    it('should generate a string of length 6', () => {
      const shortUrl = UrlUtils.generateShortUrl();
      expect(shortUrl).toHaveLength(6);
    });

    it('should generate a string containing only alphanumeric characters', () => {
      const shortUrl = UrlUtils.generateShortUrl();
      const alphanumericRegex = /^[A-Za-z0-9]+$/;
      expect(shortUrl).toMatch(alphanumericRegex);
    });

    it('should generate different strings on subsequent calls', () => {
      const shortUrl1 = UrlUtils.generateShortUrl();
      const shortUrl2 = UrlUtils.generateShortUrl();
      expect(shortUrl1).not.toBe(shortUrl2);
    });
  });
});

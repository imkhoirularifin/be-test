import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { UrlRepository } from './urls.repository';
import { ConfigService } from '@nestjs/config';
import { CustomException } from 'src/infrastructure/exception.filter';
import { UrlUtils } from 'src/utils/url';
import { HttpStatus } from '@nestjs/common';

describe('UrlsService', () => {
  let service: UrlsService;
  let urlRepo: UrlRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: UrlRepository,
          useValue: {
            findByShortUrl: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    urlRepo = module.get<UrlRepository>(UrlRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('createShortUrl', () => {
    it('should create a short URL with a custom URL', async () => {
      const userId = 'user1';
      const originalUrl = 'http://example.com';
      const customizeUrl = 'customUrl';

      jest.spyOn(urlRepo, 'findByShortUrl').mockResolvedValueOnce(null);
      jest.spyOn(urlRepo, 'create').mockResolvedValueOnce({
        id: '1',
        user_id: userId,
        url: originalUrl,
        short_url: customizeUrl,
        expires_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });
      jest.spyOn(configService, 'get').mockReturnValue('http://short.url');

      const result = await service.createShortUrl(
        userId,
        originalUrl,
        customizeUrl,
      );

      expect(result.short_url).toBe('http://short.url/customUrl');
    });

    it('should throw an error if the custom URL is taken', async () => {
      const userId = 'user1';
      const originalUrl = 'http://example.com';
      const customizeUrl = 'customUrl';

      jest.spyOn(urlRepo, 'findByShortUrl').mockResolvedValueOnce({
        id: '1',
        user_id: userId,
        url: originalUrl,
        short_url: customizeUrl,
        expires_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(
        service.createShortUrl(userId, originalUrl, customizeUrl),
      ).rejects.toThrow(
        new CustomException(
          HttpStatus.CONFLICT,
          'Customize url is taken, please try another one',
        ),
      );
    });

    it('should create a short URL with a generated URL', async () => {
      const userId = 'user1';
      const originalUrl = 'http://example.com';

      jest.spyOn(urlRepo, 'findByShortUrl').mockResolvedValueOnce(null);
      jest.spyOn(urlRepo, 'create').mockResolvedValueOnce({
        id: '1',
        user_id: userId,
        url: originalUrl,
        short_url: 'generatedUrl',
        expires_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });
      jest.spyOn(configService, 'get').mockReturnValue('http://short.url');
      jest.spyOn(UrlUtils, 'generateShortUrl').mockReturnValue('generatedUrl');

      const result = await service.createShortUrl(userId, originalUrl);

      expect(result.short_url).toBe('http://short.url/generatedUrl');
    });
  });

  describe('getOriginalUrl', () => {
    it('should return the original URL if the short URL exists and is not expired', async () => {
      const shortUrl = 'shortUrl';
      const originalUrl = 'http://example.com';

      jest.spyOn(urlRepo, 'findByShortUrl').mockResolvedValueOnce({
        url: originalUrl,
        id: '1',
        user_id: 'user1',
        short_url: shortUrl,
        expires_at: new Date(Date.now() + 10000),
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.getOriginalUrl(shortUrl);

      expect(result).toBe(originalUrl);
    });

    it('should throw an error if the short URL does not exist', async () => {
      const shortUrl = 'shortUrl';

      jest.spyOn(urlRepo, 'findByShortUrl').mockResolvedValueOnce(null);

      await expect(service.getOriginalUrl(shortUrl)).rejects.toThrow(
        new CustomException(HttpStatus.NOT_FOUND, 'Route not found'),
      );
    });

    it('should throw an error if the short URL is expired', async () => {
      const shortUrl = 'shortUrl';

      jest.spyOn(urlRepo, 'findByShortUrl').mockResolvedValueOnce({
        url: 'http://example.com',
        id: '1',
        user_id: 'user1',
        short_url: shortUrl,
        expires_at: new Date(Date.now() - 10000),
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(service.getOriginalUrl(shortUrl)).rejects.toThrow(
        new CustomException(HttpStatus.GONE, 'Url has been expired'),
      );
    });
  });
});

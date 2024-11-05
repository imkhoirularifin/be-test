import { Test, TestingModule } from '@nestjs/testing';
import { UrlRepository } from './urls.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { Url } from '@prisma/client';

describe('UrlRepository', () => {
  let urlRepository: UrlRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    url: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    urlRepository = module.get<UrlRepository>(UrlRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(urlRepository).toBeDefined();
  });

  describe('findByShortUrl', () => {
    it('should return a URL if found', async () => {
      const shortUrl = 'shortUrl';
      const url: Url = {
        id: '1',
        user_id: 'userId',
        url: 'originalUrl',
        short_url: shortUrl,
        expires_at: new Date(),
        created_at: undefined,
        updated_at: undefined,
      };
      mockPrismaService.url.findUnique.mockResolvedValue(url);

      const result = await urlRepository.findByShortUrl(shortUrl);
      expect(result).toEqual(url);
      expect(prismaService.url.findUnique).toHaveBeenCalledWith({
        where: { short_url: shortUrl },
      });
    });

    it('should return null if URL not found', async () => {
      const shortUrl = 'shortUrl';
      mockPrismaService.url.findUnique.mockResolvedValue(null);

      const result = await urlRepository.findByShortUrl(shortUrl);
      expect(result).toBeNull();
      expect(prismaService.url.findUnique).toHaveBeenCalledWith({
        where: { short_url: shortUrl },
      });
    });
  });

  describe('create', () => {
    it('should create and return a URL', async () => {
      const userId = 'userId';
      const originalUrl = 'originalUrl';
      const shortUrl = 'shortUrl';
      const expiresAt = new Date();
      const url: Url = {
        id: '1',
        user_id: userId,
        url: originalUrl,
        short_url: shortUrl,
        expires_at: expiresAt,
        created_at: undefined,
        updated_at: undefined,
      };
      mockPrismaService.url.create.mockResolvedValue(url);

      const result = await urlRepository.create(
        userId,
        originalUrl,
        shortUrl,
        expiresAt,
      );
      expect(result).toEqual(url);
      expect(prismaService.url.create).toHaveBeenCalledWith({
        data: {
          user_id: userId,
          url: originalUrl,
          short_url: shortUrl,
          expires_at: expiresAt,
        },
      });
    });
  });
});

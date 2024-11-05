import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ShortenUrlReqDto } from 'src/domain/dto/url.dto';
import { customResponse } from 'src/infrastructure/response.interceptor';
import { HttpStatus } from '@nestjs/common';

describe('UrlsController', () => {
  let controller: UrlsController;
  let service: UrlsService;

  const mockUrlsService = {
    createShortUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: mockUrlsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UrlsController>(UrlsController);
    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should shorten a URL', async () => {
    const req = { user: { sub: 'userId' } };
    const shortenUrlDto: ShortenUrlReqDto = {
      url: 'http://example.com',
      customUrl: 'custom',
    };
    const result = {
      short_url: 'http://short.url/custom',
      expires_at: new Date(),
    };

    mockUrlsService.createShortUrl.mockResolvedValue(result);

    const response = await controller.shorten(req, shortenUrlDto);

    expect(response).toEqual(
      customResponse(HttpStatus.CREATED, 'Url shortened successfully', {
        shortenedUrl: result.short_url,
        expiresAt: result.expires_at,
      }),
    );
    expect(service.createShortUrl).toHaveBeenCalledWith(
      'userId',
      'http://example.com',
      'custom',
    );
  });
});

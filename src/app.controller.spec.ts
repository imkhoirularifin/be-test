import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UrlsService } from './urls/urls.service';
import { customResponse } from './infrastructure/response.interceptor';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let urlsService: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: UrlsService,
          useValue: {
            getOriginalUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    urlsService = module.get<UrlsService>(UrlsService);
  });

  describe('appStatus', () => {
    it('should return application status', () => {
      const result = appController.appStatus();
      expect(result).toEqual(
        customResponse(HttpStatus.OK, 'Application is running 🚀'),
      );
    });
  });

  describe('redirectShortUrl', () => {
    it('should redirect to the original URL', async () => {
      const shortUrl = 'shortUrl';
      const originalUrl = 'http://original.url';
      const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      jest.spyOn(urlsService, 'getOriginalUrl').mockResolvedValue(originalUrl);

      await appController.redirectShortUrl(shortUrl, res);

      expect(urlsService.getOriginalUrl).toHaveBeenCalledWith(shortUrl);
      expect(res.redirect).toHaveBeenCalledWith(originalUrl);
    });

    it('should throw an error if getOriginalUrl fails', async () => {
      const shortUrl = 'shortUrl';
      const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(urlsService, 'getOriginalUrl')
        .mockRejectedValue(new Error('error'));

      await expect(
        appController.redirectShortUrl(shortUrl, res),
      ).rejects.toThrow('error');
    });
  });
});

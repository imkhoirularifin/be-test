import { HttpStatus, Injectable } from '@nestjs/common';
import { UrlRepository } from './urls.repository';
import { CustomException } from 'src/infrastructure/exception.filter';
import { UrlUtils } from 'src/utils/url';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlsService {
  constructor(
    private readonly urlRepo: UrlRepository,
    private readonly configService: ConfigService,
  ) {}

  async createShortUrl(
    userId: string,
    originalUrl: string,
    customizeUrl?: string,
  ) {
    // set expire time to 5 years
    const expireTime = new Date();
    expireTime.setFullYear(expireTime.getFullYear() + 5);

    let shortUrl: string;
    if (customizeUrl) {
      // check if the customize url is already taken
      const existingUrl = await this.urlRepo.findByShortUrl(customizeUrl);

      if (existingUrl) {
        throw new CustomException(
          HttpStatus.CONFLICT,
          'Customize url is taken, please try another one',
        );
      }

      shortUrl = customizeUrl;
    } else {
      // generate short url
      shortUrl = UrlUtils.generateShortUrl();

      let existingUrl = await this.urlRepo.findByShortUrl(shortUrl);

      // if the generated short url is already taken, generate another one
      while (existingUrl !== null) {
        shortUrl = UrlUtils.generateShortUrl();
        existingUrl = await this.urlRepo.findByShortUrl(shortUrl);
      }
    }

    const url = await this.urlRepo.create(
      userId,
      originalUrl,
      shortUrl,
      expireTime,
    );

    url.short_url = `${this.configService.get('DOMAIN')}/${url.short_url}`;

    return url;
  }

  async getOriginalUrl(shortUrl: string): Promise<string> {
    try {
      const url = await this.urlRepo.findByShortUrl(shortUrl);

      if (!url) {
        throw new CustomException(HttpStatus.NOT_FOUND, 'Route not found');
      }

      if (url.expires_at < new Date()) {
        throw new CustomException(HttpStatus.GONE, 'Url has been expired');
      }

      return url.url;
    } catch (error) {
      throw error;
    }
  }
}

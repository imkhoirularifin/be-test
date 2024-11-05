import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { customResponse } from './infrastructure/response.interceptor';
import { Response } from 'express';
import { UrlsService } from './urls/urls.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly urlService: UrlsService) {}

  @Get()
  @ApiOperation({ summary: 'Check application status' })
  @ApiResponse({ status: 200, description: 'Application is running 🚀' })
  appStatus() {
    return customResponse(HttpStatus.OK, 'Application is running 🚀');
  }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redirect to original URL' })
  @ApiParam({ name: 'shortUrl', required: true, description: 'Shortened URL' })
  @ApiResponse({ status: 302, description: 'Redirect to the original URL' })
  @ApiResponse({ status: 404, description: 'Short URL not found' })
  async redirectShortUrl(
    @Param('shortUrl') shortUrl: string,
    @Res() res: Response,
  ) {
    try {
      const originalUrl = await this.urlService.getOriginalUrl(shortUrl);

      return res.redirect(originalUrl);
    } catch (error) {
      throw error;
    }
  }
}

import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ShortenUrlReqDto, ShortenUrlResDto } from 'src/domain/dto/url.dto';
import { customResponse } from 'src/infrastructure/response.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TokenPayload } from 'src/domain/entity/auth.entity';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('urls')
@Controller('api/v1/urls')
export class UrlsController {
  constructor(private readonly urlService: UrlsService) {}

  @ApiBearerAuth()
  @UseGuards(ThrottlerGuard)
  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Url shortened successfully',
    type: ShortenUrlResDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async shorten(@Request() req: any, @Body() shortenUrlDto: ShortenUrlReqDto) {
    const tokenPayload: TokenPayload = req.user;
    try {
      const url = await this.urlService.createShortUrl(
        tokenPayload.sub,
        shortenUrlDto.url,
        shortenUrlDto.customUrl,
      );

      const resDto: ShortenUrlResDto = {
        shortenedUrl: url.short_url,
        expiresAt: url.expires_at,
      };

      return customResponse(
        HttpStatus.CREATED,
        'Url shortened successfully',
        resDto,
      );
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Url } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UrlRepository {
  constructor(private prisma: PrismaService) {}

  async findByShortUrl(shortUrl: string): Promise<Url | null> {
    try {
      const url = await this.prisma.url.findUnique({
        where: {
          short_url: shortUrl,
        },
      });

      if (!url) {
        return null;
      }

      if (url.short_url !== shortUrl) {
        return null;
      }

      return url;
    } catch (error) {
      throw error;
    }
  }

  async create(
    userId: string,
    originalUrl: string,
    shortUrl: string,
    expiresAt: Date,
  ): Promise<Url> {
    try {
      const url = await this.prisma.url.create({
        data: {
          user_id: userId,
          url: originalUrl,
          short_url: shortUrl,
          expires_at: expiresAt,
        },
      });

      return url;
    } catch (error) {
      throw error;
    }
  }
}

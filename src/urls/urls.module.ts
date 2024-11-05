import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { UrlRepository } from './urls.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UrlsController],
  providers: [UrlsService, UrlRepository],
  exports: [UrlsService],
})
export class UrlsModule {}

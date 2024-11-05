import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './config/config';
import { UrlsModule } from './urls/urls.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
    }),
    // set up rate limiting, 10 requests per minute
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // milliseconds
        limit: 10, // requests
      },
    ]),
    UsersModule,
    PrismaModule,
    AuthModule,
    UrlsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlReqDto {
  @ApiProperty({
    description: 'The URL to be shortened',
    example: 'https://example.com',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Custom alias for the shortened URL',
    example: 'my-custom-url',
    required: false,
    maxLength: 16,
  })
  @IsOptional()
  @MaxLength(16)
  @IsString()
  customUrl: string;
}

export class ShortenUrlResDto {
  @ApiProperty({
    description: 'The shortened URL',
    example: 'https://short.ly/abc123',
  })
  shortenedUrl: string;

  @ApiProperty({
    description: 'Expiration date of the shortened URL',
    example: '2023-12-31T23:59:59.000Z',
  })
  expiresAt: Date;
}

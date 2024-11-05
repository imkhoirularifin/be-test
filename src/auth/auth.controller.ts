import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { customResponse } from 'src/infrastructure/response.interceptor';
import { LoginDto, RegisterDto, TokenResDto } from 'src/domain/dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login success', type: TokenResDto })
  async login(@Body() loginDto: LoginDto) {
    try {
      const token = await this.authService.login(loginDto);

      const resDto: TokenResDto = {
        token: token,
      };

      return customResponse(HttpStatus.OK, 'Login success', resDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Register success',
    type: TokenResDto,
  })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const token = await this.authService.register(registerDto);

      const resDto: TokenResDto = {
        token: token,
      };

      return customResponse(HttpStatus.CREATED, 'Register success', resDto);
    } catch (error) {
      throw error;
    }
  }
}

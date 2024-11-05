import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, TokenResDto } from 'src/domain/dto/auth.dto';
import { HttpStatus } from '@nestjs/common';
import { customResponse } from 'src/infrastructure/response.interceptor';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'ahmad@email.com',
        password: 'password123',
      };
      const token = 'testToken';
      const resDto: TokenResDto = { token };

      jest.spyOn(authService, 'login').mockResolvedValue(token);

      const result = await authController.login(loginDto);

      expect(result).toEqual(
        customResponse(HttpStatus.OK, 'Login success', resDto),
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should return a token on successful registration', async () => {
      const registerDto: RegisterDto = {
        email: 'ahmad@gmail.com',
        password: 'password123',
      };
      const token = 'testToken';
      const resDto: TokenResDto = { token };

      jest.spyOn(authService, 'register').mockResolvedValue(token);

      const result = await authController.register(registerDto);

      expect(result).toEqual(
        customResponse(HttpStatus.CREATED, 'Register success', resDto),
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});

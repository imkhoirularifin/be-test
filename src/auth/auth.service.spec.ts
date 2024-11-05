import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { BcryptUtils } from 'src/utils/bcrypt';
import { CustomException } from 'src/infrastructure/exception.filter';
import { User } from '@prisma/client';
import { ValidatorUtils } from 'src/utils/validator';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepo: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepo = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: undefined,
        updated_at: undefined,
      };

      jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(BcryptUtils, 'comparePasswords').mockReturnValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await authService.login(loginDto);

      expect(result).toBe('token');
    });

    it('should throw an error if email is not found', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        CustomException,
      );
    });

    it('should throw an error if password is invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: undefined,
        updated_at: undefined,
      };

      jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(BcryptUtils, 'comparePasswords').mockReturnValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        CustomException,
      );
    });
  });

  describe('register', () => {
    it('should return a token if registration is successful', async () => {
      const registerDto = { email: 'test@example.com', password: 'Password1!' };
      const user: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: undefined,
        updated_at: undefined,
      };

      jest.spyOn(ValidatorUtils, 'validatePassword').mockReturnValue(true);
      jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(BcryptUtils, 'hashPassword').mockReturnValue('hashedPassword');
      jest.spyOn(userRepo, 'create').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await authService.register(registerDto);

      expect(result).toBe('token');
    });

    it('should throw an error if password is invalid', async () => {
      const registerDto = { email: 'test@example.com', password: 'pass' };

      jest.spyOn(ValidatorUtils, 'validatePassword').mockReturnValue(false);

      await expect(authService.register(registerDto)).rejects.toThrow(
        CustomException,
      );
    });

    it('should throw an error if email already exists', async () => {
      const registerDto = { email: 'test@example.com', password: 'Password1!' };
      const existingUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: undefined,
        updated_at: undefined,
      };

      jest.spyOn(ValidatorUtils, 'validatePassword').mockReturnValue(true);
      jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(existingUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        CustomException,
      );
    });
  });
});

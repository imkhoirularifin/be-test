import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidatorUtils } from 'src/utils/validator';
import { UserRepository } from 'src/users/users.repository';
import { BcryptUtils } from 'src/utils/bcrypt';
import { CustomException } from 'src/infrastructure/exception.filter';
import { LoginDto, RegisterDto } from 'src/domain/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/domain/entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    try {
      const user = await this.userRepo.findByEmail(loginDto.email);

      if (!user) {
        throw new CustomException(
          HttpStatus.UNAUTHORIZED,
          `Invalid email or password`,
        );
      }

      // validate password
      const isValidPassword = BcryptUtils.comparePasswords(
        loginDto.password,
        user.password,
      );

      if (!isValidPassword) {
        throw new CustomException(
          HttpStatus.UNAUTHORIZED,
          `Invalid email or password`,
        );
      }

      // generate jwt token
      const tokenPayload: TokenPayload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(tokenPayload);

      return token;
    } catch (error) {
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<string> {
    try {
      // validate password
      const isValidPassword = ValidatorUtils.validatePassword(
        registerDto.password,
      );

      if (!isValidPassword) {
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          'Invalid password, must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character',
        );
      }

      // check if email already exists
      const existingUser = await this.userRepo.findByEmail(registerDto.email);

      if (existingUser) {
        throw new CustomException(
          HttpStatus.CONFLICT,
          `User with email ${registerDto.email} already exists`,
        );
      }

      // hash password
      const hashedPassword = BcryptUtils.hashPassword(registerDto.password);

      // create user
      const user = await this.userRepo.create(
        registerDto.email,
        hashedPassword,
      );

      // generate jwt token
      const tokenPayload: TokenPayload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(tokenPayload);

      return token;
    } catch (error) {
      throw error;
    }
  }
}

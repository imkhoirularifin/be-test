import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        created_at: undefined,
        updated_at: undefined,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      expect(await userRepository.findById('1')).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      expect(await userRepository.findById('1')).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        created_at: undefined,
        updated_at: undefined,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      expect(await userRepository.findByEmail('test@test.com')).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      expect(await userRepository.findByEmail('test@test.com')).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const user: User = {
        id: '1',
        email: 'test@test.com',
        password: 'password',
        created_at: undefined,
        updated_at: undefined,
      };
      mockPrismaService.user.create.mockResolvedValue(user);

      expect(await userRepository.create('test@test.com', 'password')).toEqual(
        user,
      );
    });
  });
});

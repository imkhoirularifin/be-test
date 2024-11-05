import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(email: string, password: string): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: email,
          password: password,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}

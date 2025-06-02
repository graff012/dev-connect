import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers() {
    const users = await this.prismaService.user.findMany();

    if (!users) return [];

    return plainToInstance(UserDto, users);
  }

  async getUserById(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return plainToInstance(UserDto, user);
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    if (data.role !== undefined && data.role !== user.role) {
      throw new BadRequestException('Changing role is not allowed');
    }

    const { role, ...updateData } = data;

    user.updatedAt = new Date();

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: updateData,
    });

    return plainToInstance(UserDto, updatedUser);
  }

  async deleteUser(id: string) {
    try {
      const deletedUser = await this.prismaService.user.delete({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      return {
        message: `User deleted successfully`,
        deletedUser,
      };
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }

      throw err;
    }
  }
}

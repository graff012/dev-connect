import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  CreateAuthLoginDto,
  CreateAuthRegisterDto,
} from './dto/create-auth.dto';
import { find } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(createAuthRegisterDto: CreateAuthRegisterDto) {
    const findUser = await this.prismaService.user.findUnique({
      where: { username: createAuthRegisterDto.username },
    });

    if (findUser) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(
      createAuthRegisterDto.password,
      12
    );

    const newUser = await this.prismaService.user.create({
      data: {
        ...createAuthRegisterDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    const token = this.jwtService.signAsync({ userId: newUser.id });

    return {
      token,
      message: 'Welcome to the website',
    };
  }

  async login(createAuthLoginDto: CreateAuthLoginDto) {
    const findUser = await this.prismaService.user.findUnique({
      where: { username: createAuthLoginDto.username },
    });

    if (!findUser) throw new ConflictException('Username not found');

    const comparePass = await bcrypt.compare(
      createAuthLoginDto.password,
      findUser.password
    );

    if (!comparePass) throw new ConflictException('Password is incorrect');

    const token = await this.jwtService.signAsync({
      userId: findUser.id,
      role: findUser.role,
    });

    return {
      token,
      message: 'You have successfully logged in',
    };
  }

  // forgotPassword(id: number) {
  //   return `This action returns a #${id} auth`;
  // }
}

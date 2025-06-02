import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    // private readonly prisma: PrismaService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // I could use db to check the role,
    // eventhough it is very secure not fast enough and not ideal for high performance apps

    // const userId = request.userId;

    // const findUser = await this.prisma.user.findUnique({
    //   where: { id: userId },
    // });
    //
    // console.log(findUser);
    //
    // if (!findUser) throw new ForbiddenException('User not found');

    const userRole = request.userRole;
    const handler = context.getHandler();
    const mainRoles = this.reflector.get('roles', handler);

    if (!mainRoles.includes(userRole)) {
      throw new ForbiddenException('Role required');
    }

    return true;
  }
}

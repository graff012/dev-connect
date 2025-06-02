import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getClass(),
      context.getHandler(),
    ]);

    // If handler or class is 'isPublic', that is they don't require AuthGuard alltogether
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.cookies['token'];
    if (!token) throw new ForbiddenException('No token in cookies');

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.userId = payload.userId;
      request.userRole = payload.role;

      return true;
    } catch (err) {
      console.error(err);
      throw new ForbiddenException('Token is invalid');
    }
  }
}

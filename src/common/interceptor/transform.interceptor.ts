import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const statusCode = request.res.req.res.statusCode;
    const isFreeResponse = this.reflector.get('isFreeResponse', handler);

    if (!isFreeResponse) {
      return next.handle().pipe(
        map((data) => {
          return {
            status: statusCode,
            success: true,
            ...(typeof data !== 'object' || Array.isArray(data)
              ? { data }
              : data),
          };
        })
      );
    }

    return next.handle();
  }
}

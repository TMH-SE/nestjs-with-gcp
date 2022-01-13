import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TRANSFORM_GROUPS } from 'src/shared/constants/transform-options.constant';

export interface IResponse<T> {
  data: T;
  totalCount?: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    const res = context.switchToHttp().getResponse<Response>();
    const statusCode = res.statusCode;
    return next.handle().pipe(
      map((result) => {
        if (statusCode === 204) {
          return;
        }
        return {
          ...result,
          data: instanceToPlain(result.data, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
            groups: [TRANSFORM_GROUPS.viewDto],
          }),
          statusCode,
        };
      }),
    );
  }
}

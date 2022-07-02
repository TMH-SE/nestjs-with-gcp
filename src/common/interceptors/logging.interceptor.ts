import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        Logger.debug(
          `\x1B[33m[${req.method} ${req.path}]\x1B[0m \x1B[95mSuccessfully\x1B[0m \x1B[33m+${
            Date.now() - now
          }ms\x1B[0m`,
        );
      }),
    );
  }
}

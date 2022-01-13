import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    if (status === HttpStatus.UNAUTHORIZED) {
      exception.message = 'You do not have permission to access this resource';
    }

    const errorResponse = {
      statusCode: status,
      error: exceptionResponse?.error || exception.name,
      message: exceptionResponse?.message || exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    Logger.error(
      `\x1B[33m[${request.method} ${request.path}]\x1B[0m \x1B[31m${status} - ${errorResponse.error} - ${errorResponse.message}\x1B[0m\n${exception?.stack}`,
    );

    response.status(status).json(errorResponse);
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Response, Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const method = request.method;
    const url = request.url;
    const clientIp = request.headers['x-forwarded-for'] || request.ip;

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        const responseTime = Date.now() - now;

        const logMessage =
          `${method} ` +
          `${url} ` +
          `${statusCode} ` +
          `${clientIp} ` +
          `${responseTime}ms`;

        this.logger.log(logMessage);
      }),
      catchError((err) => {
        const statusCode = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const responseTime = Date.now() - now;

        const logMessage =
          `${method} ` +
          `${url} ` +
          `${statusCode} ` +
          `${clientIp} ` +
          `${responseTime}ms`;

        this.logger.log(logMessage);
        throw err;
      }),
    );
  }
}

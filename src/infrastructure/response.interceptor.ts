import { HttpStatus } from '@nestjs/common';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

/**
 * Constructs a custom response object.
 *
 * @param {HttpStatus} [statusCode=HttpStatus.OK] - The HTTP status code for the response.
 * @param {string} message - A message describing the response.
 * @param {any} [data] - Optional data to include in the response.
 * @returns {{ statusCode: HttpStatus, message: string, data?: any }} The custom response object.
 */
export function customResponse(
  statusCode: HttpStatus = HttpStatus.OK,
  message: string,
  data?: any,
): { statusCode: HttpStatus; message: string; data?: any } {
  return {
    statusCode,
    message,
    data,
  };
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((result) => {
        if (result === undefined) {
          return;
        }

        const statusCode = result.statusCode || HttpStatus.OK;

        // Set the custom HTTP status code on the response object
        response.status(statusCode);

        const responseObj: any = {
          error: false,
          message: result.message || 'Success',
        };

        if (result.data !== undefined) {
          responseObj.data = result.data;
        }

        return responseObj;
      }),
    );
  }
}

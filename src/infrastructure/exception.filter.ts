import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * CustomException is a specialized HttpException that allows for the creation
 * of exceptions with a specific HTTP status code and message.
 *
 * @extends HttpException
 */
export class CustomException extends HttpException {
  constructor(httpStatus: HttpStatus, message: string) {
    super(message, httpStatus);
  }
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseId = uuidv4();

    let exceptionMessage =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? `Something went wrong, Contact support team with this ResponseId: ${responseId}`
        : exception.message;

    if (exception instanceof BadRequestException) {
      // join the validation error messages
      const messages = exception.getResponse()['message'];

      exceptionMessage = messages.join(', ');
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`ResponseId: ${responseId}`);
      console.log(`Exception: ${exception.stack}`);
    }

    response.status(status).json({
      error: true,
      message: exceptionMessage,
    });
  }
}

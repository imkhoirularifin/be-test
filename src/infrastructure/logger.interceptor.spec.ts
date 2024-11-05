import { LoggingInterceptor } from './logger.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError, firstValueFrom } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          headers: { 'x-forwarded-for': '127.0.0.1' },
          ip: '127.0.0.1',
        }),
        getResponse: jest.fn().mockReturnValue({
          statusCode: 200,
        }),
      }),
    };

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of(null)),
    };

    jest.spyOn(interceptor['logger'], 'log');
  });

  it('should log the correct information on success', async () => {
    await firstValueFrom(
      interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      ),
    );

    expect(interceptor['logger'].log).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 200 127.0.0.1'),
    );
  });

  it('should log the correct information on error', async () => {
    const error = new Error('Test error');
    mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    await expect(
      firstValueFrom(
        interceptor.intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        ),
      ),
    ).rejects.toThrow(error);

    expect(interceptor['logger'].log).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 500 127.0.0.1'),
    );
  });
});

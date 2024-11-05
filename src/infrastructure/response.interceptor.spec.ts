import { ResponseInterceptor } from './response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should return a custom response object', (done) => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn(),
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler = {
      handle: jest.fn(() =>
        of({ message: 'Test message', data: { key: 'value' } }),
      ),
    } as unknown as CallHandler;

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(
        map((response) => {
          expect(response).toEqual({
            error: false,
            message: 'Test message',
            data: { key: 'value' },
          });
          done();
        }),
      )
      .subscribe();
  });

  it('should set the custom HTTP status code on the response object', (done) => {
    const mockStatus = jest.fn();
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({
        status: mockStatus,
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler = {
      handle: jest.fn(() =>
        of({ statusCode: 201, message: 'Created', data: { id: 1 } }),
      ),
    } as unknown as CallHandler;

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(
        map((response) => {
          expect(mockStatus).toHaveBeenCalledWith(201);
          expect(response).toEqual({
            error: false,
            message: 'Created',
            data: { id: 1 },
          });
          done();
        }),
      )
      .subscribe();
  });

  it('should return a default response object if result is undefined', (done) => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn(),
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler = {
      handle: jest.fn(() => of(undefined)),
    } as unknown as CallHandler;

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(
        map((response) => {
          expect(response).toBeUndefined();
          done();
        }),
      )
      .subscribe();
  });
});

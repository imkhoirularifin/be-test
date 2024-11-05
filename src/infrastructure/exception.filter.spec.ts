import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { CustomExceptionFilter } from './exception.filter';

describe('CustomExceptionFilter', () => {
  let filter: CustomExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomExceptionFilter],
    }).compile();

    filter = module.get<CustomExceptionFilter>(CustomExceptionFilter);
  });

  it('should handle HttpException and return proper response', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    const exception = new BadRequestException(['Validation error']);

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: true,
      message: 'Validation error',
    });
  });

  it('should handle internal server error and log responseId', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    const exception = new Error('Internal server error') as any;
    exception.getStatus = () => HttpStatus.INTERNAL_SERVER_ERROR;

    const loggerSpy = jest
      .spyOn(filter['logger'], 'error')
      .mockImplementation();

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: true,
      message: expect.stringContaining(
        'Something went wrong, Contact support team with this ResponseId:',
      ),
    });
    expect(loggerSpy).toHaveBeenCalled();
  });
});

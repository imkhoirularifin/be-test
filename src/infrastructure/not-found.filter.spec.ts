import { NotFoundFilter } from './not-found.filter';
import { NotFoundException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('NotFoundFilter', () => {
  let notFoundFilter: NotFoundFilter;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    notFoundFilter = new NotFoundFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse as Response,
      }),
    };
  });

  it('should return 404 status and error message', () => {
    const exception = new NotFoundException();
    notFoundFilter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: true,
      message: 'Route not found',
    });
  });
});

import { globalErrorHandler, bodyParserHandler } from './error';
import { Request, Response } from 'express';
import { ApiError } from '../helpers/ApiError';

describe('bodyParserHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const req = {} as Request;
  const res: Response = {} as Response;
  const next = jest.fn();
  const expectedError = new ApiError(400, 'BadRequest', 'Malformed JSON');

  it('calls next with ApiError when error is of type SyntaxError', () => {
    const syntaxError = new SyntaxError();
    bodyParserHandler(syntaxError, req, res, next);

    expect(next).toHaveBeenCalledWith(expectedError);
  });

  it('calls next with ApiError when error is of type TypeError', () => {
    const syntaxError = new TypeError();
    bodyParserHandler(syntaxError, req, res, next);

    expect(next).toHaveBeenCalledWith(expectedError);
  });

  it('returns void if error type is not syntax related', () => {
    const error = new Error();
    bodyParserHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalledWith(expectedError);
  });
});

describe('globalErrorHandler', () => {
  const req = {} as Request;
  const res: any = {
    status: jest.fn(),
    json: jest.fn(),
  };
  const next = jest.fn();
  it('sends 500 ApiError if error is unknown', () => {
    const unknownError = new Error('I am unknown Error');
    globalErrorHandler(unknownError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'I am unknown Error',
      error: unknownError,
    });
  });
});

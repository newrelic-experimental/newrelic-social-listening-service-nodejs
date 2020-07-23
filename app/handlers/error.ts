import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../helpers/ApiError';
import { APP_NAME } from '../config';

interface ResponseError extends Error {
  status?: number;
  type?: string;
}

const bodyParserHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof SyntaxError || err instanceof TypeError) {
    const error = new ApiError(400, 'Bad Request', 'Malformed JSON');
    return next(error);
  }
};

const fourOFour = (req: Request, res: Response, next: NextFunction): void =>
  next(
    new ApiError(
      404,
      'Resource Not Found',
      `${req.path} is not a valid path to ${APP_NAME} resource.`,
    ),
  );

const fourOFive = (req: Request, res: Response, next: NextFunction): void => {
  const err = new ApiError(
    405,
    'Method Not Allowed',
    `${req.method} is not supported at ${req.path}`,
  );
  return next(err);
};

const globalErrorHandler = (
  err: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  let error = err;
  if (!(err instanceof ApiError)) {
    error = new ApiError(500, err.type, err.message);
  }

  res.status(error.status || 500);
  return res.json({
    message: error.message,
    error,
  });
};

export { bodyParserHandler, fourOFour, fourOFive, globalErrorHandler };

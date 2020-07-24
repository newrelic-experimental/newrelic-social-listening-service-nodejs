import { NextFunction, Request, Response } from 'express';

const APP_NAME = process.env.APP_NAME || 'SLS';
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;

/**
 * Enable cors and allow other headers
 * Allow Methods
 * Set Content-Type to /json to always return json
 */
function globalResponseHeaders(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'POST,GET,PATCH,DELETE,OPTIONS');
  res.header('Content-Type', 'application/json');
  return next();
}

export { globalResponseHeaders, APP_NAME, NODE_ENV, PORT };

import dotenv from 'dotenv';
import express from 'express';

import { globalResponseHeaders } from './config';
import {
  bodyParserHandler,
  fourOFour,
  fourOFive,
  globalErrorHandler,
} from './handlers/error';

dotenv.config();
const app = express();

// body parser setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: '*/*' }));
app.use(bodyParserHandler);

// response headers setup; CORS
app.use(globalResponseHeaders);

// routes go here
app.use('/listener', (req, res) => {
  res.send({ message: 'OK' });
});

// catch 404 "Not Found" errors
app.get('*', fourOFour);
// catch 405 "Method Not Allowed" errors
app.use('*', fourOFive);
// all the other errors
app.use(globalErrorHandler);

export default app;

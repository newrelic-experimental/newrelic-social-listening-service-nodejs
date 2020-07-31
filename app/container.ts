import 'reflect-metadata';
import dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';

import { app, error } from './app';
import { SentimentAnalysisService } from './service/sentimentAnalysis';
import TYPES from './constant/types';

import './controller/listener';

dotenv.config();

const container = new Container();
container
  .bind<SentimentAnalysisService>(TYPES.SentimentAnalysisService)
  .to(SentimentAnalysisService);

const server = new InversifyExpressServer(container);

server.setConfig(app);
server.setErrorConfig(error);

const serverInstance = server.build();

export { serverInstance };

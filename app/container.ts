import 'reflect-metadata';
import dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';

dotenv.config();

import { app, error } from './app';
import { SentimentAnalysisService } from './service/sentimentAnalysis';
import { SentimentAnalyser } from './lib/SentimentAnalyser';
import { Natural } from './lib/Natural';
import { SpellCorrectorFactory } from './lib/SpellCorrector';
import { TwitterStreamAdapter } from './adapter/TwitterStream';
import TYPES from './constant/types';

import './controller/listener';
import './controller/twitter';

const container = new Container();
container
  .bind<SentimentAnalysisService>(TYPES.SentimentAnalysisService)
  .to(SentimentAnalysisService);
container
  .bind<SentimentAnalyser>(TYPES.SentimentAnalyser)
  .to(SentimentAnalyser);
container.bind<Natural>(TYPES.Natural).to(Natural);
container
  .bind<SpellCorrectorFactory>(TYPES.SpellCorrector)
  .to(SpellCorrectorFactory)
  .inSingletonScope();
container
  .bind<TwitterStreamAdapter>(TYPES.TwitterStreamAdapter)
  .to(TwitterStreamAdapter)
  .inSingletonScope();

const server = new InversifyExpressServer(container);

server.setConfig(app);
server.setErrorConfig(error);

const serverInstance = server.build();

export { serverInstance };

import 'reflect-metadata';
import dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';

import { app, error } from './app';

import './controller/listener';

dotenv.config();

const container = new Container();
const server = new InversifyExpressServer(container);

server.setConfig(app);
server.setErrorConfig(error);

const serverInstance = server.build();

export { serverInstance };

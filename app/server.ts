import 'reflect-metadata';
import dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';

import { app, error } from './app';
import { APP_NAME, PORT, NODE_ENV } from './config';

import './controller/listener';

dotenv.config();

const container = new Container();
const server = new InversifyExpressServer(container);

server.setConfig(app);
server.setErrorConfig(error);

export const serverInstance = server.build();

serverInstance.listen(PORT, () => {
  console.log(
    `${APP_NAME} is listening on port ${PORT} 🚀 - Node Env - ${NODE_ENV}`,
  );
});

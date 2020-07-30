import { serverInstance } from './container';
import { APP_NAME, PORT, NODE_ENV } from './config';

serverInstance.listen(PORT, () => {
  console.log(
    `${APP_NAME} is listening on port ${PORT} 🚀 - Node Env - ${NODE_ENV}`,
  );
});

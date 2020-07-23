import app from './app';
import { APP_NAME, PORT, NODE_ENV } from './config';

app.listen(PORT, () => {
  console.log(
    `${APP_NAME} is listening on port ${PORT} 🚀 - Node Env - ${NODE_ENV}`,
  );
});

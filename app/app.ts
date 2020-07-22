import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();

app.use(express.json({ type: 'application/json' }));

app.use('/listener', (req, res) => {
  res.send('OK!!');
});

export default app;

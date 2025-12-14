import express from 'express';
import cors from 'cors';
import './models/index.js';

import routes from './routes/index.js';
import { info } from './utils/logger.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

info('App initialized');

export default app;

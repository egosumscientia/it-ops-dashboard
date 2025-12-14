import pkg from 'pg';
import dotenv from 'dotenv';
import { info } from '../utils/logger.js';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT 1')
  .then(() => info('DB CONNECTED'))
  .catch(err => {
    console.error('DB CONNECTION FAILED');
    console.error(err);
    process.exit(1);
  });

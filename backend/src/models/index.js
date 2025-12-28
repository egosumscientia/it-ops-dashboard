import pkg from 'pg';
import dotenv from 'dotenv';
import { info, error } from '../utils/logger.js';

dotenv.config();

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  error('DATABASE_URL is not set. Create backend/.env from .env.example or export DATABASE_URL.');
  process.exit(1);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT 1')
  .then(() => info('DB CONNECTED'))
  .catch(err => {
    error('DB CONNECTION FAILED');
    error(err.message);
    process.exit(1);
  });

import { pool } from '../models/index.js';
import { info, error } from '../utils/logger.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT id, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    info(`User logged in: ${email}`);
    res.json({ token });

  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

export async function listIncidents(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM incidents ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

export async function createIncident(req, res) {
  try {
    const { title, status, priority } = req.body;

    const result = await pool.query(
      `INSERT INTO incidents (title, status, priority)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, status, priority]
    );

    info(`Incident created: ${result.rows[0].id}`);
    res.status(201).json(result.rows[0]);

  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

export async function updateIncident(req, res) {
  try {
    const id = Number(req.params.id);
    const { status, priority } = req.body;

    const result = await pool.query(
      `UPDATE incidents
       SET status = $1, priority = $2
       WHERE id = $3
       RETURNING *`,
      [status, priority, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

export async function deleteIncident(req, res) {
  try {
    const id = Number(req.params.id);

    await pool.query(
      'DELETE FROM incidents WHERE id = $1',
      [id]
    );

    info(`Incident deleted: ${id}`);
    res.sendStatus(204);

  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

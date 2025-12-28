import { pool } from '../models/index.js';
import { info, error } from '../utils/logger.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* =========================
   AUTH
========================= */
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

    const storedPassword = user.password;
    const isHashed = typeof storedPassword === 'string' && storedPassword.startsWith('$2');

    const normalize = (val) => (val ?? '').toString().trim();
    const valid = isHashed
      ? await bcrypt.compare(password, storedPassword)
      : normalize(password) === normalize(storedPassword);

    if (!isHashed && valid) {
      info(`User ${email} authenticated with plaintext password (consider hashing).`);
    }

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

/* =========================
   INCIDENTS
========================= */
export async function listIncidents(req, res) {
  try {
    const {
      page = '1',
      pageSize = '10',
      status,
      priority,
      search
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100);
    const offset = (pageNumber - 1) * size;

    const filters = [];
    const params = [];

    if (status && status !== 'all') {
      params.push(status);
      filters.push(`LOWER(status) = LOWER($${params.length})`);
    }

    if (priority && priority !== 'all') {
      params.push(priority);
      filters.push(`LOWER(priority) = LOWER($${params.length})`);
    }

    const searchTerm = search?.trim();
    if (searchTerm) {
      const term = `%${searchTerm}%`;
      params.push(term);
      params.push(term);
      filters.push(`(LOWER(title) LIKE LOWER($${params.length - 1}) OR LOWER(description) LIKE LOWER($${params.length}))`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) AS count FROM incidents ${whereClause}`;
    const totalResult = await pool.query(countQuery, params);
    const total = Number(totalResult.rows?.[0]?.count || 0);

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;
    const listQuery = `
      SELECT * FROM incidents
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;
    const listResult = await pool.query(listQuery, [...params, size, offset]);

    res.json({
      items: listResult.rows,
      total,
      page: pageNumber,
      pageSize: size,
      totalPages: Math.max(Math.ceil(total / size), 1)
    });
  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

export async function createIncident(req, res) {
  try {
    const {
      title,
      description,
      status,
      priority,
      severity,
      category,
      reported_by,
      assigned_to
    } = req.body;

    const clean = {
      title: title?.trim(),
      description: description?.trim(),
      status: status?.trim(),
      priority: priority?.trim(),
      severity: severity?.trim(),
      category: category?.trim(),
      reported_by: reported_by?.trim(),
      assigned_to: assigned_to?.trim()
    };

    const required = {
      title: clean.title,
      description: clean.description,
      status: clean.status,
      priority: clean.priority,
      severity: clean.severity,
      category: clean.category,
      reported_by: clean.reported_by
    };
    const missing = Object.entries(required)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missing.length) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    const result = await pool.query(
      `INSERT INTO incidents
       (title, description, status, priority, severity, category, reported_by, assigned_to)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        clean.title,
        clean.description,
        clean.status,
        clean.priority,
        clean.severity,
        clean.category,
        clean.reported_by,
        clean.assigned_to || null
      ]
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

    const current = await pool.query(
      'SELECT * FROM incidents WHERE id = $1',
      [id]
    );

    if (current.rowCount === 0) {
      return res.sendStatus(404);
    }

    const incident = current.rows[0];

    const {
      title = incident.title,
      description = incident.description,
      status = incident.status,
      priority = incident.priority,
      severity = incident.severity,
      category = incident.category,
      reported_by = incident.reported_by,
      assigned_to = incident.assigned_to
    } = req.body;

    const clean = {
      title: title?.trim(),
      description: description?.trim(),
      status: status?.trim(),
      priority: priority?.trim(),
      severity: severity?.trim(),
      category: category?.trim(),
      reported_by: reported_by?.trim(),
      assigned_to: assigned_to?.trim()
    };

    const required = {
      title: clean.title,
      description: clean.description,
      status: clean.status,
      priority: clean.priority,
      severity: clean.severity,
      category: clean.category,
      reported_by: clean.reported_by
    };

    const missing = Object.entries(required)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missing.length) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    const result = await pool.query(
      `UPDATE incidents
       SET
         title = $1,
         description = $2,
         status = $3,
         priority = $4,
         severity = $5,
         category = $6,
         reported_by = $7,
         assigned_to = $8,
         updated_at = now()
       WHERE id = $9
       RETURNING *`,
      [
        clean.title,
        clean.description,
        clean.status,
        clean.priority,
        clean.severity,
        clean.category,
        clean.reported_by,
        clean.assigned_to || null,
        id
      ]
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

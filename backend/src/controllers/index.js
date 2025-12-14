import { PrismaClient } from '@prisma/client';
import { info, error } from '../utils/logger.js';

const prisma = new PrismaClient();

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const bcrypt = await import('bcrypt');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const jwt = await import('jsonwebtoken');
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
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(incidents);
  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

export async function createIncident(req, res) {
  try {
    const { title, status, priority } = req.body;

    const incident = await prisma.incident.create({
      data: { title, status, priority }
    });

    info(`Incident created: ${incident.id}`);
    res.status(201).json(incident);

  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

export async function updateIncident(req, res) {
  try {
    const id = Number(req.params.id);
    const { status, priority } = req.body;

    const incident = await prisma.incident.update({
      where: { id },
      data: { status, priority }
    });

    info(`Incident updated: ${id}`);
    res.json(incident);

  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

export async function deleteIncident(req, res) {
  try {
    const id = Number(req.params.id);

    await prisma.incident.delete({ where: { id } });

    info(`Incident deleted: ${id}`);
    res.sendStatus(204);

  } catch (err) {
    error(err.message);
    res.sendStatus(500);
  }
}

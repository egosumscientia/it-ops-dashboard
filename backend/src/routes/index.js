import { Router } from 'express';
import {
  login,
  listIncidents,
  createIncident,
  updateIncident,
  deleteIncident
} from '../controllers/index.js';

import { authMiddleware } from '../middlewares/index.js';

const router = Router();

/* Auth */
router.post('/auth/login', login);

/* Incidents */
router.use('/incidents', authMiddleware);

router.get('/incidents', listIncidents);
router.post('/incidents', createIncident);
router.put('/incidents/:id', updateIncident);
router.delete('/incidents/:id', deleteIncident);

export default router;

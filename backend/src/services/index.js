import { Incident } from '../models/index.js';

export function getIncidentStats() {
  return Incident.groupBy({
    by: ['status'],
    _count: true
  });
}

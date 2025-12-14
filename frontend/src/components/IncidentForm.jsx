import { useEffect, useState } from 'react';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
};

const sanitize = (incident) => {
  if (!incident) return initialState;
  return {
    ...initialState,
    ...incident,
    title: incident.title || '',
    description: incident.description || '',
    status: incident.status || 'Open',
    priority: incident.priority || 'Low',
    severity: incident.severity || '',
    category: incident.category || '',
    reported_by: incident.reported_by || '',
    assigned_to: incident.assigned_to || ''
  };
};

const initialState = {
  title: '',
  description: '',
  status: 'Open',
  priority: 'Medium',
  severity: '',
  category: '',
  reported_by: '',
  assigned_to: ''
};

const requiredFields = ['title', 'description', 'status', 'priority', 'severity', 'category', 'reported_by'];

function IncidentForm({ onCreate, onUpdate, editing, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(sanitize(editing));
  }, [editing]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  function validate() {
    const missing = requiredFields.filter((field) => !String(form[field] || '').trim());
    if (missing.length) {
      const labels = {
        title: 'Titulo',
        description: 'Descripcion',
        status: 'Estado',
        priority: 'Prioridad',
        severity: 'Severidad',
        category: 'Categoria',
        reported_by: 'Reportado por'
      };
      const list = missing.map((m) => labels[m] || m).join(', ');
      throw new Error(`Completa: ${list}`);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      validate();
      if (editing?.id) {
        await onUpdate(editing.id, form);
      } else {
        await onCreate(form);
      }
      setForm(initialState);
    } catch (err) {
      setError(err.message || 'No se pudo guardar el incidente');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      {error && <div className="alert">{error}</div>}

      <div>
        <label htmlFor="title">Titulo *</label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Base de datos lenta"
          required
        />
      </div>

      <div>
        <label htmlFor="description">Descripcion *</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Contexto breve e impacto"
          required
        />
      </div>

      <div className="filters">
        <div>
          <label htmlFor="status">Estado *</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            required
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority">Prioridad *</label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            required
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label htmlFor="severity">Severidad *</label>
          <input
            id="severity"
            value={form.severity}
            onChange={(e) => handleChange('severity', e.target.value)}
            placeholder="Critical, Major, Minor"
            required
          />
        </div>
      </div>

      <div className="filters">
        <div>
          <label htmlFor="category">Categoria *</label>
          <input
            id="category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Networking, Infra, App"
            required
          />
        </div>
        <div>
          <label htmlFor="reported">Reportado por *</label>
          <input
            id="reported"
            value={form.reported_by}
            onChange={(e) => handleChange('reported_by', e.target.value)}
            placeholder="Monitoring, Soporte"
            required
          />
        </div>
        <div>
          <label htmlFor="assigned">Asignado a</label>
          <input
            id="assigned"
            value={form.assigned_to}
            onChange={(e) => handleChange('assigned_to', e.target.value)}
            placeholder="Ops, On-call"
          />
        </div>
      </div>

      {editing && (
        <div className="card" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
          <p className="helper-label" style={{ margin: '0 0 6px' }}>Historial del incidente</p>
          <div className="details-grid">
            <div>
              <p className="helper-label">ID</p>
              <p className="row-sub">{editing.id}</p>
            </div>
            <div>
              <p className="helper-label">Creado</p>
              <p className="row-sub">{formatDate(editing.created_at)}</p>
            </div>
            <div>
              <p className="helper-label">Actualizado</p>
              <p className="row-sub">{formatDate(editing.updated_at)}</p>
            </div>
            <div>
              <p className="helper-label">Estado actual</p>
              <p className="row-sub">{editing.status || 'N/D'}</p>
            </div>
            <div>
              <p className="helper-label">Prioridad actual</p>
              <p className="row-sub">{editing.priority || 'N/D'}</p>
            </div>
            <div>
              <p className="helper-label">Severidad actual</p>
              <p className="row-sub">{editing.severity || 'N/D'}</p>
            </div>
            <div>
              <p className="helper-label">Categoria</p>
              <p className="row-sub">{editing.category || 'N/D'}</p>
            </div>
            <div>
              <p className="helper-label">Reportado por</p>
              <p className="row-sub">{editing.reported_by || 'N/D'}</p>
            </div>
            <div>
              <p className="helper-label">Asignado a</p>
              <p className="row-sub">{editing.assigned_to || 'Unassigned'}</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : editing ? 'Actualizar' : 'Crear incidente'}
        </button>
        {editing && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setForm(initialState);
              setError('');
              onCancel && onCancel();
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default IncidentForm;

import { useState } from 'react';

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

function IncidentForm({ onCreate }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onCreate(form);
      setForm(initialState);
    } catch (err) {
      setError(err.message || 'No se pudo crear el incidente');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      {error && <div className="alert">{error}</div>}

      <div>
        <label htmlFor="title">Titulo</label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Base de datos lenta"
          required
        />
      </div>

      <div>
        <label htmlFor="description">Descripcion</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Contexto breve e impacto"
        />
      </div>

      <div className="filters">
        <div>
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority">Prioridad</label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label htmlFor="severity">Severidad</label>
          <input
            id="severity"
            value={form.severity}
            onChange={(e) => handleChange('severity', e.target.value)}
            placeholder="Critical, Major, Minor"
          />
        </div>
      </div>

      <div className="filters">
        <div>
          <label htmlFor="category">Categoria</label>
          <input
            id="category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Networking, Infra, App"
          />
        </div>
        <div>
          <label htmlFor="reported">Reportado por</label>
          <input
            id="reported"
            value={form.reported_by}
            onChange={(e) => handleChange('reported_by', e.target.value)}
            placeholder="Monitoring, Soporte"
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

      <button className="btn btn-primary" disabled={loading}>
        {loading ? 'Creando...' : 'Crear incidente'}
      </button>
    </form>
  );
}

export default IncidentForm;

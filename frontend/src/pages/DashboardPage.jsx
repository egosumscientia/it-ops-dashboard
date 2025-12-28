import { useEffect, useMemo, useRef, useState } from 'react';
import { getIncidents, createIncident, deleteIncident, updateIncident } from '../services/api';
import IncidentList from '../components/IncidentList';
import IncidentForm from '../components/IncidentForm';

function DashboardPage({ logout }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingIncident, setEditingIncident] = useState(null);
  const [banner, setBanner] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ total: 0, totalPages: 1, pageSize: 10 });
  const toastTimer = useRef(null);

  const notify = (type, message) => {
    setBanner({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setBanner(null);
      toastTimer.current = null;
    }, 3200);
  };
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  async function load(nextPage = page, activeFilters = filters, size = pageSize) {
    setLoading(true);
    setError('');
    try {
      const data = await getIncidents({
        page: nextPage,
        pageSize: size,
        status: activeFilters.status,
        priority: activeFilters.priority,
        search: activeFilters.search.trim()
      });

      const total = data.total ?? 0;
      const rawTotalPages = data.totalPages ?? Math.ceil(total / size);
      const totalPages = Math.max(rawTotalPages || 1, 1);
      const safePage = Math.min(Math.max(data.page || nextPage, 1), totalPages);

      setIncidents(data.items || []);
      setPageInfo({ total, totalPages, pageSize: size });

      if (safePage !== page) {
        setPage(safePage);
      }
    } catch (err) {
      setError(err.message || 'No se pudo cargar la lista');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page, filters, pageSize);
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [page, filters, pageSize]);

  const filteredIncidents = incidents;

  const metrics = useMemo(() => {
    const countStatus = (status) =>
      filteredIncidents.filter((i) => i.status?.toLowerCase() === status).length;
    const countPriority = (priority) =>
      filteredIncidents.filter((i) => i.priority?.toLowerCase() === priority).length;

    return {
      total: filteredIncidents.length,
      open: countStatus('open'),
      progress: countStatus('in progress'),
      closed: countStatus('closed'),
      high: countPriority('high')
    };
  }, [filteredIncidents]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handlePageSizeChange = (value) => {
    const parsed = Math.min(Math.max(Number(value) || 10, 1), 100);
    setPageSize(parsed);
    setPage(1);
    load(1, filters, parsed);
  };

  async function handleCreate(payload) {
    setError('');
    try {
      await createIncident(payload);
      setPage(1);
      await load(1, filters, pageSize);
      setEditingIncident(null);
      notify('success', 'Incidente creado');
    } catch (err) {
      setError(err.message || 'No se pudo crear el incidente');
      notify('error', err.message || 'No se pudo crear el incidente');
    }
  }

  async function handleUpdate(id, payload) {
    setError('');
    try {
      await updateIncident(id, payload);
      await load(page, filters, pageSize);
      setEditingIncident(null);
      notify('success', 'Incidente actualizado');
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el incidente');
      notify('error', err.message || 'No se pudo actualizar el incidente');
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await deleteIncident(id);
      await load(page, filters, pageSize);
      notify('success', 'Incidente eliminado');
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el incidente');
      notify('error', err.message || 'No se pudo eliminar el incidente');
    }
  }

  return (
    <div className="page">
      {banner && (
        <div className="toast-container">
          <div className={`toast ${banner.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            {banner.message}
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <p className="eyebrow">Operacion en vivo</p>
          <h1 className="page-title">IT Ops Dashboard</h1>
          <p className="muted">Estado de incidentes y focos de atencion.</p>
        </div>
        <div className="row-meta">
          <button className="btn btn-ghost" onClick={logout}>
            Cerrar sesion
          </button>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="filters">
          <div>
            <label htmlFor="search">Buscar</label>
            <input
              id="search"
              placeholder="Titulo o palabra clave"
            value={filters.search}
            onChange={(e) => handleFilter('search', e.target.value)}
          />
        </div>
        <div>
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilter('status', e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority">Prioridad</label>
            <select
              id="priority"
              value={filters.priority}
              onChange={(e) => handleFilter('priority', e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div style={{ alignSelf: 'end' }}>
            <button className="btn btn-ghost" type="button" onClick={() => load(page, filters, pageSize)}>
              Refrescar
            </button>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="card metric">
          <small>Total filtrados</small>
          <strong>{metrics.total}</strong>
          <span className="muted">
            {metrics.total === 0 ? 'Sin datos' : 'Incidentes visibles'}
          </span>
        </div>
        <div className="card metric">
          <small>Open</small>
          <strong>{metrics.total === 0 ? '—' : metrics.open}</strong>
          <span className="muted">
            {metrics.total === 0 ? 'Sin datos' : 'Esperando atencion'}
          </span>
        </div>
        <div className="card metric">
          <small>In Progress</small>
          <strong>{metrics.total === 0 ? '—' : metrics.progress}</strong>
          <span className="muted">
            {metrics.total === 0 ? 'Sin datos' : 'En curso'}
          </span>
        </div>
        <div className="card metric">
          <small>High</small>
          <strong>{metrics.total === 0 ? '—' : metrics.high}</strong>
          <span className="muted">
            {metrics.total === 0 ? 'Sin datos' : 'Alta prioridad'}
          </span>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <h3 style={{ margin: '0 0 8px' }}>Crear incidente</h3>
          <p className="muted" style={{ margin: '0 0 12px' }}>
            {editingIncident
              ? 'Edita los campos y guarda los cambios.'
              : 'Define un titulo claro, prioridad y estado inicial.'}
          </p>
          <IncidentForm
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            editing={editingIncident}
            onCancel={() => setEditingIncident(null)}
          />
        </div>

        <div className="card">
          <div className="page-header" style={{ margin: 0, padding: 0 }}>
            <div>
              <h3 style={{ margin: 0 }}>Incidentes recientes</h3>
              <p className="muted" style={{ margin: '4px 0 0' }}>
                Lista ordenada por creacion mas reciente.
              </p>
            </div>
          </div>

          <IncidentList
            incidents={filteredIncidents}
            onDelete={handleDelete}
            loading={loading}
            onEdit={setEditingIncident}
          />

          <div className="pagination-bar">
            <div className="pagination-size">
              <label htmlFor="pageSize">Por pagina</label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="muted">
              Mostrando {pageInfo.total === 0 ? 0 : (page - 1) * pageSize + 1}
              {' '}-{' '}
              {Math.min(page * pageSize, pageInfo.total)} de {pageInfo.total}
            </div>
            <div className="pagination-actions">
              <button
                className="btn btn-ghost"
                type="button"
                disabled={loading || page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Anterior
              </button>
              <span className="muted">Pagina {page} / {pageInfo.totalPages}</span>
              <button
                className="btn btn-ghost"
                type="button"
                disabled={loading || page >= pageInfo.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, pageInfo.totalPages))}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

import { useState } from 'react';

function normalize(value) {
  return value ? value.toLowerCase().replace(/\s+/g, '-') : '';
}

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
};

function IncidentList({ incidents, onDelete, loading }) {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return <div className="empty-state">Cargando incidentes...</div>;
  }

  if (!incidents.length) {
    return <div className="empty-state">No hay incidentes en este filtro.</div>;
  }

  return (
    <div className="table">
      <div className="table-head">
        <span>Incidente</span>
        <span>Estado</span>
        <span>Prioridad</span>
        <span>Asignado</span>
        <span>Acciones</span>
      </div>

      {incidents.map((i) => {
        const statusClass = normalize(i.status);
        const priorityClass = normalize(i.priority);
        const isOpen = expandedId === i.id;

        return (
          <div key={i.id} className="table-row-wrapper">
            <div className="table-row">
              <div>
                <p className="row-title">{i.title}</p>
                {i.description && <p className="row-sub">{i.description}</p>}
                <div className="row-meta">
                  {i.category && <span className="chip">{i.category}</span>}
                  {i.severity && <span className="chip">Sev: {i.severity}</span>}
                  {i.reported_by && <span className="chip">Reportado: {i.reported_by}</span>}
                </div>
              </div>

              <div>
                <span className={`badge status-${statusClass}`}>{i.status}</span>
              </div>

              <div>
                <span className={`badge priority-${priorityClass}`}>{i.priority}</span>
              </div>

              <div>
                <span className="chip">{i.assigned_to || 'Unassigned'}</span>
              </div>

              <div className="row-actions">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : i.id)}
                >
                  {isOpen ? 'Ocultar' : 'Ver detalles'}
                </button>
                <button className="btn btn-ghost" onClick={() => onDelete(i.id)}>
                  Eliminar
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="row-details">
                <div className="details-grid">
                  <div>
                    <p className="helper-label">Descripcion</p>
                    <p className="row-sub">{i.description || 'Sin descripcion'}</p>
                  </div>
                  <div>
                    <p className="helper-label">Categoria</p>
                    <p className="row-sub">{i.category || 'Sin categoria'}</p>
                  </div>
                  <div>
                    <p className="helper-label">Severidad</p>
                    <p className="row-sub">{i.severity || 'Sin severidad'}</p>
                  </div>
                  <div>
                    <p className="helper-label">Reportado por</p>
                    <p className="row-sub">{i.reported_by || 'N/D'}</p>
                  </div>
                  <div>
                    <p className="helper-label">Asignado a</p>
                    <p className="row-sub">{i.assigned_to || 'Unassigned'}</p>
                  </div>
                  <div>
                    <p className="helper-label">Creado</p>
                    <p className="row-sub">{formatDate(i.created_at)}</p>
                  </div>
                  <div>
                    <p className="helper-label">Actualizado</p>
                    <p className="row-sub">{formatDate(i.updated_at)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default IncidentList;

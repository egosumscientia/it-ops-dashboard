function normalize(value) {
  return value ? value.toLowerCase().replace(/\s+/g, '-') : '';
}

function IncidentList({ incidents, onDelete, loading }) {
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

        return (
          <div key={i.id} className="table-row">
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

            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-ghost" onClick={() => onDelete(i.id)}>
                Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default IncidentList;

function IncidentList({ incidents, onDelete }) {
  return (
    <ul>
      {incidents.map(i => (
        <li key={i.id}>
          {i.title} | {i.status} | {i.priority}
          <button onClick={() => onDelete(i.id)}>X</button>
        </li>
      ))}
    </ul>
  )
}

export default IncidentList

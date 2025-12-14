import { useState } from 'react'

function IncidentForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Low')

  function submit(e) {
    e.preventDefault()
    onCreate({
      title,
      status: 'Open',
      priority
    })
    setTitle('')
  }

  return (
    <form onSubmit={submit}>
      <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
      <select onChange={e => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button>Crear</button>
    </form>
  )
}

export default IncidentForm

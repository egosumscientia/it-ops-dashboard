import { useEffect, useState } from 'react'
import { getIncidents, createIncident, deleteIncident } from '../services/api'
import IncidentList from '../components/IncidentList'
import IncidentForm from '../components/IncidentForm'

function DashboardPage() {
  const [incidents, setIncidents] = useState([])

  async function load() {
    const data = await getIncidents()
    setIncidents(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(data) {
    await createIncident(data)
    load()
  }

  async function handleDelete(id) {
    await deleteIncident(id)
    load()
  }

  return (
    <>
      <h1>IT Ops Dashboard</h1>
      <IncidentForm onCreate={handleCreate} />
      <IncidentList incidents={incidents} onDelete={handleDelete} />
    </>
  )
}

export default DashboardPage

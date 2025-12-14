const API_URL = 'http://localhost:3000/api'

function getHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export async function getIncidents() {
  const res = await fetch(`${API_URL}/incidents`, {
    headers: getHeaders()
  })
  return res.json()
}

export async function createIncident(data) {
  const res = await fetch(`${API_URL}/incidents`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteIncident(id) {
  await fetch(`${API_URL}/incidents/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
}

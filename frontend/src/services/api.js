const API_URL = "http://localhost:3000/api";

async function request(path, options = {}) {
  const { withAuth = true, headers, ...rest } = options;
  const token = localStorage.getItem('token');
  const authHeaders = withAuth && token ? { Authorization: `Bearer ${token}` } : {};
  const contentHeader = rest.body ? { 'Content-Type': 'application/json' } : {};

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...contentHeader,
      ...authHeaders,
      ...(headers || {})
    }
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = isJson ? payload?.error || 'Request failed' : payload || 'Request failed';
    throw new Error(message);
  }

  return payload;
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    withAuth: false,
    body: JSON.stringify({ email, password })
  });
}

export function getIncidents() {
  return request('/incidents');
}

export function createIncident(data) {
  return request('/incidents', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function deleteIncident(id) {
  return request(`/incidents/${id}`, {
    method: 'DELETE'
  });
}

export function updateIncident(id, data) {
  return request(`/incidents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

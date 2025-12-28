# IT Ops Dashboard

Demo de dashboard para gestionar incidentes de IT con Node.js + React. Enfocado en claridad de cdigo y UX simple.

---

## Stack

### Backend
- Node.js + Express
- PostgreSQL (`pg`)
- JWT simple

### Frontend
- React + Vite
- React Router
- Fetch API
- CSS plano

---

## Features
- Login con JWT y proteccin de rutas.
- CRUD de incidentes (crear, listar, editar, eliminar).
- Filtros por estado/prioridad y bsqueda por ttulo.
- Mtricas rpidas (totales, open, in progress, high) con estado "sin datos".
- Detalle expandible con metadatos y fechas.
- Toasts de xito/error en operaciones y login.

---

## Estructura
```
backend/
  src/
    controllers/
    middlewares/
    routes/
    app.js
  server.js

frontend/
  src/
    components/
    hooks/
    pages/
    App.jsx
    styles.css
```

---

## Variables de entorno

Archivo base `.env.example`:
```
PORT=3000
DATABASE_URL=postgresql://it_ops_db:it_ops_password@localhost:5432/it_ops
JWT_SECRET=change_me
```
Clona `.env.example` a `.env` en `backend/` y ajusta credenciales.

## Preparar la base de datos (manual)

La app no crea la BD ni las tablas. Antes de arrancar el backend, conectate a PostgreSQL con el usuario de tu `DATABASE_URL` y ejecuta:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT,
  priority TEXT,
  severity TEXT,
  category TEXT,
  reported_by TEXT,
  assigned_to TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usuario admin: admin@test.com / 123456 (hash bcrypt)
INSERT INTO users (email, password)
VALUES ('admin@test.com', '$2b$10$isyEwwhOujGyyXxoSxjw/uvJTCX8jKhEzbUaQJ.NdGUMQZfzGBD0a');
```

Ejemplo de conexion:
```bash
psql -h localhost -U postgres -d it_ops_db
```

---

## Correr el proyecto (local)

### Backend
```bash
cd backend
npm install
node server.js
```
O exportando la URL (PowerShell):
```powershell
$env:DATABASE_URL="postgresql://it_ops_db:it_ops_password@localhost:5432/it_ops"
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Endpoints de prueba (PowerShell)

Obtener token:
```powershell
$token = (Invoke-RestMethod -Method POST `
  -Uri http://localhost:3000/api/auth/login `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"admin@test.com","password":"123456"}').token
```

Crear incidente:
```powershell
Invoke-RestMethod -Method POST `
  -Uri http://localhost:3000/api/incidents `
  -Headers @{Authorization="Bearer $token";"Content-Type"="application/json"} `
  -Body '{"title":"Servidor caido","description":"Auth no responde","status":"Open","priority":"High","severity":"Critical","category":"Infrastructure","reported_by":"Monitoring","assigned_to":"Ops"}'
```

Listar:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/incidents -Headers @{Authorization="Bearer $token"}
```

Editar:
```powershell
Invoke-RestMethod -Method PUT `
  -Uri http://localhost:3000/api/incidents/1 `
  -Headers @{Authorization="Bearer $token";"Content-Type"="application/json"} `
  -Body '{"status":"In Progress","priority":"Medium","description":"Seguimiento en curso","severity":"Major","category":"Infra","reported_by":"NOC"}'
```

Eliminar:
```powershell
Invoke-RestMethod -Method DELETE -Uri http://localhost:3000/api/incidents/1 -Headers @{Authorization="Bearer $token"}
```

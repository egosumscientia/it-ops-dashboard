# IT Ops Dashboard

Aplicación web simple para la gestión y visualización de incidentes técnicos.  
El proyecto prioriza claridad, estabilidad y mantenibilidad, manteniendo una complejidad baja pero con señales claras de seniority.

---

## Objetivo

- Gestionar incidentes técnicos de forma estructurada
- Visualizar métricas operativas básicas
- Demostrar uso correcto de un ORM sin sobre-abstracción
- Mantener un código fácil de entender, ejecutar y extender

Proyecto diseñado exclusivamente como **portafolio Senior**.

---

## Stack

### Backend
- Node.js
- Express
- PostgreSQL
- **Prisma ORM**
- JWT simple
- Logging básico (`console`)

### Frontend
- React
- Vite
- React Router
- Fetch API
- CSS plano

Dependencias mínimas y bien conocidas.

---

## Funcionalidades

### Autenticación
- Login con JWT
- Middleware de protección de rutas

### Incidentes
- Crear incidente
- Listar incidentes
- Actualizar estado
- Eliminar incidente

Estados:
- Open
- In Progress
- Closed

Prioridad:
- Low
- Medium
- High

### Dashboard
- Incidentes por estado
- Incidentes por prioridad

Sin métricas complejas ni cálculos pesados.

---

## Arquitectura

### Backend

backend/
├── prisma/
│ └── schema.prisma
├── src/
│ ├── routes/
│ ├── controllers/
│ ├── services/
│ ├── middlewares/
│ └── app.js
└── server.js


Criterios:
- Prisma solo como capa de persistencia
- Servicios con lógica mínima
- Controladores delgados
- Sin patrones innecesarios

### Frontend
frontend/
├── src/
│ ├── pages/
│ ├── components/
│ └── App.jsx


Enfoque:
- Estado local
- Componentes pequeños
- Comunicación directa con API REST

---

## Modelo de datos

### User
- id
- email
- password
- createdAt

### Incident
- id
- title
- status
- priority
- createdAt
- updatedAt

---

## Variables de entorno

Archivo `.env.example`:

PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/it_ops
JWT_SECRET=change_me


---

## Ejecución local

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
node server.js

### Frontend 
cd frontend
npm install
npm run dev

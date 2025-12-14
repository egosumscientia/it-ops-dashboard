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



### Procedimiento de prueba
Login → obtener token

Crear incidente

Listar incidentes

Actualizar incidente

Eliminar incidente

Confirmar lista vacía

1️⃣ LOGIN (obtener token)
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@test.com","password":"123456"}'

Salida esperada:
{"token":"TOKEN_REAL"}

👉 Copia el token completo y úsalo en los siguientes comandos.

2️⃣ CREAR INCIDENTE
curl -X POST http://localhost:3000/api/incidents -H "Authorization: Bearer TOKEN_REAL" -H "Content-Type: application/json" -d '{"title":"Servidor caído","status":"Open","priority":"High"}'

Salida esperada:
{"id":1,"title":"Servidor caído","status":"Open","priority":"High",...}

3️⃣ LISTAR INCIDENTES
curl http://localhost:3000/api/incidents -H "Authorization: Bearer TOKEN_REAL"

Salida esperada:
[{"id":1,"title":"Servidor caído","status":"Open","priority":"High",...}]


4️⃣ ACTUALIZAR INCIDENTE
curl -X PUT http://localhost:3000/api/incidents/1 -H "Authorization: Bearer TOKEN_REAL" -H "Content-Type: application/json" -d '{"status":"In Progress","priority":"Medium"}'

Salida esperada:
{"id":1,"status":"In Progress","priority":"Medium",...}


5️⃣ ELIMINAR INCIDENTE
curl -X DELETE http://localhost:3000/api/incidents/1 -H "Authorization: Bearer TOKEN_REAL"

Salida esperada:
204 No Content

6️⃣ CONFIRMAR QUE NO HAY INCIDENTES
curl http://localhost:3000/api/incidents -H "Authorization: Bearer TOKEN_REAL"

Salida esperada:
[]

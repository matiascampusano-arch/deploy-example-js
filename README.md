# Actividad práctica - Webinar 1, Sprint 15 (JavaScript)

Proyecto de apoyo para la actividad "Construye el flujo de login (con JavaScript)". Incluye una API de autenticación de práctica y un frontend React con JavaScript/JSX para completar durante el webinar.

El guion completo para el instructor está en [GUIA_PASO_A_PASO.md](GUIA_PASO_A_PASO.md).

## Estructura

```
actividad-login-ts/
├── GUIA_PASO_A_PASO.md       <- guion para el instructor
├── backend/                  <- API de autenticación de práctica (Express)
│   └── server.js
└── frontend/                 <- proyecto React + JavaScript (Vite)
    ├── src/
    │   ├── services/auth.js         (Paso 2 - con TODOs)
    │   ├── context/AuthContext.jsx  (Paso 3 - para recorrer)
    │   ├── hooks/useAuth.js         (Paso 4 - con TODO)
    │   ├── pages/LoginPage.jsx      (Paso 5 y 6 - con TODO)
    │   ├── pages/RegisterPage.jsx   (ya completo, sirve de referencia)
    │   └── pages/HomePage.jsx       (ya completo)
    └── solucion/              <- versión resuelta de los archivos del taller
```

## Cómo correrlo

Abrí dos terminales, una para el backend y otra para el frontend.

**1. Backend - puerto 3000**

```bash
cd backend
npm install
npm start
```

Vas a ver: `API de autenticación de práctica escuchando en http://localhost:3000`.

**2. Frontend - puerto 5173**

```bash
cd frontend
npm install
npm run dev
```

Abrí `http://localhost:5173` en el navegador. El proyecto usa JavaScript y JSX.

## Comprobar la aplicación

Al finalizar los pasos, podés validar que Vite empaqueta la aplicación:

```bash
cd frontend
npm run build
```

Luego probá el flujo completo: `/registro` crea una cuenta, `/login` inicia sesión y `/` muestra el email de la cuenta autenticada. En DevTools > Network se ven las tres peticiones: `/signup`, `/signin` y `/users/me`.

## Solución de respaldo

La carpeta `frontend/solucion/` contiene las versiones resueltas en JavaScript de `services/auth`, `context/AuthContext`, `hooks/useAuth` y `pages/LoginPage`. No forma parte de la aplicación que corre; sirve para recuperar la actividad en vivo.

## Notas

- Los usuarios viven en memoria en el backend: se pierden al reiniciar `npm start`.
- Esta actividad no restaura la sesión al recargar ni protege rutas. Es contenido del Webinar 2.

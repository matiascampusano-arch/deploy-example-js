# Guía paso a paso - Actividad "Construye el flujo de login (con JavaScript)"

Webinar 1, Sprint 15. Duración estimada: 20 minutos.

Antes de comenzar, iniciá el backend (`cd backend && npm start`) y el frontend (`cd frontend && npm run dev`). Abrí `http://localhost:5173/registro`.

La actividad usa JavaScript y JSX. El foco es seguir los datos entre la API, el contexto y los componentes. Podés ejecutar `npm run build` al terminar para comprobar que Vite puede empaquetar la aplicación.

## Paso 1 - Identificar los datos del flujo

Mostrá `frontend/src/services/auth.js`. Antes de escribir código, repasá qué devuelve cada llamada:

```js
// POST /signup
{ user: { _id: "...", email: "alguien@email.com" } }

// POST /signin
{ token: "..." }

// GET /users/me, con Authorization: Bearer <token>
{ _id: "...", email: "alguien@email.com" }
```

JavaScript no declara estas formas de datos. Por eso el nombre de las variables y el recorrido de los datos son importantes: `token` sirve para pedir el usuario, y `user` es lo que se guarda como estado de la sesión.

## Paso 2 - Implementar registro e inicio de sesión

Archivo: `frontend/src/services/auth.js`.

`authRequest` y `getCurrentUser` ya están listos. Implementá los dos TODOs:

```js
export async function registerUser(email, password) {
  const { user } = await authRequest("/signup", { email, password });
  return user;
}

export async function loginUser(email, password) {
  const { token } = await authRequest("/signin", { email, password });
  const user = await getCurrentUser(token);
  return { token, user };
}
```

Crear una cuenta requiere una petición. Iniciar sesión requiere dos: primero se obtiene el token y luego se usa en `Authorization` para preguntar quién es el usuario.

**Verificación en vivo:** registrá una cuenta en `/registro`. La app debería redirigir a `/login`. En DevTools > Network, confirmá la petición `POST /signup`.

## Paso 3 - Revisar el estado compartido de autenticación

Archivo: `frontend/src/context/AuthContext.jsx`.

Recorré el provider sin cambiar código. Es el límite entre la API y las pantallas:

```jsx
const [currentUser, setCurrentUser] = useState(null);

const value = {
  currentUser,
  isAuthenticated: Boolean(currentUser),
  login,
  logout,
};

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

`login` recibe las credenciales desde el formulario, llama al servicio, guarda el token y actualiza el estado. `logout` elimina ambos rastros de la sesión. Los componentes que consumen el contexto no necesitan conocer `localStorage` ni las URLs de la API.

## Paso 4 - Proteger el hook `useAuth`

Archivo: `frontend/src/hooks/useAuth.js`.

Completá el hook para que detecte un uso fuera de `<AuthProvider>`:

```js
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>.");
  }
  return context;
}
```

El hook concentra una regla de la aplicación. Así las páginas pueden hacer `const { login } = useAuth()` y el error, si existe, queda claro y cerca de su causa.

## Paso 5 - Conectar el formulario de login

Archivo: `frontend/src/pages/LoginPage.jsx`.

El formulario ya controla `email`, `password`, `error` e `isSubmitting`. Completá `handleSubmit`:

```js
async function handleSubmit(event) {
  event.preventDefault();
  setError("");
  setIsSubmitting(true);
  try {
    await login(email, password);
    navigate("/");
  } catch (error) {
    setError(
      error instanceof Error ? error.message : "No se pudo iniciar sesión.",
    );
  } finally {
    setIsSubmitting(false);
  }
}
```

`preventDefault()` evita que el navegador recargue la página. El bloque `finally` se ejecuta tanto si el login funciona como si falla, y vuelve a habilitar el botón.

**Verificación en vivo:** iniciá sesión con la cuenta creada. Debés terminar en `/` viendo el email. En Network deben aparecer, en este orden, `POST /signin` y `GET /users/me`.

## Paso 6 (bonus) - Darle más contexto al estado de la petición

Un booleano solo expresa dos situaciones. Si sobra tiempo, reemplazá `isSubmitting` por un estado con nombres explícitos:

```js
const REQUEST_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const [status, setStatus] = useState(REQUEST_STATUS.IDLE);
const isSubmitting = status === REQUEST_STATUS.LOADING;
```

Usá `setStatus(REQUEST_STATUS.LOADING)` antes del `try`, `SUCCESS` después del login y `ERROR` en el `catch`. Para mostrar el mensaje, comprobá `status === REQUEST_STATUS.ERROR`.

Aunque JavaScript no impone una unión de tipos, agrupar los valores posibles en una constante evita strings dispersos y vuelve más legible el flujo de la interfaz.

## Resumen para el debrief final

El flujo completo es: `/registro` crea la cuenta, `/login` obtiene un token, `/users/me` identifica al usuario y el contexto comparte esa sesión con `HomePage`. El token solo viaja en la tercera petición. Como cierre, ejecutá `npm run build` dentro de `frontend/`; debe terminar sin errores.

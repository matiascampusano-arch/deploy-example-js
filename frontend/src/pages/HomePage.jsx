import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

export function HomePage() {
  const { currentUser, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="card">
        <h1>Bienvenido</h1>
        <p>Todavía no iniciaste sesión.</p>
        <p>
          <Link to="/login">Iniciar sesión</Link> ·{" "}
          <Link to="/registro">Registrarme</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>¡Hola, {currentUser?.email}!</h1>
      <p>Tu sesión está activa. Esto es lo que ve un usuario autenticado.</p>
      <button onClick={logout}>Cerrar sesión</button>
      <button
        onClick={async () => {
          try {
            const data = await api.request("/users/me");
            console.log(data);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Obtener mi información
      </button>
    </div>
  );
}

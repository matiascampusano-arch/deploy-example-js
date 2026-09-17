import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/hooks/useAuth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const { login } = useAuth();
  const navigate = useNavigate();
  const isValid = email.includes("@") && password.length >= 6;
  const isSubmitting = status === "loading";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setStatus("loading");
    try {
      await login(email, password);
      setStatus("success");
      navigate("/");
    } catch (error) {
      setStatus("error");
      setError(
        error instanceof Error ? error.message : "No se pudo iniciar sesión.",
      );
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />
      </label>
      {status === "error" && <p className="error">{error}</p>}
      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
      </button>
      <p>
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </form>
  );
}

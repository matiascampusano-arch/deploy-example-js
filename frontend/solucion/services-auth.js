const AUTH_BASE_URL = "http://localhost:3000";

async function authRequest(path, body) {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Ocurrió un error inesperado.");
  }
  return response.json();
}

export async function getCurrentUser(token) {
  const response = await fetch(`${AUTH_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("No se pudo verificar la sesión.");
  return response.json();
}

export async function registerUser(email, password) {
  const { user } = await authRequest("/signup", { email, password });
  return user;
}

export async function loginUser(email, password) {
  const { token } = await authRequest("/signin", { email, password });
  const user = await getCurrentUser(token);
  return { token, user };
}

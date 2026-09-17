class Api {
  constructor(baseUrl, headers = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  setToken(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }

  async request(path, options = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: { ...this.headers, ...options.headers },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Ocurrió un error inesperado.");
    }

    return response.json();
  }
}

export const api = new Api("http://localhost:3000", {
  "Content-Type": "application/json",
});

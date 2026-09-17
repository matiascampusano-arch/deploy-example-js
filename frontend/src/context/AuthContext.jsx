import { createContext, useState } from "react";
import { loginUser, getCurrentUser } from "../services/auth";
import { api } from "../services/api";
import { useEffect } from "react";

const TOKEN_KEY = "sprint15-jwt";

export const AuthContext = createContext(undefined);

// PASO 3: revisá las responsabilidades del provider y el objeto value.
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(email, password) {
    const { token, user } = await loginUser(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setCurrentUser(user);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser(token)
      .then(setCurrentUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => {
        api.setToken(token);
        setIsLoading(false);
      });
  }, []);

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

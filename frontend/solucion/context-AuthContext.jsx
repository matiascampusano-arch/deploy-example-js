import { createContext, useState } from "react";
import { loginUser } from "../src/services/auth";

const TOKEN_KEY = "sprint15-jwt";
export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  async function login(email, password) {
    const { token, user } = await loginUser(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setCurrentUser(user);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

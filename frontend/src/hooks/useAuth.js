import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// PASO 4: agregá una comprobación para dar un error claro fuera del provider.
export function useAuth() {
  return useContext(AuthContext);
}

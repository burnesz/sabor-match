import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthWrapper({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <p>Carregando...</p>; // opcional, enquanto verifica o token

  if (!token) return <Navigate to="/login" />; // se não tiver token, manda pro login

  return children; // se tiver token, renderiza normalmente
}

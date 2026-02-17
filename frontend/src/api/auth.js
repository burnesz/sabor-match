const API_URL = "http://localhost:8000/auth";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || "E-mail ou senha inválidos";
    
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function register(nome, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || "Falha ao realizar cadastro";
    
    throw new Error(errorMessage);
  }
  return response.json();
}
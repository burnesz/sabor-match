const API_URL = "http://localhost:8000/auth";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Login inválido");
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
    throw new Error("Erro ao cadastrar usuário");
  }
  return response.json();
}
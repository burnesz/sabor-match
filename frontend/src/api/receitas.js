const API_URL = "http://localhost:8000/receitas";

export async function novaReceita(form) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/nova-receita`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });
  if (!response.ok) {
    throw new Error("Erro ao criar nova receita");
  }
  return response.json();
}

export async function listaCategorias() {
  const response = await fetch(`${API_URL}/listar_categorias`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  if (!response.ok) {
    throw new Error("Erro ao listar categorias, contate o suporte");
  }
  return response.json();
}

export async function listaReceitasCarrossel() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/minhas-receitas/carrossel`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Erro ao listar receitas recentes, contate o suporte");
  }
  return response.json();
}
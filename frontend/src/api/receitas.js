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

export async function obterReceita(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Erro ao obter receita");
  }
  return response.json();
}

export async function listarReceitasFavoritas() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/receitas-favoritas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Erro ao listar receitas favoritas");
  }
  return response.json();
}

export async function favoritarReceita(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/favoritar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Erro ao favoritar receita");
  }
  return response.json();
}

export async function desfavoritarReceita(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/favoritar`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Erro ao desfavoritar receita");
  }
}

export async function listaReceitasRecentes() {
  const response = await fetch(`${API_URL}/recentes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Erro ao listar receitas recentes");
  }
  return response.json();
}

export async function listaReceitasRecomendadas() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/recomendadas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Erro ao listar receitas recomendadas");
  }
  return response.json();
}
export async function verificarFavorita(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/favoritada`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Erro ao verificar se receita é favorita");
  }
  return response.json();
}
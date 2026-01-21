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
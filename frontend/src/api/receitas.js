const API_URL = "http://localhost:8000/receitas";

export async function novaReceita(form) {
  const formData = new FormData();
  formData.append("titulo", form.titulo);
  formData.append("descricao", form.descricao);
  formData.append("tempo", form.tempo);
  formData.append("porcoes", form.porcoes);
  formData.append("ingredientes", form.ingredientes);
  formData.append("categoria", form.categoria);
  if (form.imagem_arquivo) {
    formData.append("imagem_arquivo", form.imagem_arquivo);
  }

  const response = await fetch(`${API_URL}/nova-receita`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Erro ao criar nova receita");
  }
  return response.json();
}
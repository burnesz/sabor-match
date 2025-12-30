const API_URL = "http://localhost:8000/uploads";

export async function uploadImagemReceita(imagem) {
  const formData = new FormData();
  formData.append("imagem", imagem);
  const response = await fetch(`${API_URL}/nova-receita-imagem`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Erro fazer upload da imagem da receita");
  }
  return response.json();
}
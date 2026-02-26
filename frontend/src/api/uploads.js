const API_URL = "http://localhost:8000/uploads";

export async function uploadImagemReceita(imagem) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("imagem", imagem);
  
  const response = await fetch(`${API_URL}/nova-receita-imagem`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Erro ao fazer upload da imagem da receita");
  }
  return response.json();
}

export async function uploadImagemPerfil(imagem) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("imagem", imagem);
  
  const response = await fetch(`${API_URL}/perfil-imagem`, {
    method: "POST",
    headers : {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Erro ao fazer upload da imagem de perfil");
  }
  return response.json();
}
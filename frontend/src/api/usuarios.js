const API_URL = import.meta.env.VITE_SABOR_MATCH_BACKEND + "/usuarios";

export const buscarPerfilUsuario = async (usuario_id) => {
  const response = await fetch(`${API_URL}/${usuario_id}/perfil`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error("Usuário não encontrado");
  }
  
  return await response.json();
};
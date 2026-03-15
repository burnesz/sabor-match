const API_URL = import.meta.env.VITE_SABOR_MATCH_BACKEND + "/auth";

export async function login(email, password) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error(
      "E-mail inválido, o e-mail deve conter '@' e um domínio. Ex: email@example.com"
    );
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // tenta extrair a mensagem de erro do servidor
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || "E-mail ou senha inválidos";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    // verifica se é erro de rede
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new Error(
        "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde."
      );
    }
    // re-lança outros erros
    throw err;
  }
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

export async function updateUser(userData) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || "Falha ao atualizar dados";

    throw new Error(errorMessage);
  }
  return response.json();
}

export async function validateToken(storedToken) {
  const response = await fetch(`${API_URL}/validate-token`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${storedToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || "Falha ao validar token";

    throw new Error(errorMessage);
  }
  return response.json();
}
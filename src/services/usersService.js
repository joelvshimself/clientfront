const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token.trim()}` : "";
};

export const getUsuarios = async () => {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("No autorizado o error en la petición");
  }
  return await response.json();
};

export const createUsuario = async (usuario) => {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
  });
  return response.ok;
};

export const updateUsuario = async (id, usuario) => {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getToken()
    },
    body: JSON.stringify(usuario)
  });
  return response.ok;
};

export const deleteUsuario = async (id) => {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Authorization": getToken()
    }
  });
  return response.ok;
};

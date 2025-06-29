const API_URL = process.env.VITE_API_URL;

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

export const updateSelf = async (id, payload) => {
  try {
    const res = await fetch(`${API_URL}/updateSelf`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      credentials: "include" // <-- Ensures cookies (like Auth) are sent
    });

    return res.ok;
  } catch (error) {
    console.error("Error updating self:", error);
    return false;
  }
};

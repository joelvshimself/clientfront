const API_URL = import.meta.env.VITE_API_URL;

// Login
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Para cookie
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: "Error en la conexión con el servidor", error };
  }
};

// Register
const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // optional but safe to include
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: "Error en la conexión con el servidor", error };
  }
};

// Check if user is authenticated (based on backend session)
const isAuthenticated = async () => {
  try {
    const response = await fetch(`${API_URL}/check-auth`, {
      method: "GET",
      credentials: "include", // 👈 get cookies
    });

    return response.ok;
  } catch {
    return false;
  }
};

// Logout (clear cookie via backend)
const logout = async () => {
  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  }
};

export { login, register, logout, isAuthenticated };

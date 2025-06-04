// ventaService.js
import axios from "axios";

const BASE_URL = process.env.VITE_API_URL;

export const venderProductos = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/vender`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al vender productos:", error.response?.data || error.message);
    throw error;
  }
};

export const getVentas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/ventas`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ventas:", error.response?.data || error.message);
    throw error;
  }
};

export const eliminarVenta = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/ventas/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar venta:", error.response?.data || error.message);
    throw error;
  }
};

export const editarVenta = async (id, productos) => {
  try {
    const response = await axios.put(`${BASE_URL}/ventas/${id}`, { productos }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al editar venta:", error.response?.data || error.message);
    throw error;
  }
};

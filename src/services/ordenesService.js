// src/services/ordenesService.js
import axios from "axios";

const BASE_URL = process.env.VITE_API_URL;

export const getOrdenes = async () => {
  const response = await axios.get(`${BASE_URL}/ordenes`, {
    withCredentials: true,
  });
  return response.data;
};

export const createOrden = async (ordenData) => {
  try {
    const response = await axios.post(`${BASE_URL}/nuevaorden`, ordenData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear orden:", error.response?.data || error.message);
    return null;
  }
};

export const deleteOrden = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/ordenes/${id}`, {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error al eliminar orden:", error.response?.data || error.message);
    return false;
  }
};

export const updateOrden = async (id, datos) => {
  try {
    const response = await axios.put(`${BASE_URL}/ordenes/${id}`, datos, {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error al actualizar orden:", error.response?.data || error.message);
    return false;
  }
};

export const completarOrden = async (id, fecha_recepcion) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/completarorden/${id}`,
      { fecha_recepcion },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al completar orden:", error.response?.data || error.message);
    throw error;
  }
};

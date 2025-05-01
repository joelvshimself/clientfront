// src/services/ordenesService.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const getOrdenes = async () => {
  const response = await axios.get(`${BASE_URL}/ordenes`);
  return response.data;
};

export const createOrden = async (ordenData) => {
  try {
    const response = await axios.post(`${BASE_URL}/nuevaorden`, ordenData);
    return response.data;
  } catch (error) {
    console.error(" Error al crear orden:", error.response?.data || error.message);
    return null;
  }
};
export const deleteOrden = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/ordenes/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error al eliminar orden:", error.response?.data || error.message);
    return false;
  }
};

export const updateOrden = async (id, datos) => {
  try {
    const response = await axios.put(`${BASE_URL}/ordenes/${id}`, datos);
    return response.status === 200;
  } catch (error) {
    console.error("Error al actualizar orden:", error.response?.data || error.message);
    return false;
  }
};
export const completarOrden = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/completarorden/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al completar orden:", error.response?.data || error.message);
    throw error;
  }
};

// src/services/notificacionesService.js
import axios from "axios";

const BASE_URL = process.env.VITE_API_URL;

export const crearNotificacion = async (notificacionData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/notificaciones`,
      notificacionData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear notificación:", error.response?.data || error.message);
    return null;
  }
};

export const getNotificaciones = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/notificaciones`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener notificaciones:", error.response?.data || error.message);
    return [];
  }
};

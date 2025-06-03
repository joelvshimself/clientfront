import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getForecast = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      withCredentials: true, // This allows cookies to be sent
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener datos de pronóstico:",
      error.response?.data || error.message
    );
    return [];
  }
};

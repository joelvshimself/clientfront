import axios from "axios";

const BASE_URL = "http://localhost:3000/api"; // cambia el puerto si tu backend corre en otro

export const venderProductos = async (productos) => {
    try {
        const response = await axios.post(`${BASE_URL}/vender`, { productos });
        return response.data;
    } catch (error) {
        console.error("Error al vender productos:", error.response?.data || error.message);
        throw error;
    }
};

export const getVentas = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/ventas`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener ventas:", error.response?.data || error.message);
        throw error;
    }
};

export const eliminarVenta = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/ventas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar venta:", error.response?.data || error.message);
        throw error;
    }
};
export const editarVenta = async (id, productos) => {
    try {
        const response = await axios.put(`${BASE_URL}/ventas/${id}`, { productos });
        return response.data;
    } catch (error) {
        console.error("❌ Error al editar venta:", error.response?.data || error.message);
        throw error;
    }
};

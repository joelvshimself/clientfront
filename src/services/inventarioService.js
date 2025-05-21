import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function getInventario() {
  return axios
    .get(`${API}/api/inventario`)
    .then(res => res.data);
}

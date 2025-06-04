// src/services/inventarioService.js

import axios from "axios";

const API = process.env.VITE_API_URL || "http://localhost:3000";

export function getInventario() {
  return axios
    .get(`${API}/inventario`, {
      withCredentials: true,
    })
    .then(res => res.data);
}

export function getInventarioVendido() {
  return axios
    .get(`${API}/inventario/vendido`, {
      withCredentials: true,
    })
    .then(res => res.data);
}

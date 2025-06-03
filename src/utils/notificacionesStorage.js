// src/utils/notificacionesStorage.js

const STORAGE_KEY = "notificaciones";

/**
 * Devuelve el array de notificaciones almacenado en localStorage.
 * @returns {Array<{id:number, mensaje:string, tipo:string}>}
 */
export const obtenerNotificaciones = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
};

/**
 * Persiste en localStorage el array recibido.
 * @param {Array<{id:number, mensaje:string, tipo:string}>} notificaciones
 */
export const guardarNotificaciones = (notificaciones) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notificaciones));
  } catch (error) {
    console.error("Error al guardar notificaciones:", error);
  }
};

/**
 * Elimina la notificación con el id indicado y devuelve el array resultante.
 * @param {number} id
 * @returns {Array} Array actualizado sin la notificación borrada.
 */
export const eliminarNotificacionStorage = (id) => {
  const actuales = obtenerNotificaciones();
  const nuevas = actuales.filter((n) => n.id !== id);
  guardarNotificaciones(nuevas);
  return nuevas;
};

/**
 * 🧹 Borra TODAS las notificaciones del localStorage.
 * Úsala, por ejemplo, al hacer logout.
 */
export const limpiarNotificaciones = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error al limpiar notificaciones:", error);
  }
};

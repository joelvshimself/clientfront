// src/utils/notificacionesStorage.js

const STORAGE_KEY = "notificaciones";

// Obtener notificaciones guardadas
export const obtenerNotificaciones = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error("Error al obtener notificaciones del localStorage:", e);
    return [];
  }
};

// Guardar lista completa
export const guardarNotificaciones = (notificaciones) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notificaciones));
};

// Agregar una notificación nueva
export const agregarNotificacionStorage = (tipo, mensaje) => {
  const actuales = obtenerNotificaciones();
  const nueva = {
    id: Date.now(),
    mensaje,
    tipo,
  };
  const actualizadas = [...actuales, nueva];
  guardarNotificaciones(actualizadas);
  return actualizadas;
};

// Limpiar (si necesitas eliminar todas)
export const limpiarNotificaciones = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const eliminarNotificacionStorage = (id) => {
  // Obtenemos las notificaciones del localStorage
  const notificaciones = JSON.parse(localStorage.getItem("notificaciones")) || [];

  // Filtramos la notificación con el id proporcionado
  const nuevasNotificaciones = notificaciones.filter((noti) => noti.id !== id);

  // Guardamos las notificaciones actualizadas en el localStorage
  localStorage.setItem("notificaciones", JSON.stringify(nuevasNotificaciones));

  return nuevasNotificaciones;  // Devolvemos las notificaciones actualizadas
};


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
    id: crypto.randomUUID(), // ✅ ID único más robusto que Date.now()
    mensaje,
    tipo,
    fecha: new Date().toISOString(), // (opcional) puedes mostrar la hora después
  };

  const actualizadas = [...actuales, nueva];
  guardarNotificaciones(actualizadas);
  return actualizadas;
};

// Eliminar una notificación por ID
export const eliminarNotificacionStorage = (id) => {
  const actuales = obtenerNotificaciones();
  const nuevas = actuales.filter((noti) => noti.id !== id);
  guardarNotificaciones(nuevas);
  return nuevas;
};

// Limpiar todas las notificaciones
export const limpiarNotificaciones = () => {
  localStorage.removeItem(STORAGE_KEY);
};

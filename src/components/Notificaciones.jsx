import toast from "react-hot-toast";
import { guardarNotificaciones } from "../utils/notificacionesStorage";
import { crearNotificacion } from "../services/notificacionesService"; // 🔥 Añadido

export const mensajesNotificaciones = {
  exito: "Operación exitosa",
  info: "Mensaje informativo",
  error: "Operación fallida",
};

export const agregarNotificacion = async (tipo, mensaje, setNotificaciones) => {
  const nueva = { tipo, mensaje, id: Date.now() };

  // 🔄 Actualizar estado local y persistencia
  setNotificaciones((prev) => {
    const actualizadas = [...prev, nueva];
    guardarNotificaciones(actualizadas);
    return actualizadas;
  });

  // 🔔 Mostrar toast
  switch (tipo) {
    case "success":
      toast.success(mensaje);
      break;
    case "info":
      toast(mensaje);
      break;
    case "warning":
      toast(mensaje, { icon: "⚠️" });
      break;
    case "error":
      toast.error(mensaje);
      break;
    default:
      toast(mensaje);
      break;
  }

  // 💾 Guardar también en la base de datos
  try {
    const payload = {
      tipo: String(tipo),
      mensaje: String(mensaje),
      // id_usuario: 1 // Si tienes el ID del usuario disponible, puedes usarlo aquí
    };

    const result = await crearNotificacion(payload);

    if (!result || result.error) {
      toast.error("Error al guardar en el servidor");
      console.error("Error en respuesta del servidor:", result);
    }
  } catch (error) {
    toast.error("Fallo la conexión con el servidor");
    console.error("Error al enviar notificación al servidor:", error);
  }
};

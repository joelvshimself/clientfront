// src/pages/Notificaciones.jsx
import toast from "react-hot-toast";
import { guardarNotificaciones } from "../utils/notificacionesStorage";

export const agregarNotificacion = (tipo, mensaje, setNotificaciones) => {
  const nueva = { tipo, mensaje, id: Date.now() };

  setNotificaciones((prev) => {
    const actualizadas = [...prev, nueva];
    guardarNotificaciones(actualizadas);
    return actualizadas;
  });

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
};

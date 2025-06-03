// Notificaciones.jsx
import toast from "react-hot-toast";

export const mensajesNotificaciones = {
  exito: "Operación exitosa",
  info: "Mensaje informativo",
  error: "Operación fallida",
};

export const agregarNotificacion = (tipo, mensaje, setNotificaciones) => {
  setNotificaciones((prev) => [
    ...prev,
    { tipo, mensaje, id: Date.now() },
  ]);

  // Mostrar el toast dependiendo del tipo
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

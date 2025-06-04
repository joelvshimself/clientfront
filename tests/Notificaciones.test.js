// tests/Notificaciones.test.js
import { agregarNotificacion } from "../src/components/Notificaciones";  // changed from components to pages
import * as notificacionesStorage from "../src/utils/notificacionesStorage";
import toast from "react-hot-toast";

// ✅ Mock de react-hot-toast
jest.mock("react-hot-toast", () => {
  const toast = jest.fn();
  toast.success = jest.fn();
  toast.error = jest.fn();
  return toast;
});

// ✅ Mock de guardarNotificaciones
jest.mock("../src/utils/notificacionesStorage", () => ({
  guardarNotificaciones: jest.fn(),
}));

describe("agregarNotificacion", () => {
  let setNotificacionesMock;

  beforeEach(() => {
    setNotificacionesMock = jest.fn((callback) => {
      const prev = [];
      const result = callback(prev);
      setNotificacionesMock.result = result;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("agrega una notificación de tipo 'success'", () => {
    agregarNotificacion("success", "Éxito!", setNotificacionesMock);

    expect(setNotificacionesMock).toHaveBeenCalled();
    expect(notificacionesStorage.guardarNotificaciones).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Éxito!");
  });

  test("agrega una notificación de tipo 'error'", () => {
    agregarNotificacion("error", "Ocurrió un error", setNotificacionesMock);

    expect(toast.error).toHaveBeenCalledWith("Ocurrió un error");
  });

  test("agrega una notificación de tipo 'info'", () => {
    agregarNotificacion("info", "Información general", setNotificacionesMock);

    expect(toast).toHaveBeenCalledWith("Información general");
  });

  test("agrega una notificación de tipo 'warning'", () => {
    agregarNotificacion("warning", "Cuidado", setNotificacionesMock);

    expect(toast).toHaveBeenCalledWith("Cuidado", { icon: "⚠️" });
  });

  test("agrega una notificación de tipo desconocido (default)", () => {
    agregarNotificacion("otro", "Mensaje genérico", setNotificacionesMock);

    expect(toast).toHaveBeenCalledWith("Mensaje genérico");
  });
});

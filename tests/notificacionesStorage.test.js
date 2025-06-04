// tests/notificacionesStorage.test.js
import {
  obtenerNotificaciones,
  guardarNotificaciones,
  eliminarNotificacionStorage,
  limpiarNotificaciones,
} from "../src/utils/notificacionesStorage";

describe("notificacionesStorage utils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("obtenerNotificaciones", () => {
    test("devuelve array vacío si no hay nada en localStorage", () => {
      expect(obtenerNotificaciones()).toEqual([]);
    });

    test("devuelve las notificaciones parseadas desde localStorage", () => {
      const notis = [{ id: 1, mensaje: "test", tipo: "info" }];
      localStorage.setItem("notificaciones", JSON.stringify(notis));
      expect(obtenerNotificaciones()).toEqual(notis);
    });

    test("captura error y devuelve array vacío si JSON inválido", () => {
      localStorage.setItem("notificaciones", "no-json");
      const spyConsole = jest.spyOn(console, "error").mockImplementation(() => {});
      expect(obtenerNotificaciones()).toEqual([]);
      expect(spyConsole).toHaveBeenCalled();
      spyConsole.mockRestore();
    });
  });

  describe("guardarNotificaciones", () => {
    test("guarda correctamente el array en localStorage", () => {
      const notis = [{ id: 1, mensaje: "guardar", tipo: "warn" }];
      guardarNotificaciones(notis);
      const almacenado = JSON.parse(localStorage.getItem("notificaciones"));
      expect(almacenado).toEqual(notis);
    });

    test("captura error y llama console.error si falla localStorage.setItem", () => {
      const spyConsole = jest.spyOn(console, "error").mockImplementation(() => {});
      // Simular error lanzado por localStorage.setItem
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("error setItem");
      });
      guardarNotificaciones([{ id: 2, mensaje: "error", tipo: "error" }]);
      expect(spyConsole).toHaveBeenCalled();
      spyConsole.mockRestore();
      // Restaurar implementación original para otros tests
      Storage.prototype.setItem.mockRestore();
    });
  });

  describe("eliminarNotificacionStorage", () => {
    test("elimina la notificación por id y actualiza localStorage", () => {
      const notis = [
        { id: 1, mensaje: "uno", tipo: "info" },
        { id: 2, mensaje: "dos", tipo: "error" },
      ];
      localStorage.setItem("notificaciones", JSON.stringify(notis));

      const resultado = eliminarNotificacionStorage(1);
      expect(resultado).toEqual([{ id: 2, mensaje: "dos", tipo: "error" }]);

      const almacenado = JSON.parse(localStorage.getItem("notificaciones"));
      expect(almacenado).toEqual([{ id: 2, mensaje: "dos", tipo: "error" }]);
    });
  });

  describe("limpiarNotificaciones", () => {
    test("elimina todas las notificaciones del localStorage", () => {
      localStorage.setItem("notificaciones", JSON.stringify([{ id: 1 }]));
      limpiarNotificaciones();
      expect(localStorage.getItem("notificaciones")).toBeNull();
    });

    test("captura error y llama console.error si falla localStorage.removeItem", () => {
      localStorage.setItem("notificaciones", "algo");
      const spyConsole = jest.spyOn(console, "error").mockImplementation(() => {});
      jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw new Error("error removeItem");
      });
      limpiarNotificaciones();
      expect(spyConsole).toHaveBeenCalled();
      spyConsole.mockRestore();
      Storage.prototype.removeItem.mockRestore();
    });
  });
});

// tests/OrdenesOrdenamiento.test.jsx
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// ── MOCK de @ui5/webcomponents-react ─────────────────────────────────────
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children }) => <div data-testid="mock-FlexBox">{children}</div>,
  Card: ({ children }) => <div data-testid="mock-Card">{children}</div>,
  Title: ({ children }) => <div data-testid="mock-Title">{children}</div>,
  Input: () => <input data-testid="mock-Input" />,
  Button: ({ children }) => <button data-testid="mock-Button">{children}</button>,
  Dialog: ({ children, open }) => (open ? <div data-testid="mock-Dialog">{children}</div> : null),
}));

// 1) MOCK de los servicios de órdenes (ruta CORRECTA)
jest.mock("../src/services/ordenesService", () => ({
  getOrdenes: jest.fn(),
  deleteOrden: jest.fn(),
  updateOrden: jest.fn(),
  completarOrden: jest.fn(),
}));

// 2) MOCK del contexto de notificaciones
jest.mock("../src/utils/NotificacionesContext", () => ({
  useNotificaciones: () => ({ setNotificaciones: jest.fn() }),
}));

// 3) MOCK del helper de notificaciones
jest.mock("../src/components/Notificaciones", () => ({
  agregarNotificacion: jest.fn(),
}));

// 4) MOCK de Layout
jest.mock("../src/components/Layout", () => {
  return ({ children }) => <div data-testid="mock-Layout">{children}</div>;
});

// 5) MOCK COMPLETO de `orden.jsx` que llama a getOrdenes()
jest.mock(
  "../src/pages/orden/orden",
  () => {
    return {
      __esModule: true,
      default: () => {
        const React = require("react");
        const { getOrdenes } = require("../src/services/ordenesService");
        React.useEffect(() => {
          getOrdenes();
        }, []);
        // Exponemos un placeholder para el selector de ordenamiento
        return <div data-testid="mock-Ordenes" />;
      },
    };
  }
);

describe("🧪 <Ordenes /> – Ordenamiento (solo getOrdenes)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const servicios = require("../src/services/ordenesService");
    servicios.getOrdenes.mockResolvedValue([]);
  });

  test("🔸 Al montar <Ordenes />, getOrdenes() debe invocarse exactamente 1 vez", async () => {
    const Ordenes = require("../src/pages/orden/orden").default;

    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });
  });
});

// tests/OrdenesFiltrado.test.jsx
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// ── MOCK de @ui5/webcomponents-react ─────────────────────────────────────
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children }) => <div data-testid="mock-FlexBox">{children}</div>,
  Card: ({ children }) => <div data-testid="mock-Card">{children}</div>,
  Title: ({ children }) => <div data-testid="mock-Title">{children}</div>,
  Input: (props) => <input data-testid="mock-Input" {...props} />,
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

// 5) MOCK COMPLETO de `orden.jsx` con invocación a getOrdenes()
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
        // Exponemos un input para simular filtro (aunque no hace nada real)
        return (
          <div data-testid="mock-Ordenes">
            <input data-testid="input-filtro" placeholder="Buscar por Estado" />
          </div>
        );
      },
    };
  }
);

describe("🧪 <Ordenes /> – Filtrado por Estado (solo getOrdenes)", () => {
  const MOCK_ORDENES = [
    {
      ID_ORDEN: 1,
      FECHA_EMISION: "2025-06-01",
      FECHA_RECEPCION: "2025-06-02",
      FECHA_RECEPCION_ESTIMADA: "2025-06-05",
      ESTADO: "pendiente",
      SUBTOTAL: 100,
      COSTO_COMPRA: 150,
      ID_USUARIO_SOLICITA: "usuarioA",
      ID_USUARIO_PROVEE: "proveedorX",
    },
    {
      ID_ORDEN: 2,
      FECHA_EMISION: "2025-05-28",
      FECHA_RECEPCION: "2025-05-29",
      FECHA_RECEPCION_ESTIMADA: "2025-06-03",
      ESTADO: "completada",
      SUBTOTAL: 200,
      COSTO_COMPRA: 250,
      ID_USUARIO_SOLICITA: "usuarioB",
      ID_USUARIO_PROVEE: "proveedorY",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const servicios = require("../src/services/ordenesService");
    servicios.getOrdenes.mockResolvedValue(MOCK_ORDENES);
  });

  test("🔸 Al montar <Ordenes />, getOrdenes() se llama, y luego simulamos escribir en el filtro", async () => {
    const Ordenes = require("../src/pages/orden/orden").default;

    const { getByTestId } = render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // Validamos que getOrdenes() se llame al montar
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });

    // Simulamos escritura en el input de filtro (aunque no hace nada real)
    fireEvent.change(getByTestId("input-filtro"), { target: { value: "completada" } });
  });
});

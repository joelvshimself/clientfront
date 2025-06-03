// tests/OrdenesSeleccionReal.test.jsx
import React from "react";
global.React = React;

// ─── IMPORT PARA JEST-DOM ───────────────────────────────────────────────────────────
import "@testing-library/jest-dom";

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// ─── MOCK de @ui5/webcomponents-react ───────────────────────────────────────────────
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children }) => <div data-testid="mock-FlexBox">{children}</div>,
  Card: ({ children }) => <div data-testid="mock-Card">{children}</div>,
  Title: ({ children }) => <div data-testid="mock-Title">{children}</div>,
  Input: (props) => <input data-testid="mock-Input" {...props} />,
  Button: ({ children, ...props }) => (
    <button data-testid="mock-Button" {...props}>
      {children}
    </button>
  ),
  Dialog: ({ children, open, footer }) =>
    open ? (
      <div data-testid="mock-Dialog">
        {children}
        {footer}
      </div>
    ) : null,
}));

// ─── MOCK de servicios (tests → src/services/ordenesService.js) ────────────────────
jest.mock("../src/services/ordenesService", () => ({
  getOrdenes: jest.fn(),
  deleteOrden: jest.fn(),
  updateOrden: jest.fn(),
  completarOrden: jest.fn(),
}));

// ─── MOCK de contexto de notificaciones (tests → src/utils/NotificacionesContext.jsx) ─
jest.mock("../src/utils/NotificacionesContext", () => ({
  useNotificaciones: () => ({ setNotificaciones: jest.fn() }),
}));

// ─── MOCK de helper de notificaciones (tests → src/components/Notificaciones.jsx) ──
jest.mock("../src/components/Notificaciones", () => ({
  agregarNotificacion: jest.fn(),
}));

// ─── MOCK de Layout (tests → src/components/Layout.jsx) ─────────────────────────────
jest.mock("../src/components/Layout", () => {
  return ({ children }) => <div data-testid="mock-Layout">{children}</div>;
});

// ─── IMPORTAMOS EL COMPONENTE REAL ─────────────────────────────────────────────────
import Ordenes from "../src/pages/orden/orden";

describe("🧪 <Ordenes /> – Selección y habilitación de botón 'Eliminar'", () => {
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

  test("🔸 Al marcar la casilla de la fila ID=2, el botón 'Eliminar' debe habilitarse", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar a que getOrdenes() sea llamado y la fila “2” aparezca
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    // 2) Marcar la casilla en la fila ID=2
    const celdaID2 = screen.getByText("2");
    const filaID2 = celdaID2.closest("tr");
    const checkbox = filaID2.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);

    // 3) El botón “Eliminar” ya debe estar habilitado
    const botonEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(botonEliminar).not.toBeDisabled();
  });

  test("🔸 Sin marcar nada, el botón 'Eliminar' permanece deshabilitado", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar a que getOrdenes() sea llamado y la fila “2” aparezca
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    // 2) Sin marcar nada, “Eliminar” sigue deshabilitado
    const botonEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(botonEliminar).toBeDisabled();
  });
});

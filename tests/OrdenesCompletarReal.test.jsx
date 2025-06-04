// tests/OrdenesCompletarReal.test.jsx
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

describe("🧪 <Ordenes /> – Completar una orden", () => {
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
    {
      ID_ORDEN: 3,
      FECHA_EMISION: "2025-06-03",
      FECHA_RECEPCION: "2025-06-04",
      FECHA_RECEPCION_ESTIMADA: "2025-06-07",
      ESTADO: "cancelada",
      SUBTOTAL: 50,
      COSTO_COMPRA: 80,
      ID_USUARIO_SOLICITA: "usuarioC",
      ID_USUARIO_PROVEE: "proveedorX",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const servicios = require("../src/services/ordenesService");
    servicios.getOrdenes.mockResolvedValue(MOCK_ORDENES);
    servicios.completarOrden.mockResolvedValue({}); // simulamos resolve vacío
  });

  test("🔸 Marcar la casilla de ID=2 y hacer clic en 'Completar' invoca completarOrden(2, fechaHoy)", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar a que getOrdenes() se llame y las filas aparezcan
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    // 2) Marcar la casilla de la fila ID=2
    const celdaID2 = screen.getByText("2");
    const filaID2 = celdaID2.closest("tr");
    const checkbox = filaID2.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);

    // 3) El botón “Completar” debe habilitarse y hacer clic en él
    const botonCompletar = screen.getByRole("button", { name: /Completar/i });
    expect(botonCompletar).not.toBeDisabled();
    fireEvent.click(botonCompletar);

    // 4) Al invocar “Completar”, completarOrden(2, fechaHoy) debe llamarse con ID=2
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.completarOrden).toHaveBeenCalledTimes(1);
      const llamado = servicios.completarOrden.mock.calls[0];
      expect(llamado[0]).toBe(2);

      // Para chequear la fecha, comparamos solo el prefijo "YYYY-MM-DD"
      const fechaHoy = llamado[1].slice(0, 10);
      const hoy = new Date();
      const yyyy = hoy.getFullYear().toString().padStart(4, "0");
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      expect(fechaHoy).toBe(`${yyyy}-${mm}-${dd}`);
    });
  });
});

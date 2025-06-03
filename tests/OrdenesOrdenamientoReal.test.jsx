// tests/OrdenesOrdenamientoReal.test.jsx
import React from "react";
global.React = React;

// ─── IMPORT PARA JEST-DOM ───────────────────────────────────────────────────────────
import "@testing-library/jest-dom";

import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// ─── MOCK de @ui5/webcomponents-react ───────────────────────────────────────────────
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children }) => <div data-testid="mock-FlexBox">{children}</div>,
  Card: ({ children }) => <div data-testid="mock-Card">{children}</div>,
  Title: ({ children }) => <div data-testid="mock-Title">{children}</div>,
  Input: () => <input data-testid="mock-Input" />,
  Button: ({ children }) => <button data-testid="mock-Button">{children}</button>,
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

describe("🧪 <Ordenes /> – Ordenamiento por 'estado'", () => {
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
  });

  test("🔸 Al seleccionar 'asc' en el select de 'Estado', la primera fila debe tener ID=3 (cancelada)", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar a que getOrdenes() se llame y la fila “3” aparezca
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    // 2) Ubicar <th> “Estado” y su <select>
    const thEstado = screen.getByText("Estado").closest("th");
    expect(thEstado).toBeInTheDocument();

    // 3) Cambiar el <select> a 'asc'
    const selectEstado = within(thEstado).getByRole("combobox");
    fireEvent.change(selectEstado, { target: { value: "asc" } });

    // 4) Con “asc” lexicográfico, “cancelada” va primero → ID=3
    await waitFor(() => {
      const filasDatos = screen.getAllByRole("row").filter((row) => {
        return row.querySelectorAll("td").length === 10;
      });
      const primeraFila = filasDatos[0];
      const textoID = primeraFila.querySelectorAll("td")[1].textContent;
      expect(textoID).toBe("3");
    });
  });

  test("🔸 Al seleccionar 'desc' en 'Estado', la primera fila debe tener ID=1 (pendiente)", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar a que getOrdenes() se llame y la fila “3” aparezca
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    // 2) Cambiar el <select> a 'desc'
    const thEstado = screen.getByText("Estado").closest("th");
    const selectEstado = within(thEstado).getByRole("combobox");
    fireEvent.change(selectEstado, { target: { value: "desc" } });

    // 3) En “desc” lexicográfico, “pendiente” va primero → ID=1
    await waitFor(() => {
      const filasDatos = screen.getAllByRole("row").filter((row) => {
        return row.querySelectorAll("td").length === 10;
      });
      const primeraFila = filasDatos[0];
      const textoID = primeraFila.querySelectorAll("td")[1].textContent;
      expect(textoID).toBe("1");
    });
  });
});

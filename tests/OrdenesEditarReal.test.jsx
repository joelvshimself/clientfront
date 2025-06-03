import React from "react";
global.React = React;

// ─── IMPORT PARA JEST-DOM (matchers como toBeDisabled, toBeInTheDocument, etc.) ───
import "@testing-library/jest-dom";

// ─── IMPORTS DE RTL Y REACT-ROUTER ─────────────────────────────────────────────────
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
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

describe("🧪 <Ordenes /> – Editar una orden", () => {
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
    {
      ID_ORDEN: 5,
      FECHA_EMISION: "2025-06-07",
      FECHA_RECEPCION: "2025-06-08",
      FECHA_RECEPCION_ESTIMADA: "2025-06-10",
      ESTADO: "pendiente",
      SUBTOTAL: 300,
      COSTO_COMPRA: 400,
      ID_USUARIO_SOLICITA: "usuarioD",
      ID_USUARIO_PROVEE: "proveedorZ",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const servicios = require("../src/services/ordenesService");
    servicios.getOrdenes.mockResolvedValue(MOCK_ORDENES);
    servicios.updateOrden.mockResolvedValue(true);
  });

  test("🔸 Marcar casilla ID=5, hacer clic en 'Editar', cambiar estado y 'Guardar' invoca updateOrden(5, payloadEditado)", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar a que getOrdenes() se llame y la fila “5” aparezca
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    // 2) Marcar la casilla de la fila ID=5
    const celdaID5 = screen.getByText("5");
    const filaID5 = celdaID5.closest("tr");
    const checkbox5 = filaID5.querySelector('input[type="checkbox"]');
    expect(checkbox5).toBeInTheDocument();
    fireEvent.click(checkbox5);

    // 3) El botón “Editar” debe habilitarse y hacemos clic en “Editar”
    const botonEditar = screen.getByRole("button", { name: /Editar/i });
    expect(botonEditar).not.toBeDisabled();
    fireEvent.click(botonEditar);

    // 4) Modificar el campo “Estado” dentro del diálogo y guardar
    const dialog = await screen.findByTestId("mock-Dialog");
    // Buscar el Input cuyo placeholder es "Estado" y cambiar su valor
    const inputEstado = within(dialog).getByPlaceholderText("Estado");
    expect(inputEstado).toHaveValue("pendiente"); // confirmamos valor inicial
    fireEvent.input(inputEstado, { target: { value: "cancelada" } });

    // Luego pulsamos en "Guardar"
    const botonGuardar = within(dialog).getByRole("button", { name: /Guardar/i });
    fireEvent.click(botonGuardar);

    // 5) Verificar que updateOrden(5, ...) se haya llamado con el payload correcto
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.updateOrden).toHaveBeenCalledTimes(1);

      const llamado = servicios.updateOrden.mock.calls[0];
      expect(llamado[0]).toBe(5);
      // El componente envía el campo en minúsculas: ordenEditar.estado
      expect(llamado[1].estado).toBe("cancelada");
    });
  });
});

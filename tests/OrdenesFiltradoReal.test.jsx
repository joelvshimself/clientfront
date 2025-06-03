import React from "react";
global.React = React;

// ─── MATCHERS DE jest-dom (toBeInTheDocument, toBeDisabled, etc.) ─────────────────────
import "@testing-library/jest-dom";

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// ─── MOCK de @ui5/webcomponents-react (incluyendo TODOS los controles que usa Ordenes) ─
jest.mock("@ui5/webcomponents-react", () => {
  const React = require("react");

  return {
    // Ya antes mockeábamos estos:
    FlexBox: ({ children }) => <div data-testid="mock-FlexBox">{children}</div>,
    Card:    ({ children }) => <div data-testid="mock-Card">{children}</div>,
    Title:   ({ children }) => <div data-testid="mock-Title">{children}</div>,
    Input:   (props)        => <input data-testid="mock-Input" {...props} />,
    Button:  ({ children, ...props }) => (
      <button data-testid="mock-Button" {...props}>{children}</button>
    ),

    // **Éstos nuevos hay que mockearlos si Ordenes.jsx los importa**:
    Table: ({ children })       => <table data-testid="mock-Table">{children}</table>,
    TableColumn: ({ children }) => <th data-testid="mock-TableColumn">{children}</th>,
    TableRow: ({ children })    => <tr data-testid="mock-TableRow">{children}</tr>,
    TableCell: ({ children })   => <td data-testid="mock-TableCell">{children}</td>,

    Select: (props) => (
      <select data-testid="mock-Select" {...props}>
        {props.children}
      </select>
    ),
    Option: ({ children, ...props }) => (
      <option data-testid="mock-Option" {...props}>{children}</option>
    ),

    Dialog: ({ children, open, header, footer }) =>
      open ? (
        <div data-testid="mock-Dialog">
          {header}
          {children}
          {footer}
        </div>
      ) : null,

    DialogHeader: ({ children }) => (
      <div data-testid="mock-DialogHeader">{children}</div>
    ),
    DialogFooter: ({ children }) => (
      <div data-testid="mock-DialogFooter">{children}</div>
    ),

    Label:     ({ children }) => <label data-testid="mock-Label">{children}</label>,
    Form:      ({ children }) => <form data-testid="mock-Form">{children}</form>,
    FormGroup: ({ children }) => <div data-testid="mock-FormGroup">{children}</div>,
    FormItem:  ({ children }) => <div data-testid="mock-FormItem">{children}</div>,
    // … continúa mockeando cualquier otro componente de UI5 que use Ordenes.jsx
  };
});

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

// ─── IMPORTAMOS EL COMPONENTE REAL (ajusta la ruta/nombre si tu archivo se llama Orden.jsx) ───
import Ordenes from "../src/pages/orden/orden";
// Si tu fichero se llama “Orden.jsx”, escribe:
//    import Ordenes from "../src/pages/orden/Orden";

describe("🧪 <Ordenes /> – Filtrado de órdenes (campo “estado”)", () => {
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

  test("🔸 Al escribir 'completada' en el filtro, solo debe verse la fila con estado 'completada'", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Espera a que getOrdenes() se llame y aparezcan las tres filas originales
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });

    // 2) Verifica que, antes del filtro, existan las tres filas
    await waitFor(() => {
      expect(screen.getByText("pendiente")).toBeInTheDocument();
      expect(screen.getByText("completada")).toBeInTheDocument();
      expect(screen.getByText("cancelada")).toBeInTheDocument();
    });

    // 3) Ubica el input de búsqueda (placeholder="Buscar por Estado")
    const inputBusqueda = screen.getByPlaceholderText("Buscar por Estado");
    expect(inputBusqueda).toBeInTheDocument();

    // 4) Simula que el usuario escribe “completada”
    fireEvent.input(inputBusqueda, { target: { value: "completada" } });

    // 5) Solo debe quedar visible la fila con ESTADO="completada"
    await waitFor(() => {
      expect(screen.getByText("completada")).toBeInTheDocument();
      expect(screen.queryByText("pendiente")).toBeNull();
      expect(screen.queryByText("cancelada")).toBeNull();
    });
  });
});

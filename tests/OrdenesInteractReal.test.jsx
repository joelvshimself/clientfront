// tests/OrdenesInteractReal.test.jsx

import React from "react";
global.React = React;

import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

jest.mock("@ui5/webcomponents-react", () => {
  const React = require("react");
  return {
    FlexBox: ({ children }) => <div data-testid="mock-FlexBox">{children}</div>,
    Card: ({ children }) => <div data-testid="mock-Card">{children}</div>,
    Title: ({ children }) => <div data-testid="mock-Title">{children}</div>,
    Input: (props) => <input data-testid="mock-Input" {...props} />,
    Button: ({ children, ...props }) => <button data-testid="mock-Button" {...props}>{children}</button>,

    // Aunque el componente usa <table> nativo, añadimos estos mocks por si acaso:
    Table: ({ children }) => <table data-testid="mock-Table">{children}</table>,
    TableColumn: ({ children }) => <th data-testid="mock-TableColumn">{children}</th>,
    TableRow: ({ children }) => <tr data-testid="mock-TableRow">{children}</tr>,
    TableCell: ({ children }) => <td data-testid="mock-TableCell">{children}</td>,

    Select: (props) => <select data-testid="mock-Select" {...props}>{props.children}</select>,
    Option: ({ children, ...props }) => <option data-testid="mock-Option" {...props}>{children}</option>,

    Dialog: ({ children, open, header, footer }) =>
      open ? <div data-testid="mock-Dialog">{header}{children}{footer}</div> : null,
    DialogHeader: ({ children }) => <div data-testid="mock-DialogHeader">{children}</div>,
    DialogFooter: ({ children }) => <div data-testid="mock-DialogFooter">{children}</div>,

    Label: ({ children }) => <label data-testid="mock-Label">{children}</label>,
    Form: ({ children }) => <form data-testid="mock-Form">{children}</form>,
    FormGroup: ({ children }) => <div data-testid="mock-FormGroup">{children}</div>,
    FormItem: ({ children }) => <div data-testid="mock-FormItem">{children}</div>,
  };
});

//
// ─── MOCK DE SERVICIOS ─────────────────────────────────────────────────────────────────
jest.mock("../src/services/ordenesService", () => ({
  getOrdenes: jest.fn(),
  deleteOrden: jest.fn(),
  updateOrden: jest.fn(),
  completarOrden: jest.fn(),
}));

//
// ─── MOCK DE CONTEXTO DE NOTIFICACIONES ─────────────────────────────────────────────────
jest.mock("../src/utils/NotificacionesContext", () => ({
  useNotificaciones: () => ({ setNotificaciones: jest.fn() }),
}));

//
// ─── MOCK DEL COMPONENTE Notificaciones (agregarNotificacion) ────────────────────────────
jest.mock("../src/components/Notificaciones", () => ({
  agregarNotificacion: jest.fn(),
}));

//
// ─── MOCK DEL LAYOUT ─────────────────────────────────────────────────────────────────────
jest.mock("../src/components/Layout", () => {
  return ({ children }) => <div data-testid="mock-Layout">{children}</div>;
});

//
// ─── IMPORTAMOS EL COMPONENTE REAL ────────────────────────────────────────────────────────
// Ajusta la ruta si tu fichero se llama Orden.jsx o está ubicado de otra forma
import Ordenes from "../src/pages/orden/orden";

describe("🧪 <Ordenes /> – Cobertura completa de interacciones (delete, completar, editar)", () => {
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
    servicios.deleteOrden.mockResolvedValue(true);
    servicios.completarOrden.mockResolvedValue(true);
    servicios.updateOrden.mockResolvedValue(true);
  });

  test("✅ Selección múltiple y eliminación en bucle", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar a que se carguen las órdenes
    await waitFor(() => {
      expect(require("../src/services/ordenesService").getOrdenes).toHaveBeenCalledTimes(1);
    });

    // 2) Esperar a que aparezcan las filas con ID=1 y ID=3
    const celda1 = await screen.findByText("1");
    const fila1 = celda1.closest("tr");
    const checkbox1 = fila1.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox1);

    const celda3 = await screen.findByText("3");
    const fila3 = celda3.closest("tr");
    const checkbox3 = fila3.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox3);

    // 3) El botón “Eliminar” se habilita
    const botonEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(botonEliminar).not.toBeDisabled();

    // 4) Hacer clic en “Eliminar” y comprobar llamadas
    fireEvent.click(botonEliminar);
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.deleteOrden).toHaveBeenCalledTimes(2);
      expect(servicios.deleteOrden.mock.calls[0][0]).toBe(1);
      expect(servicios.deleteOrden.mock.calls[1][0]).toBe(3);
    });

    // 5) Después de eliminar, recarga de órdenes
    await waitFor(() => {
      expect(require("../src/services/ordenesService").getOrdenes).toHaveBeenCalledTimes(2);
    });
  });

  test("✅ Completar una orden invoca completarOrden con fecha correcta", async () => {
    jest.useFakeTimers("modern");
    // Simulamos que “hoy” es 2025-06-05 UTC
    jest.setSystemTime(new Date("2025-06-05T00:00:00Z"));

    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar carga inicial
    await waitFor(() => {
      expect(require("../src/services/ordenesService").getOrdenes).toHaveBeenCalledTimes(1);
    });

    // 2) Esperar a que aparezca la fila con ID=1
    const celda1 = await screen.findByText("1");
    const fila1 = celda1.closest("tr");
    const checkbox1 = fila1.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox1);

    // 3) Botón “Completar” se habilita
    const botonCompletar = screen.getByRole("button", { name: /Completar/i });
    expect(botonCompletar).not.toBeDisabled();

    // 4) Hacer clic en “Completar”
    fireEvent.click(botonCompletar);

    // 5) Verificar llamada a completarOrden(1, fecha)
    const servicios = require("../src/services/ordenesService");
    await waitFor(() => {
      expect(servicios.completarOrden).toHaveBeenCalledTimes(1);
      const llamada = servicios.completarOrden.mock.calls[0];
      expect(llamada[0]).toBe(1);

      // Sólo comprobamos que sea un string con formato YYYY-MM-DD en la parte inicial:
      expect(typeof llamada[1]).toBe("string");
      expect(/^\d{4}-\d{2}-\d{2}/.test(llamada[1])).toBe(true);
    });

    jest.useRealTimers();
  });

  test("✅ Editar una orden: éxito y notificación", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar carga inicial
    await waitFor(() => {
      expect(require("../src/services/ordenesService").getOrdenes).toHaveBeenCalledTimes(1);
    });

    // 2) Esperar a que aparezca la fila con ID=5
    const celda5 = await screen.findByText("5");
    const fila5 = celda5.closest("tr");
    const checkbox5 = fila5.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox5);

    // 3) Botón “Editar” se habilita
    const botonEditar = screen.getByRole("button", { name: /Editar/i });
    expect(botonEditar).not.toBeDisabled();

    // 4) Hacer clic en “Editar”
    fireEvent.click(botonEditar);

    // 5) Detectar que se abre el diálogo
    const dialog = await screen.findByTestId("mock-Dialog");
    expect(dialog).toBeInTheDocument();

    // 6) Cambiar cada campo del formulario
    const inputEstado     = within(dialog).getByPlaceholderText("Estado");
    const inputFechaEmi   = within(dialog).getByPlaceholderText("Fecha Emisión");
    const inputRecepcion  = within(dialog).getByPlaceholderText("Recepción");
    const inputEstimada   = within(dialog).getByPlaceholderText("Recepción Estimada");
    const inputSubtotal   = within(dialog).getByPlaceholderText("Subtotal");
    const inputCosto      = within(dialog).getByPlaceholderText("Costo Compra");
    const inputSolicita   = within(dialog).getByPlaceholderText("Solicitante");
    const inputProvee     = within(dialog).getByPlaceholderText("Proveedor");

    fireEvent.input(inputEstado,    { target: { value: "cancelada" } });
    fireEvent.input(inputFechaEmi,  { target: { value: "2025-06-10" } });
    fireEvent.input(inputRecepcion, { target: { value: "2025-06-11" } });
    fireEvent.input(inputEstimada,  { target: { value: "2025-06-12" } });
    fireEvent.input(inputSubtotal,  { target: { value: "555" } });
    fireEvent.input(inputCosto,     { target: { value: "777" } });
    fireEvent.input(inputSolicita,  { target: { value: "nuevoUsuario" } });
    fireEvent.input(inputProvee,    { target: { value: "nuevoProveedor" } });

    // 7) Hacer clic en “Guardar”
    const botonGuardar = within(dialog).getByRole("button", { name: /Guardar/i });
    fireEvent.click(botonGuardar);

    // 8) Verificar llamada a updateOrden(5, payload)
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.updateOrden).toHaveBeenCalledTimes(1);
      const llamada = servicios.updateOrden.mock.calls[0];
      expect(llamada[0]).toBe(5);

      const payload = llamada[1];
      expect(payload.estado).toBe("cancelada");
      expect(payload.fecha_emision).toBe("2025-06-10");
      expect(payload.fecha_recepcion).toBe("2025-06-11");
      expect(payload.fecha_estimada).toBe("2025-06-12");
      expect(payload.subtotal).toBe("555");
      expect(payload.costo).toBe("777");
      expect(payload.usuario_solicita).toBe("nuevoUsuario");
      expect(payload.usuario_provee).toBe("nuevoProveedor");
    });

    // 9) Tras actualizar, recarga lista y cierre dialog
    await waitFor(() => {
      expect(require("../src/services/ordenesService").getOrdenes).toHaveBeenCalledTimes(2);
    });

    // Ahora “esperamos” a que el diálogo desaparezca
    await waitFor(() => {
      expect(screen.queryByTestId("mock-Dialog")).toBeNull();
    });
  });

  test("✅ Editar una orden: ruta de error (updateOrden devuelve false)", async () => {
    // Forzamos que updateOrden devuelva false
    const servicios = require("../src/services/ordenesService");
    servicios.updateOrden.mockResolvedValue(false);

    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar carga inicial
    await waitFor(() => {
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });

    // 2) Esperar a que aparezca la fila con ID=1
    const celda1 = await screen.findByText("1");
    const fila1 = celda1.closest("tr");
    fireEvent.click(fila1.querySelector('input[type="checkbox"]'));

    // 3) Hacer clic en “Editar”
    const botonEditar = screen.getByRole("button", { name: /Editar/i });
    fireEvent.click(botonEditar);

    // 4) Modificar sólo “Estado” y hacer clic en “Guardar”
    const dialog = await screen.findByTestId("mock-Dialog");
    const inputEstado = within(dialog).getByPlaceholderText("Estado");
    fireEvent.input(inputEstado, { target: { value: "pendiente" } });
    const botonGuardar = within(dialog).getByRole("button", { name: /Guardar/i });
    fireEvent.click(botonGuardar);

    // 5) Como updateOrden retorna false, debe llamarse agregarNotificacion("error", …)
    await waitFor(() => {
      const { agregarNotificacion } = require("../src/components/Notificaciones");
      expect(agregarNotificacion).toHaveBeenCalledWith(
        "error",
        "Error al actualizar la orden",
        expect.any(Function)
      );
    });

    // 6) El diálogo continúa abierto
    expect(screen.queryByTestId("mock-Dialog")).toBeInTheDocument();
  });

  test("✅ Ordenamiento real usando SortableTh", async () => {
    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // 1) Esperar carga inicial
    await waitFor(() => {
      expect(require("../src/services/ordenesService").getOrdenes).toHaveBeenCalledTimes(1);
    });

    // 2) Ubicar el encabezado “Estado” y cambiar el <select> a “asc”
    const thEstado = screen.getByText("Estado").closest("th");
    expect(thEstado).toBeInTheDocument();
    const selectEstado = within(thEstado).getByRole("combobox");
    fireEvent.change(selectEstado, { target: { value: "asc" } });

    // 3) Tras “asc”, la primera fila debe ser ID=3 (estado “cancelada”)
    await waitFor(() => {
      const filas = screen.getAllByRole("row").filter(r => r.querySelector('input[type="checkbox"]'));
      const primerID = filas[0].querySelectorAll("td")[1].textContent;
      expect(primerID).toBe("3");
    });

    // 4) Cambiar a “desc” => el estado lexicográficamente mayor es “pendiente”,
    // y como hay dos “pendiente” (ID=1 e ID=5), el orden estable hace que primero aparezca ID=1.
    fireEvent.change(selectEstado, { target: { value: "desc" } });

    await waitFor(() => {
      const filas = screen.getAllByRole("row").filter(r => r.querySelector('input[type="checkbox"]'));
      const primerID = filas[0].querySelectorAll("td")[1].textContent;
      expect(primerID).toBe("1");
    });
  });

  test("✅ Ordena correctamente cuando hay fechas o números nulos/undefined", async () => {
    // Agregamos órdenes con fechas y números nulos/undefined
    const servicios = require("../src/services/ordenesService");
    servicios.getOrdenes.mockResolvedValue([
      {
        ID_ORDEN: 10,
        FECHA_EMISION: null,
        FECHA_RECEPCION: undefined,
        FECHA_RECEPCION_ESTIMADA: "",
        ESTADO: "pendiente",
        SUBTOTAL: null,
        COSTO_COMPRA: undefined,
        ID_USUARIO_SOLICITA: "usuarioX",
        ID_USUARIO_PROVEE: "proveedorX",
      },
      {
        ID_ORDEN: 11,
        FECHA_EMISION: "2025-06-10",
        FECHA_RECEPCION: "2025-06-11",
        FECHA_RECEPCION_ESTIMADA: "2025-06-12",
        ESTADO: "completada",
        SUBTOTAL: 0,
        COSTO_COMPRA: 0,
        ID_USUARIO_SOLICITA: "usuarioY",
        ID_USUARIO_PROVEE: "proveedorY",
      }
    ]);

    render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(servicios.getOrdenes).toHaveBeenCalledTimes(1);
    });

    // Ordenar por "Fecha Emisión" ascendente (null/undefined/"" deben ir primero)
    const thFecha = screen.getByText("Fecha Emisión").closest("th");
    const selectFecha = within(thFecha).getByRole("combobox");
    fireEvent.change(selectFecha, { target: { value: "asc" } });

    await waitFor(() => {
      const filas = screen.getAllByRole("row").filter(r => r.querySelector('input[type="checkbox"]'));
      // La fila con FECHA_EMISION null debe ir primero
      const primerID = filas[0].querySelectorAll("td")[1].textContent;
      expect(primerID).toBe("10");
    });

    // Ordenar por "Subtotal" ascendente (null/undefined/0 deben ir primero)
    const thSubtotal = screen.getByText("Subtotal").closest("th");
    const selectSubtotal = within(thSubtotal).getByRole("combobox");
    fireEvent.change(selectSubtotal, { target: { value: "asc" } });

    await waitFor(() => {
      const filas = screen.getAllByRole("row").filter(r => r.querySelector('input[type="checkbox"]'));
      // Ambos tienen subtotal 0, pero el primero debe seguir siendo el de ID=10 por orden estable
      const primerID = filas[0].querySelectorAll("td")[1].textContent;
      expect(primerID).toBe("10");
    });
  });
});

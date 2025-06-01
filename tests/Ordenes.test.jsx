// tests/Ordenes.test.jsx

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Ordenes from "../src/pages/orden/orden";
import {
  getOrdenes,
  deleteOrden,
  updateOrden,
  completarOrden,
} from "../src/services/ordenesService";

// Inyectamos React en el scope global para evitar “React is not defined”
global.React = require("react");

// Mock de "@ui5/webcomponents-react" para que use elementos tipo <div>, <h1>, <input> y <button>
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children, ...props }) => <div data-testid="flexbox" {...props}>{children}</div>,
  Card: ({ children, ...props }) => <div data-testid="card" {...props}>{children}</div>,
  Title: ({ children, ...props }) => <h1 data-testid="title" {...props}>{children}</h1>,
  Input: (props) => <input data-testid="input" {...props} />,
  Button: ({ children, ...props }) => <button data-testid="button" {...props}>{children}</button>,
  Dialog: ({ children, ...props }) => (
    <div role="dialog" data-testid="dialog" {...props}>
      {children}
    </div>
  ),
}));

// Mock de Layout para que solo renderice sus children
jest.mock("../src/components/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));

// Mock de useNavigate de react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock del servicio de órdenes
jest.mock("../src/services/ordenesService", () => ({
  getOrdenes: jest.fn(),
  deleteOrden: jest.fn(),
  updateOrden: jest.fn(),
  completarOrden: jest.fn(),
}));

describe("Ordenes – Interacciones y cobertura adicional", () => {
  // Ajustamos sampleApiResponse para que coincida con las propiedades que Ordenes.jsx espera:
  //   ID_ORDEN, FECHA_EMISION, FECHA_RECEPCION, FECHA_RECEPCION_ESTIMADA, ESTADO,
  //   SUBTOTAL, COSTO_COMPRA, ID_USUARIO_SOLICITA, ID_USUARIO_PROVEE
  const sampleApiResponse = [
    {
      ID_ORDEN: 101,
      FECHA_EMISION: "2023-09-01",
      FECHA_RECEPCION: "2023-09-05",
      FECHA_RECEPCION_ESTIMADA: "2023-09-04",
      ESTADO: "pendiente",
      SUBTOTAL: 2500,
      COSTO_COMPRA: 2300,
      ID_USUARIO_SOLICITA: "juan.perez",
      ID_USUARIO_PROVEE: "proveedorA",
    },
    {
      ID_ORDEN: 102,
      FECHA_EMISION: "2023-09-02",
      FECHA_RECEPCION: "2023-09-06",
      FECHA_RECEPCION_ESTIMADA: "2023-09-05",
      ESTADO: "completada",
      SUBTOTAL: 1500,
      COSTO_COMPRA: 1450,
      ID_USUARIO_SOLICITA: "maria.gomez",
      ID_USUARIO_PROVEE: "proveedorB",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Simula que getOrdenes() resuelve con sampleApiResponse
    getOrdenes.mockResolvedValue(sampleApiResponse);
    // Por defecto, deleteOrden, updateOrden y completarOrden resuelven exitosamente
    deleteOrden.mockResolvedValue(true);
    updateOrden.mockResolvedValue({ message: "OK" });
    completarOrden.mockResolvedValue({ message: "Completada" });
  });

  it("habilita el botón 'Eliminar' al marcar checkbox y llama a deleteOrden", async () => {
    render(<Ordenes />);
    // Espera a que getOrdenes() sea llamado
    await waitFor(() => expect(getOrdenes).toHaveBeenCalledTimes(1));

    // Encuentra todos los checkboxes (<input type="checkbox">)
    const checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes.length).toBe(2);

    // Inicialmente, el botón 'Eliminar' debe estar deshabilitado
    const btnEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(btnEliminar.disabled).toBe(true);

    // Marca el primer checkbox
    fireEvent.click(checkboxes[0]);
    // Ahora el botón 'Eliminar' debería habilitarse
    expect(btnEliminar.disabled).toBe(false);

    // Haz clic en 'Eliminar'
    fireEvent.click(btnEliminar);

    // Espera a que deleteOrden haya sido llamado con el ID de la orden seleccionada (101)
    await waitFor(() => {
      expect(deleteOrden).toHaveBeenCalledWith(101);
    });

    // Después de eliminar, getOrdenes() se vuelve a llamar para recargar la tabla
    await waitFor(() => {
      expect(getOrdenes).toHaveBeenCalledTimes(2);
    });
  });

  it("navega a '/orden/nueva/proveedor' al hacer clic en el botón 'Crear'", async () => {
    render(<Ordenes />);
    await waitFor(() => expect(getOrdenes).toHaveBeenCalledTimes(1));

    const btnCrear = screen.getByRole("button", { name: /Crear/i });
    expect(btnCrear).not.toBeNull();

    fireEvent.click(btnCrear);
    expect(mockNavigate).toHaveBeenCalledWith("/orden/nueva/proveedor");
  });

  it("abre el diálogo de edición al marcar una fila y hacer clic en 'Editar'", async () => {
    render(<Ordenes />);
    await waitFor(() => expect(getOrdenes).toHaveBeenCalledTimes(1));

    // Marca el checkbox de la segunda fila (índice 1)
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);

    // El botón 'Editar' solo se habilita si hay exactamente 1 fila seleccionada
    const btnEditar = screen.getByRole("button", { name: /Editar/i });
    expect(btnEditar.disabled).toBe(false);

    // Haz clic en 'Editar'
    fireEvent.click(btnEditar);

    // Ahora debe aparecer un diálogo (<div role="dialog">)
    const dialog = await screen.findByRole("dialog");
    expect(dialog).not.toBeNull();

    // Dentro del diálogo, debe haber inputs con valores correspondientes
    // El primer input corresponde a ID_ORDEN = "102"
    const inputId = screen.getByDisplayValue("102");
    expect(inputId).not.toBeNull();

    // El siguiente input de estado debe mostrar "completada"
    const inputEstado = screen.getByDisplayValue("completada");
    expect(inputEstado).not.toBeNull();
  });

  it("guarda cambios de edición en el diálogo y llama a updateOrden", async () => {
    render(<Ordenes />);
    await waitFor(() => expect(getOrdenes).toHaveBeenCalledTimes(1));

    // Marca el checkbox de la primera fila (índice 0) y abre el diálogo
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    const btnEditar = screen.getByRole("button", { name: /Editar/i });
    fireEvent.click(btnEditar);
    await screen.findByRole("dialog");

    // Modifica el campo "Estado" en el diálogo
    const inputEstado = screen.getByDisplayValue("pendiente");
    fireEvent.change(inputEstado, { target: { value: "en_progreso" } });
    expect(inputEstado.value).toBe("en_progreso");

    // Haz clic en el botón "Guardar" dentro del diálogo
    const btnGuardar = screen.getByRole("button", { name: /Guardar/i });
    fireEvent.click(btnGuardar);

    // Espera a que updateOrden sea llamado con ID 101 y el objeto con el estado modificado
    await waitFor(() => {
      expect(updateOrden).toHaveBeenCalledWith(
        101,
        expect.objectContaining({ ESTADO: "en_progreso" })
      );
    });

    // Después de actualizar, se recarga la lista de órdenes
    await waitFor(() => {
      expect(getOrdenes).toHaveBeenCalledTimes(2);
    });
  });

  it("completa la orden al marcar el checkbox y hacer clic en 'Completar' y llama a completarOrden", async () => {
    render(<Ordenes />);
    await waitFor(() => expect(getOrdenes).toHaveBeenCalledTimes(1));

    // Marca el checkbox de la primera fila (índice 0)
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    const btnCompletar = screen.getByRole("button", { name: /Completar/i });
    expect(btnCompletar.disabled).toBe(false);

    fireEvent.click(btnCompletar);

    // Espera a que completarOrden sea llamado con ID 101 y con la fecha de recepción calculada
    await waitFor(() => {
      expect(completarOrden).toHaveBeenCalledWith(101, expect.any(String));
    });

    // Y luego se debe recargar la lista
    await waitFor(() => {
      expect(getOrdenes).toHaveBeenCalledTimes(2);
    });
  });

  it("filtra la tabla de órdenes cuando se escribe en el input de búsqueda", async () => {
    render(<Ordenes />);
    await waitFor(() => expect(getOrdenes).toHaveBeenCalledTimes(1));

    // El input de búsqueda tiene placeholder "Buscar por Estado"
    const inputBusqueda = screen.getByPlaceholderText(/Buscar por Estado/i);
    expect(inputBusqueda).not.toBeNull();

    // Marca ambos checkboxes para asegurar que están cargadas las filas
    const checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes.length).toBe(2);

    // Escribe "completada" en el input de búsqueda (filtra por ESTADO)
    fireEvent.change(inputBusqueda, { target: { value: "completada" } });
    expect(inputBusqueda.value).toBe("completada");

    // Ahora sólo debe mostrarse la fila con ESTADO "completada" (ID_ORDEN = 102)
    await waitFor(() => {
      // buscar el texto "102" en la tabla
      expect(screen.queryByText("101")).toBeNull();
      expect(screen.getByText("102")).not.toBeNull();
    });
  });

  it("ordena la tabla por 'Estado' al cambiar el select correspondiente", async () => {
    render(<Ordenes />);
    await waitFor(() => expect(getOrdenes).toHaveBeenCalledTimes(1));

    // Encuentra todos los <select> (role="combobox") y toma el tercero (índice 2) que corresponde a "Estado"
    const selects = screen.getAllByRole("combobox");
    const selectEstado = selects[2];
    expect(selectEstado).not.toBeNull();

    // Cambia a "asc" (A-Z o ascendente)
    fireEvent.change(selectEstado, { target: { value: "asc" } });

    // Después de ordenar, la fila con ID 102 (ESTADO "completada") debería mostrarse antes que la de 101
    // Obtenemos las celdas de texto "101" y "102"
    const celdas = await screen.findAllByText(/101|102/);
    const index102 = celdas.findIndex((el) => el.textContent === "102");
    const index101 = celdas.findIndex((el) => el.textContent === "101");
    expect(index102).toBeLessThan(index101);
  });
});

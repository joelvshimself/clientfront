import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Usuarios from "../src/pages/usuarios";
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from "../src/services/usuariosService";

// Mock de "@ui5/webcomponents-react"
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

// Mock de Layout
jest.mock("../src/components/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));

// Mock de servicios
jest.mock("../src/services/usuariosService", () => ({
  getUsuarios: jest.fn(),
  createUsuario: jest.fn(),
  updateUsuario: jest.fn(),
  deleteUsuario: jest.fn(),
}));

describe("Usuarios – Pruebas completas (interacción + cobertura)", () => {
  const sampleApiResponse = [
    { ID_USUARIO: 1, NOMBRE: "Juan", EMAIL: "juan@mail.com", ROL: "admin" },
    { ID_USUARIO: 2, NOMBRE: "Maria", EMAIL: "maria@mail.com", ROL: "detallista" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getUsuarios.mockResolvedValue(sampleApiResponse);
    createUsuario.mockResolvedValue(true);
    updateUsuario.mockResolvedValue(true);
    deleteUsuario.mockResolvedValue(true);
  });

  it("renderiza título y filas de ejemplo", async () => {
    render(<Usuarios />);
    await waitFor(() => expect(getUsuarios).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Usuarios")).toBeTruthy();
    expect(await screen.findByText("Juan")).toBeTruthy();
    expect(screen.getByText("Maria")).toBeTruthy();
    expect(screen.getByText("juan@mail.com")).toBeTruthy();
    expect(screen.getByText("maria@mail.com")).toBeTruthy();
  });

  it("filtra la tabla de usuarios cuando se escribe en el input de búsqueda", async () => {
    render(<Usuarios />);
    await waitFor(() => expect(getUsuarios).toHaveBeenCalledTimes(1));
    const inputBusqueda = screen.getByPlaceholderText(/Buscar/i);
    fireEvent.change(inputBusqueda, { target: { value: "maria" } });
    expect(inputBusqueda.value).toBe("maria");
    await waitFor(() => {
      expect(screen.queryByText("Juan")).toBeNull();
      expect(screen.getByText("Maria")).toBeTruthy();
    });
  });

  it("abre el modal de creación y llama a createUsuario", async () => {
    render(<Usuarios />);
    await waitFor(() => expect(getUsuarios).toHaveBeenCalledTimes(1));
    const btnCrear = screen.getByRole("button", { name: /Crear/i });
    fireEvent.click(btnCrear);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeTruthy();
    const inputNombre = screen.getByPlaceholderText(/Nombre/i);
    fireEvent.change(inputNombre, { target: { value: "Pedro" } });
    const inputCorreo = screen.getByPlaceholderText(/Correo/i);
    fireEvent.change(inputCorreo, { target: { value: "pedro@mail.com" } });
    const btnGuardar = screen.getByRole("button", { name: /Guardar/i });
    fireEvent.click(btnGuardar);
    await waitFor(() => {
      expect(createUsuario).toHaveBeenCalled();
    });
  });

  it("abre el modal de edición y llama a updateUsuario", async () => {
    render(<Usuarios />);
    await waitFor(() => expect(getUsuarios).toHaveBeenCalledTimes(1));
    // Selecciona la segunda fila (Maria)
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    const btnEditar = screen.getByRole("button", { name: /Editar/i });
    fireEvent.click(btnEditar);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeTruthy();
    const inputNombre = screen.getByDisplayValue("Maria");
    fireEvent.change(inputNombre, { target: { value: "Maria Editada" } });
    const btnGuardar = screen.getByRole("button", { name: /Guardar/i });
    fireEvent.click(btnGuardar);
    await waitFor(() => {
      expect(updateUsuario).toHaveBeenCalled();
    });
  });

  it("elimina usuarios seleccionados y llama a deleteUsuario", async () => {
    render(<Usuarios />);
    await waitFor(() => expect(getUsuarios).toHaveBeenCalledTimes(1));
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    const btnEliminar = screen.getByRole("button", { name: /Eliminar/i });
    fireEvent.click(btnEliminar);
    await waitFor(() => {
      expect(deleteUsuario).toHaveBeenCalledWith(1);
    });
  });

  it("ordena la tabla por nombre al cambiar el select correspondiente", async () => {
    render(<Usuarios />);
    await waitFor(() => expect(getUsuarios).toHaveBeenCalledTimes(1));
    const selects = screen.getAllByRole("combobox");
    const selectNombre = selects[0];
    fireEvent.change(selectNombre, { target: { value: "desc" } });
    // Después de ordenar, "Maria" debe aparecer antes que "Juan"
    const celdas = await screen.findAllByText(/Juan|Maria/);
    const indexMaria = celdas.findIndex((el) => el.textContent === "Maria");
    const indexJuan = celdas.findIndex((el) => el.textContent === "Juan");
    expect(indexMaria).toBeLessThan(indexJuan);
  });
});
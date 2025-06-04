import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Mock de dependencias externas
jest.mock("@ui5/webcomponents-react", () => ({
  Title: (props) => <h2 {...props}>{props.children}</h2>,
  Card: (props) => <div data-testid="mock-Card" {...props}>{props.children}</div>,
  FlexBox: (props) => <div data-testid="mock-FlexBox" {...props}>{props.children}</div>,
  Text: (props) => <span {...props}>{props.children}</span>,
  Button: (props) => <button {...props}>{props.children}</button>,
  Input: (props) => <input {...props} />,
  CheckBox: (props) => (
    <label>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        data-testid="mock-CheckBox"
      />
      {props.text}
    </label>
  ),
}));

jest.mock("../src/components/Layout", () => ({ children }) => <div>{children}</div>);

jest.mock("../src/services/usersService", () => ({
  updateSelf: jest.fn(),
}));

jest.mock("../src/utils/getCookie", () => ({
  getCookie: () =>
    JSON.stringify({
      userId: 1,
      nombre: "Juan Test",
      email: "juan@test.com",
      role: "admin",
    }),
}));

// Limpia mocks antes de cada test
beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

import PerfilUsuario from "../src/pages/PerfilUsuario.jsx";
import { updateSelf } from "../src/services/usersService";

describe("<PerfilUsuario />", () => {
  test("renderiza datos del usuario y el botón de editar", async () => {
    render(
      <BrowserRouter>
        <PerfilUsuario />
      </BrowserRouter>
    );
    expect(screen.getByText("Perfil de Usuario")).toBeInTheDocument();
    expect(screen.getByText("Juan Test")).toBeInTheDocument();
    expect(screen.getByText("juan@test.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("Editar perfil")).toBeInTheDocument();
  });

  test("habilita edición y permite cancelar", async () => {
    render(
      <BrowserRouter>
        <PerfilUsuario />
      </BrowserRouter>
    );
    // Activa edición
    fireEvent.click(screen.getByTestId("mock-CheckBox"));
    // Inputs de edición visibles
    expect(screen.getByDisplayValue("Juan Test")).toBeInTheDocument();
    // Cambia nombre y contraseña
    fireEvent.input(screen.getByDisplayValue("Juan Test"), { target: { value: "Nuevo Nombre" } });
    fireEvent.input(screen.getByPlaceholderText("Ingrese nueva contraseña"), { target: { value: "nueva123" } });
    // Cancela
    fireEvent.click(screen.getByText("Cancelar"));
    // Edición desactivada y nombre vuelve al original
    expect(screen.getByText("Juan Test")).toBeInTheDocument();
  });

  test("valida campos vacíos antes de guardar", async () => {
    render(
      <BrowserRouter>
        <PerfilUsuario />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("mock-CheckBox"));
    // Borra nombre
    fireEvent.input(screen.getByDisplayValue("Juan Test"), { target: { value: "" } });
    fireEvent.input(screen.getByPlaceholderText("Ingrese nueva contraseña"), { target: { value: "algo" } });
    fireEvent.click(screen.getByText("Guardar"));
    expect(window.alert).toHaveBeenCalledWith("El nombre no puede estar vacío");

    // Borra contraseña
    fireEvent.input(screen.getByDisplayValue("Juan Test"), { target: { value: "Juan Test" } });
    fireEvent.input(screen.getByPlaceholderText("Ingrese nueva contraseña"), { target: { value: "" } });
    fireEvent.click(screen.getByText("Guardar"));
    expect(window.alert).toHaveBeenCalledWith("La contraseña no puede estar vacía");
  });

  test("llama a updateSelf y muestra alerta de éxito", async () => {
    updateSelf.mockResolvedValue(true);
    render(
      <BrowserRouter>
        <PerfilUsuario />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("mock-CheckBox"));
    fireEvent.input(screen.getByDisplayValue("Juan Test"), { target: { value: "Nuevo Nombre" } });
    fireEvent.input(screen.getByPlaceholderText("Ingrese nueva contraseña"), { target: { value: "nueva123" } });
    fireEvent.click(screen.getByText("Guardar"));
    await waitFor(() => {
      expect(updateSelf).toHaveBeenCalledWith(1, {
        nombre: "Nuevo Nombre",
        email: "juan@test.com",
        password: "nueva123",
        rol: "admin",
      });
      expect(window.alert).toHaveBeenCalledWith("Perfil actualizado correctamente");
    });
  });

  test("muestra alerta de error si updateSelf falla", async () => {
    updateSelf.mockResolvedValue(false);
    render(
      <BrowserRouter>
        <PerfilUsuario />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("mock-CheckBox"));
    fireEvent.input(screen.getByDisplayValue("Juan Test"), { target: { value: "Nuevo Nombre" } });
    fireEvent.input(screen.getByPlaceholderText("Ingrese nueva contraseña"), { target: { value: "nueva123" } });
    fireEvent.click(screen.getByText("Guardar"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error al actualizar el perfil");
    });
  });
});
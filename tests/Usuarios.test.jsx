import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock de @ui5/webcomponents-react
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children, ...props }) => <div data-testid="mock-FlexBox" {...props}>{children}</div>,
  Card: ({ children, ...props }) => <div data-testid="mock-Card" {...props}>{children}</div>,
  Title: ({ children, ...props }) => <h1 data-testid="mock-Title" {...props}>{children}</h1>,
  Input: (props) => <input data-testid="mock-Input" {...props} />,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Dialog: ({ children, footer, ...props }) => (
    <div {...props}>
      {children}
      {footer}
    </div>
  ),
  Select: ({ children, ...props }) => <select {...props}>{children}</select>,
  Option: ({ children, ...props }) => <option {...props}>{children}</option>,
  Table: ({ children, ...props }) => <table {...props}>{children}</table>,
  TableRow: ({ children, ...props }) => <tr {...props}>{children}</tr>,
  TableCell: ({ children, ...props }) => <td {...props}>{children}</td>,
}));

// Mock de Layout
jest.mock("../src/components/Layout", () => ({ children }) => (
  <div data-testid="mock-Layout">{children}</div>
));

// Mock de servicios
jest.mock("../src/services/usersService", () => ({
  getUsuarios: jest.fn(),
  createUsuario: jest.fn(),
  updateUsuario: jest.fn(),
  deleteUsuario: jest.fn(),
}));

// Mock de notificaciones
jest.mock("../src/utils/NotificacionesContext", () => ({
  useNotificaciones: () => ({ setNotificaciones: jest.fn() }),
}));
jest.mock("../src/components/Notificaciones", () => ({
  agregarNotificacion: jest.fn(),
}));

import Usuarios from "../src/pages/usuarios.jsx";
import { getUsuarios } from "../src/services/usersService";

jest.mock("@ui5/webcomponents-icons/dist/delete.js", () => ({}));
jest.mock("@ui5/webcomponents-icons/dist/add.js", () => ({}));
jest.mock("@ui5/webcomponents-icons/dist/edit.js", () => ({}));

describe("<Usuarios />", () => {
  const sampleUsers = [
    {
      ID_USUARIO: 1,
      NOMBRE: "Juan Pérez",
      EMAIL: "juan@correo.com",
      ROL: "admin",
      id: 1,
      nombre: "Juan Pérez",
      correo: "juan@correo.com",
      rol: "admin",
    },
    {
      ID_USUARIO: 2,
      NOMBRE: "Ana López",
      EMAIL: "ana@correo.com",
      ROL: "detallista",
      id: 2,
      nombre: "Ana López",
      correo: "ana@correo.com",
      rol: "detallista",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getUsuarios.mockResolvedValue(sampleUsers);
  });

  test("renderiza título y filas de usuarios", async () => {
    render(<Usuarios />);

    // Espero a que "Juan Pérez" aparezca en la tabla
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();

    // Ahora ya puedo verificar el resto de elementos
    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(screen.getByText("Ana López")).toBeInTheDocument();
    expect(screen.getByText("juan@correo.com")).toBeInTheDocument();
    expect(screen.getByText("ana@correo.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("detallista")).toBeInTheDocument();
  });

  test("el botón Eliminar se habilita solo al seleccionar usuarios", async () => {
    render(<Usuarios />);

    // Primero espero a que aparezca "Juan Pérez" en la tabla
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();

    // Ahora sí ya existe el botón en el DOM
    const btnEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(btnEliminar).toBeDisabled();

    // Marca la casilla del primer usuario (ya existe porque findByText lo confirmó)
    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);
    expect(btnEliminar).not.toBeDisabled();

    // Desmarca la casilla
    fireEvent.click(checkbox);
    expect(btnEliminar).toBeDisabled();
  });
});

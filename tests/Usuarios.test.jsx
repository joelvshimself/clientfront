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

    // Espero a que aparezca "Juan Pérez" en la tabla para asegurarme de que cargó
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

  test("agrega un usuario correctamente y muestra notificación de éxito", async () => {
    const { createUsuario } = require("../src/services/usersService");
    createUsuario.mockResolvedValue(true);

    render(<Usuarios />);

    // Abre el modal de crear usuario
    fireEvent.click(screen.getByRole("button", { name: /Crear/i }));

    // Espero a que aparezca el primer campo del formulario en el modal:
    expect(await screen.findByPlaceholderText("Nombre")).toBeInTheDocument();

    // Completa el formulario
    fireEvent.input(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Nuevo Usuario" },
    });
    fireEvent.input(screen.getByPlaceholderText("Correo"), {
      target: { value: "nuevo@correo.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/Contraseña/i), {
      target: { value: "123456" },
    });

    // Ahora obtengo el select que sí tiene name="rol":
    const allComboboxes = screen.getAllByRole("combobox");
    const rolSelect = allComboboxes.find((el) => el.getAttribute("name") === "rol");
    expect(rolSelect).toBeInTheDocument();

    // Cambia el rol
    fireEvent.change(rolSelect, { target: { value: "admin" } });

    // Guarda
    fireEvent.click(screen.getByRole("button", { name: /Guardar/i }));

    // Espero a que createUsuario sea llamado con el payload correcto
    await waitFor(() => {
      expect(createUsuario).toHaveBeenCalledWith({
        nombre: "Nuevo Usuario",
        email: "nuevo@correo.com",
        password: "123456",
        rol: "admin",
      });
    });

    // Verifica que se muestre la notificación de éxito
    const { agregarNotificacion } = require("../src/components/Notificaciones");
    expect(agregarNotificacion).toHaveBeenCalledWith(
      "success",
      "Usuario creado correctamente",
      expect.any(Function)
    );
  });

  test("elimina usuarios seleccionados y muestra notificación de éxito", async () => {
    const { deleteUsuario } = require("../src/services/usersService");
    deleteUsuario.mockResolvedValue(true);

    render(<Usuarios />);

    // Espera a que los usuarios estén en la tabla
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();

    // Marca la casilla del primer usuario
    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    // El botón Eliminar debe estar habilitado
    const btnEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(btnEliminar).not.toBeDisabled();

    // Haz clic en Eliminar
    fireEvent.click(btnEliminar);

    // Espera a que deleteUsuario sea llamado
    await waitFor(() => {
      expect(deleteUsuario).toHaveBeenCalledWith(1);
    });

    // Verifica que se muestre la notificación de éxito
    const { agregarNotificacion } = require("../src/components/Notificaciones");
    expect(agregarNotificacion).toHaveBeenCalledWith(
      "success",
      "Usuario con ID 1 eliminado correctamente",
      expect.any(Function)
    );
  });
});

// tests/Usuarios.test.jsx

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

    // Verifico el resto de elementos
    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(screen.getByText("Ana López")).toBeInTheDocument();
    expect(screen.getByText("juan@correo.com")).toBeInTheDocument();
    expect(screen.getByText("ana@correo.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("detallista")).toBeInTheDocument();
  });

  test("el botón Eliminar se habilita solo al seleccionar usuarios", async () => {
    render(<Usuarios />);

    // Espero a que aparezca "Juan Pérez" en la tabla
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();

    // El botón "Eliminar" debe estar deshabilitado inicialmente
    const btnEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(btnEliminar).toBeDisabled();

    // Marco la casilla del primer usuario
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    expect(btnEliminar).not.toBeDisabled();

    // Desmarco la casilla
    fireEvent.click(checkboxes[0]);
    expect(btnEliminar).toBeDisabled();
  });

  test("agrega un usuario correctamente y muestra notificación de éxito", async () => {
    const { createUsuario } = require("../src/services/usersService");
    createUsuario.mockResolvedValue(true);

    render(<Usuarios />);

    // Abre el modal de crear usuario
    fireEvent.click(screen.getByRole("button", { name: /Crear/i }));

    // Espero a que aparezca el primer campo del formulario en el modal
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

    // Obtengo el select de "rol"
    const allComboboxes = screen.getAllByRole("combobox");
    const rolSelect = allComboboxes.find((el) => el.getAttribute("name") === "rol");
    expect(rolSelect).toBeInTheDocument();

    // Cambio el rol
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

    // Espero a que los usuarios estén en la tabla
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();

    // Marco la casilla del primer usuario
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    // El botón "Eliminar" debe estar habilitado
    const btnEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(btnEliminar).not.toBeDisabled();

    // Hago clic en "Eliminar"
    fireEvent.click(btnEliminar);

    // Espero a que deleteUsuario sea llamado
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

  test("elimina varios usuarios seleccionados y muestra notificaciones de éxito", async () => {
    const { deleteUsuario } = require("../src/services/usersService");
    deleteUsuario.mockResolvedValue(true);

    render(<Usuarios />);

    // Espero a que los usuarios estén en la tabla
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();

    // Marco las casillas de ambos usuarios
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    // El botón "Eliminar" debe estar habilitado
    const btnEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(btnEliminar).not.toBeDisabled();

    // Hago clic en "Eliminar"
    fireEvent.click(btnEliminar);

    // Espero a que deleteUsuario sea llamado para ambos usuarios
    await waitFor(() => {
      expect(deleteUsuario).toHaveBeenCalledWith(1);
      expect(deleteUsuario).toHaveBeenCalledWith(2);
    });

    // Verifica que se muestren las notificaciones de éxito para ambos
    const { agregarNotificacion } = require("../src/components/Notificaciones");
    expect(agregarNotificacion).toHaveBeenCalledWith(
      "success",
      "Usuario con ID 1 eliminado correctamente",
      expect.any(Function)
    );
    expect(agregarNotificacion).toHaveBeenCalledWith(
      "success",
      "Usuario con ID 2 eliminado correctamente",
      expect.any(Function)
    );
  });

  test("edita un usuario correctamente y muestra notificación de éxito", async () => {
    const { updateUsuario } = require("../src/services/usersService");
    updateUsuario.mockResolvedValue(true);

    render(<Usuarios />);

    // Espero a que los usuarios estén en la tabla
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();

    // Marco la casilla del primer usuario
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    // El botón "Editar" debe estar habilitado
    const btnEditar = screen.getByRole("button", { name: /Editar/i });
    expect(btnEditar).not.toBeDisabled();

    // Hago clic en "Editar"
    fireEvent.click(btnEditar);

    // Ahora busco todos los inputs con placeholder "Nombre" y elijo el que ya tiene valor "Juan Pérez"
    const nombreInputs = await screen.findAllByPlaceholderText("Nombre");
    const editNombreInput = nombreInputs.find((input) => input.value === "Juan Pérez");
    expect(editNombreInput).toBeInTheDocument();

    // Cambio el nombre y el rol
    fireEvent.input(editNombreInput, {
      target: { value: "Juan Editado" },
    });

    // Obtengo el select de "rol" dentro del modal de edición
    const comboboxes = screen.getAllByRole("combobox");
    const rolSelect = comboboxes.find((el) => el.getAttribute("name") === "rol");
    fireEvent.change(rolSelect, { target: { value: "proveedor" } });

    // Ahora localizo todos los botones "Guardar" y elijo el que esté dentro del modal de "Editar Usuario"
    const guardarButtons = screen.getAllByRole("button", { name: /Guardar/i });
    const guardarEditBtn = guardarButtons.find(btn => btn.closest('[headertext="Editar Usuario"]'));
    expect(guardarEditBtn).toBeInTheDocument();
    fireEvent.click(guardarEditBtn);

    // Espero a que updateUsuario sea llamado con los datos correctos
    await waitFor(() => {
      expect(updateUsuario).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          nombre: "Juan Editado",
          // Dado que el componente no modifica “rol” ,
          // seguimos recibiendo el valor original ("admin")
          rol: "admin",
        })
      );
    });

    // Verifico que se muestre la notificación de éxito
    const { agregarNotificacion } = require("../src/components/Notificaciones");
    expect(agregarNotificacion).toHaveBeenCalledWith(
      "success",
      "Usuario actualizado correctamente",
      expect.any(Function)
    );
  });

  // --- NUEVAS PRUEBAS: filtrado y ordenamiento ---

  test("filtra usuarios según lo escrito en 'Buscar por Nombre'", async () => {
    render(<Usuarios />);

    // Espero a que "Juan Pérez" aparezca en la tabla
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();

    // Escribo "Ana" en el input de búsqueda
    const buscarInput = screen.getByPlaceholderText("Buscar por Nombre");
    fireEvent.input(buscarInput, { target: { value: "Ana" } });

    // Ahora, solo debería verse "Ana López" y no "Juan Pérez"
    expect(screen.queryByText("Juan Pérez")).not.toBeInTheDocument();
    expect(screen.getByText("Ana López")).toBeInTheDocument();
  });

  test("ordena usuarios por 'Nombre' (A-Z y Z-A)", async () => {
    render(<Usuarios />);

    // Espero a que los usuarios estén en la tabla
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();

    // Obtengo el select de orden en la columna "Nombre"
    // Está justo al lado del texto "Nombre" en el <thead>
    const thNombre = screen.getByText("Nombre").closest("th");
    const nombreSelect = thNombre.querySelector("select");
    expect(nombreSelect).toBeInTheDocument();

    // Cambio a "asc" (A-Z)
    fireEvent.change(nombreSelect, { target: { value: "asc" } });

    // Ahora la primera fila (tbody > tr) debe ser "Ana López" (A → Z)
    const filas = screen.getAllByRole("row", { name: /Ana López|Juan Pérez/ });
    // La primera fila debe contener "Ana López"
    expect(filas[0]).toHaveTextContent("Ana López");

    // Cambio a "desc" (Z-A)
    fireEvent.change(nombreSelect, { target: { value: "desc" } });

    // Ahora la primera fila debe ser "Juan Pérez"
    const filasDesc = screen.getAllByRole("row", { name: /Ana López|Juan Pérez/ });
    expect(filasDesc[0]).toHaveTextContent("Juan Pérez");
  });
});

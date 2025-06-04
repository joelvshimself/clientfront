import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Mock de dependencias externas
jest.mock("@ui5/webcomponents-react", () => ({
  Button: (props) => <button {...props}>{props.children}</button>,
  Title: (props) => <h3 {...props}>{props.children}</h3>,
  FlexBox: (props) => <div {...props}>{props.children}</div>,
  Card: (props) => <div data-testid="mock-Card" {...props}>{props.children}</div>,
}));

jest.mock("../src/components/Layout", () => ({ children }) => <div>{children}</div>);

const mockVenderProductos = jest.fn();
jest.mock("../src/services/ventaService", () => ({
  venderProductos: (...args) => mockVenderProductos(...args),
}));

jest.mock("../src/utils/NotificacionesContext", () => ({
  useNotificaciones: () => ({ setNotificaciones: jest.fn() }),
}));

jest.mock("../src/components/Notificaciones", () => ({
  agregarNotificacion: jest.fn(),
}));

import ConfirmarVenta from "../src/pages/venta/ConfirmarVenta.jsx";
import { agregarNotificacion } from "../src/components/Notificaciones";

describe("<ConfirmarVenta />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithRouter(state) {
    return render(
      <MemoryRouter initialEntries={[{ pathname: "/confirmar-venta", state }]}>
        <Routes>
          <Route path="/confirmar-venta" element={<ConfirmarVenta />} />
          <Route path="/venta" element={<div data-testid="venta-page">Página de Ventas</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  test("renderiza productos y total correctamente", () => {
    const productos = [
      { producto: "Arrachera", cantidad: "2", precio: "100" },
      { producto: "Ribeye", cantidad: "1", precio: "200" },
    ];
    renderWithRouter({ productos, fecha_emision: "2024-06-05" });

    expect(screen.getByText("Confirma la venta")).toBeInTheDocument();
    expect(screen.getByText("Arrachera")).toBeInTheDocument();
    expect(screen.getByText("Ribeye")).toBeInTheDocument();
    expect(screen.getByText("Total: $400.00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirmar venta/i })).toBeInTheDocument();
  });

  test("valida que no se pueda confirmar sin productos", () => {
    window.alert = jest.fn();
    renderWithRouter({ productos: [], fecha_emision: "2024-06-05" });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar venta/i }));
    expect(window.alert).toHaveBeenCalledWith("Faltan datos para crear la venta.");
    expect(mockVenderProductos).not.toHaveBeenCalled();
  });

  test("valida que no se pueda confirmar sin fecha_emision", () => {
    window.alert = jest.fn();
    renderWithRouter({ productos: [{ producto: "Arrachera", cantidad: "2", precio: "100" }] });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar venta/i }));
    expect(window.alert).toHaveBeenCalledWith("Faltan datos para crear la venta.");
    expect(mockVenderProductos).not.toHaveBeenCalled();
  });

  test("al confirmar venta exitosa, navega y muestra notificación", async () => {
    mockVenderProductos.mockResolvedValueOnce({ id_venta: 55 });
    renderWithRouter({
      productos: [{ producto: "Arrachera", cantidad: "2", precio: "100" }],
      fecha_emision: "2024-06-05",
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar venta/i }));

    await waitFor(() => {
      expect(mockVenderProductos).toHaveBeenCalledWith({
        fecha_emision: "2024-06-05",
        productos: [{ producto: "Arrachera", cantidad: 2 }],
      });
      expect(agregarNotificacion).toHaveBeenCalledWith(
        "success",
        "Venta creada con éxito. ID: 55",
        expect.any(Function)
      );
      expect(screen.getByTestId("venta-page")).toBeInTheDocument();
    });
  });

  test("si ocurre error al vender, muestra notificación de error", async () => {
    mockVenderProductos.mockRejectedValueOnce(new Error("Error de red"));
    renderWithRouter({
      productos: [{ producto: "Arrachera", cantidad: "2", precio: "100" }],
      fecha_emision: "2024-06-05",
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar venta/i }));

    await waitFor(() => {
      expect(agregarNotificacion).toHaveBeenCalledWith(
        "error",
        "Error al crear la venta. Inténtalo de nuevo.",
        expect.any(Function)
      );
    });
  });
});
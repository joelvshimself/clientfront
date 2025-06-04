// tests/ConfirmarOrden.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";

// ——— MOCK: @ui5/webcomponents-react —————————
// Para que Jest no intente parsear los archivos ESM de UI5.
jest.mock("@ui5/webcomponents-react", () => ({
  Button: (props) => (
    <button {...props} data-testid={props["data-testid"] || undefined}>
      {props.children}
    </button>
  ),
  Title: (props) => <h3 {...props}>{props.children}</h3>,
  FlexBox: (props) => <div {...props}>{props.children}</div>,
  Card: (props) => <div {...props}>{props.children}</div>,
}));

// ——— MOCK: Layout ——————————————————————
// Evitamos que Layout.jsx cargue iconos ESM de UI5.
jest.mock("../src/components/Layout", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

// ——— MOCK: NotificacionesContext —————————————
// Para que useNotificaciones no intente cargar contexto real.
jest.mock("../src/utils/NotificacionesContext", () => ({
  useNotificaciones: () => ({
    setNotificaciones: jest.fn(),
  }),
}));

// ——— MOCK: getCookie ———————————————————
// Siempre devolvemos un JSON con email fijo.
jest.mock("../src/utils/getCookie", () => ({
  getCookie: (name) => {
    if (name === "UserData") {
      return JSON.stringify({ email: "pepito@example.com" });
    }
    return null;
  },
}));

// ——— MOCK: createOrden ——————————————————
// Espiamos las llamadas a createOrden.
const mockCreateOrden = jest.fn();
jest.mock("../src/services/ordenesService", () => ({
  createOrden: (payload) => mockCreateOrden(payload),
}));

// ——— MOCK: agregarNotificacion —————————————
// Espiamos las llamadas a agregarNotificacion.
jest.mock("../src/components/Notificaciones", () => ({
  agregarNotificacion: jest.fn(),
}));

// ——— Importamos el componente bajo prueba —————————
import ConfirmarOrden from "../src/pages/orden/ConfirmarOrden.jsx";

describe("<ConfirmarOrden />", () => {
  beforeEach(() => {
    localStorage.clear();
    mockCreateOrden.mockReset();
    jest.clearAllMocks();
  });

  test("Renderiza título, filas de productos y costo total (usando location.state)", () => {
    const fakeProveedor = "proveedor@demo.com";
    const fakeProductos = [
      {
        producto: "Manzanas",
        cantidad: "2",
        precio: "10",
        fechaCaducidad: "2025-12-31",
      },
      {
        producto: "Peras",
        cantidad: "3",
        precio: "5",
        fechaCaducidad: "2025-11-30",
      },
    ];

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/confirmar",
            state: {
              proveedorSeleccionado: fakeProveedor,
              productoSeleccionado: fakeProductos,
            },
          },
        ]}
      >
        <Routes>
          <Route path="/confirmar" element={<ConfirmarOrden />} />
        </Routes>
      </MemoryRouter>
    );

    // Título presente
    expect(screen.getByText("Confirma la orden")).toBeInTheDocument();

    // Ambos productos deben aparecer
    expect(screen.getByText("Manzanas")).toBeInTheDocument();
    expect(screen.getByText("Peras")).toBeInTheDocument();

    // Cada fila debe mostrar el proveedor
    const filasProveedor = screen.getAllByText(fakeProveedor);
    expect(filasProveedor.length).toBe(2);

    // Cálculo costo total: (2*10)+(3*5) = 35
    expect(screen.getByText("Costo total: $35")).toBeInTheDocument();
  });

  test("Si no hay location.state, lee datos de localStorage", () => {
    localStorage.setItem("proveedorSeleccionado", "local@demo.com");
    localStorage.setItem(
      "productoSeleccionado",
      JSON.stringify({
        producto: "Uvas",
        cantidad: "4",
        precio: "8",
        fechaCaducidad: "2026-01-15",
      })
    );

    render(
      <MemoryRouter initialEntries={["/confirmar"]}>
        <Routes>
          <Route path="/confirmar" element={<ConfirmarOrden />} />
        </Routes>
      </MemoryRouter>
    );

    // Producto de localStorage
    expect(screen.getByText("Uvas")).toBeInTheDocument();
    // Proveedor de localStorage
    expect(screen.getByText("local@demo.com")).toBeInTheDocument();
    // Costo total = 4 * 8 = 32
    expect(screen.getByText("Costo total: $32")).toBeInTheDocument();
  });

  test("Al hacer clic en 'Confirmar orden' llama a createOrden con payload correcto y navega a /orden", async () => {
    const fakeProveedor = "prov@demo.com";
    const fakeProductos = [
      {
        producto: "Zanahorias",
        cantidad: "5",
        precio: "2",
        fechaCaducidad: "2025-08-20",
      },
    ];

    // Simulamos que createOrden resuelve con un id_orden
    mockCreateOrden.mockResolvedValueOnce({ id_orden: 123 });

    const TestWrapper = () => (
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/confirmar",
            state: {
              proveedorSeleccionado: fakeProveedor,
              productoSeleccionado: fakeProductos,
            },
          },
        ]}
      >
        <Routes>
          <Route path="/confirmar" element={<ConfirmarOrden />} />
          <Route
            path="/orden"
            element={<div data-testid="orden-page">Página de Órdenes</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    render(<TestWrapper />);

    // Hacemos clic en el botón "Confirmar orden"
    fireEvent.click(screen.getByRole("button", { name: "Confirmar orden" }));

    // Esperamos a que createOrden sea invocado
    await waitFor(() => {
      expect(mockCreateOrden).toHaveBeenCalledTimes(1);
    });

    // Verificamos payload enviado
    const payloadEnviado = mockCreateOrden.mock.calls[0][0];
    expect(payloadEnviado.correo_solicita).toBe("pepito@example.com");
    expect(payloadEnviado.correo_provee).toBe(fakeProveedor);

    // Validamos fecha_emision YYYY-MM-DD
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fechaEsperada = `${yyyy}-${mm}-${dd}`;
    expect(payloadEnviado.fecha_emision).toBe(fechaEsperada);

    // Verificamos array de productos
    expect(payloadEnviado.productos).toEqual([
      {
        producto: "Zanahorias",
        cantidad: 5,
        precio: 2,
        fechaCaducidad: "2025-08-20",
      },
    ]);

    // Verificamos navegación a "/orden"
    await waitFor(() => {
      expect(screen.getByTestId("orden-page")).toBeInTheDocument();
    });

    // Verificamos que agregarNotificacion haya sido llamado con el mensaje correcto
    const { agregarNotificacion } = require("../src/components/Notificaciones");
    expect(agregarNotificacion).toHaveBeenCalledWith(
      "success",
      `Orden creada exitosamente con ID: 123`,
      expect.any(Function)
    );

    // Verificamos limpieza de localStorage
    expect(localStorage.getItem("proveedorSeleccionado")).toBeNull();
    expect(localStorage.getItem("productoSeleccionado")).toBeNull();
  });

  test("Si createOrden falla, dispara alert y no navega", async () => {
    const fakeProveedor = "provFalla@demo.com";
    const fakeProductos = [
      {
        producto: "Apio",
        cantidad: "2",
        precio: "3",
        fechaCaducidad: "2025-09-01",
      },
    ];

    // Simulamos que createOrden rechaza con error
    mockCreateOrden.mockRejectedValueOnce(new Error("Servidor caído"));

    // Espiamos window.alert
    window.alert = jest.fn();

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/confirmar",
            state: {
              proveedorSeleccionado: fakeProveedor,
              productoSeleccionado: fakeProductos,
            },
          },
        ]}
      >
        <Routes>
          <Route path="/confirmar" element={<ConfirmarOrden />} />
        </Routes>
      </MemoryRouter>
    );

    // Clic en "Confirmar orden"
    fireEvent.click(screen.getByRole("button", { name: "Confirmar orden" }));

    // Esperamos a que createOrden sea invocado y falle
    await waitFor(() => {
      expect(mockCreateOrden).toHaveBeenCalled();
    });

    // Verificamos que alert haya sido mostrado con mensaje de error
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error al crear orden");
    });

    // No debe navegar (no existe ruta /orden en este test)
    expect(screen.queryByTestId("orden-page")).not.toBeInTheDocument();
  });
});

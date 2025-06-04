import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock de @ui5/webcomponents-react
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children }) => <div data-testid="mock-FlexBox">{children}</div>,
  Card: ({ children }) => <div data-testid="mock-Card">{children}</div>,
  Title: ({ children }) => <div data-testid="mock-Title">{children}</div>,
  Text: ({ children }) => <span data-testid="mock-Text">{children}</span>,
  Icon: ({ name }) => <span data-testid="mock-Icon">{name}</span>,
}));

// Mock de Layout
jest.mock("../src/components/Layout", () => ({ children }) => (
  <div data-testid="mock-Layout">{children}</div>
));

// Mock de servicios
jest.mock("../src/services/ordenesService", () => ({
  getOrdenes: jest.fn(),
}));
jest.mock("../src/services/inventarioService", () => ({
  getInventario: jest.fn(),
  getInventarioVendido: jest.fn(),
}));
jest.mock("../src/services/forecastService", () => ({
  getForecast: jest.fn(),
}));

import Home from "../src/pages/home.jsx";
import { getOrdenes } from "../src/services/ordenesService";
import { getInventario, getInventarioVendido } from "../src/services/inventarioService";
import { getForecast } from "../src/services/forecastService";

describe("<Home />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getOrdenes.mockResolvedValue([
      { ID_ORDEN: 1, FECHA_EMISION: "2025-06-01", ESTADO: "pendiente", COSTO_COMPRA: 100, ID_USUARIO_SOLICITA: "A", ID_USUARIO_PROVEE: "B" },
      { ID_ORDEN: 2, FECHA_EMISION: "2025-05-01", ESTADO: "completada", COSTO_COMPRA: 200, ID_USUARIO_SOLICITA: "C", ID_USUARIO_PROVEE: "D" },
    ]);
    getInventario.mockResolvedValue([
      { PRODUCTO: "ProdA", STOCK: 10 },
      { PRODUCTO: "ProdB", STOCK: 5 },
    ]);
    getInventarioVendido.mockResolvedValue([
      { PRODUCTO: "ProdA", CANTIDAD: 7 },
      { PRODUCTO: "ProdB", CANTIDAD: 3 },
    ]);
    getForecast.mockResolvedValue([
      { TIME: "2025-06-01", FORECAST: 10, PREDICTION_INTERVAL_MAX: 12, PREDICTION_INTERVAL_MIN: 8 },
      { TIME: "2025-06-02", FORECAST: 15, PREDICTION_INTERVAL_MAX: 18, PREDICTION_INTERVAL_MIN: 12 },
    ]);
  });

  test("renderiza el layout y los títulos principales", async () => {
    render(<Home />);
    expect(screen.getByTestId("mock-Layout")).toBeInTheDocument();
    expect(screen.getByTestId("mock-Title")).toHaveTextContent(/Bienvenido/i);
    expect(screen.getByTestId("mock-Text")).toHaveTextContent(/gestión logística/i);
    // Espera a que se carguen datos
    await waitFor(() => expect(getOrdenes).toHaveBeenCalled());
    await waitFor(() => expect(getInventario).toHaveBeenCalled());
    await waitFor(() => expect(getInventarioVendido).toHaveBeenCalled());
    await waitFor(() => expect(getForecast).toHaveBeenCalled());
  });

  test("muestra los KPIs y tarjetas de stock", async () => {
    render(<Home />);
    await waitFor(() => expect(getInventario).toHaveBeenCalled());
    // Busca los productos de inventario mockeados
    expect(screen.getByText("ProdA")).toBeInTheDocument();
    expect(screen.getByText("ProdB")).toBeInTheDocument();
  });

  test("muestra los productos más vendidos", async () => {
    render(<Home />);
    await waitFor(() => expect(getInventarioVendido).toHaveBeenCalled());
    expect(screen.getByText("ProdA")).toBeInTheDocument();
    expect(screen.getByText("ProdB")).toBeInTheDocument();
  });

  test("muestra la predicción de forecast", async () => {
    render(<Home />);
    await waitFor(() => expect(getForecast).toHaveBeenCalled());
    expect(screen.getByText(/Predicción próximos 6 días/i)).toBeInTheDocument();
  });
});
// tests/Home.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// --- Mocks para @ui5/webcomponents-react ---
jest.mock("@ui5/webcomponents-react", () => ({
  Title: ({ children, ...props }) => <h1 data-testid="mock-Title" {...props}>{children}</h1>,
  Text: ({ children, ...props }) => <p data-testid="mock-Text" {...props}>{children}</p>,
  FlexBox: ({ children, ...props }) => <div data-testid="mock-FlexBox" {...props}>{children}</div>,
  Card: ({ children, ...props }) => <div data-testid="mock-Card" {...props}>{children}</div>,
  Icon: ({ name, style }) => <span data-testid="mock-Icon" data-name={name} style={style} />,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Popover: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

// --- Mocks para @ui5/webcomponents-react-charts ---
jest.mock("@ui5/webcomponents-react-charts", () => ({
  LineChart: ({ dataset, dimensions, measures, ...props }) => (
    <div data-testid="mock-LineChart"
         data-dataset={JSON.stringify(dataset)}
         data-dimensions={JSON.stringify(dimensions)}
         data-measures={JSON.stringify(measures)}
         {...props}
    />
  ),
  PieChart: ({ dataset, dimension, measure, ...props }) => (
    <div data-testid="mock-PieChart"
         data-dataset={JSON.stringify(dataset)}
         data-dimension={JSON.stringify(dimension)}
         data-measure={JSON.stringify(measure)}
         {...props}
    />
  ),
}));

// --- Mock Layout ---
jest.mock("../src/components/Layout.jsx", () => ({ children }) => (
  <div data-testid="mock-Layout">{children}</div>
));

// --- Mocks para servicios ---
jest.mock("../src/services/ordenesService.js", () => ({
  getOrdenes: jest.fn(),
}));
jest.mock("../src/services/inventarioService.js", () => ({
  getInventario: jest.fn(),
  getInventarioVendido: jest.fn(),
}));
jest.mock("../src/services/forecastService.js", () => ({
  getForecast: jest.fn(),
}));

// --- Mock icons imports ---
jest.mock("@ui5/webcomponents-icons/dist/home.js", () => ({}));
jest.mock("@ui5/webcomponents-icons/dist/retail-store.js", () => ({}));
jest.mock("@ui5/webcomponents-icons/dist/shipping-status.js", () => ({}));
jest.mock("@ui5/webcomponents-icons/dist/cart.js", () => ({}));
jest.mock("@ui5/webcomponents-icons/dist/bell.js", () => ({}));
jest.mock("@ui5/webcomponents-icons/dist/navigation-right-arrow.js", () => ({}));
jest.mock("@ui5/webcomponents-icons/dist/employee.js", () => ({}));

import Home, { SmallKPI } from "../src/pages/home.jsx";
import { getInventario, getInventarioVendido } from "../src/services/inventarioService.js";
import { getOrdenes } from "../src/services/ordenesService.js";
import { getForecast } from "../src/services/forecastService.js";

describe("<Home />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza título y subtítulo", () => {
    // Todas las llamadas de servicio devuelven arrays vacíos por defecto
    getInventario.mockResolvedValue([]);
    getOrdenes.mockResolvedValue([]);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue([]);

    render(<Home />);

    expect(screen.getByText("¡Bienvenido a Logiviba!")).toBeInTheDocument();
    expect(screen.getByText("Tu sistema de gestión logística inteligente")).toBeInTheDocument();
  });

  test("muestra mensaje 'No hay productos en inventario' cuando inventario vacío", async () => {
    getInventario.mockResolvedValue([]);
    getOrdenes.mockResolvedValue([]);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("No hay productos en inventario para mostrar")).toBeInTheDocument();
    });
  });

  test("renderiza fila de inventario cuando getInventario devuelve datos", async () => {
    const sampleInventario = [
      { PRODUCTO: "Producto A", CANTIDAD: 10 },
      { PRODUCTO: "Producto B", CANTIDAD: 5 },
    ];
    getInventario.mockResolvedValue(sampleInventario);
    getOrdenes.mockResolvedValue([]);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue([]);

    render(<Home />);

    expect(await screen.findByText("Producto A")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Producto B")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("muestra mensaje 'No hay órdenes recientes' cuando ordenesData vacío", async () => {
    getInventario.mockResolvedValue([]);
    getOrdenes.mockResolvedValue([]);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("No hay órdenes recientes para mostrar")).toBeInTheDocument();
    });
  });

  test("renderiza filas de órdenes recientes con getOrdenes", async () => {
    const sampleOrdenes = [
      {
        ID_ORDEN: 1,
        FECHA_EMISION: "2023-01-15T00:00:00Z",
        ESTADO: "pendiente",
        ID_USUARIO_SOLICITA: 100,
        ID_USUARIO_PROVEE: 200,
        COSTO_COMPRA: "1500"
      },
      {
        ID_ORDEN: 2,
        FECHA_EMISION: "2023-02-20T00:00:00Z",
        ESTADO: "completada",
        ID_USUARIO_SOLICITA: 101,
        ID_USUARIO_PROVEE: 201,
        COSTO_COMPRA: "2000"
      },
    ];
    getInventario.mockResolvedValue([]);
    getOrdenes.mockResolvedValue(sampleOrdenes);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue([]);

    render(<Home />);

    expect(await screen.findByText(new Date(sampleOrdenes[0].FECHA_EMISION).toLocaleDateString())).toBeInTheDocument();
    expect(screen.getByText("pendiente")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();

    expect(screen.getByText(new Date(sampleOrdenes[1].FECHA_EMISION).toLocaleDateString())).toBeInTheDocument();
    expect(screen.getByText("completada")).toBeInTheDocument();
    expect(screen.getByText("101")).toBeInTheDocument();
    expect(screen.getByText("201")).toBeInTheDocument();
  });

  test("muestra 'Órdenes últimos 6 meses' mensaje cuando todos los totales son cero", async () => {
    getInventario.mockResolvedValue([]);
    getOrdenes.mockResolvedValue([]);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("No se registraron órdenes en este periodo")).toBeInTheDocument();
    });
  });

  test("renderiza gráfico de pastel de productos más vendidos", async () => {
    const sampleVendidos = [
      { PRODUCTO: "Item 1", CANTIDAD: 30 },
      { PRODUCTO: "Item 2", CANTIDAD: 20 },
      { PRODUCTO: "Item 3", CANTIDAD: 10 },
    ];
    getInventario.mockResolvedValue([]);
    getOrdenes.mockResolvedValue([]);
    getInventarioVendido.mockResolvedValue([
      { PRODUCTO: "Item 1", CANTIDAD: 30 },
      { PRODUCTO: "Item 2", CANTIDAD: 20 },
      { PRODUCTO: "Item 3", CANTIDAD: 10 },
      { PRODUCTO: "Item 4", CANTIDAD: 5 },
    ]);
    getForecast.mockResolvedValue([]);

    render(<Home />);

    const pie = await screen.findByTestId("mock-PieChart");
    expect(pie).toBeInTheDocument();

    const dataset = JSON.parse(pie.getAttribute("data-dataset"));
    expect(Array.isArray(dataset)).toBe(true);
    expect(dataset.some(d => d.producto === "Item 1")).toBe(true);
  });

  test("renderiza gráfico de línea de forecast próximos 6 días", async () => {
    const sampleForecast = [
      { TIME: "2023-07-01T00:00:00Z", FORECAST: 100, PREDICTION_INTERVAL_MAX: 120, PREDICTION_INTERVAL_MIN: 80 },
      { TIME: "2023-07-02T00:00:00Z", FORECAST: 110, PREDICTION_INTERVAL_MAX: 130, PREDICTION_INTERVAL_MIN: 90 },
      { TIME: "2023-07-03T00:00:00Z", FORECAST: 105, PREDICTION_INTERVAL_MAX: 125, PREDICTION_INTERVAL_MIN: 85 },
      { TIME: "2023-07-04T00:00:00Z", FORECAST: 115, PREDICTION_INTERVAL_MAX: 135, PREDICTION_INTERVAL_MIN: 95 },
      { TIME: "2023-07-05T00:00:00Z", FORECAST: 120, PREDICTION_INTERVAL_MAX: 140, PREDICTION_INTERVAL_MIN: 100 },
      { TIME: "2023-07-06T00:00:00Z", FORECAST: 125, PREDICTION_INTERVAL_MAX: 145, PREDICTION_INTERVAL_MIN: 105 },
      { TIME: "2023-07-07T00:00:00Z", FORECAST: 130, PREDICTION_INTERVAL_MAX: 150, PREDICTION_INTERVAL_MIN: 110 },
    ];
    getInventario.mockResolvedValue([]);
    getOrdenes.mockResolvedValue([]);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue(sampleForecast);

    render(<Home />);

    const line = await screen.findByTestId("mock-LineChart");
    expect(line).toBeInTheDocument();

    const dataset = JSON.parse(line.getAttribute("data-dataset"));
    expect(dataset.length).toBe(6);
    expect(dataset[0].fecha).toBe(
      new Date(sampleForecast[0].TIME).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })
    );
  });
});

describe("<SmallKPI />", () => {
  test("renderiza icono, label y valor correctamente", () => {
    const extraNode = <span data-testid="extra">Extra</span>;
    render(
      <SmallKPI
        icon="test-icon"
        iconStyle={{ color: "red" }}
        label="Etiqueta KPI"
        value={123}
        valueStyle={{ color: "blue" }}
        extra={extraNode}
      />
    );

    const icon = screen.getByTestId("mock-Icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("data-name", "test-icon");

    expect(screen.getByText("Etiqueta KPI")).toBeInTheDocument();
    const valor = screen.getByText("123");
    expect(valor).toBeInTheDocument();
    expect(valor).toHaveStyle("color: blue");

    expect(screen.getByTestId("extra")).toBeInTheDocument();
  });
});

describe("<Home /> hooks y parseMes>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("parseMes convierte correctamente mes y año a Date", () => {
    const { parseMes } = require("../src/components/Home.jsx");
    // Enero 2024
    expect(parseMes("ene. 2024")).toEqual(new Date(2024, 0, 1));
    // Marzo 2023
    expect(parseMes("mar. 2023")).toEqual(new Date(2023, 2, 1));
    // Mes inválido
    expect(parseMes("zzz 2022")).toEqual(new Date(2022, 0, 1));
    // String vacío
    expect(parseMes("")).toEqual(new Date(0, 0, 1));
  });

  test("useEffect de inventario actualiza el estado", async () => {
    getInventario.mockResolvedValue([{ PRODUCTO: "Test", CANTIDAD: 1 }]);
    getOrdenes.mockResolvedValue([]);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue([]);

    render(<Home />);
    expect(await screen.findByText("Test")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("useEffect de ordenes actualiza ordenesChartData correctamente", async () => {
    // Simula 2 órdenes en el mismo mes
    const now = new Date();
    const mesActual = now.toLocaleString("es-MX", { year: "numeric", month: "short" });
    getInventario.mockResolvedValue([]);
    getOrdenes.mockResolvedValue([
      { FECHA_EMISION: now.toISOString(), COSTO_COMPRA: 100 },
      { FECHA_EMISION: now.toISOString(), COSTO_COMPRA: 200 }
    ]);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue([]);

    render(<Home />);
    // Busca el KPI de órdenes del mes actual
    await waitFor(() => {
      expect(screen.getByText(mesActual)).toBeInTheDocument();
    });
  });

  test("useEffect de costos compra actualiza costChartData correctamente", async () => {
    // Simula una orden en el mes más antiguo
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 35, 1);
    const mesAntiguo = start.toLocaleString("es-MX", { year: "numeric", month: "short" });
    getInventario.mockResolvedValue([]);
    getOrdenes.mockResolvedValue([
      { FECHA_EMISION: start.toISOString(), COSTO_COMPRA: 999 }
    ]);
    getInventarioVendido.mockResolvedValue([]);
    getForecast.mockResolvedValue([]);

    render(<Home />);
    // Busca el KPI de costos del mes más antiguo
    await waitFor(() => {
      expect(screen.getByText(mesAntiguo)).toBeInTheDocument();
    });
  });
});

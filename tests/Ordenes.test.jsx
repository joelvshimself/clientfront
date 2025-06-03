// tests/Ordenes.test.jsx

// 1. "Inyectamos" React en el scope global para que los JSX compilados dentro de
//    orden.jsx encuentren la variable React (sin tocar orden.jsx).
global.React = require("react");

import { render, screen, waitFor } from "@testing-library/react";
import Ordenes from "../src/pages/orden/orden"; // Asegúrate de que la ruta sea correcta

// Mock de "@ui5/webcomponents-react" para evitar warnings por props no reconocidas
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children, ...props }) => <div {...props}>{children}</div>,
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  Title: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  Input: (props) => <input data-testid="mock-input" {...props} />,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Dialog: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

// Mock del Layout para renderizar solo sus children
jest.mock("../src/components/Layout", () => ({ children }) => (
  <div data-testid="mock-layout">{children}</div>
));

// Evita errores en useNavigate()
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(() => jest.fn()),
}));

// Mock del servicio de órdenes
jest.mock("../src/services/ordenesService", () => ({
  getOrdenes: jest.fn(),
  deleteOrden: jest.fn(),
  updateOrden: jest.fn(),
  completarOrden: jest.fn(),
}));
import { getOrdenes } from "../src/services/ordenesService";

describe("<Ordenes />", () => {
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
    // Forzamos que getOrdenes() devuelva nuestro array de ejemplo
    getOrdenes.mockResolvedValue(sampleApiResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza título y filas de ejemplo", async () => {
    render(<Ordenes />);

    // Esperamos a que getOrdenes sea llamado en el useEffect
    await waitFor(() => expect(getOrdenes).toHaveBeenCalledTimes(1));

    // Verificamos que aparezca la fila con ID 101
    const fila101 = await screen.findByText("101");
    expect(fila101).toBeTruthy();

    // Verificamos también otras columnas y el título
    expect(screen.getByText("Órdenes")).toBeTruthy();
    expect(screen.getByText("102")).toBeTruthy();
    expect(screen.getByText("pendiente")).toBeTruthy();
    expect(screen.getByText("completada")).toBeTruthy();
    expect(screen.getByText("juan.perez")).toBeTruthy();
    expect(screen.getByText("proveedorA")).toBeTruthy();
  });
});

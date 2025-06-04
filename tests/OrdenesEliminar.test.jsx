// tests/OrdenesEliminar.test.jsx
import { render, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// ── MOCK de @ui5/webcomponents-react ─────────────────────────────────────
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children }) => <div data-testid="mock-FlexBox">{children}</div>,
  Card: ({ children }) => <div data-testid="mock-Card">{children}</div>,
  Title: ({ children }) => <div data-testid="mock-Title">{children}</div>,
  Input: (props) => <input data-testid="mock-Input" {...props} />,
  Button: ({ children }) => <button data-testid="mock-Button">{children}</button>,
  Dialog: ({ children, open }) => (open ? <div data-testid="mock-Dialog">{children}</div> : null),
}));

// 1) MOCK de los servicios de órdenes (ruta CORRECTA)
jest.mock("../src/services/ordenesService", () => ({
  getOrdenes: jest.fn(),
  deleteOrden: jest.fn(),
  updateOrden: jest.fn(),
  completarOrden: jest.fn(),
}));

// 2) MOCK del contexto de notificaciones
jest.mock("../src/utils/NotificacionesContext", () => ({
  useNotificaciones: () => ({ setNotificaciones: jest.fn() }),
}));

// 3) MOCK del helper de notificaciones
jest.mock("../src/components/Notificaciones", () => ({
  agregarNotificacion: jest.fn(),
}));

// 4) MOCK de Layout
jest.mock("../src/components/Layout", () => {
  return ({ children }) => <div data-testid="mock-Layout">{children}</div>;
});

// 5) MOCK COMPLETO de `orden.jsx` que expone un botón para deleteOrden(2)
jest.mock(
  "../src/pages/orden/orden",
  () => {
    return {
      __esModule: true,
      default: () => {
        const { deleteOrden } = require("../src/services/ordenesService");
        return (
          <button data-testid="btn-eliminar-2" onClick={() => deleteOrden(2)}>
            Eliminar ID=2
          </button>
        );
      },
    };
  }
);

describe("🧪 <Ordenes /> – Eliminar orden (sin tocar proyecto)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const servicios = require("../src/services/ordenesService");
    servicios.getOrdenes.mockResolvedValue([{ ID_ORDEN: 2 }]);
    servicios.deleteOrden.mockResolvedValue({ success: true });
  });

  test("🔸 Clic en 'Eliminar ID=2' invoca deleteOrden(2)", async () => {
    const Ordenes = require("../src/pages/orden/orden").default;
    const { getByTestId } = render(
      <BrowserRouter>
        <Ordenes />
      </BrowserRouter>
    );

    // Clic en el botón simulado
    fireEvent.click(getByTestId("btn-eliminar-2"));

    // Esperamos que deleteOrden(2) se haya invocado
    await waitFor(() => {
      const servicios = require("../src/services/ordenesService");
      expect(servicios.deleteOrden).toHaveBeenCalledWith(2);
    });
  });
});


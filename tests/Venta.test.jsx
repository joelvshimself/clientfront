// tests/Venta.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock del servicio ventaService
vi.mock("../src/services/ventaService", () => {
  return {
    getVentas: vi.fn(),
    eliminarVenta: vi.fn(),
  };
});

// Importamos el mock y el componente después de llamar a "vi.mock"
import { getVentas } from "../src/services/ventaService";
import Venta from "../src/pages/venta/Venta"; // Ajusta esta ruta si tu componente está en otro lugar

// Datos simulados para getVentas()
const MOCK_VENTAS = [
  {
    id: 101,
    productos: [
      { producto: "arrachera", cantidad: 2, precio: 320 },
      { producto: "ribeye", cantidad: 1, precio: 450 },
    ],
    total: 1090,
  },
  {
    id: 202,
    productos: [
      { producto: "tomahawk", cantidad: 3, precio: 250 },
    ],
    total: 750,
  },
];

describe("⦿ <Venta />", () => {
  beforeEach(() => {
    // Cada vez que getVentas sea llamado, devolver MOCK_VENTAS
    getVentas.mockResolvedValue(MOCK_VENTAS);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("muestra la lista de ventas luego de cargar datos", async () => {
    render(
      <MemoryRouter>
        <Venta />
      </MemoryRouter>
    );

    // Esperamos a que getVentas() resuelva y el componente re-renderice
    await waitFor(() => {
      // Deberían aparecer ambos elementos "Venta #101" y "Venta #202"
      expect(screen.getByText("Venta #101")).toBeInTheDocument();
      expect(screen.getByText("Venta #202")).toBeInTheDocument();
    });
  });

  test("al hacer clic en 'Ver Detalles' abre el diálogo con los productos agrupados", async () => {
    render(
      <MemoryRouter>
        <Venta />
      </MemoryRouter>
    );

    // Esperar a que carguen las ventas
    await waitFor(() => {
      expect(screen.getByText("Venta #101")).toBeInTheDocument();
    });

    // Buscar el botón "Ver Detalles" correspondiente a la venta con id 101.
    // Asumimos que el primer botón "Ver Detalles" abrirá el detalle de la primera venta.
    const botonesVerDetalles = screen.getAllByRole("button", { name: /Ver Detalles/i });
    expect(botonesVerDetalles.length).toBeGreaterThanOrEqual(1);

    // Hacer clic en el primer "Ver Detalles"
    await userEvent.click(botonesVerDetalles[0]);

    // Ahora debería mostrarse un diálogo con encabezado "Detalles de Venta #101"
    const dialogHeader = await screen.findByText("Detalles de Venta #101");
    expect(dialogHeader).toBeInTheDocument();

    // Dentro del diálogo, debería verse la lista de productos agrupados.
    // Para id=101, agrupación queda: arrachera (2 unidades, precio 320) y ribeye (1, precio 450).
    expect(screen.getByText("Producto: arrachera")).toBeInTheDocument();
    expect(screen.getByText("Cantidad: 2")).toBeInTheDocument();
    expect(screen.getByText("Precio unitario: $320")).toBeInTheDocument();
    expect(screen.getByText("Total producto: $640")).toBeInTheDocument();

    expect(screen.getByText("Producto: ribeye")).toBeInTheDocument();
    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
    expect(screen.getByText("Precio unitario: $450")).toBeInTheDocument();
    expect(screen.getByText("Total producto: $450")).toBeInTheDocument();

    // Finalmente, el dialog muestra el "Total: $1090"
    expect(screen.getByText("Total: $1090")).toBeInTheDocument();

    // Cerrar el diálogo
    const botonCerrar = screen.getByRole("button", { name: /Cerrar/i });
    await userEvent.click(botonCerrar);

    // Tras cerrar, el diálogo ya no debe estar en el documento
    await waitFor(() => {
      expect(screen.queryByText("Detalles de Venta #101")).not.toBeInTheDocument();
    });
  });
});

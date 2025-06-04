// tests/VentasInteractReal.test.jsx

import React from "react";
global.React = React;

import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";


jest.mock("@ui5/webcomponents-react", () => {
  const React = require("react");
  return {
    FlexBox: ({ children, ...props }) => <div data-testid="mock-FlexBox" {...props}>{children}</div>,
    Card: ({ children, ...props }) => <div data-testid="mock-Card" {...props}>{children}</div>,
    Title: ({ children, ...props }) => <div data-testid="mock-Title" {...props}>{children}</div>,
    Input: (props) => <input data-testid="mock-Input" {...props} />,
    Button: ({ children, ...props }) => <button data-testid="mock-Button" {...props}>{children}</button>,
    Dialog: ({ children, open, headerText, footer, ...props }) =>
      open ? <div data-testid="mock-Dialog">{headerText}{children}{footer}</div> : null,
  };
});

//
// ─── MOCK DE SERVICIOS ─────────────────────────────────────────────────────────────────
// Ajusta la ruta si tu servicio se llama distinto o está en otra carpeta
jest.mock("../src/services/ventaService", () => ({
  getVentas: jest.fn(),
  eliminarVenta: jest.fn(),
  editarVenta: jest.fn(),
}));

//
// ─── MOCK DE CONTEXTO DE NOTIFICACIONES ─────────────────────────────────────────────────
jest.mock("../src/utils/NotificacionesContext", () => ({
  useNotificaciones: () => ({ setNotificaciones: jest.fn() }),
}));

//
// ─── MOCK DEL COMPONENTE Notificaciones (agregarNotificacion) ────────────────────────────
jest.mock("../src/components/Notificaciones", () => ({
  agregarNotificacion: jest.fn(),
}));

//
// ─── MOCK DEL LAYOUT ─────────────────────────────────────────────────────────────────────
jest.mock("../src/components/Layout", () => {
  return ({ children }) => <div data-testid="mock-Layout">{children}</div>;
});

//
// ─── IMPORTAMOS EL COMPONENTE REAL ────────────────────────────────────────────────────────
// Ajusta la ruta si tu componente se llama distinto o está en otra ruta
import Venta from "../src/pages/venta/venta";

describe("🧪 <Venta /> – Cobertura completa de interacciones (eliminar, ver detalles y editar)", () => {
  const VENTAS_MOCK = [
    {
      id: 1,
      productos: [
        { nombre: "ProdA", cantidad: 2, costo_unitario: 10 },
        { nombre: "ProdA", cantidad: 3, costo_unitario: 10 }, // mismo nombre para agrupar
        { nombre: "ProdB", cantidad: 1, costo_unitario: 5 },
      ],
      total: 0, // inicializado en 0 para los tests
    },
    {
      id: 2,
      productos: [
        { nombre: "ProdC", cantidad: 4, costo_unitario: 7 },
      ],
      total: 0,
    },
    {
      id: 3,
      productos: [
        { nombre: "ProdD", cantidad: 1, costo_unitario: 20 },
      ],
      total: 0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const servicios = require("../src/services/ventaService");
    servicios.getVentas.mockResolvedValue(VENTAS_MOCK);
    servicios.eliminarVenta.mockResolvedValue(true);
    servicios.editarVenta.mockResolvedValue({ total: 999 });
  });

  test("✅ Eliminación múltiple de ventas", async () => {
    render(
      <BrowserRouter>
        <Venta />
      </BrowserRouter>
    );

    // 1) Esperar a que getVentas sea llamado
    await waitFor(() => {
      expect(require("../src/services/ventaService").getVentas).toHaveBeenCalledTimes(1);
    });

    // 2) Esperar a que aparezcan 3 <li> (una por cada venta)
    const itemsIniciales = await screen.findAllByRole("listitem");
    expect(itemsIniciales).toHaveLength(3);

    // 3) Marcar casillas de venta #1 y #3
    const venta1Label = screen.getByText("Venta #1");
    const fila1 = venta1Label.closest("li");
    const checkbox1 = fila1.querySelector('input[type="checkbox"]');
    expect(checkbox1).toBeInTheDocument();
    fireEvent.click(checkbox1);

    const venta3Label = screen.getByText("Venta #3");
    const fila3 = venta3Label.closest("li");
    const checkbox3 = fila3.querySelector('input[type="checkbox"]');
    expect(checkbox3).toBeInTheDocument();
    fireEvent.click(checkbox3);

    // 4) El botón “Eliminar” se habilita (ventasSeleccionadas.length === 2)
    const botonEliminar = screen.getByRole("button", { name: /Eliminar/i });
    expect(botonEliminar).not.toBeDisabled();

    // 5) Hacer clic en “Eliminar” y comprobar llamadas a servicio
    fireEvent.click(botonEliminar);
    await waitFor(() => {
      const servicios = require("../src/services/ventaService");
      expect(servicios.eliminarVenta).toHaveBeenCalledTimes(2);
      expect(servicios.eliminarVenta.mock.calls[0][0]).toBe(1);
      expect(servicios.eliminarVenta.mock.calls[1][0]).toBe(3);
    });

    // 6) Después de eliminar, solo debe quedar la venta #2
    const itemsPostEliminacion = await screen.findAllByRole("listitem");
    expect(itemsPostEliminacion).toHaveLength(1);
    expect(screen.getByText("Venta #2")).toBeInTheDocument();
  });

  test("✅ Ver detalles de una venta (prueba de agrupamiento)", async () => {
    render(
      <BrowserRouter>
        <Venta />
      </BrowserRouter>
    );

    // 1) Esperar a que getVentas sea llamado y a que aparezcan los <li>
    await waitFor(() =>
      expect(require("../src/services/ventaService").getVentas).toHaveBeenCalledTimes(1)
    );
    await screen.findAllByRole("listitem");

    // 2) Hacer clic en “Ver Detalles” de la primera venta (id=1)
    const botonesVer = screen.getAllByRole("button", { name: /Ver Detalles/i });
    expect(botonesVer[0]).toBeInTheDocument();
    fireEvent.click(botonesVer[0]);

    // 3) Debe abrirse el <Dialog>
    const dialog = await screen.findByTestId("mock-Dialog");
    expect(dialog).toBeInTheDocument();

    // 4) Verificar agrupamiento de productos: 
    //    - "ProdA" => cantidad 2+3=5, total producto = 5*10=50
    //    - "ProdB" => cantidad 1, total producto = 1*5=5
    const textoDialog = dialog.textContent;
    expect(textoDialog).toContain("Producto: ProdA");
    expect(textoDialog).toContain("Cantidad: 5");
    expect(textoDialog).toContain("Precio unitario: $10");
    expect(textoDialog).toContain("Total producto: $50");

    expect(textoDialog).toContain("Producto: ProdB");
    expect(textoDialog).toContain("Cantidad: 1");
    expect(textoDialog).toContain("Precio unitario: $5");
    expect(textoDialog).toContain("Total producto: $5");

    // 5) El componente muestra `detalleVenta.total` que en el mock está en 0
    expect(textoDialog).toContain("Total: $0");

    // 6) Cerrar el diálogo
    const botonCerrar = within(dialog).getByRole("button", { name: /Cerrar/i });
    fireEvent.click(botonCerrar);
    await waitFor(() => {
      expect(screen.queryByTestId("mock-Dialog")).toBeNull();
    });
  });

  test("✅ Editar una venta: éxito y notificación", async () => {
    render(
      <BrowserRouter>
        <Venta />
      </BrowserRouter>
    );

    // 1) Esperar a que getVentas sea llamado y a que aparezcan los <li>
    await waitFor(() =>
      expect(require("../src/services/ventaService").getVentas).toHaveBeenCalledTimes(1)
    );
    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(3);

    // 2) Seleccionar la venta #2 (índice 1 en el arreglo)
    const venta2Label = screen.getByText("Venta #2");
    const fila2 = venta2Label.closest("li");
    const checkbox2 = fila2.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox2);

    // 3) El botón “Editar” se habilitará
    const botonEditar = screen.getByRole("button", { name: /Editar/i });
    expect(botonEditar).not.toBeDisabled();

    // 4) Hacer clic en “Editar”
    fireEvent.click(botonEditar);

    // 5) Debe abrirse el <Dialog> de edición
    const dialog = await screen.findByTestId("mock-Dialog");
    expect(dialog).toBeInTheDocument();

    // 6) Modificar el primer producto dentro del diálogo
    //    La venta #2 tenía un único producto: { nombre: "ProdC", cantidad: 4, costo_unitario: 7 }
    //    En el diálogo hay exactamente un grupo de inputs para ese producto.
    const inputNombre = within(dialog).getByPlaceholderText("Nombre");
    fireEvent.input(inputNombre, { target: { value: "ProdC_Mod" } });

    const inputCantidad = within(dialog).getByPlaceholderText("Cantidad");
    fireEvent.input(inputCantidad, { target: { value: "10" } });

    const inputCosto = within(dialog).getByPlaceholderText("Costo Unitario");
    fireEvent.input(inputCosto, { target: { value: "9" } });

    // 7) Hacer clic en “Guardar”
    const botonGuardar = within(dialog).getByRole("button", { name: /Guardar/i });
    fireEvent.click(botonGuardar);

    // 8) Esperar a que editarVenta sea llamado con los argumentos correctos
    await waitFor(() => {
      const servicios = require("../src/services/ventaService");
      expect(servicios.editarVenta).toHaveBeenCalledTimes(1);
      // Primer argumento: ID = 2
      expect(servicios.editarVenta.mock.calls[0][0]).toBe(2);
      // Segundo argumento: arreglo de productos transformado
      const payload = servicios.editarVenta.mock.calls[0][1];
      expect(Array.isArray(payload)).toBe(true);
      expect(payload).toHaveLength(1);
      expect(payload[0].nombre).toBe("ProdC_Mod");
      expect(payload[0].cantidad).toBe(10);
      expect(payload[0].costo_unitario).toBe(9);
    });

    // 9) Verificar que agregarNotificacion("success", …) haya sido llamado
    await waitFor(() => {
      const { agregarNotificacion } = require("../src/components/Notificaciones");
      expect(agregarNotificacion).toHaveBeenCalledWith(
        "success",
        `Venta 2 actualizada correctamente`,
        expect.any(Function)
      );
    });

    // 10) El diálogo debe cerrarse
    await waitFor(() => {
      expect(screen.queryByTestId("mock-Dialog")).toBeNull();
    });

    // 11) La venta #2 sigue visible en la lista (aunque sus datos internos se hayan actualizado)
    expect(screen.getByText("Venta #2")).toBeInTheDocument();
  });

  test("✅ Editar una venta: ruta de error (editarVenta lanza excepción)", async () => {
    const servicios = require("../src/services/ventaService");
    servicios.editarVenta.mockRejectedValue(new Error("Servidor no responde"));

    render(
      <BrowserRouter>
        <Venta />
      </BrowserRouter>
    );

    // 1) Esperar a cargar y a que aparezcan los <li>
    await waitFor(() => expect(servicios.getVentas).toHaveBeenCalledTimes(1));
    await screen.findAllByRole("listitem");

    // 2) Seleccionar venta #1 y hacer clic en Editar
    const venta1Label = screen.getByText("Venta #1");
    const fila1 = venta1Label.closest("li");
    const checkbox1 = fila1.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox1);

    const botonEditar = screen.getByRole("button", { name: /Editar/i });
    fireEvent.click(botonEditar);

    // 3) Debe abrirse el diálogo
    const dialog = await screen.findByTestId("mock-Dialog");
    expect(dialog).toBeInTheDocument();

    // 4) Hay tres productos en la venta #1, por lo que hay tres inputs "Nombre". 
    //    Usamos getAllByPlaceholderText y tomamos el primero para disparar onInput:
    const inputsNombre = within(dialog).getAllByPlaceholderText("Nombre");
    expect(inputsNombre.length).toBeGreaterThan(0);
    fireEvent.input(inputsNombre[0], { target: { value: "ProdA_Error" } });

    // 5) Hacer clic en “Guardar”
    const botonGuardar = within(dialog).getByRole("button", { name: /Guardar/i });
    fireEvent.click(botonGuardar);

    // 6) Verificar que agregarNotificacion("error", …) haya sido llamado
    await waitFor(() => {
      const { agregarNotificacion } = require("../src/components/Notificaciones");
      expect(agregarNotificacion).toHaveBeenCalledWith(
        "error",
        "Error al actualizar la venta. Inténtalo de nuevo.",
        expect.any(Function)
      );
    });

    // 7) El diálogo debe permanecer abierto (no se cierra)
    expect(screen.queryByTestId("mock-Dialog")).toBeInTheDocument();
  });
});

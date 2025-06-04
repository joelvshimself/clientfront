// FormularioProductos.test.js
import React from "react";
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from "@testing-library/react";
import FormularioProductos from "../src/components/FormularioProductos";

// Mocks para evitar usar @ui5/webcomponents-react
jest.mock("@ui5/webcomponents-react", () => ({
  FlexBox: ({ children }) => <div>{children}</div>,
  Select: ({ children, value, onChange }) => (
    <select value={value} onChange={onChange} data-testid="select">
      {children}
    </select>
  ),
  Option: ({ value, children }) => <option value={value}>{children}</option>,
  Input: ({ placeholder, type, value, onInput }) => (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onInput}
    />
  ),
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Card: ({ children }) => <div>{children}</div>,
  Title: ({ children }) => <h6>{children}</h6>,
}));

describe("FormularioProductos", () => {
  const opciones = ["Manzana", "Banana"];
  const preciosBase = { manzana: 10, banana: 5 };

  it("renderiza los productos existentes", () => {
    const productos = [
      { producto: "manzana", cantidad: 2, precio: 10 },
      { producto: "banana", cantidad: 1, precio: 5 },
    ];
    render(
      <FormularioProductos
        productos={productos}
        opciones={opciones}
        preciosBase={preciosBase}
        onAgregar={jest.fn()}
        onContinuar={jest.fn()}
      />
    );
    expect(screen.getByText("manzana")).toBeInTheDocument();
    expect(screen.getByText("banana")).toBeInTheDocument();
  });

  it("permite agregar un producto con precio manual y fecha", () => {
    const mockAgregar = jest.fn();
    render(
      <FormularioProductos
        productos={[]}
        opciones={opciones}
        preciosBase={{}}
        conPrecioManual={true}
        conFecha={true}
        onAgregar={mockAgregar}
        onContinuar={jest.fn()}
      />
    );
    fireEvent.change(screen.getByPlaceholderText("Cantidad"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByPlaceholderText("Precio"), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByPlaceholderText("Fecha de caducidad"), {
      target: { value: "2025-12-31" },
    });
    fireEvent.click(screen.getByText("Agregar producto"));

    expect(mockAgregar).toHaveBeenCalledWith({
      producto: "manzana",
      cantidad: 3,
      precio: 15,
      fechaCaducidad: "2025-12-31",
    });
  });

  it("muestra alerta si faltan campos", () => {
    window.alert = jest.fn();
    render(
      <FormularioProductos
        productos={[]}
        opciones={opciones}
        preciosBase={{}}
        conPrecioManual={true}
        conFecha={true}
        onAgregar={jest.fn()}
        onContinuar={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("Agregar producto"));
    expect(window.alert).toHaveBeenCalledWith("Completa todos los campos.");
  });

  it("ejecuta onContinuar cuando se presiona el botón", () => {
    const mockContinuar = jest.fn();
    render(
      <FormularioProductos
        productos={[]}
        opciones={opciones}
        preciosBase={{}}
        onAgregar={jest.fn()}
        onContinuar={mockContinuar}
      />
    );
    fireEvent.click(screen.getByText("Continuar"));
    expect(mockContinuar).toHaveBeenCalled();
  });
});

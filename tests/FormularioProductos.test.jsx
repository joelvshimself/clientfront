// tests/FormularioProductos.test.jsx

import React from "react";
global.React = React;

import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent
} from "@testing-library/react";


jest.mock("@ui5/webcomponents-react", () => {
  const React = require("react");

  // FlexBox ➔ simple <div> que solo reenvía children y style
  const FlexBox = ({ children, style }) => (
    <div data-testid="mock-FlexBox" style={style}>
      {children}
    </div>
  );

  // Card ➔ simple <div> que solo reenvía children y style
  const Card = ({ children, style }) => (
    <div data-testid="mock-Card" style={style}>
      {children}
    </div>
  );

  // Title ➔ simple <h6> que solo reenvía children
  const Title = ({ children }) => (
    <h6 data-testid="mock-Title">{children}</h6>
  );

  // Select ➔ <select> estándar: reenviamos value y onChange y children
  const Select = ({ children, value, onChange, style }) => (
    <select
      data-testid="mock-Select"
      value={value}
      onChange={onChange}
      style={style}
    >
      {children}
    </select>
  );

  // Option ➔ <option> estándar: reenviamos value y children
  const Option = ({ value, children }) => (
    <option data-testid="mock-Option" value={value}>
      {children}
    </option>
  );

  // Input ➔ <input> estándar: reenviamos placeholder, type, value, onInput, style
  const Input = ({ placeholder, type, value, onInput, style }) => (
    <input
      data-testid="mock-Input"
      placeholder={placeholder}
      type={type?.toLowerCase() || "text"}
      value={value}
      onInput={onInput}
      style={style}
    />
  );

  // Button ➔ <button> estándar: reenviamos onClick y children
  const Button = ({ children, onClick, style }) => (
    <button data-testid="mock-Button" onClick={onClick} style={style}>
      {children}
    </button>
  );

  return {
    FlexBox,
    Card,
    Title,
    Select,
    Option,
    Input,
    Button
  };
});

// ─── IMPORTAMOS EL COMPONENTE QUE VAMOS A PROBAR ─────────────────────────────────
import FormularioProductos from "../src/components/FormularioProductos";

describe("🧪 <FormularioProductos />", () => {
  const opcionesMock = ["Manzana", "Banana", "Cereza"];
  const preciosBaseMock = {
    manzana: 1.5,
    banana: 0.75,
    cereza: 2.2
  };

  let onAgregarMock;
  let onContinuarMock;
  let alertSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    onAgregarMock = jest.fn();
    onContinuarMock = jest.fn();
    alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  test("✅ Renderizado inicial con productos y preciosBase (sin precioManual, sin fecha)", () => {
    const productosIniciales = [
      { producto: "manzana", cantidad: 3, precio: 1.5 },
      { producto: "banana", cantidad: 2, precio: 0.75 }
    ];

    render(
      <FormularioProductos
        productos={productosIniciales}
        opciones={opcionesMock}
        preciosBase={preciosBaseMock}
        conPrecioManual={false}
        conFecha={false}
        onAgregar={onAgregarMock}
        onContinuar={onContinuarMock}
      />
    );

    // Debe haber dos filas en <tbody> (una por cada producto)
    const filas = screen.getAllByRole("row").filter((row) => row.querySelector("td"));
    expect(filas).toHaveLength(2);

    // Verificamos “manzana” y “banana”
    expect(screen.getByText("manzana")).toBeInTheDocument();
    expect(screen.getByText("banana")).toBeInTheDocument();

    // No debe haber ningún <input placeholder="Precio">, porque conPrecioManual=false
    expect(screen.queryByPlaceholderText("Precio")).toBeNull();

    // Debe aparecer un <h6> (nuestra mock del Title) con el precio unitario de “manzana” ($1.50)
    const tituloPrecio = screen.getByText(/Precio unitario:/i);
    expect(tituloPrecio).toBeInTheDocument();
    expect(tituloPrecio).toHaveTextContent("Precio unitario: $1.50");

    // Como conFecha=false, NO debe haber la columna “Caducidad”
    expect(screen.queryByText("Caducidad")).toBeNull();
  });

  test("✅ Al cambiar la selección, el precio de preciosBase se actualiza correctamente", () => {
    render(
      <FormularioProductos
        productos={[]}
        opciones={opcionesMock}
        preciosBase={preciosBaseMock}
        conPrecioManual={false}
        conFecha={false}
        onAgregar={onAgregarMock}
        onContinuar={onContinuarMock}
      />
    );

    // 1) El <select> inicial debe valer "Manzana"
    const select = screen.getByTestId("mock-Select");
    expect(select).toHaveValue("Manzana");

    // 2) El precio inicial: $1.50
    let tituloPrecio = screen.getByText(/Precio unitario:/i);
    expect(tituloPrecio).toHaveTextContent("Precio unitario: $1.50");

    // 3) Cambiamos a “Banana”
    fireEvent.change(select, { target: { value: "Banana" } });
    tituloPrecio = screen.getByText(/Precio unitario:/i);
    expect(tituloPrecio).toHaveTextContent("Precio unitario: $0.75");

    // 4) Cambiamos a “Cereza”
    fireEvent.change(select, { target: { value: "Cereza" } });
    tituloPrecio = screen.getByText(/Precio unitario:/i);
    expect(tituloPrecio).toHaveTextContent("Precio unitario: $2.20");
  });

  test("✅ Cuando conPrecioManual=true, aparece input de precio en lugar de mostrar precioBase", () => {
    render(
      <FormularioProductos
        productos={[]}
        opciones={opcionesMock}
        preciosBase={preciosBaseMock}
        conPrecioManual={true}
        conFecha={false}
        onAgregar={onAgregarMock}
        onContinuar={onContinuarMock}
      />
    );

    // Debe haber un <input placeholder="Precio">
    expect(screen.getByPlaceholderText("Precio")).toBeInTheDocument();
    // Y no debe mostrarse ningún “Precio unitario: ...”
    expect(screen.queryByText(/Precio unitario:/i)).toBeNull();
  });

  test("✅ Cuando conFecha=true, aparece input de fecha y columna Caducidad en la tabla", () => {
    const productosIniciales = [
      { producto: "manzana", cantidad: 3, precio: 1.5, fechaCaducidad: "2023-12-31" }
    ];

    render(
      <FormularioProductos
        productos={productosIniciales}
        opciones={opcionesMock}
        preciosBase={preciosBaseMock}
        conPrecioManual={false}
        conFecha={true}
        onAgregar={onAgregarMock}
        onContinuar={onContinuarMock}
      />
    );

    // Debe existir <input placeholder="Fecha de caducidad" type="date">
    const inputDate = screen.getByPlaceholderText("Fecha de caducidad");
    expect(inputDate).toBeInTheDocument();
    expect(inputDate).toHaveAttribute("type", "date");

    // Debe aparecer la columna “Caducidad” en <thead>
    expect(screen.getByText("Caducidad")).toBeInTheDocument();
    // Y el valor de la celda debe ser “2023-12-31”
    expect(screen.getByText("2023-12-31")).toBeInTheDocument();
  });

  describe("🧪 Funcionalidad de Agregar producto", () => {
    test(
      "⚠️ Al hacer clic en 'Agregar producto' sin completar campos, debe alert y NO llamar a onAgregar",
      () => {
        render(
          <FormularioProductos
            productos={[]}
            opciones={opcionesMock}
            preciosBase={preciosBaseMock}
            conPrecioManual={true}
            conFecha={true}
            onAgregar={onAgregarMock}
            onContinuar={onContinuarMock}
          />
        );

        // Sin ingresar nada, hacer clic en “Agregar producto”
        const botonAgregar = screen.getByRole("button", {
          name: /Agregar producto/i
        });
        fireEvent.click(botonAgregar);

        // Debe haberse llamado alert("Completa todos los campos.")
        expect(alertSpy).toHaveBeenCalledWith("Completa todos los campos.");
        // Y NO se debe haber invocado onAgregar
        expect(onAgregarMock).not.toHaveBeenCalled();
      }
    );

    test(
      "✅ Al completar campos y hacer clic en 'Agregar producto', llama onAgregar con objeto esperado y limpia inputs",
      () => {
        render(
          <FormularioProductos
            productos={[]}
            opciones={opcionesMock}
            preciosBase={preciosBaseMock}
            conPrecioManual={true}
            conFecha={true}
            onAgregar={onAgregarMock}
            onContinuar={onContinuarMock}
          />
        );

        // 1) Seleccionar “Cereza”
        const select = screen.getByTestId("mock-Select");
        fireEvent.change(select, { target: { value: "Cereza" } });
        expect(select).toHaveValue("Cereza");

        // 2) Ingresar cantidad = "5"
        const inputCantidad = screen.getByPlaceholderText("Cantidad");
        fireEvent.input(inputCantidad, { target: { value: "5" } });
        // Ahora el valor debe ser el número 5
        expect(inputCantidad).toHaveValue(5);

        // 3) Ingresar precio manual = "3.14"
        const inputPrecio = screen.getByPlaceholderText("Precio");
        fireEvent.input(inputPrecio, { target: { value: "3.14" } });
        // Ahora el valor debe ser el número 3.14
        expect(inputPrecio).toHaveValue(3.14);

        // 4) Ingresar fecha = "2024-06-30"
        const inputDate = screen.getByPlaceholderText("Fecha de caducidad");
        fireEvent.input(inputDate, { target: { value: "2024-06-30" } });
        expect(inputDate).toHaveValue("2024-06-30");

        // 5) Hacer clic en “Agregar producto”
        const botonAgregar = screen.getByRole("button", {
          name: /Agregar producto/i
        });
        fireEvent.click(botonAgregar);

        // 6) onAgregar debe haberse llamado con:
        //    { producto: "cereza", cantidad: 5, precio: 3.14, fechaCaducidad: "2024-06-30" }
        expect(onAgregarMock).toHaveBeenCalledTimes(1);
        expect(onAgregarMock).toHaveBeenCalledWith({
          producto: "cereza",
          cantidad: 5,
          precio: 3.14,
          fechaCaducidad: "2024-06-30"
        });

        // 7) Los inputs deben limpiarse (si .value es null o "")
        expect(inputCantidad.value || "").toBe("");
        expect(inputPrecio.value   || "").toBe("");
        expect(inputDate.value     || "").toBe("");
      }
    );
  });

  test("✅ El botón 'Continuar' invoca a onContinuar", () => {
    render(
      <FormularioProductos
        productos={[]}
        opciones={opcionesMock}
        preciosBase={preciosBaseMock}
        conPrecioManual={false}
        conFecha={false}
        onAgregar={onAgregarMock}
        onContinuar={onContinuarMock}
      />
    );

    const botonContinuar = screen.getByRole("button", { name: /Continuar/i });
    fireEvent.click(botonContinuar);
    expect(onContinuarMock).toHaveBeenCalledTimes(1);
  });
});

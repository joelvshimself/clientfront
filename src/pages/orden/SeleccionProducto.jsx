import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Title,
  Select,
  Option,
  Input,
  Button,
  FlexBox,
  Card
} from "@ui5/webcomponents-react";
import Layout from "../../components/Layout";

const productosBase = ["Arrachera", "Ribeye", "Tomahawk", "Diezmillo"];

export default function SeleccionProducto() {
  const navigate = useNavigate();
  const location = useLocation();
  const proveedorSeleccionado = location.state?.proveedorSeleccionado;

  const [producto, setProducto] = useState("Arrachera");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [tablaProductos, setTablaProductos] = useState([]);

  const handleAgregarProducto = () => {
    if (!producto || !cantidad || !precio || !fechaCaducidad) {
      alert("Completa todos los campos.");
      return;
    }

    const nuevoProducto = {
      producto: producto.toLowerCase(),
      cantidad: parseInt(cantidad),
      precio: parseFloat(precio),
      fechaCaducidad
    };

    setTablaProductos([...tablaProductos, nuevoProducto]);
    setCantidad("");
    setPrecio("");
    setFechaCaducidad("");
  };

  const handleContinuar = () => {
    if (tablaProductos.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }
    localStorage.setItem("productoSeleccionado", JSON.stringify(tablaProductos));
    navigate("/orden/nueva/confirmar", {
      state: {
        proveedorSeleccionado,
        productoSeleccionado: tablaProductos
      }
    });
  };

  return (
    <Layout>
      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{ flexGrow: 1, padding: "5rem 2rem", backgroundColor: "#f0f7ff" }}
      >
        <Title level="H3" style={{ fontSize: "1.8rem", marginBottom: "2rem" }}>
          Selecciona los productos
        </Title>

        <FlexBox
          direction="Row"
          style={{ width: "80%", justifyContent: "space-around", marginBottom: "2rem" }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "45%",
              backgroundColor: "#F5FAFF",
              borderRadius: "12px",
              overflow: "hidden",
              color: "#000"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#D9EFFF" }}>
                <th style={thStyle}>Producto</th>
                <th style={thStyle}>Cantidad</th>
                <th style={thStyle}>Precio</th>
                <th style={thStyle}>Fecha de caducidad</th>
              </tr>
            </thead>
            <tbody>
              {tablaProductos.map((item, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{item.producto}</td>
                  <td style={tdStyle}>{item.cantidad}</td>
                  <td style={tdStyle}>${item.precio}</td>
                  <td style={tdStyle}>{item.fechaCaducidad}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <FlexBox
            direction="Column"
            style={{
              width: "45%",
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <Select
              style={{ height: "48px", marginBottom: "1rem" }}
              value={producto}
              onChange={(e) => setProducto(e.target.selectedOption.textContent)}
            >
              {productosBase.map((prod) => (
                <Option key={prod} selected={prod === producto}>{prod}</Option>
              ))}
            </Select>

            <Input
              placeholder="Cantidad"
              value={cantidad}
              type="number"
              onInput={(e) => setCantidad(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />

            <Input
              placeholder="Precio"
              value={precio}
              type="number"
              onInput={(e) => setPrecio(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />

            <Input
              placeholder="Fecha de caducidad"
              value={fechaCaducidad}
              type="date"
              onInput={(e) => setFechaCaducidad(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />

            <Button design="Emphasized" onClick={handleAgregarProducto}>
              Agregar producto
            </Button>
          </FlexBox>
        </FlexBox>

        <Button
          design="Emphasized"
          style={{ marginTop: "1rem", padding: "0.75rem 2rem" }}
          onClick={handleContinuar}
        >
          Continuar
        </Button>
      </FlexBox>
    </Layout>
  );
}

const thStyle = {
  border: "1px solid #A9CCE3",
  padding: "12px",
  textAlign: "center",
  color: "#0B3C5D"
};

const tdStyle = {
  border: "1px solid #A9CCE3",
  padding: "12px",
  textAlign: "center",
  color: "#000"
};

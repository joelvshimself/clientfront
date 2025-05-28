import React, { useState } from "react";
import {
  Title,
  Select,
  Option,
  Input,
  Button,
  FlexBox,
  Card
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const preciosBase = {
  arrachera: 320,
  ribeye: 450,
  tomahawk: 250,
  diezmillo: 180
};

export default function SeleccionVenta() {
  const navigate = useNavigate();
  const [producto, setProducto] = useState("Arrachera");
  const [cantidad, setCantidad] = useState("");
  const [tablaProductos, setTablaProductos] = useState([]);

  const handleAgregarProducto = () => {
    if (!producto || !cantidad) {
      alert("Completa todos los campos.");
      return;
    }

    const precio = preciosBase[producto.toLowerCase()] || 0;

    const nuevoProducto = {
      producto: producto.toLowerCase(),
      cantidad: parseInt(cantidad),
      precio
    };

    setTablaProductos([...tablaProductos, nuevoProducto]);
    setCantidad("");
  };

  const handleContinuar = () => {
    if (tablaProductos.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fecha_emision = `${yyyy}-${mm}-${dd}`;

    navigate("/venta/nueva/confirmar", {
      state: {
        productos: tablaProductos,
        fecha_emision
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
        <Title level="H4" style={{ marginBottom: "1rem" }}>
          Selecciona los productos
        </Title>

        <FlexBox
          direction="Row"
          style={{ width: "80%", justifyContent: "space-around", marginBottom: "2rem" }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "40%",
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
              </tr>
            </thead>
            <tbody>
              {tablaProductos.map((item, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{item.producto}</td>
                  <td style={tdStyle}>{item.cantidad}</td>
                  <td style={tdStyle}>${item.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <FlexBox
            direction="Column"
            style={{
              width: "40%",
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
              <Option selected>Arrachera</Option>
              <Option>Ribeye</Option>
              <Option>Tomahawk</Option>
              <Option>Diezmillo</Option>
            </Select>

            <Input
              placeholder="Cantidad"
              value={cantidad}
              onInput={(e) => setCantidad(e.target.value)}
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

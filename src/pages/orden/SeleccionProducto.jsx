import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Title,
  FlexBox,
  Card,
  Input,
  Select,
  Option
} from "@ui5/webcomponents-react";
import Layout from "../../components/Layout"; 

export default function SeleccionProducto() {
  const navigate = useNavigate();
  const location = useLocation();
  const proveedorSeleccionado = location.state?.proveedorSeleccionado;

  const [producto, setProducto] = useState("Arrachera");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");

  const handleContinuar = () => {
    if (producto && cantidad && precio && fechaCaducidad) {
      const productoSeleccionado = {
        producto: producto.toLowerCase(),
        cantidad,
        precio,
        fechaCaducidad
      };
      localStorage.setItem("productoSeleccionado", JSON.stringify(productoSeleccionado));
      navigate("/orden/nueva/confirmar", {
        state: {
          proveedorSeleccionado,
          productoSeleccionado
        }
      });
    } else {
      alert("Por favor completa todos los campos.");
    }
  };

  return (
    <Layout>
      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{
          flexGrow: 1,
          padding: "5rem 2rem",
          backgroundColor: "#f0f7ff"
        }}
      >
        <Title level="H3" style={{ fontSize: "1.8rem", marginBottom: "2rem" }}>
          Selecciona un producto
        </Title>

        <Card
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "2rem",
            backgroundColor: "#f7faff",
            border: "1px solid #dde3ea",
            borderRadius: "16px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <FlexBox direction="Column" style={{ gap: "1.2rem", alignItems: "center" }}>
            <Select
              style={{ height: "60px", width: "100%", fontSize: "1rem", borderRadius: "10px" }}
              value={producto}
              onChange={(e) => setProducto(e.target.selectedOption.textContent)}
            >
              <Option selected>Arrachera</Option>
              <Option>Ribeye</Option>
              <Option>Tomahawk</Option>
              <Option>Diezmillo</Option>
            </Select>

            <FlexBox direction="Row" style={{ width: "100%", gap: "1rem" }}>
              <Input
                placeholder="Cantidad"
                style={{ height: "60px", flex: 1, fontSize: "1rem", borderRadius: "10px" }}
                value={cantidad}
                onInput={(e) => setCantidad(e.target.value)}
              />
              <Input
                placeholder="Precio"
                style={{ height: "60px", flex: 1, fontSize: "1rem", borderRadius: "10px" }}
                value={precio}
                onInput={(e) => setPrecio(e.target.value)}
              />
            </FlexBox>

            <Input
              placeholder="Fecha de caducidad"
              style={{ height: "60px", width: "100%", fontSize: "1rem", borderRadius: "10px" }}
              value={fechaCaducidad}
              onInput={(e) => setFechaCaducidad(e.target.value)}
            />
          </FlexBox>
        </Card>

        <Button
          onClick={handleContinuar}
          design="Emphasized"
          style={{
            marginTop: "2rem",
            minWidth: "160px",
            height: "50px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "10px",
            color: "#fff",
            backgroundColor: "#0070f3",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 1rem"
          }}
        >
          <span style={{ lineHeight: "1", fontWeight: "600" }}>Continuar</span>
        </Button>
      </FlexBox>
    </Layout>
  );
}

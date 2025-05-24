import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  Title,
  FlexBox,
  Card,
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  Input,
  Select,
  Option
} from "@ui5/webcomponents-react";

export default function SeleccionProducto() {
  const navigate = useNavigate();
  const location = useLocation();
  const proveedorSeleccionado = location.state?.proveedorSeleccionado;

  const [producto, setProducto] = useState("Arrachera");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");

  const handleContinuar = () => {
    if (!producto || !cantidad || !precio || !fechaCaducidad) {
      alert("Por favor completa todos los campos.");
      return;
    }

    navigate("/orden/nueva/confirmar", {
      state: {
        proveedorSeleccionado,
        productoSeleccionado: {
          producto,
          cantidad,
          precio,
          fechaCaducidad
        }
      }
    });
  };

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      <ShellBar
        logo={<img src="/viba1.png" alt="ViBa" style={{ height: "40px" }} />}
        primaryTitle="Fs"
        profile={{ image: "/viba1.png" }}
        style={{
          width: "100%",
          background: "#B71C1C",
          color: "white",
          position: "fixed",
          zIndex: 1201
        }}
      />
      <div style={{ width: 240, marginTop: "3.5rem", backgroundColor: "#fff" }}>
        <SideNavigation>
          <SideNavigationItem icon="home" text="Dashboard" data-route="/home" />
          <SideNavigationItem icon="retail-store" text="Producto" data-route="/producto" />
          <SideNavigationItem icon="employee" text="Usuarios" data-route="/usuarios" />
          <SideNavigationItem icon="shipping-status" text="Órdenes" data-route="/orden" />
          <SideNavigationItem icon="cart" text="Ventas" data-route="/venta" />
        </SideNavigation>
      </div>

      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{
          flexGrow: 1,
          backgroundColor: "#fafafa",
          padding: "6rem 2rem 2rem 2rem"
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
              style={{
                height: "60px",
                width: "100%",
                fontSize: "1rem",
                borderRadius: "10px"
              }}
              value={producto}
              onChange={(e) =>
                setProducto(e.target.selectedOption.textContent)
              }
            >
              <Option selected>Arrachera</Option>
              <Option>Ribeye</Option>
              <Option>Tomahawk</Option>
              <Option>Diezmillo</Option>
            </Select>

            <FlexBox direction="Row" style={{ width: "100%", gap: "1rem" }}>
              <Input
                placeholder="Cantidad"
                style={{
                  height: "60px",
                  flex: 1,
                  fontSize: "1rem",
                  borderRadius: "10px"
                }}
                value={cantidad}
                onInput={(e) => setCantidad(e.target.value)}
              />
              <Input
                placeholder="Precio"
                style={{
                  height: "60px",
                  flex: 1,
                  fontSize: "1rem",
                  borderRadius: "10px"
                }}
                value={precio}
                onInput={(e) => setPrecio(e.target.value)}
              />
            </FlexBox>

            <Input
              placeholder="Fecha de caducidad"
              style={{
                height: "60px",
                width: "100%",
                fontSize: "1rem",
                borderRadius: "10px"
              }}
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
    </FlexBox>
  );
}

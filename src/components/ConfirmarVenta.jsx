// ConfirmarVenta.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Title,
  FlexBox,
  Card,
  ShellBar,
  SideNavigation,
  SideNavigationItem
} from "@ui5/webcomponents-react";

export default function ConfirmarVenta() {
  const navigate = useNavigate();
  const location = useLocation();
  const productos = location.state?.productos || [];

  const costoTotal = productos.reduce(
    (acc, p) => acc + parseFloat(p.precio || 0) * parseInt(p.cantidad || 0),
    0
  );

  const handleConfirmar = () => {
    alert("Venta confirmada correctamente.");
    navigate("/venta");
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
        style={{ flexGrow: 1, padding: "6rem 2rem 2rem 2rem", backgroundColor: "#f0f7ff" }}
      >
        <Title level="H3" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
          Confirma la venta
        </Title>

        <Card
          style={{
            width: "100%",
            maxWidth: "800px",
            padding: "2rem",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                maxWidth: "100%",
                borderCollapse: "collapse",
                marginBottom: "1rem"
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={headerCellStyle}>Producto</th>
                  <th style={headerCellStyle}>Cantidad</th>
                  <th style={headerCellStyle}>Precio</th>
                  <th style={headerCellStyle}>Fecha de caducidad</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((item, index) => (
                  <tr key={index}>
                    <td style={bodyCellStyle}>{item.producto}</td>
                    <td style={{ ...bodyCellStyle, textAlign: "center" }}>{item.cantidad}</td>
                    <td style={{ ...bodyCellStyle, textAlign: "center" }}>${item.precio}</td>
                    <td style={{ ...bodyCellStyle, textAlign: "center" }}>{item.fechaCaducidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              backgroundColor: "#fff8e1",
              padding: "0.75rem 1.5rem",
              border: "2px dashed orange",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              minHeight: "50px"
            }}
          >
            Total: ${costoTotal.toFixed(2)}
          </div>
        </Card>

        <Button
          onClick={handleConfirmar}
          design="Emphasized"
          style={{
            marginTop: "2rem",
            minWidth: "200px",
            height: "48px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "10px"
          }}
        >
          Confirmar venta
        </Button>
      </FlexBox>
    </FlexBox>
  );
}

const headerCellStyle = {
  border: "2px solid #000",
  padding: "12px",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "1rem"
};

const bodyCellStyle = {
  border: "2px solid #000",
  padding: "10px",
  fontSize: "1rem"
};

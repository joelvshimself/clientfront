import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  Title,
  FlexBox,
  Card,
  ShellBar,
  SideNavigation,
  SideNavigationItem
} from "@ui5/webcomponents-react";

export default function SeleccionProveedor() {
  const navigate = useNavigate();
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

  const handleContinuar = () => {
    if (!proveedorSeleccionado) {
      alert("Selecciona un proveedor para continuar.");
      return;
    }
    navigate("/orden/nueva/producto", { state: { proveedorSeleccionado } });
  };

  const proveedores = [
    "Distribuidora Norte",
    "Frigo Aguascalientes",
    "Cárnicos del Centro",
    "La Silla Select",
    "Monterrey Prime",
    "Ganadera San Juan",
    "El Gran Buey",
    "Bovinos Premium",
    "Exportaciones TIF",
    "Santa Fe Selecta"
  ];

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

      {/* CONTENIDO A LA DERECHA */}
      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{
          flexGrow: 1,
          backgroundColor: "#fafafa",
          padding: "6rem 2rem 2rem 2rem"
        }}
      >
        {/* TÍTULO DE PANTALLA */}
        <Title level="H3" style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>
          Selecciona el proveedor
        </Title>

        {/* CARD CENTRAL */}
        <Card
          style={{
            width: "100%",
            maxWidth: "850px",
            padding: "2rem",
            backgroundColor: "#f7faff",
            border: "1px solid #dde3ea",
            borderRadius: "16px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
              Nombre del proveedor
            </p>
            <p style={{ fontSize: "0.95rem", color: "#444", marginBottom: "1.5rem" }}>
              Selecciona un proveedor registrado en el sistema para comenzar la orden.
            </p>
          </div>

          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              border: "2px solid #b0bec5",
              borderRadius: "8px",
              backgroundColor: "#fff"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {proveedores.map((nombre, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "1.05rem" }}>
                      <input
                        type="radio"
                        name="proveedor"
                        value={nombre}
                        checked={proveedorSeleccionado === nombre}
                        onChange={() => setProveedorSeleccionado(nombre)}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {nombre}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* BOTÓN CONTINUAR CENTRADO */}
        <Button
          onClick={handleContinuar}
          design="Emphasized"
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 2.5rem",
            fontSize: "1rem"
          }}
        >
          Continuar
        </Button>
      </FlexBox>
    </FlexBox>
  );
}

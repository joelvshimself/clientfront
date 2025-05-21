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
import { createOrden } from "../services/ordenesService";

export default function ConfirmarOrden() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    proveedorSeleccionado,
    producto,
    cantidad,
    precio,
    fechaCaducidad
  } = location.state || {};

  const handleConfirmar = async () => {
    const correoSolicita = localStorage.getItem("userEmail") || "";
    const datos = {
      correo_solicita: correoSolicita,
      correo_provee: proveedorSeleccionado,
      productos: [
        {
          producto,
          cantidad,
          precio,
          fecha_caducidad: fechaCaducidad
        }
      ]
    };

    const res = await createOrden(datos);
    if (res && res.id_orden) {
      alert("Orden creada con ID: " + res.id_orden);
    } else {
      alert("Error al crear orden");
    }
    navigate("/orden");
  };

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      <ShellBar
        logo={<img src="/viba1.png" alt="ViBa" style={{ height: "40px" }} />}
        primaryTitle="Fs"
        profile={{ image: "/viba1.png" }}
        style={{ width: "100%", background: "#B71C1C", color: "white", position: "fixed", zIndex: 1201 }}
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

      <FlexBox direction="Column" style={{ flexGrow: 1, padding: "2rem", marginTop: "4rem", backgroundColor: "#fafafa" }}>
        <Title level="H4">Confirma tu orden</Title>
        <Card style={{ padding: "1rem", marginTop: "1rem", maxWidth: "600px" }}>
          <p><strong>Proveedor:</strong> {proveedorSeleccionado}</p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Fecha de caducidad</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{producto}</td>
                <td>{cantidad}</td>
                <td>${precio}</td>
                <td>{fechaCaducidad}</td>
              </tr>
            </tbody>
          </table>
          <Button onClick={handleConfirmar} design="Positive" style={{ marginTop: "1rem" }}>Confirmar orden</Button>
        </Card>
      </FlexBox>
    </FlexBox>
  );
}

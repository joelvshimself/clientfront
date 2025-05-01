import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  Card,
  Title,
  Text,
  FlexBox,
  Button,
  Popover
} from "@ui5/webcomponents-react";
import { Toaster } from "react-hot-toast";
import { Grid } from "@mui/material";

import { agregarNotificacion, mensajesNotificaciones } from "./Notificaciones";

import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/retail-store.js";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/cart.js";
import "@ui5/webcomponents-icons/dist/bell.js";

const drawerWidth = 240;

export default function Home() {
  const navigate = useNavigate();
  const [isSidebarOpen] = useState(true);
  const [openNotificaciones, setOpenNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const notiButtonRef = useRef(null);

  const handleNavigationClick = (event) => {
    const selected = event.detail.item.dataset.route;
    if (selected) navigate(selected);
  };

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      <ShellBar
        logo={<img src="/viba1.png" alt="Carnes ViBa" style={{ height: "40px" }} />}
        primaryTitle="Productos"
        onProfileClick={() => navigate("/login")}
        profile={{ image: "/viba1.png" }}
        style={{
          width: "100%",
          background: "#B71C1C",
          color: "white",
          position: "fixed",
          zIndex: 1201,
        }}
      />

      {/* Botón flotante de notificaciones */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "60px",
          zIndex: 1500,
        }}
      >
        <div style={{ position: "relative" }}>
          <Button
            icon="bell"
            design="Transparent"
            ref={notiButtonRef}
            onClick={() => setOpenNotificaciones(true)}
          />
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "10px",
              fontWeight: "bold",
              zIndex: 2000,
            }}
          >
            {notificaciones.length}
          </span>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          style={{
            width: drawerWidth,
            marginTop: "3.5rem",
            height: "calc(100vh - 3.5rem)",
            backgroundColor: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
          }}
        >
        <SideNavigation onSelectionChange={handleNavigationClick}>
          <SideNavigationItem icon="home" text="Dashboard" data-route="/home" />
          <SideNavigationItem icon="retail-store" text="Producto" data-route="/producto" />
          <SideNavigationItem icon="employee" text="Usuarios" data-route="/usuarios" />
          <SideNavigationItem icon="shipping-status" text="Órdenes" data-route="/orden" />
          <SideNavigationItem icon="cart" text="Ventas" data-route="/venta" />
        </SideNavigation>
        </div>
      )}

<FlexBox
  direction="Column"
  style={{
    flexGrow: 1,
    padding: "2rem",
    marginTop: "4rem",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Title style={{ marginTop: "0rem", fontSize: "60px", color: "#000" }}>¡Bienvenido a Logiviba!</Title>
  <Text style={{ marginTop: "1rem", fontSize: "18px", color: "#666" }}>
    Tu sistema de gestión logística inteligente
  </Text>
</FlexBox>


      {notiButtonRef.current && (
        <Popover
          headerText="Notificaciones recientes"
          open={openNotificaciones}
          opener={notiButtonRef.current}
          onClose={() => setOpenNotificaciones(false)}
        >
          <FlexBox direction="Column" style={{ padding: "1rem", gap: "0.5rem", maxHeight: "300px", overflowY: "auto" }}>
            {notificaciones.map((noti) => (
              <div key={noti.id} style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>
                <Text>{noti.mensaje}</Text>
              </div>
            ))}

            <Button onClick={() => agregarNotificacion("success", mensajesNotificaciones.exito, setNotificaciones)}>
              Agregar Notificación de Éxito
            </Button>
            <Button onClick={() => agregarNotificacion("info", mensajesNotificaciones.info, setNotificaciones)}>
              Agregar Notificación Informativa
            </Button>
            <Button onClick={() => agregarNotificacion("error", mensajesNotificaciones.error, setNotificaciones)}>
              Agregar Notificación de Error
            </Button>
          </FlexBox>
        </Popover>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </FlexBox>
  );
}

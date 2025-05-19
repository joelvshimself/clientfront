import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  Title,
  Text,
  FlexBox,
  Button,
  Popover
} from "@ui5/webcomponents-react";
import { toast, Toaster } from "react-hot-toast";

import {
  obtenerNotificaciones,
  agregarNotificacionStorage,
  eliminarNotificacionStorage
} from "../utils/notificacionesStorage";
import { mensajesNotificaciones } from "./Notificaciones";
import { crearNotificacion } from "../services/notificacionesService";

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

  // Cargar notificaciones persistidas
  useEffect(() => {
    const guardadas = obtenerNotificaciones();
    setNotificaciones(guardadas);
  }, []);

  // Función para agregar notificación local + backend
  const handleAgregarNotificacion = async (tipo, mensaje) => {
    const nuevas = agregarNotificacionStorage(tipo, mensaje);
    setNotificaciones(nuevas);

    const result = await crearNotificacion({
      tipo,
      mensaje,
      id_usuario: 1, // Ajustar si el ID del usuario es dinámico
    });

    switch (tipo) {
      case "success":
        toast.success(mensaje);
        break;
      case "info":
        toast(mensaje);
        break;
      case "error":
        toast.error(mensaje);
        break;
      default:
        toast(mensaje);
        break;
    }

    if (!result) {
      toast.error("Error al guardar notificación en el servidor.");
    }
  };

  // Eliminar notificación
  const handleEliminarNotificacion = (id) => {
    const nuevas = eliminarNotificacionStorage(id);
    setNotificaciones(nuevas);
    toast.success("Notificación eliminada");
  };

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
        <Title style={{ fontSize: "60px", color: "#000" }}>¡Bienvenido a Logiviba!</Title>
        <Text style={{ marginTop: "1rem", fontSize: "18px", color: "#666" }}>
          Tu sistema de gestión logística inteligente
        </Text>
      </FlexBox>

      {/* POPUP DE NOTIFICACIONES */}
      {notiButtonRef.current && (
        <Popover
          headerText="Notificaciones recientes"
          open={openNotificaciones}
          opener={notiButtonRef.current}
          onClose={() => setOpenNotificaciones(false)}
        >
          <FlexBox
            direction="Column"
            style={{ padding: "1rem", gap: "0.5rem", maxHeight: "300px", overflowY: "auto" }}
          >
            {notificaciones.map((noti) => (
              <div key={noti.id} style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>
                <Text>{noti.mensaje}</Text>
                <Button
                  onClick={() => handleEliminarNotificacion(noti.id)}
                  style={{ marginTop: "0.5rem", backgroundColor: "red", color: "white" }}
                >
                  Eliminar
                </Button>
              </div>
            ))}

            <Button onClick={() => handleAgregarNotificacion("success", mensajesNotificaciones.exito)}>
              Agregar Notificación de Éxito
            </Button>
            <Button onClick={() => handleAgregarNotificacion("info", mensajesNotificaciones.info)}>
              Agregar Notificación Informativa
            </Button>
            <Button onClick={() => handleAgregarNotificacion("error", mensajesNotificaciones.error)}>
              Agregar Notificación de Error
            </Button>
          </FlexBox>
        </Popover>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </FlexBox>
  );
}
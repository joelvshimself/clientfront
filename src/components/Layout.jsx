import React from "react";
import PropTypes from "prop-types";
import {
  ShellBar,
  ShellBarItem,
  SideNavigation,
  SideNavigationItem,
  FlexBox,
  Avatar
} from "@ui5/webcomponents-react";
import logIcon from "@ui5/webcomponents-icons/dist/log.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";
import { getCookie } from "../utils/getCookie";
import { getNavigationItemsForRole } from "../utils/navigationItems";
import NotificacionesPanel from "./NotificacionesPanel";


export default function Layout({ children }) {
  // Mejor guardar otra cookie no protegida por js que guarde el rol para el layout
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener datos del usuario desde la cookie
  const userData = JSON.parse(getCookie("UserData")) || {
    nombre: "Usuario",
    role: "Invitado"
  };

  // Obtener ítems de navegación según el roln
  const navItems = getNavigationItemsForRole(userData.role); // [{ label, route, icon }]

  const handleNavigationClick = (e) => {
    const route = e.detail.item.dataset.route;
    if (route) navigate(route);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Barra superior */}
      <ShellBar
        logo={<img src="/viba1.png" alt="ViBa" style={{ height: 40 }} />}
        primaryTitle="Bienvenido a ViBa"
        secondaryTitle={`${userData.nombre} - ${userData.role}`}
        profile={<Avatar icon="employee" />}
        onProfileClick={handleProfileClick}
        style={{
          width: "100%",
          background: "#B71C1C",
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1201
        }}
      >
        <ShellBarItem icon={logIcon} text="Salir" onClick={handleLogout} />
      </ShellBar>

      {/* Botón y panel de notificaciones */}
      <div style={{ position: "fixed", top: 10, right: 20, zIndex: 1300 }}>
        <NotificacionesPanel />
      </div>

      {/* Layout principal con navegación y contenido */}
      <FlexBox direction="Row" style={{ height: "100%", marginTop: "3.5rem" }}>
        <div
          style={{
            width: 260,
            backgroundColor: "#fff",
            minHeight: "calc(100vh - 3.5rem)"
          }}
        >
          <SideNavigation
            onSelectionChange={handleNavigationClick}
            selectedKey={location.pathname}
          >
            {navItems.map((item) => (
              <SideNavigationItem
                key={item.route}
                icon={item.icon}
                text={item.label}
                data-route={item.route}
              />
            ))}
          </SideNavigation>
        </div>

        <div
          style={{
            flexGrow: 1,
            padding: "2rem",
            backgroundColor: "#f9f9f9",
            overflowY: "auto",
            height: "calc(100vh - 3.5rem)"
          }}
        >
          {children}
        </div>
      </FlexBox>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
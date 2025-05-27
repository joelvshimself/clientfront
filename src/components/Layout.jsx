import {
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  FlexBox
} from "@ui5/webcomponents-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigationClick = (e) => {
    const route = e.detail.item.dataset.route;
    if (route) {
      navigate(route);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* ShellBar fija */}
      <ShellBar
        logo={<img src="/viba1.png" alt="ViBa" style={{ height: "40px" }} />}
        primaryTitle="Fs"
        profile={{ image: "/viba1.png" }}
        style={{
          width: "100%",
          background: "#B71C1C",
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1201
        }}
      />

      {/* Contenedor general: barra lateral + contenido */}
      <FlexBox direction="Row" style={{ height: "100%", marginTop: "3.5rem" }}>
        {/* Barra lateral */}
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
            <SideNavigationItem
              key="/home"
              icon="home"
              text="Dashboard"
              data-route="/home"
            />
            <SideNavigationItem
              key="/producto"
              icon="retail-store"
              text="Producto"
              data-route="/producto"
            />
            <SideNavigationItem
              key="/usuarios"
              icon="employee"
              text="Usuarios"
              data-route="/usuarios"
            />
            <SideNavigationItem
              key="/orden"
              icon="shipping-status"
              text="Órdenes"
              data-route="/orden"
            />
            <SideNavigationItem
              key="/venta"
              icon="cart"
              text="Ventas"
              data-route="/venta"
            />
          </SideNavigation>
        </div>

        {/* Área de contenido */}
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